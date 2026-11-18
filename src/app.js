(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var H = window.HEARTH || { asset: function (p) { return 'assets/' + p; }, personal: function (p) { return 'personal/' + p; }, media: function () { return null; },
                             fallbackMedia: { video: 'media/loop-1080.mp4', music: 'media/music-short.m4a' }, logLine: function () {}, config: {}, log: [] };
  var log = H.logLine || function () {};
  var SCENE = (H.config && H.config.scene) || 'fireplace';
  var APP_VERSION = '0.2.7';
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
  /* hang the board in the chimney's own perspective: the stone courses run downhill to the right (about 3.5° at the
     top of the board, 2.9° at the bottom, because we look up at the chimney from the left), and the verticals stay upright */
  (function () {
    var W = 178, Hh = 124, L = 421, T = 76, a1 = Math.tan(3.5 * Math.PI / 180), a2 = Math.tan(2.9 * Math.PI / 180);
    var q = [[L, T], [L + W, T + W * a1], [L, T + Hh], [L + W, T + Hh + W * a2]];
    // homography from the unit square to the quad, as a CSS matrix3d
    var x0 = q[0][0], y0 = q[0][1], x1 = q[1][0], y1 = q[1][1], x2 = q[2][0], y2 = q[2][1], x3 = q[3][0], y3 = q[3][1];
    var dx1 = x1 - x3, dx2 = x2 - x3, dy1 = y1 - y3, dy2 = y2 - y3, sx = x0 - x1 - x2 + x3, sy = y0 - y1 - y2 + y3, den = dx1 * dy2 - dx2 * dy1;
    var g = (sx * dy2 - dx2 * sy) / den, h = (dx1 * sy - sx * dy1) / den;
    var a = x1 - x0 + g * x1, b = x2 - x0 + h * x2, c = x0, d = y1 - y0 + g * y1, e = y2 - y0 + h * y2, f = y0;
    var m = [a / W, d / W, 0, g / W, b / Hh, e / Hh, 0, h / Hh, 0, 0, 1, 0, c, f, 0, 1];
    boardEl.style.left = '0px'; boardEl.style.top = '0px'; boardEl.style.transformOrigin = '0 0';
    boardEl.style.transform = 'matrix3d(' + m.map(function (v) { return +v.toFixed(8); }).join(',') + ')';
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

  /* ================= the board on the chimney: family notes, or your teams when there are none ================= */
  var TEAMS = {
    'nba-tor': { n: 'Raptors', p: 'basketball/nba', t: 'tor', sb: 'basketball/nba', c: '#ce1141' },
    'nhl-tor': { n: 'Maple Leafs', p: 'hockey/nhl', t: 'tor', sb: 'hockey/nhl', c: '#3b6fd6' },
    'mlb-tor': { n: 'Blue Jays', p: 'baseball/mlb', t: 'tor', sb: 'baseball/mlb', c: '#2a6fd0' },
    'nfl-buf': { n: 'Bills', p: 'football/nfl', t: 'buf', sb: 'football/nfl', c: '#2f5fd0' },
    'tfc': { n: 'Toronto FC', p: 'soccer/all', t: '7318', c: '#c8233a' },
    'mia': { n: 'Inter Miami', p: 'soccer/all', t: '20232', c: '#f7b5cd' },
    'bar': { n: 'Barcelona', p: 'soccer/all', t: '83', c: '#b5163d' },
    'arg': { n: 'Argentina', p: 'soccer/all', t: '202', c: '#74acdf' },
    'can': { n: 'Canada', p: 'soccer/all', t: '206', c: '#ed2224' },
    'psg': { n: 'PSG', p: 'soccer/all', t: '160', c: '#3a5bbf' },
    'bay': { n: 'Bayern', p: 'soccer/all', t: '132', c: '#dc052d' },
    'rma': { n: 'Real Madrid', p: 'soccer/all', t: '86', c: '#e8d9a8' },
    'liv': { n: 'Liverpool', p: 'soccer/all', t: '364', c: '#d11317' },
    'ars': { n: 'Arsenal', p: 'soccer/all', t: '359', c: '#e20520' },
    'mci': { n: 'Man City', p: 'soccer/all', t: '382', c: '#99c5ea' }
  };
  var follow = store.get('hearthTeams', ['nba-tor', 'nhl-tor', 'mlb-tor', 'tfc', 'mia', 'bar', 'arg']);
  var notes = store.get('hearthNotes', []);
  var games = {}, fetchedAt = {}, ESPN = 'https://site.api.espn.com/apis/site/v2/sports/';
  function getJSON(url, cb) {
    var x = new XMLHttpRequest(), done = false, to = setTimeout(function () { if (!done) { done = true; try { x.abort(); } catch (e) {} cb(null); } }, 20000);
    x.onreadystatechange = function () { if (x.readyState !== 4 || done) return; done = true; clearTimeout(to); var j = null; if (x.status === 200) { try { j = JSON.parse(x.responseText); } catch (e) {} } cb(j); };
    try { x.open('GET', url, true); x.send(); } catch (e) { done = true; clearTimeout(to); cb(null); }
  }
  function score(s) { if (s == null) return ''; if (typeof s === 'object') return s.displayValue != null ? s.displayValue : (s.value != null ? String(s.value) : ''); return String(s); }
  function norm(e, ourId, ourAbbr) {
    var c = e.competitions && e.competitions[0]; if (!c || !c.competitors) return null;
    var us = null, them = null;
    c.competitors.forEach(function (t) { var tm = t.team || {}; if (String(tm.id) === String(ourId) || (ourAbbr && String(tm.abbreviation).toLowerCase() === ourAbbr)) us = t; else them = t; });
    if (!us || !them) return null;
    var st = (c.status || e.status || {}).type || {};
    return { id: e.id, d: Date.parse(e.date), home: us.homeAway === 'home', opp: (them.team.shortDisplayName || them.team.displayName || them.team.abbreviation),
             state: st.state || 'pre', detail: st.shortDetail || '', su: score(us.score), so: score(them.score),
             lg: (e.league && (e.league.abbreviation || e.league.shortName)) || '', slug: (e.league && e.league.slug) || '' };
  }
  function fetchTeam(k, done) {
    var T = TEAMS[k]; if (!T) return done && done();
    getJSON(ESPN + T.p + '/teams/' + T.t + '/schedule' + (T.p.indexOf('soccer') === 0 ? '?fixture=true' : ''), function (j) {
      if (j && j.events) {
        var id = j.team && j.team.id, ab = j.team && j.team.abbreviation && j.team.abbreviation.toLowerCase(), now = Date.now(), list = [];
        j.events.forEach(function (e) { var g = norm(e, id, ab); if (g && g.d > now - 36 * 3600000 && g.d < now + 8 * 86400000) list.push(g); });
        games[k] = list; fetchedAt[k] = now;
      }
      done && done();
    });
  }
  /* during a game, refresh its score every 90 seconds (league scoreboards are much smaller than team schedules) */
  function etDate(ms) { var d = new Date(ms - 5 * 3600000); return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()); }
  function liveRefresh() {
    var now = Date.now();
    follow.forEach(function (k) {
      var T = TEAMS[k], L = games[k] || [];
      L.forEach(function (g) {
        if (g.state === 'post' || now < g.d - 10 * 60000 || now > g.d + 5 * 3600000) return;
        var sb = T.sb || (g.slug ? 'soccer/' + g.slug : '');
        if (sb) getJSON(ESPN + sb + '/scoreboard?dates=' + etDate(g.d), function (j) {
          if (!j || !j.events) return;
          j.events.forEach(function (e) { if (e.id !== g.id) return; var n = norm(e, T.sb ? null : T.t, T.sb ? T.t : null); if (n) { g.state = n.state; g.detail = n.detail; g.su = n.su; g.so = n.so; renderBoard(); publishBoard(); } });
        });
        else fetchTeam(k, renderBoard);
      });
    });
  }
  var sportsQ = [];
  function refreshAll() { sportsQ = follow.slice(); (function next() { if (!sportsQ.length) { renderBoard(); publishBoard(); liveRefresh(); return; } fetchTeam(sportsQ.shift(), function () { setTimeout(next, 1500); }); })(); }
  setTimeout(refreshAll, 8000); setInterval(refreshAll, 3 * 3600000); setInterval(liveRefresh, 90000);

  function when(ms) {
    var d = new Date(ms), now = new Date(), day0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    var dd = Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - day0) / 86400000);
    var h = d.getHours(), t = (((h + 11) % 12) + 1) + (d.getMinutes() ? ':' + pad(d.getMinutes()) : '') + (h < 12 ? ' am' : ' pm');
    var w = dd === 0 ? (h >= 17 ? 'Tonight' : 'Today') : dd === 1 ? 'Tomorrow' : dd < 7 ? DAYS[d.getDay()].slice(0, 3) : MONTHS[d.getMonth()].slice(0, 3) + ' ' + d.getDate();
    return { w: w, t: t };
  }
  function upcoming() {
    var now = Date.now(), out = [];
    follow.forEach(function (k) { (games[k] || []).forEach(function (g) {
      var live = g.state === 'in', fin = g.state === 'post' && now - g.d < 9 * 3600000, pre = g.state === 'pre' && g.d > now - 3 * 3600000;
      if (live || fin || pre) out.push({ k: k, g: g, rank: live ? 0 : fin && now - g.d < 4.5 * 3600000 ? 1 : 2 });
    }); });
    out.sort(function (a, b) { return a.rank - b.rank || a.g.d - b.g.d; });
    return out;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ago(t) { var m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'just now' : m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : Math.round(m / 1440) + ' d ago'; }
  function gameRow(it) {
    var T = TEAMS[it.k], g = it.g, wt;
    var lg = esc(g.lg || T.p.split('/')[1].toUpperCase()).replace(/^Men's International Friendly$/, 'Friendly');
    if (g.state === 'in') wt = '<span class="live">Live · ' + esc(g.detail.replace(/ - /, ' ')) + '</span>';
    else if (g.state === 'post') wt = 'Final' + (g.su !== '' && g.so !== '' ? (+g.su > +g.so ? ' · Win' : +g.su < +g.so ? ' · Loss' : ' · Draw') : '');
    else { var w = when(g.d); wt = esc(w.w) + ' · ' + esc(w.t); }
    wt += '<span class="lg">' + lg + '</span>';
    var right = g.state !== 'pre' && g.su !== '' ? '<div class="sc">' + esc(g.su) + '<i>–</i>' + esc(g.so) + '</div>' : '';
    return '<div class="bg"><div class="chip" style="background:' + T.c + '"></div><div class="m"><div class="w">' + wt + '</div><div class="a">' + esc(T.n) + '</div><div class="s">' + (g.home ? 'vs ' : 'at ') + esc(g.opp) + '</div></div>' + right + '</div>';
  }
  var pages = [], pageI = 0, pageT = null, lastSig = '';
  function buildPages() {
    var P = [], ups = upcoming(), live = ups.filter(function (x) { return x.g.state === 'in'; });
    var ns = notes.slice().sort(function (a, b) { return b.t - a.t; });
    for (var i = 0; i < ns.length;) {
      var a = ns[i], b = ns[i + 1], pair = b && a.text.length + b.text.length < 90;
      var body = [a].concat(pair ? [b] : []).map(function (n) { return '<div class="bn' + (pair ? '' : ' one') + '"><div class="t">' + esc(n.text) + '</div><div class="f">' + (n.from ? esc(n.from) + ' · ' : '') + ago(n.t) + '</div></div>'; }).join('');
      P.push({ k: 'Family board', h: body }); i += pair ? 2 : 1;
    }
    if (ns.length) { if (live.length) P.push({ k: 'Live now', h: live.slice(0, 2).map(gameRow).join('') }); }
    else if (ups.length) {
      for (var j = 0; j < Math.min(ups.length, 6); j += 2) P.push({ k: ups[j].g.state === 'in' ? 'Live now' : j ? 'Coming up' : 'Up next', h: ups.slice(j, j + 2).map(gameRow).join('') });
    } else P.push({ k: 'Family board', h: '<div class="bempty"><div class="t">Nothing on the board</div><div class="f">Pin a note from your phone</div></div>' });
    return P;
  }
  function renderBoard(advance) {
    var P = buildPages(), sig = JSON.stringify(P);
    if (!advance && sig === lastSig) return;
    var changed = sig !== lastSig; lastSig = sig; pages = P;
    if (advance) pageI = (pageI + 1) % pages.length; else if (pageI >= pages.length || pageI < 0) pageI = 0;
    var body = $('bBody'), pg = pages[pageI];
    function put() { body.innerHTML = pg.h; $('bKicker').textContent = pg.k;
      $('bDots').innerHTML = pages.length > 1 ? pages.map(function (x, i) { return '<i' + (i === pageI ? ' class="on"' : '') + '></i>'; }).join('') : ''; body.className = ''; }
    if (advance || changed) { body.className = 'fade'; setTimeout(put, 700); } else put();
  }
  setInterval(function () { if (pages.length > 1) renderBoard(true); }, 12000);
  setInterval(function () { renderBoard(false); }, 60000);   // keeps "Tonight", "5 min ago" and live states fresh
  renderBoard(false);
  function saveNotes() { store.set('hearthNotes', notes); renderBoard(false); publishBoard(); }
  function addNote(text, from) {
    text = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 140); if (!text) return;
    notes.push({ id: Date.now().toString(36) + Math.floor(Math.random() * 1e4).toString(36), text: text, from: String(from || '').slice(0, 24), t: Date.now() });
    if (notes.length > 40) notes.shift();
    pageI = 0; saveNotes();
  }
  function boardState() {
    return { notes: notes, teams: follow, catalog: Object.keys(TEAMS).map(function (k) { return { k: k, n: TEAMS[k].n, c: TEAMS[k].c }; }),
             next: upcoming().slice(0, 8).map(function (x) { var g = x.g; return { team: TEAMS[x.k].n, c: TEAMS[x.k].c, opp: g.opp, home: g.home, d: g.d, state: g.state, detail: g.detail, su: g.su, so: g.so, lg: g.lg }; }),
             page: pages[pageI] ? pages[pageI].k : '' };
  }
  var publishBoard = function () {};

  /* ================= phone remote / admin link =================
     Live status goes to a private channel on a public MQTT relay; the channel name is a random key that only
     exists on this TV and on phones that scanned its code. Nothing personal is sent – just what's playing and how it's running. */
  var BROKERS = H.brokers || [{ host: 'broker.hivemq.com', port: 8884, path: '/mqtt', ssl: true }, { host: 'broker.emqx.io', port: 8084, path: '/mqtt', ssl: true }];
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
      case 'teams': if (c.list && c.list.length !== undefined) { follow = c.list.filter(function (k) { return TEAMS[k]; }); store.set('hearthTeams', follow); refreshAll(); } break;
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
