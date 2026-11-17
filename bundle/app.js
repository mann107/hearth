(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var H = window.HEARTH || { asset: function (p) { return 'assets/' + p; }, personal: function (p) { return 'personal/' + p; }, media: function () { return null; },
                             fallbackMedia: { video: 'media/loop-1080.mp4', music: 'media/music-short.m4a' }, logLine: function () {}, config: {} };
  var log = H.logLine || function () {};
  var SCENE = (H.config && H.config.scene) || 'fireplace';

  /* fit the 1920x1080 stage to whatever size the TV gives the app */
  (function () { var st = $('stage'); function fit() { var w = window.innerWidth || document.documentElement.clientWidth, h = window.innerHeight || document.documentElement.clientHeight, s = Math.min(w / 1920, h / 1080);
    st.style.transform = 'scale(' + s + ')'; st.style.left = ((w - 1920 * s) / 2) + 'px'; st.style.top = ((h - 1080 * s) / 2) + 'px'; } fit(); window.addEventListener('resize', fit); setTimeout(fit, 500); setTimeout(fit, 2000); })();

  /* images: generic art from GitHub/package, personal from the USB stick */
  [].forEach.call(document.querySelectorAll('[data-asset]'), function (el) { el.src = H.asset(el.getAttribute('data-asset')); });
  [].forEach.call(document.querySelectorAll('[data-personal]'), function (el) { el.src = H.personal(el.getAttribute('data-personal')); });
  (function () { var m = 'url(' + H.asset('skymask.png') + ')', sk = $('sky'); sk.style.webkitMaskImage = m; sk.style.maskImage = m; })();
  var video = $('scene'), music = $('music'), overlay = $('overlay'), world = $('world');
  var store = { get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
                set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
  var BRAMPTON = { lat: 43.6834, lon: -79.7663 };

  /* ---------- remote keys ---------- */
  ['MediaPlayPause', 'MediaPlay', 'MediaPause', 'ColorF0Red', 'ColorF1Green', 'ColorF2Yellow', 'ColorF3Blue']
    .forEach(function (k) { try { tizen.tvinputdevice.registerKey(k); } catch (e) {} });

  /* ---------- video: 4K HEVC first, 1080p H.264 fallback ---------- */
  /* ---------- media: USB stick -> Hearth's own storage on the TV -> built-in ---------- */
  var hevc = !!(video.canPlayType('video/mp4; codecs="hvc1.1.6.L153.B0"') || video.canPlayType('video/mp4; codecs="hev1"') || video.canPlayType('video/mp4; codecs="hvc1"'));
  var CACHE = 'hearth-cache';
  function fsResolve(path, mode, ok, bad) { try { tizen.filesystem.resolve(path, ok, bad || function () { ok(null); }, mode || 'r'); } catch (e) { ok(null); } }
  function cacheURI(name, cb) { fsResolve('wgt-private/' + CACHE + '/' + name, 'r', function (f) { cb(f && f.fileSize > 1024 ? f.toURI() : null); }); }
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
  var played = false, vTry = null, vWatch = null;
  function playFrom(list, onFail) {
    if (!list.length) return onFail && onFail();
    var src = list[0]; clearTimeout(vWatch);
    video.onerror = function () { log('video error ' + (video.error && video.error.code) + ': ' + src.split('/').slice(-2).join('/')); playFrom(list.slice(1), onFail); };
    vWatch = setTimeout(function () { if (!played) { log('video stalled (state ' + video.readyState + '/' + video.networkState + '): ' + src.split('/').slice(-2).join('/')); playFrom(list.slice(1), onFail); } }, 7000);
    vTry = src; video.src = src; video.load(); var p = video.play(); if (p && p.catch) p.catch(function () {});
  }
  video.addEventListener('playing', function () { if (!played) log('playing ' + (vTry || '').split('/').slice(-2).join('/') + ' ' + video.videoWidth + 'x' + video.videoHeight); played = true; clearTimeout(vWatch); });
  video.addEventListener('ended', function () { video.currentTime = 0; video.play(); });
  function switchVideo(src) { var t = video.currentTime; played = false; playFrom([src], function () {}); }
  var vName = SCENE + '-' + (hevc ? 'loop-4k.mp4' : 'loop-1080.mp4'), vUsbRel = 'scenes/' + SCENE + '/' + (hevc ? 'loop-4k.mp4' : 'loop-1080.mp4');
  cacheURI(vName, function (cached) {
    var list = [];
    if (cached) list.push(cached);
    if (H.media(SCENE, hevc ? 'loop-4k.mp4' : 'loop-1080.mp4')) list.push(H.media(SCENE, hevc ? 'loop-4k.mp4' : 'loop-1080.mp4'));
    list.push(H.fallbackMedia.video);
    playFrom(list, function () { log('no video source worked'); });
    if (!cached && H.usb) {
      // play the built-in fire meanwhile, then switch to the TV-stored 4K copy when the copy finishes
      copyToCache(vName, vUsbRel, function (ok) { if (ok) cacheURI(vName, function (u) { if (u) { log('switching to stored 4K'); played = false; playFrom([u, H.fallbackMedia.video]); } }); });
    }
  });
  var revealed = false;
  function reveal() { if (revealed) return; revealed = true; $('curtain').className = 'up'; startMusic(); }
  video.addEventListener('playing', reveal);
  setTimeout(reveal, 4000);

  /* ---------- music with gentle fades ---------- */
  var vol = store.get('hearthVol', 0.35), curVol = 0, rampT = null, paused = false;
  function night() { var h = new Date().getHours(); return h >= 23 || h < 6; }
  function target() { return paused ? 0 : vol * (night() ? 0.6 : 1); }
  function rampTo(t, ms, done) {
    clearInterval(rampT); rampT = null;
    var steps = Math.max(1, Math.round(ms / 50)), start = curVol, i = 0;
    rampT = setInterval(function () {
      i++; curVol = start + (t - start) * (i / steps); music.volume = Math.max(0, Math.min(1, curVol));
      if (i >= steps) { clearInterval(rampT); rampT = null; if (done) done(); }
    }, 50);
  }
  var mName = SCENE + '-music.m4a', musicList = [], mWatch = null, mPlaying = false;
  function musicFrom(list) {
    if (!list.length) { log('no music source worked'); return; }
    var src = list[0]; clearTimeout(mWatch);
    music.onerror = function () { log('music error: ' + src.split('/').slice(-2).join('/')); musicFrom(list.slice(1)); };
    mWatch = setTimeout(function () { if (!mPlaying) { log('music stalled: ' + src.split('/').slice(-2).join('/')); musicFrom(list.slice(1)); } }, 9000);
    music.src = src; var p = music.play(); if (p && p.catch) p.catch(function () {});
  }
  music.addEventListener('playing', function () { if (!mPlaying) log('music playing ' + (music.currentSrc || '').split('/').slice(-2).join('/')); mPlaying = true; clearTimeout(mWatch); });
  var musicReady = false;
  cacheURI(mName, function (cached) {
    if (cached) musicList.push(cached);
    if (H.media(SCENE, 'music.m4a')) musicList.push(H.media(SCENE, 'music.m4a'));
    musicList.push(H.fallbackMedia.music); musicReady = true;
    if (!cached && H.usb) setTimeout(function () { copyToCache(mName, 'scenes/' + SCENE + '/music.m4a', function (ok) { if (ok) log('music stored on the TV – used from next start'); }); }, 20000);
  });
  function startMusic() {
    music.volume = 0; curVol = 0;
    (function go() { if (!musicReady) return setTimeout(go, 300); musicFrom(musicList);
      music.addEventListener('loadedmetadata', function once() { music.removeEventListener('loadedmetadata', once); var st = store.get('hearthPos', 0); try { if (st > 0 && st < music.duration) music.currentTime = st; } catch (e) {} });
      rampTo(target(), 8000); })();
  }
  setInterval(function () { if (!music.paused) store.set('hearthPos', Math.floor(music.currentTime)); }, 15000);

  /* ---------- info layer ---------- */
  var hideT = null;
  function showOverlay(ms) { overlay.className = 'show'; clearTimeout(hideT); hideT = setTimeout(function () { overlay.className = ''; }, ms || 60000); }
  showOverlay(60000);
  var toastT = null;
  function toast(msg, ms) { var t = $('toast'); t.textContent = msg; t.className = 'on'; clearTimeout(toastT); toastT = setTimeout(function () { t.className = ''; }, ms || 2200); }

  /* ---------- living light: fire glow breathes, fairy lights twinkle ---------- */
  var fire = $('firelight'), fl = 0.18;
  setInterval(function () { fl += (0.12 + Math.random() * 0.16 - fl) * 0.45; fire.style.opacity = fl.toFixed(3); }, 110);
  var fxOn = store.get('hearthFx', true);
  function applyFx() { $('fx').className = fxOn ? '' : 'off'; $('names').style.opacity = fxOn ? 0.92 : 0; }
  applyFx();

  /* ---------- family photos in the two picture frames ---------- */
  function buildFrame(id, key) {
    var el = $(id), imgs = [];
    for (var i = 0; i < 7; i++) { var im = document.createElement('img'); im.src = H.personal('framed/' + key + '_' + i + '.png'); el.appendChild(im); imgs.push(im); }
    return imgs;
  }
  var fA = buildFrame('frameA', 'A'), fB = buildFrame('frameB', 'B');
  var pa = Math.floor(Math.random() * 7), pb = (pa + 3) % 7;
  fA[pa].className = 'on'; fB[pb].className = 'on';
  setInterval(function () { fA[pa].className = ''; pa = (pa + 1) % 7; fA[pa].className = 'on'; }, 4 * 60000);
  setTimeout(function () { setInterval(function () { fB[pb].className = ''; pb = (pb + 1) % 7; fB[pb].className = 'on'; }, 4 * 60000); }, 2 * 60000);

  /* ---------- the elf: hides somewhere new every 5 minutes ---------- */
  var SPOTS = [
    ['mantel', 434.5, 419, 27, 38], ['balcony left', 221, 142, 21.5, 30], ['balcony right', 691, 195, 21.5, 30],
    ['right lamp', 1581.5, 578, 28.5, 40], ['left lamp', 181.5, 608, 28.5, 40], ['coffee table', 1118.5, 801.5, 35, 49],
    ['presents', 268.5, 827.5, 35, 49], ['presents by the window', 1479, 774.5, 34, 47.5], ['big window', 1328.5, 313.5, 23, 32],
    ['hearth', 662.5, 641, 27, 38], ['chandelier', 110.5, 405.5, 23, 32], ['bookshelf', 249.5, 437.5, 24.5, 34.5],
    ['fireplace wreath', 516.5, 244.5, 27, 19], ['side table', 133.5, 760, 32.5, 45.5]];
  var elf = $('elf'), elfAt = store.get('hearthElf', -1);
  function placeElf(i) {
    var s = SPOTS[i]; elf.src = H.asset('elves/elf_' + i + '.png');
    elf.style.left = s[1] + 'px'; elf.style.top = s[2] + 'px'; elf.style.width = s[3] + 'px'; elf.style.height = s[4] + 'px';
    elfAt = i; store.set('hearthElf', i);
  }
  function moveElf() {
    elf.className = '';
    setTimeout(function () {
      var n; do { n = Math.floor(Math.random() * SPOTS.length); } while (n === elfAt);
      placeElf(n); setTimeout(function () { elf.className = 'on'; }, 200);
    }, 1600);
  }
  if (elfAt < 0 || elfAt >= SPOTS.length) elfAt = Math.floor(Math.random() * SPOTS.length);
  placeElf(elfAt); setTimeout(function () { elf.className = 'on'; }, 3000);
  setInterval(moveElf, 5 * 60000);
  var hintT = null, lastHint = 0;
  function elfHint() {
    var now = Date.now();
    if (now - lastHint < 8000) toast('Psst… try near the ' + SPOTS[elfAt][0], 3500);
    else toast('The elf is shining for a moment…', 2500);
    lastHint = now; elf.className = 'on hint'; clearTimeout(hintT); hintT = setTimeout(function () { elf.className = 'on'; }, 4500);
  }

  /* ---------- look closer: slow camera push-ins (yellow button) ---------- */
  var VIEWS = [null, { x: 512, y: 505, s: 2.8, n: 'The mantel' }, { x: 316, y: 140, s: 5, n: 'Upstairs frame' },
               { x: 874, y: 497, s: 6.5, n: 'Fireplace frame' }, { x: 1000, y: 560, s: 1.6, n: 'The tree' }];
  var view = 0, viewT = null;
  function setView(i, quiet, holdMs) {
    view = i; var v = VIEWS[i];
    if (!v) { world.style.transform = ''; if (!quiet) toast('Full room'); return; }
    var tx = Math.min(0, Math.max(1920 - 1920 * v.s, 960 - v.x * v.s)), ty = Math.min(0, Math.max(1080 - 1080 * v.s, 540 - v.y * v.s));
    world.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + v.s + ')';
    if (!quiet) toast(v.n);
    clearTimeout(viewT); viewT = setTimeout(function () { setView(0, true); }, holdMs || 45000);   // drift back to the full room
  }

  /* ---------- memories: every 15 min the camera drifts in to a family photo ---------- */
  var memStep = 0;
  setInterval(function () {
    if (view || overlay.className === 'show' || house.className === 'on' || flying) return;
    var k = memStep++ % 3;
    if (k === 0) { fA[pa].className = ''; pa = (pa + 1) % 7; fA[pa].className = 'on'; setTimeout(function () { setView(2, true, 16000); }, 2600); }
    else if (k === 1) setView(1, true, 16000);   // the stockings
    else { fB[pb].className = ''; pb = (pb + 1) % 7; fB[pb].className = 'on'; setTimeout(function () { setView(3, true, 16000); }, 2600); }
  }, 15 * 60000);

  /* ---------- Santa flying past the windows ---------- */
  var sleigh = $('sleigh'), flying = false;
  function flyover() {
    if (flying) return; flying = true;
    sleigh.className = ''; void sleigh.offsetWidth; sleigh.className = 'fly';
    setTimeout(function () { sleigh.className = ''; flying = false; }, 11500);
  }
  var lastFly = Date.now();
  setInterval(function () {
    var d = new Date(), m = d.getMonth(), day = d.getDate(), h = d.getHours(), since = (Date.now() - lastFly) / 60000;
    var evening = h >= 16 || h < 1;
    var go = false;
    if (m === 11 && day === 24 && evening) go = since >= 15;
    else if (m === 11 && day < 24 && evening) go = since >= 20 && Math.random() < 1 / 40;
    else if (evening) go = since >= 30 && Math.random() < 1 / 120;
    if (go) { lastFly = Date.now(); flyover(); }
  }, 60000);

  /* ---------- clock, date, countdown ---------- */
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
    if (!paused && !rampT && Math.abs(music.volume - target()) > 0.02) rampTo(target(), 4000);
    if (!demo) santaTick(d);
  }

  /* ---------- Santa model: sleigh prep, then a midnight-chasing flight ---------- */
  var santa = { lat: 90, lon: 0, flying: false };
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
      $('santaLine').textContent = 'Sleigh prep · ' + Math.floor(pct * 100) + '%';
      $('santaLabel').textContent = 'Santa · takes off in ' + dd + (dd === 1 ? ' day' : ' days');
    } else if (t >= dep && t < land) {
      pct = (t - dep) / (land - dep); santa.flying = true;
      var lon = -15 * ((t - Date.UTC(y, 11, 25)) / 3600000); santaAtLon(((lon + 540) % 360) - 180);
      $('santaLine').textContent = 'Delivering now · ' + Math.floor(pct * 100) + '%';
      $('santaLabel').textContent = 'Santa · in flight';
      var dist = km(santa, BRAMPTON);
      if (dist < 3000 && Date.now() - lastHouse > 8 * 60000) { lastHouse = Date.now(); houseMoment(dist, 30000); }
    } else {
      pct = 1; santa.flying = false; santa.lat = 90;
      $('santaLine').textContent = 'Home at the North Pole'; $('santaLabel').textContent = 'Santa';
    }
    $('santaFill').style.width = (pct * 100).toFixed(1) + '%';
  }

  /* ---------- "Santa is near your house" ---------- */
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

  /* demo (red button): replays the Christmas Eve approach in 30 seconds */
  var demo = false;
  function runDemo() {
    if (demo) return; demo = true; var start = Date.now(), D = 26000, wasFlying = santa.flying;
    santa.flying = true; houseMoment(2400, D + 6000);
    var iv = setInterval(function () {
      var k = Math.min(1, (Date.now() - start) / D), lon = -30 + (BRAMPTON.lon + 30) * k;
      santaAtLon(lon); if (k >= 1) { santa.lat = BRAMPTON.lat; santa.lon = BRAMPTON.lon; }
      var dist = k >= 1 ? 0 : km(santa, BRAMPTON); houseText(dist);
      if (k >= 1) { clearInterval(iv); flyover(); setTimeout(function () { demo = false; santa.flying = wasFlying; tick(); }, 9000); }
    }, 250);
  }

  /* ---------- globes: NASA Blue Marble with live day/night ---------- */
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
  function frame(ts) {
    requestAnimationFrame(frame);
    if (!tex || ts - lastF < 66) return;
    var dt = lastF ? Math.min(0.5, (ts - lastF) / 1000) : 0; lastF = ts;
    var santaMk = { lat: santa.lat, lon: santa.lon, r: 3.6, color: '#ff5a46', glow: true };
    if (overlay.className === 'show') {
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

  /* ---------- remote control ---------- */
  document.addEventListener('keydown', function (e) {
    var k = e.keyCode;
    if (k === 10009 || k === 27) { if (view) { setView(0); return; } try { tizen.application.getCurrentApplication().exit(); } catch (x) {} return; }
    if (k === 38 || k === 40) {
      vol = Math.max(0, Math.min(1, Math.round((vol + (k === 38 ? 0.05 : -0.05)) * 100) / 100));
      store.set('hearthVol', vol); rampTo(target(), 300); toast('Music ' + Math.round(vol * 100) + '%'); e.preventDefault(); return;
    }
    if (k === 10252 || k === 415 || k === 19) {
      paused = !paused; rampTo(target(), 1200, function () { if (paused) music.pause(); }); if (!paused) music.play();
      toast(paused ? 'Music paused' : 'Music on'); return;
    }
    if (k === 403) { runDemo(); return; }                                   // red: Santa demo
    if (k === 404) { elfHint(); return; }                                   // green: where's the elf?
    if (k === 405) { setView((view + 1) % VIEWS.length); return; }          // yellow: look closer
    if (k === 406) { fxOn = !fxOn; store.set('hearthFx', fxOn); applyFx(); toast(fxOn ? 'Magic on' : 'Just the fire'); return; } // blue
    showOverlay(60000);
  });

  tick(); setInterval(tick, 1000);
})();
