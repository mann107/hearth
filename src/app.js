(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var H = window.HEARTH || { asset: function (p) { return 'assets/' + p; }, personal: function (p) { return 'personal/' + p; }, media: function () { return null; },
                             fallbackMedia: { video: 'media/loop-1080.mp4', music: 'media/music-short.m4a' }, logLine: function () {}, config: {}, log: [] };
  var log = H.logLine || function () {};
  var SCENE = (H.config && H.config.scene) || 'fireplace';
  var APP_VERSION = '0.2.9';
  var BOOT = Date.now();
  var REMOTE = H.remote || 'https://mann107.github.io/hearth/';

  /* the newest version of each scene's loop, hosted next to the code (names are stitched into the video itself) */
  var MEDIA = { fireplace: { rev: 2, file: 'media/fireplace-r2-4k.mp4', bytes: 0 } };

  /* fit the 1920x1080 stage to whatever size the TV gives the app */
  (function () { var st = $('stage'); function fit() { var w = window.innerWidth || document.documentElement.clientWidth, h = window.innerHeight || document.documentElement.clientHeight, s = Math.min(w / 1920, h / 1080);
    st.style.transform = 'scale(' + s + ')'; st.style.left = ((w - 1920 * s) / 2) + 'px'; st.style.top = ((h - 1080 * s) / 2) + 'px'; } fit(); window.addEventListener('resize', fit); setTimeout(fit, 500); setTimeout(fit, 2000); })();

  var store = { get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
                set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var BRAMPTON = { lat: 43.6834, lon: -79.7663 };
  var video = $('scene'), music = $('music'), overlay = $('overlay'), world = $('world');
  function short(u) { return (u || '–').split('?')[0].split('/').slice(-2).join('/'); }

  /* ================= loading screen ================= */
  var loader = $('loader'), steps = { fonts: false, art: false, video: false }, revealed = false;
  setTimeout(function () { loader.className = 'in'; }, 60);
  function progress() {
    var n = (steps.fonts ? 1 : 0) + (steps.art ? 1 : 0) + (steps.video ? 2 : 0);
    $('lfill').style.width = Math.max(8, n / 4 * 100) + '%';
    $('lcap').textContent = steps.video ? 'Ready' : steps.art ? 'Lighting the fire' : 'Warming up';
    if (steps.video && steps.art && steps.fonts) setTimeout(reveal, 500);
  }
  progress();
  try { if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { steps.fonts = true; progress(); }); else steps.fonts = true; } catch (e) { steps.fonts = true; }
  setTimeout(function () { steps.fonts = true; progress(); }, 2500);

  /* preload every piece of art before the room is shown, so nothing pops in */
  (function () {
    var urls = [H.asset('glow0.png'), H.asset('glow1.png'), H.asset('skymask.png'), H.asset('earth.jpg')], left = urls.length;
    for (var i = 0; i < 11; i++) urls.push(H.asset('elves/elf_' + i + '.png'));
    left = urls.length;
    urls.forEach(function (u) { var im = new Image(); im.onload = im.onerror = function () { if (--left === 0) { steps.art = true; progress(); } }; im.src = u; });
    setTimeout(function () { if (!steps.art) { steps.art = true; progress(); } }, 6000);
  })();
  [].forEach.call(document.querySelectorAll('[data-asset]'), function (el) { el.src = H.asset(el.getAttribute('data-asset')); });
  (function () { var m = 'url(' + H.asset('skymask.png') + ')', sk = $('sky'); sk.style.webkitMaskImage = m; sk.style.maskImage = m; })();

  function reveal() {
    if (revealed) return; revealed = true;
    log('reveal after ' + ((Date.now() - BOOT) / 1000).toFixed(1) + 's');
    loader.className = 'in gone';
    setTimeout(function () { $('curtain').className = 'up'; startMusic(); }, 450);
    setTimeout(function () { overlay.className = 'show intro'; }, 1500);
    setTimeout(function () { overlay.className = 'show'; showOverlay(60000); }, 1700);
    setTimeout(function () { elf.className = 'on'; }, 7000);
    setTimeout(function () { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 3000);
    setTimeout(maybeShowPairing, 9000);
  }
  setTimeout(function () { if (!revealed) { log('reveal: gave up waiting after 15s'); steps.video = steps.art = steps.fonts = true; reveal(); } }, 15000);

  /* ================= remote keys =================
     The colour buttons and number keys no longer do anything; everything they did lives on the phone remote now. */
  try { tizen.tvinputdevice.registerKey('MediaPlayPause'); tizen.tvinputdevice.registerKey('MediaPlay'); tizen.tvinputdevice.registerKey('MediaPause'); } catch (e) {}
  ['ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    .forEach(function (k) { try { tizen.tvinputdevice.unregisterKey(k); } catch (e) {} });
  window.addEventListener('keydown', function (e) {        // runs before the shell's own listener
    var k = e.keyCode;
    if ((k >= 48 && k <= 57) || (k >= 403 && k <= 406)) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  /* ================= media: TV storage -> USB stick -> GitHub -> built-in ================= */
  var hevc = !!(video.canPlayType('video/mp4; codecs="hvc1.1.6.L153.B0"') || video.canPlayType('video/mp4; codecs="hev1"') || video.canPlayType('video/mp4; codecs="hvc1"'));
  var CACHE = 'hearth-cache';
  var media = { state: 'starting', pct: 0, playing: '', stalls: 0 };
  function fsResolve(path, mode, ok, bad) { try { tizen.filesystem.resolve(path, ok, bad || function () { ok(null); }, mode || 'r'); } catch (e) { ok(null); } }
  function cacheURI(name, cb) { fsResolve('wgt-private/' + CACHE + '/' + name, 'r', function (f) { cb(f && f.fileSize > 1024 ? f.toURI() : null); }); }
  function cacheDir(cb) {
    fsResolve('wgt-private', 'rw', function (dir) {
      if (!dir) return cb(null);
      try { dir.createDirectory(CACHE); } catch (e) {}
      fsResolve('wgt-private/' + CACHE, 'rw', function (d) { cb(d); });
    });
  }
  function usbLabel(cb) {
    var labels = ['removable_sda2', 'removable_sda1', 'removable_sdb1', 'removable_sdb2'], i = 0;
    (function next() { if (i >= labels.length) return cb(null); var l = labels[i++]; fsResolve(l + '/Hearth/config.json', 'r', function (f) { if (f) cb(l); else next(); }); })();
  }
  function copyToCache(name, usbRel, done) {
    usbLabel(function (lab) {
      if (!lab) { log('copy: could not resolve USB label'); return done(false); }
      fsResolve('wgt-private', 'rw', function (dir) {
        if (!dir) { log('copy: wgt-private unavailable'); return done(false); }
        try { dir.createDirectory(CACHE); } catch (e) {}
        var src = lab + '/Hearth/' + usbRel, dst = 'wgt-private/' + CACHE + '/' + name, t0 = Date.now();
        log('copying ' + usbRel + ' into the TV…');
        function ok() { log('copied ' + name + ' in ' + Math.round((Date.now() - t0) / 1000) + 's'); done(true); }
        function bad(e) { log('copy failed (' + name + '): ' + (e && e.message)); done(false); }
        try { dir.copyTo(src, dst, true, ok, function (e) {
              if (tizen.filesystem.copyFile) { try { tizen.filesystem.copyFile(src, dst, true, ok, bad); } catch (x) { bad(x); } } else bad(e); }); }
        catch (e) { try { tizen.filesystem.copyFile(src, dst, true, ok, bad); } catch (x) { bad(x); } }
      });
    });
  }
  function deleteCached(name) {
    cacheDir(function (d) { if (!d) return; try { d.deleteFile('wgt-private/' + CACHE + '/' + name, function () { log('removed old ' + name); }, function () {}); } catch (e) {} });
  }
  /* download a file from GitHub straight into the TV's own storage (Tizen 5+ file API) */
  function downloadToCache(url, name, done) {
    if (!window.tizen || !tizen.filesystem || !tizen.filesystem.openFile) { log('download: this TV has no file-write API'); return done(false); }
    var x = new XMLHttpRequest(), t0 = Date.now(), lastLog = 0;
    media.state = 'downloading'; media.pct = 0;
    x.open('GET', url, true); x.responseType = 'blob'; x.timeout = 15 * 60000;
    x.onprogress = function (e) { if (e.lengthComputable) { media.pct = Math.round(e.loaded / e.total * 100); if (media.pct - lastLog >= 25) { lastLog = media.pct; log('downloading new video ' + media.pct + '%'); } } };
    x.onerror = x.ontimeout = function () { log('download failed (network)'); media.state = 'download failed'; done(false); };
    x.onload = function () {
      if (x.status !== 200 || !x.response || x.response.size < 1e6) { log('download failed (' + x.status + ')'); media.state = 'download failed'; return done(false); }
      var blob = x.response, part = 'wgt-private/' + CACHE + '/' + name + '.part', fin = 'wgt-private/' + CACHE + '/' + name;
      cacheDir(function (d) {
        if (!d) { media.state = 'no storage'; return done(false); }
        function finish() {
          function ok() { log('new video stored on the TV (' + Math.round(blob.size / 1048576) + ' MB in ' + Math.round((Date.now() - t0) / 1000) + 's)'); media.state = 'stored'; done(true); }
          function legacy() { try { d.moveTo(part, fin, true, ok, function (e) { log('move failed: ' + (e && e.message)); media.state = 'store failed'; done(false); }); } catch (e) { log('move failed: ' + e.message); media.state = 'store failed'; done(false); } }
          try { if (tizen.filesystem.moveFile) tizen.filesystem.moveFile(part, fin, true, ok, legacy); else legacy(); } catch (e) { legacy(); }
        }
        function fail(e) { log('write failed: ' + (e && e.message)); media.state = 'store failed'; done(false); }
        try {
          var fh = tizen.filesystem.openFile(part, 'w');
          if (fh.writeBlobNonBlocking) {
            fh.writeBlobNonBlocking(blob, function () { fh.closeNonBlocking(finish, fail); }, function (e) { try { fh.close(); } catch (z) {} fail(e); });
          } else {
            var fr = new FileReader();
            fr.onload = function () { try { fh.writeData(new Uint8Array(fr.result)); fh.close(); finish(); } catch (e) { try { fh.close(); } catch (z) {} fail(e); } };
            fr.onerror = fail; fr.readAsArrayBuffer(blob);
          }
        } catch (e) { fail(e); }
      });
    };
    x.send();
  }

  var played = false, vTry = null, vWatch = null, frames = 0;
  function playFrom(list, onFail) {
    if (!list.length) return onFail && onFail();
    var src = list[0]; clearTimeout(vWatch); frames = 0;
    video.onerror = function () { log('video error ' + (video.error && video.error.code) + ': ' + short(src)); playFrom(list.slice(1), onFail); };
    vWatch = setTimeout(function () { if (!played) { log('video stalled (state ' + video.readyState + '/' + video.networkState + '): ' + short(src)); media.stalls++; playFrom(list.slice(1), onFail); } }, 8000);
    vTry = src; video.src = src; video.load(); var p = video.play(); if (p && p.catch) p.catch(function () {});
  }
  video.addEventListener('playing', function () { if (!played) { log('playing ' + short(vTry) + ' ' + video.videoWidth + 'x' + video.videoHeight); media.playing = short(vTry); } played = true; clearTimeout(vWatch); });
  /* only call the video "ready" once real frames are moving – avoids revealing a black first frame */
  video.addEventListener('timeupdate', function () { if (played && video.currentTime > 0.2 && ++frames === 2) { steps.video = true; progress(); if (veiled) unveil(); } });
  video.addEventListener('ended', function () { video.currentTime = 0; video.play(); });
  /* switching source mid-session: a soft dip to black, never a hard cut */
  var veiled = false;
  function switchTo(list) {
    if (!revealed) { played = false; return playFrom(list); }
    veiled = true; $('curtain').className = 'veil';
    setTimeout(function () { played = false; playFrom(list, function () { unveil(); }); }, 950);
    setTimeout(function () { if (veiled) unveil(); }, 12000);
  }
  function unveil() { veiled = false; setTimeout(function () { $('curtain').className = 'up'; }, 250); }

  var M = MEDIA[SCENE], file = hevc ? 'loop-4k.mp4' : 'loop-1080.mp4';
  var oldName = SCENE + '-' + file, newName = M && hevc ? SCENE + '-r' + M.rev + '-' + file : null, newURL = M ? REMOTE + M.file : null;
  function startVideo() {
    if (!newName) media.state = 'not needed (1080p)';
    (newName ? cacheURI : function (n, cb) { cb(null); })(newName, function (fresh) {
      cacheURI(oldName, function (old) {
        var list = [];
        if (fresh) { list.push(fresh); media.state = 'stored'; }
        else if (old) list.push(old);
        if (H.media(SCENE, file)) list.push(H.media(SCENE, file));
        if (!fresh && H.online && newURL && hevc) list.push(newURL);          // stream it if nothing local works
        list.push(H.fallbackMedia.video);
        playFrom(list, function () { log('no video source worked'); });
        if (fresh) { if (old) deleteCached(oldName); return; }
        if (newName && H.online) {
          setTimeout(function () {
            downloadToCache(newURL, newName, function (ok) {
              if (ok) cacheURI(newName, function (u) { if (u) { log('switching to the new video'); switchTo([u].concat(list)); if (old) deleteCached(oldName); } });
            });
          }, 25000);                                                          // let startup settle first
        } else if (!old && H.usb) {
          copyToCache(oldName, 'scenes/' + SCENE + '/' + file, function (ok) { if (ok) cacheURI(oldName, function (u) { if (u) switchTo([u, H.fallbackMedia.video]); }); });
        }
      });
    });
  }
  startVideo();

  /* ================= music with gentle fades ================= */
  var vol = store.get('hearthVol', 0.35), curVol = 0, rampT = null, paused = false;
  function night() { var h = new Date().getHours(); return h >= 23 || h < 6; }
  function target() { return paused ? 0 : vol * (night() ? 0.6 : 1); }
  function rampTo(t, ms, done) {
    clearInterval(rampT); rampT = null;
    var steps2 = Math.max(1, Math.round(ms / 50)), start = curVol, i = 0;
    rampT = setInterval(function () {
      i++; var k = i / steps2; k = k * k * (3 - 2 * k);                        // ease in-out
      curVol = start + (t - start) * k; music.volume = Math.max(0, Math.min(1, curVol));
      if (i >= steps2) { clearInterval(rampT); rampT = null; if (done) done(); }
    }, 50);
  }
  var mName = SCENE + '-music.m4a', musicList = [], mWatch = null, mPlaying = false, musicReady = false;
  function musicFrom(list) {
    if (!list.length) { log('no music source worked'); return; }
    var src = list[0]; clearTimeout(mWatch);
    music.onerror = function () { log('music error: ' + short(src)); musicFrom(list.slice(1)); };
    mWatch = setTimeout(function () { if (!mPlaying) { log('music stalled: ' + short(src)); musicFrom(list.slice(1)); } }, 9000);
    music.src = src; var p = music.play(); if (p && p.catch) p.catch(function () {});
  }
  music.addEventListener('playing', function () { if (!mPlaying) log('music playing ' + short(music.currentSrc)); mPlaying = true; clearTimeout(mWatch); });
  cacheURI(mName, function (cached) {
    if (cached) musicList.push(cached);
    if (H.media(SCENE, 'music.m4a')) musicList.push(H.media(SCENE, 'music.m4a'));
    musicList.push(H.fallbackMedia.music); musicReady = true;
    if (!cached && H.usb) setTimeout(function () { copyToCache(mName, 'scenes/' + SCENE + '/music.m4a', function (ok) { if (ok) log('music stored on the TV – used from next start'); }); }, 60000);
  });
  function startMusic() {
    music.volume = 0; curVol = 0;
    (function go() { if (!musicReady) return setTimeout(go, 300); musicFrom(musicList);
      music.addEventListener('loadedmetadata', function once() { music.removeEventListener('loadedmetadata', once); var st = store.get('hearthPos', 0); try { if (st > 0 && st < music.duration) music.currentTime = st; } catch (e) {} });
      rampTo(target(), 9000); })();
  }
  setInterval(function () { if (!music.paused) store.set('hearthPos', Math.floor(music.currentTime)); }, 15000);
  setInterval(function () {
    if (paused || !revealed || !music.src) return;
    if (music.paused || music.ended) { log('music was paused by the TV – resuming'); var p = music.play(); if (p && p.catch) p.catch(function () {}); }
    if (!rampT && Math.abs(music.volume - target()) > 0.02) rampTo(target(), 2000);
  }, 4000);
  video.addEventListener('playing', function () { setTimeout(function () { if (!paused && music.src && music.paused) { var p = music.play(); if (p && p.catch) p.catch(function () {}); } }, 600); });
  function setVolume(v, quiet) { vol = Math.max(0, Math.min(1, Math.round(v * 100) / 100)); store.set('hearthVol', vol); rampTo(target(), 400); if (!quiet) toast('Music ' + Math.round(vol * 100) + '%'); }
  function setPaused(p) { paused = !!p; rampTo(target(), 1200, function () { if (paused) music.pause(); }); if (!paused) { var q = music.play(); if (q && q.catch) q.catch(function () {}); } toast(paused ? 'Music paused' : 'Music on'); }

  /* ================= info layer, toasts, phone messages ================= */
  var hideT = null;
  function showOverlay(ms) { if (overlay.className.indexOf('show') < 0) overlay.className = 'show'; clearTimeout(hideT); hideT = setTimeout(function () { overlay.className = ''; }, ms || 60000); }
  var toastT = null;
  function toast(msg, ms) { var t = $('toast'); t.textContent = msg; t.className = 'on'; clearTimeout(toastT); toastT = setTimeout(function () { t.className = ''; }, ms || 2200); }
  var noteT = null;
  function note(from, text, ms) {
    $('noteFrom').textContent = from ? 'From ' + from : 'A note'; $('noteText').textContent = text;
    $('note').className = 'on'; clearTimeout(noteT); noteT = setTimeout(function () { $('note').className = ''; }, Math.max(6000, Math.min(120000, ms || 20000)));
  }

  /* ================= living light ================= */
  var fire = $('firelight'), fl = 0.18;
  var boardEl = $('board');
  /* set the board into the chimney's own perspective. Mapped from the stone courses in the video (mortar joints fitted
     across the chimney face): they run downhill to the right at about 9.5° near the top of the board and 7.5° at the
     bottom, all meeting at one vanishing point off to the right; the chimney's edges stay vertical. The board is a flat
     rectangle warped onto that grid, so its text and frame foreshorten exactly like the stone around it. */
  (function () {
    var W = 164, Hh = 143, L = 434, R = 598, T = 62, B = 205, a1 = Math.tan(9.5 * Math.PI / 180), a2 = Math.tan(7.5 * Math.PI / 180);
    var x0 = L, y0 = T, x1 = R, y1 = T + (R - L) * a1, x2 = L, y2 = B, x3 = R, y3 = B + (R - L) * a2;
    var dx1 = x1 - x3, dx2 = x2 - x3, dy1 = y1 - y3, dy2 = y2 - y3, sx = x0 - x1 - x2 + x3, sy = y0 - y1 - y2 + y3, den = dx1 * dy2 - dx2 * dy1;
    var g = (sx * dy2 - dx2 * sy) / den, h = (dx1 * sy - sx * dy1) / den;
    var a = x1 - x0 + g * x1, b = x2 - x0 + h * x2, c = x0, d = y1 - y0 + g * y1, e = y2 - y0 + h * y2, f = y0;
    var m = [a / W, d / W, 0, g / W, b / Hh, e / Hh, 0, h / Hh, 0, 0, 1, 0, c, f, 0, 1];
    boardEl.style.transformOrigin = '0 0';
    boardEl.style.transform = 'matrix3d(' + m.map(function (v) { return +v.toFixed(9); }).join(',') + ')';
  })();
  setInterval(function () { fl += (0.12 + Math.random() * 0.16 - fl) * 0.45; fire.style.opacity = fl.toFixed(3); boardEl.style.setProperty('--fire', (0.9 + fl * 0.45).toFixed(3)); }, 110);
  var fxOn = store.get('hearthFx', true);
  function applyFx() { $('fx').className = fxOn ? '' : 'off'; }
  applyFx();

  /* ================= family photos in the two picture frames ================= */
  function buildFrame(id, key) {
    var el = $(id), imgs = [];
    for (var i = 0; i < 7; i++) { var im = document.createElement('img'); im.src = H.personal('framed/' + key + '_' + i + '.png'); el.appendChild(im); imgs.push(im); }
    return imgs;
  }
  var fA = buildFrame('frameA', 'A'), fB = buildFrame('frameB', 'B');
  var pa = Math.floor(Math.random() * 7), pb = (pa + 3) % 7;
  fA[pa].className = 'on'; fB[pb].className = 'on';
  function nextPhoto(which) {
    if (which !== 'B') { fA[pa].className = ''; pa = (pa + 1) % 7; fA[pa].className = 'on'; }
    if (which !== 'A') { fB[pb].className = ''; pb = (pb + 1) % 7; fB[pb].className = 'on'; }
  }
  setInterval(function () { nextPhoto('A'); }, 4 * 60000);
  setTimeout(function () { setInterval(function () { nextPhoto('B'); }, 4 * 60000); }, 2 * 60000);

  /* ================= the elf: hides somewhere new every 5 minutes ================= */
  var SPOTS = [
    ['mantel', 434.5, 419, 27, 38], ['balcony railing', 221, 124, 21.5, 30], ['right lamp', 1581.5, 578, 28.5, 40], ['left lamp', 181.5, 608, 28.5, 40],
    ['coffee table', 1112.5, 832.5, 35, 49], ['presents', 268.5, 827.5, 35, 49], ['presents by the window', 1479, 774.5, 34, 47.5],
    ['big window', 1328.5, 313.5, 23, 32], ['chandelier', 110.5, 405.5, 23, 32], ['bookshelf', 249.5, 437.5, 24.5, 34.5], ['fireplace wreath', 516.5, 244.5, 27, 19]];
  var elf = $('elf'), elfAt = store.get('hearthElf', -1), elfMovedAt = Date.now();
  function placeElf(i) {
    var s = SPOTS[i]; elf.src = H.asset('elves/elf_' + i + '.png');
    elf.style.left = s[1] + 'px'; elf.style.top = s[2] + 'px'; elf.style.width = s[3] + 'px'; elf.style.height = s[4] + 'px';
    elfAt = i; store.set('hearthElf', i); elfMovedAt = Date.now();
  }
  function moveElf() {
    elf.className = '';
    setTimeout(function () {
      var n; do { n = Math.floor(Math.random() * SPOTS.length); } while (n === elfAt);
      placeElf(n); setTimeout(function () { elf.className = 'on'; }, 200);
    }, 1600);
  }
  if (elfAt < 0 || elfAt >= SPOTS.length) elfAt = Math.floor(Math.random() * SPOTS.length);
  placeElf(elfAt);
  var elfTimer = setInterval(moveElf, 5 * 60000);
  var hintT = null;
  function elfHint() {
    toast('The elf is shining for a moment…', 2500);
    elf.className = 'on hint'; clearTimeout(hintT); hintT = setTimeout(function () { elf.className = 'on'; }, 4500);
  }

  /* ================= Santa flying past the windows ================= */
  var sleigh = $('sleigh'), flying = false;
  function flyover() {
    if (flying) return; flying = true;
    sleigh.className = ''; void sleigh.offsetWidth; sleigh.className = 'fly';
    setTimeout(function () { sleigh.className = ''; flying = false; }, 11500);
  }
  var lastFly = Date.now();
  setInterval(function () {
    var d = new Date(), m = d.getMonth(), day = d.getDate(), h = d.getHours(), since = (Date.now() - lastFly) / 60000;
    var evening = h >= 16 || h < 1, go = false;
    if (m === 11 && day === 24 && evening) go = since >= 15;
    else if (m === 11 && day < 24 && evening) go = since >= 20 && Math.random() < 1 / 40;
    else if (evening) go = since >= 30 && Math.random() < 1 / 120;
    if (go) { lastFly = Date.now(); flyover(); }
  }, 60000);

  /* ================= clock, date, countdown ================= */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function tick() {
    var d = new Date(), h = d.getHours();
    $('time').textContent = (((h + 11) % 12) + 1) + ':' + pad(d.getMinutes());
    $('ampm').textContent = h < 12 ? 'AM' : 'PM';
    $('greet').textContent = h < 5 ? 'Good night' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
    $('date').textContent = DAYS[d.getDay()] + ', ' + MONTHS[d.getMonth()] + ' ' + d.getDate();
    var today = new Date(d.getFullYear(), d.getMonth(), d.getDate()), xmas = new Date(d.getFullYear(), 11, 25);
    if (today > xmas) xmas = new Date(d.getFullYear() + 1, 11, 25);
    var days = Math.round((xmas - today) / 86400000);
    $('countdown').textContent = days === 0 ? 'Merry Christmas' : days === 1 ? 'One more sleep' : days + ' sleeps until Christmas';
    $('dim').style.opacity = night() ? 0.35 : 0;
    if (!paused && !rampT && revealed && Math.abs(music.volume - target()) > 0.02) rampTo(target(), 4000);
    if (!demo) santaTick(d);
  }

  /* ================= Santa model ================= */
  var santa = { lat: 90, lon: 0, flying: false, line: '', pct: 0 };
  function santaAtLon(lon) { santa.lon = lon; santa.lat = 18 + 28 * Math.sin(lon * Math.PI / 60); }
  function km(a, b) {
    var r = Math.PI / 180, dl = (b.lat - a.lat) * r, dn = (b.lon - a.lon) * r;
    var x = Math.sin(dl / 2) * Math.sin(dl / 2) + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dn / 2) * Math.sin(dn / 2);
    return 6371 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  }
  var lastHouse = 0;
  function santaTick(now) {
    var y = now.getUTCFullYear(), t = now.getTime();
    var prep = Date.UTC(y, 10, 1), dep = Date.UTC(y, 11, 24, 10), land = Date.UTC(y, 11, 25, 12), pct;
    if (t >= prep && t < dep) {
      pct = (t - prep) / (dep - prep); santa.flying = false; santa.lat = 90;
      var dd = Math.ceil((dep - t) / 86400000);
      santa.line = 'Sleigh prep · ' + Math.floor(pct * 100) + '%';
      $('santaLabel').textContent = 'Santa · takes off in ' + dd + (dd === 1 ? ' day' : ' days');
    } else if (t >= dep && t < land) {
      pct = (t - dep) / (land - dep); santa.flying = true;
      var lon = -15 * ((t - Date.UTC(y, 11, 25)) / 3600000); santaAtLon(((lon + 540) % 360) - 180);
      santa.line = 'Delivering now · ' + Math.floor(pct * 100) + '%';
      $('santaLabel').textContent = 'Santa · in flight';
      var dist = km(santa, BRAMPTON);
      if (dist < 3000 && Date.now() - lastHouse > 8 * 60000) { lastHouse = Date.now(); houseMoment(dist, 30000); }
    } else {
      pct = 1; santa.flying = false; santa.lat = 90;
      santa.line = 'Home at the North Pole'; $('santaLabel').textContent = 'Santa';
    }
    santa.pct = pct; $('santaLine').textContent = santa.line;
    $('santaFill').style.width = (pct * 100).toFixed(1) + '%';
  }
  var house = $('house'), houseT = null;
  function houseText(dist) {
    if (dist < 120) { $('houseLine').textContent = 'Santa is over Brampton!'; $('houseSub').textContent = 'Lights off, everyone to bed'; }
    else { $('houseLine').textContent = 'Santa is ' + Math.round(dist / 10) * 10 + ' km from Brampton'; $('houseSub').textContent = 'He’s heading your way'; }
  }
  function houseMoment(dist, ms) {
    houseText(dist); house.className = 'on'; overlay.className = '';
    if (dist < 120) flyover();
    clearTimeout(houseT); houseT = setTimeout(function () { house.className = ''; }, ms);
  }
  /* demo: replays the Christmas Eve approach in 30 seconds (from the phone remote) */
  var demo = false;
  function runDemo() {
    if (demo) return; demo = true; var start = Date.now(), D = 26000, wasFlying = santa.flying;
    santa.flying = true; houseMoment(2400, D + 6000);
    var iv = setInterval(function () {
      var k = Math.min(1, (Date.now() - start) / D), lon = -30 + (BRAMPTON.lon + 30) * k;
      santaAtLon(lon); if (k >= 1) { santa.lat = BRAMPTON.lat; santa.lon = BRAMPTON.lon; }
      houseText(k >= 1 ? 0 : km(santa, BRAMPTON));
      if (k >= 1) { clearInterval(iv); flyover(); setTimeout(function () { demo = false; santa.flying = wasFlying; tick(); }, 9000); }
    }, 250);
  }

  /* ================= globes: NASA Blue Marble with live day/night ================= */
  var tex = null, TW = 0, TH = 0;
  var img = new Image();
  img.onload = function () { var c = document.createElement('canvas'); c.width = TW = img.width; c.height = TH = img.height; var g = c.getContext('2d'); g.drawImage(img, 0, 0); tex = g.getImageData(0, 0, TW, TH).data; };
  img.src = H.asset('earth.jpg');
  function sun(d) {
    var start = Date.UTC(d.getUTCFullYear(), 0, 0), doy = (d.getTime() - start) / 86400000;
    return { dec: -23.44 * Math.cos(2 * Math.PI / 365 * (doy + 10)) * Math.PI / 180, lon: (-15 * (d.getUTCHours() + d.getUTCMinutes() / 60 - 12)) * Math.PI / 180 };
  }
  function Globe(canvas, tiltDeg) {
    var cx = canvas.getContext('2d'), S = canvas.width, R = S / 2 - 6, out = cx.createImageData(S, S), tilt = tiltDeg * Math.PI / 180, table = [];
    for (var py = 0; py < S; py++) for (var px = 0; px < S; px++) {
      var x = (px - S / 2 + 0.5) / R, y = (S / 2 - py - 0.5) / R, r2 = x * x + y * y; if (r2 > 1) continue;
      var z = Math.sqrt(1 - r2), y2 = y * Math.cos(tilt) + z * Math.sin(tilt), z2 = -y * Math.sin(tilt) + z * Math.cos(tilt);
      table.push(py * S + px, Math.asin(y2), Math.atan2(x, z2), z, Math.min(1, (1 - Math.sqrt(r2)) * 18));
    }
    this.view = -80 * Math.PI / 180;
    this.draw = function (ts, markers) {
      var s = sun(new Date()), sd = Math.sin(s.dec), cd = Math.cos(s.dec), o = out.data, v = this.view;
      for (var i = 3; i < o.length; i += 4) o[i] = 0;
      for (var j = 0; j < table.length; j += 5) {
        var idx = table[j], lat = table[j + 1], lon = table[j + 2] + v, z = table[j + 3], edge = table[j + 4];
        var lw = ((lon / (2 * Math.PI) + 0.5) % 1 + 1) % 1, tx = (lw * TW) | 0, ty = ((0.5 - lat / Math.PI) * TH) | 0; if (ty >= TH) ty = TH - 1;
        var ti = (ty * TW + tx) * 4, light = Math.sin(lat) * sd + Math.cos(lat) * cd * Math.cos(lon - s.lon);
        var day = Math.max(0, Math.min(1, light * 5 + 0.5)), f = (0.38 + 0.62 * day) * (0.6 + 0.4 * z), n = 1 - day, oi = idx * 4;
        o[oi] = tex[ti] * f * (1 - 0.25 * n) + n * 6; o[oi + 1] = tex[ti + 1] * f * (1 - 0.12 * n) + n * 14; o[oi + 2] = tex[ti + 2] * f + n * 34; o[oi + 3] = 255 * edge;
      }
      cx.clearRect(0, 0, S, S); cx.putImageData(out, 0, 0);
      var g = cx.createRadialGradient(S / 2, S / 2, R * 0.86, S / 2, S / 2, R * 1.06);
      g.addColorStop(0, 'rgba(120,175,255,0)'); g.addColorStop(0.7, 'rgba(120,175,255,.28)'); g.addColorStop(1, 'rgba(120,175,255,0)');
      cx.fillStyle = g; cx.beginPath(); cx.arc(S / 2, S / 2, R * 1.06, 0, Math.PI * 2); cx.fill();
      for (var k = 0; k < markers.length; k++) {
        var mk = markers[k], la = mk.lat * Math.PI / 180, lo = mk.lon * Math.PI / 180 - v;
        var X = Math.cos(la) * Math.sin(lo), Y = Math.sin(la), Z = Math.cos(la) * Math.cos(lo);
        var vy = Y * Math.cos(tilt) - Z * Math.sin(tilt), vz = Y * Math.sin(tilt) + Z * Math.cos(tilt);
        if (vz < -0.05) continue;
        var sx = S / 2 + X * R, sy = S / 2 - vy * R, rr = mk.r * S / 220, pulse = 0.6 + 0.4 * Math.sin(ts / 400);
        if (mk.glow) { var gg = cx.createRadialGradient(sx, sy, 0, sx, sy, rr * 4); gg.addColorStop(0, 'rgba(255,90,70,' + (0.55 * pulse) + ')'); gg.addColorStop(1, 'rgba(255,90,70,0)'); cx.fillStyle = gg; cx.beginPath(); cx.arc(sx, sy, rr * 4, 0, Math.PI * 2); cx.fill(); }
        cx.fillStyle = mk.color; cx.beginPath(); cx.arc(sx, sy, rr, 0, Math.PI * 2); cx.fill();
        cx.strokeStyle = 'rgba(255,255,255,.9)'; cx.lineWidth = Math.max(1, S / 180); cx.stroke();
      }
    };
  }
  var small = new Globe($('globe'), 24), big = new Globe($('bigGlobe'), 38), lastF = 0;
  /* also measures how smoothly the TV is drawing, for the admin page */
  var fpsCount = 0, fps = 0, fpsT = performance.now();
  function frame(ts) {
    requestAnimationFrame(frame);
    fpsCount++; if (ts - fpsT >= 1000) { fps = Math.round(fpsCount * 1000 / (ts - fpsT)); fpsCount = 0; fpsT = ts; }
    if (!tex || ts - lastF < 66) return;
    var dt = lastF ? Math.min(0.5, (ts - lastF) / 1000) : 0; lastF = ts;
    var santaMk = { lat: santa.lat, lon: santa.lon, r: 3.6, color: '#ff5a46', glow: true };
    if (overlay.className.indexOf('show') >= 0) {
      if (santa.flying) { var tg = santa.lon * Math.PI / 180, df = Math.atan2(Math.sin(tg - small.view), Math.cos(tg - small.view)); small.view += df * Math.min(1, dt * 0.8); }
      else small.view += dt * (2 * Math.PI / 150);
      small.draw(ts, [santaMk]);
    }
    if (house.className === 'on') {
      var mid = (santa.lon + BRAMPTON.lon) / 2 * Math.PI / 180, d2 = Math.atan2(Math.sin(mid - big.view), Math.cos(mid - big.view));
      big.view += d2 * Math.min(1, dt * 1.2);
      big.draw(ts, [{ lat: BRAMPTON.lat, lon: BRAMPTON.lon, r: 2.6, color: '#f3cf86', glow: false }, santaMk]);
    }
  }
  requestAnimationFrame(frame);
  var lag = 0, lagT = Date.now();
  setInterval(function () { var n = Date.now(); lag = Math.max(0, n - lagT - 1000); lagT = n; }, 1000);

  /* ================= the board on the chimney =================
     Priority, top to bottom: family notes (only when there is one) → live games → today's and tomorrow's big games →
     Brampton weather when there's nothing else. A thin ticker along the bottom carries only the most serious world
     news (war, strikes, bombings, attacks); it disappears when there's none. */
  var ESPN = 'https://site.api.espn.com/apis/site/v2/sports/';
  var COMPS = {
    nhl: { n: 'NHL', path: 'hockey/nhl', base: 40, c: '#8fb8e8', days: 2 },
    epl: { n: 'Premier League', path: 'soccer/eng.1', base: 30, c: '#b48ad6', days: 4 },
    ucl: { n: 'Champions League', path: 'soccer/uefa.champions', base: 36, c: '#6f8ff0', days: 4 },
    ccl: { n: 'CONCACAF', path: 'soccer/concacaf.champions', base: 24, c: '#4fb3a6', days: 3 },
    cnl: { n: 'CONCACAF', path: 'soccer/concacaf.nations.league', base: 24, c: '#4fb3a6', days: 3, dflt: true },
    gold: { n: 'Gold Cup', path: 'soccer/concacaf.gold', base: 26, c: '#d9b45a', days: 3, dflt: true }
  };
  var CANADA_NHL = { TOR: 12, OTT: 6, MTL: 6, WPG: 6, EDM: 6, CGY: 5, VAN: 5 };         // Leafs first, then the rest of Canada
  var BIG = ['Arsenal', 'Manchester City', 'Liverpool', 'Chelsea', 'Manchester United', 'Tottenham Hotspur', 'Newcastle United', 'Aston Villa',
             'Real Madrid', 'Barcelona', 'Bayern Munich', 'Paris Saint-Germain', 'Internazionale', 'Juventus', 'AC Milan', 'Borussia Dortmund', 'Atletico Madrid'];
  var CONCACAF_MAIN = /Canada|United States|USA|Mexico|Toronto|Vancouver|Montr[eé]al|Inter Miami|LAFC|LA Galaxy|Club Am[eé]rica|Monterrey|Tigres|Cruz Azul|Chivas|Guadalajara|Seattle|Columbus/i;
  var settings = store.get('hearthSports', { comps: ['nhl', 'epl', 'ucl', 'ccl'], favs: [] });
  if (!settings.comps) settings = { comps: ['nhl', 'epl', 'ucl', 'ccl'], favs: [] };
  var FAVS = {
    bar: { n: 'Barcelona', id: '83' }, arg: { n: 'Argentina', id: '202' }, mia: { n: 'Inter Miami', id: '20232' }, can: { n: 'Canada', id: '206' },
    tfc: { n: 'Toronto FC', id: '7318' }, rma: { n: 'Real Madrid', id: '86' }, psg: { n: 'PSG', id: '160' }, bay: { n: 'Bayern', id: '132' }
  };
  var notes = store.get('hearthNotes', []);
  var gamesByComp = {}, favGames = {}, weather = null, news = [], dataReady = false;

  function getJSON(url, cb) {
    var x = new XMLHttpRequest(), done = false, to = setTimeout(function () { if (!done) { done = true; try { x.abort(); } catch (e) {} cb(null); } }, 20000);
    x.onreadystatechange = function () { if (x.readyState !== 4 || done) return; done = true; clearTimeout(to); var j = null; if (x.status === 200) { try { j = JSON.parse(x.responseText); } catch (e) {} } cb(j, x); };
    try { x.open('GET', url, true); x.send(); } catch (e) { done = true; clearTimeout(to); cb(null); }
  }
  function score(s) { if (s == null) return ''; if (typeof s === 'object') return s.displayValue != null ? s.displayValue : (s.value != null ? String(s.value) : ''); return String(s); }
  function ymd(ms) { var d = new Date(ms); return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()); }

  /* one game, scored for how much this family cares about it */
  function parseGame(e, ck, favKey) {
    var c = e.competitions && e.competitions[0]; if (!c || !c.competitors || c.competitors.length < 2) return null;
    var home = null, away = null;
    c.competitors.forEach(function (t) { if (t.homeAway === 'home') home = t; else away = t; });
    if (!home || !away) { home = c.competitors[0]; away = c.competitors[1]; }
    var st = (c.status || e.status || {}).type || {}, C = COMPS[ck] || { n: '', base: 28, c: '#d9b45a' };
    var hn = home.team.displayName || '', an = away.team.displayName || '';
    var g = { id: e.id, d: Date.parse(e.date), comp: ck, lg: (favKey && e.league && e.league.abbreviation) || C.n, c: C.c,
              state: st.state || 'pre', detail: st.shortDetail || '',
              h: { n: home.team.shortDisplayName || hn, full: hn, ab: home.team.abbreviation, s: score(home.score) },
              a: { n: away.team.shortDisplayName || an, full: an, ab: away.team.abbreviation, s: score(away.score) }, w: C.base, star: 'h' };
    if (ck === 'nhl') {
      var bh = CANADA_NHL[g.h.ab] || 0, ba = CANADA_NHL[g.a.ab] || 0;
      if (!bh && !ba) return null;                                                   // NHL: Canadian teams only
      g.w += Math.max(bh, ba) + (bh && ba ? 8 : 0); g.star = bh >= ba ? 'h' : 'a';
    } else if (ck === 'ccl' || ck === 'cnl' || ck === 'gold') {
      var mh = CONCACAF_MAIN.test(hn), ma = CONCACAF_MAIN.test(an);
      if (!mh && !ma) return null;                                                   // only the main CONCACAF sides
      g.w += (/Canada|Toronto|Vancouver|Montr/i.test(hn + an) ? 12 : 0); g.star = mh || !ma ? 'h' : 'a';
    } else if (ck === 'epl' || ck === 'ucl') {
      var kh = BIG.indexOf(hn) >= 0, ka = BIG.indexOf(an) >= 0;
      g.w += (kh ? 6 : 0) + (ka ? 6 : 0) + (kh && ka ? 8 : 0); g.star = kh || !ka ? 'h' : 'a';
    }
    if (favKey) { g.w += 30; g.star = String(away.team.id) === FAVS[favKey].id ? 'a' : 'h'; }
    return g;
  }
  function loadComp(ck, done) {
    var C = COMPS[ck], urls = [], out = {}, left;
    if (C.dflt) urls.push(ESPN + C.path + '/scoreboard');
    for (var i = 0; i < C.days; i++) urls.push(ESPN + C.path + '/scoreboard?dates=' + ymd(Date.now() + i * 86400000));
    if (ck !== 'nhl') urls.push(ESPN + C.path + '/scoreboard?dates=' + ymd(Date.now() - 86400000));   // last night's results
    left = urls.length;
    urls.forEach(function (u, k) {
      setTimeout(function () {
        getJSON(u, function (j) {
          if (j && j.events) j.events.forEach(function (e) { var g = parseGame(e, ck); if (g) out[g.id] = g; });
          if (--left === 0) { gamesByComp[ck] = Object.keys(out).map(function (id) { return out[id]; }); done && done(); }
        });
      }, k * 700);
    });
  }
  function loadFav(fk, done) {
    var F = FAVS[fk]; if (!F) return done && done();
    getJSON(ESPN + 'soccer/all/teams/' + F.id + '/schedule?fixture=true', function (j) {
      if (j && j.events) { var now = Date.now(); favGames[fk] = j.events.map(function (e) { return parseGame(e, 'fav', fk); }).filter(function (g) { return g && g.d > now - 86400000 && g.d < now + 5 * 86400000; }); }
      done && done();
    });
  }
  function refreshSports() {
    var jobs = [];
    settings.comps.forEach(function (ck) { if (COMPS[ck]) jobs.push(function (n) { loadComp(ck, n); }); if (ck === 'ccl') { jobs.push(function (n) { loadComp('cnl', n); }); jobs.push(function (n) { loadComp('gold', n); }); } });
    (settings.favs || []).forEach(function (fk) { jobs.push(function (n) { loadFav(fk, n); }); });
    Object.keys(gamesByComp).forEach(function (k) { if (settings.comps.indexOf(k) < 0 && !(settings.comps.indexOf('ccl') >= 0 && (k === 'cnl' || k === 'gold'))) delete gamesByComp[k]; });
    Object.keys(favGames).forEach(function (k) { if ((settings.favs || []).indexOf(k) < 0) delete favGames[k]; });
    (function next() { if (!jobs.length) { dataReady = true; renderBoard(); publishBoard(); return; } jobs.shift()(function () { setTimeout(next, 800); }); })();
  }
  /* live games: refresh just that day's scoreboard every 60 s */
  function liveTick() {
    var now = Date.now(), seen = {};
    allGames().forEach(function (g) {
      if (g.state === 'post' || now < g.d - 5 * 60000 || now > g.d + 4 * 3600000 || !COMPS[g.comp]) return;
      var u = ESPN + COMPS[g.comp].path + '/scoreboard?dates=' + ymd(g.d); if (seen[u]) return; seen[u] = 1;
      getJSON(u, function (j) {
        if (!j || !j.events) return;
        j.events.forEach(function (e) { var n = parseGame(e, g.comp); if (!n) return; allGames().forEach(function (o) { if (o.id === n.id) { o.state = n.state; o.detail = n.detail; o.h.s = n.h.s; o.a.s = n.a.s; } }); });
        renderBoard(); publishBoard();
      });
    });
  }
  function allGames() {
    var L = [], ids = {};
    Object.keys(gamesByComp).forEach(function (k) { gamesByComp[k].forEach(function (g) { if (!ids[g.id]) { ids[g.id] = 1; L.push(g); } }); });
    Object.keys(favGames).forEach(function (k) { favGames[k].forEach(function (g) { if (!ids[g.id]) { ids[g.id] = 1; L.push(g); } else L.forEach(function (o) { if (o.id === g.id) o.w = Math.max(o.w, g.w); }); }); });
    return L;
  }
  function ranked() {
    var now = Date.now(), day0 = new Date(new Date().setHours(0, 0, 0, 0)).getTime(), out = [];
    allGames().forEach(function (g) {
      var live = g.state === 'in', fin = g.state === 'post' && now - g.d < 5 * 3600000 && now - g.d > 0, pre = g.state === 'pre' && g.d > now - 2 * 3600000 && g.d < now + 72 * 3600000;
      if (!(live || fin || pre)) return;
      var bucket = live ? 0 : fin ? 1 : g.d < day0 + 86400000 ? 2 : g.d < day0 + 2 * 86400000 ? 3 : 4;
      if (bucket === 4 && g.w < 46) return;                                          // further out: only the biggest games
      out.push({ g: g, b: bucket });
    });
    out.sort(function (x, y) { return x.b - y.b || y.g.w - x.g.w || x.g.d - y.g.d; });
    return out.slice(0, 6).map(function (x) { return x.g; });
  }
  setTimeout(refreshSports, 5000); setInterval(refreshSports, 2 * 3600000); setInterval(liveTick, 60000);

  /* weather for the quiet times (Open-Meteo, no key needed) */
  var WMO = { 0: 'Clear', 1: 'Mostly clear', 2: 'Partly cloudy', 3: 'Cloudy', 45: 'Fog', 48: 'Fog', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle', 56: 'Freezing drizzle', 57: 'Freezing drizzle',
              61: 'Light rain', 63: 'Rain', 65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain', 71: 'Light snow', 73: 'Snow', 75: 'Heavy snow', 77: 'Snow grains',
              80: 'Showers', 81: 'Showers', 82: 'Heavy showers', 85: 'Snow showers', 86: 'Snow showers', 95: 'Thunderstorms', 96: 'Thunderstorms', 99: 'Thunderstorms' };
  function loadWeather() {
    getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + BRAMPTON.lat + '&longitude=' + BRAMPTON.lon + '&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=America%2FToronto&forecast_days=2', function (j) {
      if (j && j.current) { weather = { t: Math.round(j.current.temperature_2m), w: WMO[j.current.weather_code] || '', lo: Math.round(j.daily.temperature_2m_min[0]), hi1: Math.round(j.daily.temperature_2m_max[1]), w1: WMO[j.daily.weather_code[1]] || '' }; renderBoard(); }
    });
  }
  setTimeout(loadWeather, 3000); setInterval(loadWeather, 30 * 60000);

  /* ticker: only the most serious world news */
  var FEEDS = ['https://rss.nytimes.com/services/xml/rss/nyt/World.xml', 'https://feeds.bbci.co.uk/news/world/rss.xml', 'https://www.aljazeera.com/xml/rss/all.xml', 'https://www.theguardian.com/world/rss'];
  var HOT = /\b(air ?strikes?|missiles?|ballistic|bombs?|bombed|bombings?|explosions?|blasts?|drone (?:strikes?|attacks?)|shelling|invasion|invades?|invaded|nuclear|hostages?|rockets?|terror(?:ist|ism)?|suicide bomber|gunmen|massacre|ceasefire|truce|war|warplanes?|troops|militants?|attacks?|killed)\b/i;
  var STRONG = /\b(air ?strikes?|missiles?|ballistic|bombs?|bombed|bombings?|explosions?|blasts?|drone (?:strikes?|attacks?)|shelling|invasion|invades?|invaded|nuclear|terror(?:ist|ism)? attack|suicide bomber|massacre|warplanes?)\b/i;
  var COLD = /\b(price war|trade war|culture war|star wars|war of words|war chest|cold war-era|film|movie|series|novel|book|review|museum|exhibition|anniversary|memorial|remembrance|veterans?|football|soccer|cricket|rugby|tennis|olympic|award|recipe|fashion|podcast|quiz|opinion|interview|explainer|what we know|analysis|photos?:|in pictures|crossword|obituary)\b/i;
  var STATE = /\b(russia|russian|ukraine|ukrainian|kyiv|moscow|crimea|iran|iranian|tehran|israel|israeli|gaza|lebanon|hezbollah|hamas|houthis?|yemen|syria|u\.s\.|pentagon|nato|china|chinese|taiwan|north korea|pakistan|india|bahrain|kuwait|qatar|saudi)\b/i;
  var ACT = /\b(attacks?|attacked|strikes?|struck|hit|hits|bombard\w*|shell\w*|fired|launch(?:es|ed)?|intercept\w*)\b/i;
  var SOFT = /\b(trial|sentenc\w*|convict\w*|court|lawsuit|sues?|whistleblower|claims?|plot|could.ve|could have|how the|why|what|explainer|proof|lessons|inquiry|probe|keeping it|rainy day)\b/i;
  function newsScore(t) {
    if (!HOT.test(t) || COLD.test(t)) return 0;
    var s = 1; if (STRONG.test(t)) s += 3; if (STATE.test(t) && ACT.test(t)) s += 3; if (/\b(killed|dead|deaths?)\b/i.test(t)) s += 1; if (SOFT.test(t)) s -= 5;
    return s;
  }
  function loadNews() {
    var got = [], left = FEEDS.length;
    FEEDS.forEach(function (u) {
      var x = new XMLHttpRequest(), done = false, to = setTimeout(function () { finish(); }, 15000);
      function finish() { if (done) return; done = true; clearTimeout(to); if (--left === 0) settle(); }
      x.onreadystatechange = function () {
        if (x.readyState !== 4) return;
        try {
          var doc = x.responseXML || (new DOMParser()).parseFromString(x.responseText, 'text/xml'), items = doc.getElementsByTagName('item');
          for (var i = 0; i < items.length && i < 60; i++) {
            var t = (items[i].getElementsByTagName('title')[0] || {}).textContent || '', p = (items[i].getElementsByTagName('pubDate')[0] || {}).textContent || '';
            var when = Date.parse(p) || 0; t = t.replace(/\s+/g, ' ').trim().replace(/^[^:]{0,24}\blive:\s*/i, '');
            if (t && when && Date.now() - when < 8 * 3600000) { var s = newsScore(t); if (s >= 3) got.push({ t: t, d: when, s: s, src: u.indexOf('nytimes') > 0 ? 'NYT' : u.indexOf('bbc') > 0 ? 'BBC' : u.indexOf('aljazeera') > 0 ? 'Al Jazeera' : 'Guardian' }); }
          }
        } catch (e) {}
        finish();
      };
      try { x.open('GET', u, true); x.send(); } catch (e) { finish(); }
    });
    function settle() {
      got.sort(function (a, b) { return b.s - a.s || b.d - a.d; });
      var seen = [], out = [];
      got.forEach(function (n) { var k = n.t.toLowerCase().replace(/[^a-z ]/g, '').split(' ').filter(function (w) { return w.length > 3; }).slice(0, 5);
        if (seen.some(function (s) { var c = 0; k.forEach(function (w) { if (s.indexOf(w) >= 0) c++; }); return c >= 3; })) return; seen.push(k); out.push(n); });
      news = out.slice(0, 3); renderTicker(); publishBoard();
    }
  }
  setTimeout(loadNews, 7000); setInterval(loadNews, 10 * 60000);
  var tickSig = '';
  function renderTicker() {
    var sig = news.map(function (n) { return n.t; }).join('|'); if (sig === tickSig) return; tickSig = sig;
    var el = $('bTick'), run = $('bTickRun');
    if (!news.length) { el.className = ''; $('bScreen').className = ''; return; }
    var txt = news.map(function (n) { return esc(n.t) + ' <span class="src">' + n.src + '</span>'; }).join('<i></i>');
    run.innerHTML = '<span>' + txt + '<i></i></span><span>' + txt + '<i></i></span>';
    el.className = 'on'; $('bScreen').className = 'tick';
    setTimeout(function () { var w = run.firstChild.offsetWidth; run.style.animationDuration = Math.max(18, w / 14) + 's'; }, 100);
  }

  /* ---------- drawing the board ---------- */
  function when(ms) {
    var d = new Date(ms), now = new Date(), day0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var dd = Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - day0) / 86400000);
    var h = d.getHours(), t = (((h + 11) % 12) + 1) + (d.getMinutes() ? ':' + pad(d.getMinutes()) : '') + (h < 12 ? ' am' : ' pm');
    var w = dd === 0 ? (h >= 17 ? 'Tonight' : 'Today') : dd === 1 ? 'Tomorrow' : dd < 7 ? DAYS[d.getDay()].slice(0, 3) : MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getDate();
    return w + ' · ' + t;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ago(t) { var m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'just now' : m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' d ago'; }
  function gameRow(g) {
    var S = g[g.star], O = g[g.star === 'h' ? 'a' : 'h'], wt;
    if (g.state === 'in') wt = '<span class="live">Live · ' + esc(g.detail.replace(/ - /, ' ')) + '</span>';
    else if (g.state === 'post') wt = 'Final' + (/OT|SO|Pen/i.test(g.detail) ? ' · ' + esc(g.detail.replace(/^Final\/?/i, '')) : '');
    else wt = esc(when(g.d));
    wt += '<span class="lg">' + esc(g.lg) + '</span>';
    var right = g.state !== 'pre' && S.s !== '' ? '<div class="sc">' + esc(S.s) + '<i>–</i>' + esc(O.s) + '</div>' : '';
    return '<div class="bg"><div class="chip" style="background:' + g.c + '"></div><div class="m"><div class="w">' + wt + '</div><div class="a">' + esc(S.n) + '</div><div class="s">' + (g.star === 'h' ? 'vs ' : 'at ') + esc(O.n) + '</div></div>' + right + '</div>';
  }
  var pages = [], pageI = 0, lastSig = '';
  function buildPages() {
    var P = [], gs = ranked(), live = gs.filter(function (g) { return g.state === 'in'; });
    var ns = notes.slice().sort(function (a, b) { return b.t - a.t; });
    for (var i = 0; i < ns.length;) {
      var a = ns[i], b = ns[i + 1], pair = b && a.text.length + b.text.length < 90;
      P.push({ k: 'Family board', h: [a].concat(pair ? [b] : []).map(function (n) { return '<div class="bn' + (pair ? '' : ' one') + '"><div class="t">' + esc(n.text) + '</div><div class="f">' + (n.from ? esc(n.from) + ' · ' : '') + ago(n.t) + '</div></div>'; }).join('') });
      i += pair ? 2 : 1;
    }
    var show = ns.length ? live : gs;                                                 // with notes up, only live games interrupt
    for (var j = 0; j < show.length; j += 2) P.push({ k: show[j].state === 'in' ? 'Live now' : show[j].state === 'post' ? 'Results' : j ? 'Coming up' : 'Up next', h: show.slice(j, j + 2).map(gameRow).join('') });
    if (!P.length && weather) P.push({ k: 'Brampton', h: '<div class="bw"><div class="t">' + weather.t + '°</div><div class="r"><div class="c">' + esc(weather.w) + '</div><div class="f">Tonight ' + weather.lo + '° · Tomorrow ' + weather.hi1 + '°' + (weather.w1 ? ', ' + esc(weather.w1.toLowerCase()) : '') + '</div></div></div>' });
    return P;
  }
  function renderBoard(advance) {
    var P = buildPages(), sig = JSON.stringify(P), body = $('bBody'), scr = $('board');
    if (!P.length) { pages = []; lastSig = sig; scr.className = 'off'; return; }          // nothing worth showing: the screen rests dark
    scr.className = '';
    if (!advance && sig === lastSig) return;
    var changed = sig !== lastSig; lastSig = sig; pages = P;
    if (advance) pageI = (pageI + 1) % pages.length; else if (pageI >= pages.length || pageI < 0) pageI = 0;
    var pg = pages[pageI];
    function put() { body.innerHTML = pg.h; $('bKicker').textContent = pg.k;
      $('bDots').innerHTML = pages.length > 1 ? pages.map(function (x, i) { return '<i' + (i === pageI ? ' class="on"' : '') + '></i>'; }).join('') : ''; body.className = ''; }
    if (advance || changed) { body.className = 'fade'; setTimeout(put, 700); } else put();
  }
  setInterval(function () { if (pages.length > 1) renderBoard(true); }, 12000);
  setInterval(function () { renderBoard(false); }, 60000);
  renderBoard(false);
  function saveNotes() { store.set('hearthNotes', notes); renderBoard(false); publishBoard(); }
  function addNote(text, from) {
    text = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 140); if (!text) return;
    notes.push({ id: Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36), text: text, from: String(from || '').slice(0, 24), t: Date.now() });
    if (notes.length > 40) notes.shift();
    pageI = 0; saveNotes();
  }
  function boardState() {
    return { notes: notes, sports: settings,
             compsCat: [{ k: 'nhl', n: 'NHL · Canadian teams' }, { k: 'epl', n: 'Premier League' }, { k: 'ucl', n: 'Champions League' }, { k: 'ccl', n: 'CONCACAF' }],
             favsCat: Object.keys(FAVS).map(function (k) { return { k: k, n: FAVS[k].n }; }),
             next: ranked().map(function (g) { var S = g[g.star], O = g[g.star === 'h' ? 'a' : 'h']; return { team: S.n, opp: O.n, home: g.star === 'h', c: g.c, d: g.d, state: g.state, detail: g.detail, su: S.s, so: O.s, lg: g.lg }; }),
             news: news, weather: weather, page: pages[pageI] ? pages[pageI].k : (pages.length ? '' : 'off') };
  }
  var publishBoard = function () {};

  /* ================= phone remote / admin link =================
     Live status goes to a private channel on a public MQTT relay; the channel name is a random key that only
     exists on this TV and on phones that scanned its code. Nothing personal is sent – just what's playing and how it's running. */
  var BROKERS = H.brokers || [{ host: 'broker.hivemq.com', port: 8884, path: '/mqtt', ssl: true }, { host: 'broker.hivemq.com', port: 8000, path: '/mqtt', ssl: false }, { host: 'broker.emqx.io', port: 8084, path: '/mqtt', ssl: true }];
  var key = store.get('hearthLinkKey', '');
  if (!/^[a-z0-9]{16}$/.test(key)) {
    var al = 'abcdefghijkmnpqrstuvwxyz23456789', r = [];
    try { var b = new Uint8Array(16); crypto.getRandomValues(b); for (var i = 0; i < 16; i++) r.push(al[b[i] % al.length]); }
    catch (e) { for (var j = 0; j < 16; j++) r.push(al[Math.floor(Math.random() * al.length)]); }
    key = r.join(''); store.set('hearthLinkKey', key); log('made a new phone-remote key');
  }
  var BASE = 'hearth/v1/' + key + '/', ADMIN_URL = REMOTE + 'admin/#' + key;
  var link = { client: null, up: false, bi: 0, tries: 0, host: '', since: 0, lastAdmin: 0, sent: 0, cmds: 0 };
  function linkConnect() {
    if (typeof Paho === 'undefined') { log('phone remote unavailable (library missing)'); return; }
    var B = BROKERS[link.bi % BROKERS.length], id = 'hearth-tv-' + key.slice(0, 4) + '-' + Math.floor(Math.random() * 1e6);
    var c;
    try { c = new Paho.Client(B.host, B.port, B.path, id); } catch (e) { log('phone remote: ' + e.message); return; }
    link.client = c;
    c.onConnectionLost = function (e) { link.up = false; log('phone remote: connection lost' + (e && e.errorMessage ? ' (' + e.errorMessage + ')' : '')); retry(); };
    c.onMessageArrived = function (m) { try { command(JSON.parse(m.payloadString)); } catch (e) { log('bad command: ' + e.message); } };
    var will = new Paho.Message('offline'); will.destinationName = BASE + 'online'; will.retained = true; will.qos = 1;
    try {
      c.connect({ useSSL: B.ssl !== false, timeout: 10, keepAliveInterval: 30, cleanSession: true, willMessage: will,
        onSuccess: function () {
          link.up = true; link.tries = 0; link.host = B.host; link.since = Date.now(); log('phone remote online via ' + B.host);
          c.subscribe(BASE + 'cmd', { qos: 0 });
          pub('online', 'online', true); publishState(true); publishLog(true); publishBoard();
        },
        onFailure: function (e) { link.up = false; log('phone remote: could not reach ' + B.host + (e && e.errorMessage ? ' (' + e.errorMessage + ')' : '')); link.bi++; retry(); } });
    } catch (e) { log('phone remote: ' + e.message); link.bi++; retry(); }
  }
  var retryT = null;
  function retry() { clearTimeout(retryT); link.tries++; retryT = setTimeout(linkConnect, Math.min(120000, 4000 * Math.pow(1.6, Math.min(link.tries, 8)))); }
  function pub(topic, payload, retained) {
    if (!link.up) return;
    try { var m = new Paho.Message(typeof payload === 'string' ? payload : JSON.stringify(payload)); m.destinationName = BASE + topic; m.retained = !!retained; m.qos = 0; link.client.send(m); link.sent++; } catch (e) {}
  }
  function bufAhead(el) { try { for (var i = 0; i < el.buffered.length; i++) if (el.buffered.start(i) <= el.currentTime + 0.1 && el.buffered.end(i) >= el.currentTime) return +(el.buffered.end(i) - el.currentTime).toFixed(1); } catch (e) {} return 0; }
  function state() {
    var q = null; try { q = video.getVideoPlaybackQuality && video.getVideoPlaybackQuality(); } catch (e) {}
    var heap = null; try { if (performance.memory) heap = Math.round(performance.memory.usedJSHeapSize / 1048576); } catch (e) {}
    return {
      v: APP_VERSION, shell: H.shell || '', src: H.source || '', usb: !!H.usb, up: Math.round((Date.now() - BOOT) / 1000), t: Date.now(),
      scene: SCENE, revealed: revealed,
      video: { src: short(video.currentSrc || vTry), w: video.videoWidth, h: video.videoHeight, t: +video.currentTime.toFixed(2), d: +(video.duration || 0).toFixed(2),
               paused: video.paused, ready: video.readyState, buf: bufAhead(video), dropped: q ? q.droppedVideoFrames : (video.webkitDroppedFrameCount || 0),
               decoded: q ? q.totalVideoFrames : (video.webkitDecodedFrameCount || 0), hevc: hevc },
      media: { state: media.state, pct: media.pct, stalls: media.stalls, rev: M ? M.rev : 0 },
      music: { src: short(music.currentSrc), t: Math.round(music.currentTime || 0), d: Math.round(music.duration || 0), vol: vol, cur: +curVol.toFixed(2), paused: paused, playing: !music.paused },
      room: { fx: fxOn, night: night(), elf: SPOTS[elfAt] ? SPOTS[elfAt][0] : '', elfNext: Math.max(0, Math.round((elfMovedAt + 5 * 60000 - Date.now()) / 1000)),
              photoA: pa, photoB: pb, santa: santa.line, santaPct: +(santa.pct * 100).toFixed(1), flying: santa.flying, countdown: $('countdown').textContent,
              overlay: overlay.className.indexOf('show') >= 0, house: house.className === 'on' },
      perf: { fps: fps, lag: lag, heap: heap },
      net: { online: navigator.onLine !== false, broker: link.host, sent: link.sent, cmds: link.cmds },
      screen: (window.innerWidth || 0) + '×' + (window.innerHeight || 0)
    };
  }
  var lastStatePub = 0, lastLogLen = -1, lastLogPub = 0;
  function publishState(force) {
    var watching = Date.now() - link.lastAdmin < 90000, every = watching ? 2000 : 30000;
    if (!force && Date.now() - lastStatePub < every) return;
    lastStatePub = Date.now(); pub('state', state(), true);
  }
  function publishLog(force) {
    var L = H.log || [], sig = L.length + (L[L.length - 1] || '');
    if (!force && (sig === lastLogLen || Date.now() - lastLogPub < 3000)) return;
    lastLogLen = sig; lastLogPub = Date.now(); pub('log', L.slice(-60), true);
  }
  publishBoard = function () { pub('board', boardState(), true); };
  setInterval(function () { publishState(false); publishLog(false); }, 1000);
  function command(c) {
    if (!c || !c.c) return;
    link.cmds++;
    if (c.c !== 'hello' && c.c !== 'ping') log('phone: ' + c.c);
    switch (c.c) {
      case 'hello': link.lastAdmin = Date.now(); publishBoard(); if (!store.get('hearthPaired', false)) { store.set('hearthPaired', true); hidePairing(); toast('Phone connected', 3000); } publishState(true); break;
      case 'ping': pub('ack', { pong: c.id, t: Date.now() }); break;
      case 'vol': setVolume(+c.v); break;
      case 'music': setPaused(!c.on); break;
      case 'fx': fxOn = !!c.on; store.set('hearthFx', fxOn); applyFx(); toast(fxOn ? 'Living light on' : 'Living light off'); break;
      case 'santa': runDemo(); break;
      case 'fly': flyover(); break;
      case 'elf': if (c.a === 'move') { clearInterval(elfTimer); moveElf(); elfTimer = setInterval(moveElf, 5 * 60000); } else elfHint(); break;
      case 'photo': nextPhoto(); break;
      case 'overlay': showOverlay(60000); break;
      case 'msg': if (c.text) note(String(c.from || '').slice(0, 30), String(c.text).slice(0, 160), c.ms); break;
      case 'pair': showPairing(60000); break;
      case 'note.add': addNote(c.text, c.from); toast('New note on the board', 2500); break;
      case 'note.del': notes = notes.filter(function (n) { return n.id !== c.id; }); saveNotes(); break;
      case 'note.clear': notes = []; saveNotes(); break;
      case 'sports': if (c.comps) { settings = { comps: c.comps.filter(function (k) { return COMPS[k]; }), favs: (c.favs || []).filter(function (k) { return FAVS[k]; }) }; store.set('hearthSports', settings); refreshSports(); } break;
      case 'reload': pub('ack', { reloading: true }); setTimeout(function () { location.reload(); }, 600); break;
    }
    setTimeout(function () { publishState(true); }, 300);
  }
  setTimeout(linkConnect, 4000);

  /* pairing card: shows on its own until a phone has connected once; after that, hold OK on the remote */
  var pairT = null, pairDrawn = false;
  function drawQR() {
    if (pairDrawn || typeof qrcode === 'undefined') return; pairDrawn = true;
    var q = qrcode(0, 'M'); q.addData(ADMIN_URL); q.make();
    var n = q.getModuleCount(), cv = $('pairQR'), g = cv.getContext('2d'), S = cv.width, quiet = 2, cell = Math.floor(S / (n + quiet * 2)), off = Math.floor((S - cell * n) / 2);
    g.fillStyle = '#f7f1e6'; g.fillRect(0, 0, S, S); g.fillStyle = '#1b120d';
    for (var r2 = 0; r2 < n; r2++) for (var c2 = 0; c2 < n; c2++) if (q.isDark(r2, c2)) g.fillRect(off + c2 * cell, off + r2 * cell, cell, cell);
    $('pairUrl').textContent = REMOTE.replace(/^https?:\/\//, '') + 'admin';
    $('pairCode').textContent = 'Code ' + key.match(/.{4}/g).join('-');
  }
  function showPairing(ms) { drawQR(); $('pair').className = 'on'; clearTimeout(pairT); pairT = setTimeout(hidePairing, ms || 60000); }
  function hidePairing() { $('pair').className = ''; }
  function maybeShowPairing() { if (!store.get('hearthPaired', false)) showPairing(5 * 60000); }

  /* ================= remote control ================= */
  var okDown = 0;
  document.addEventListener('keydown', function (e) {
    var k = e.keyCode;
    if (k === 10009 || k === 27) {
      if ($('pair').className === 'on') { hidePairing(); return; }
      if ($('note').className === 'on') { $('note').className = ''; return; }
      try { tizen.application.getCurrentApplication().exit(); } catch (x) {} return;
    }
    if (k === 38 || k === 40) { setVolume(vol + (k === 38 ? 0.05 : -0.05)); e.preventDefault(); return; }
    if (k === 10252 || k === 415 || k === 19) { setPaused(!paused); return; }
    if (k === 13) { if (!okDown) okDown = Date.now(); else if (Date.now() - okDown > 1400) { okDown = Date.now() + 1e9; showPairing(60000); } }
    showOverlay(60000);
  });
  document.addEventListener('keyup', function (e) { if (e.keyCode === 13) okDown = 0; });

  tick(); setInterval(tick, 1000);
  H.app = { version: APP_VERSION, state: state, command: command };
})();
