/* ==========================================================================
   animations.js — SVG artwork, particle effects, bell sound, scroll reveals
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----------------------------------------------------------------------
     ART — traditional motifs drawn as inline SVG (no image downloads)
     ---------------------------------------------------------------------- */
  var Art = {};

  function flame(x, y, s, d) {
    return '<g class="flame" transform="translate(' + x + ' ' + y + ') scale(' + s + ')">' +
      '<g class="flame__inner" style="--fd:' + d + 's">' +
      '<circle class="flame__glow" cx="0" cy="-12" r="22" fill="url(#g-glow)"/>' +
      '<path d="M0 0C-6-5-7-13 0-27C7-13 6-5 0 0Z" fill="url(#g-flame)"/>' +
      '<path d="M0-2C-2.6-4-3-8 0-14C3-8 2.6-4 0-2Z" fill="#fffbe8"/>' +
      "</g></g>";
  }

  /* Kuthuvilakku — five-faced brass temple lamp */
  Art.lamp = function () {
    return '<svg class="lamp" viewBox="0 0 100 240" aria-hidden="true" focusable="false">' +
      '<ellipse cx="50" cy="234" rx="34" ry="4" fill="rgba(60,30,10,.25)"/>' +
      /* finial */
      '<path d="M50 4C55 14 57 22 50 31C43 22 45 14 50 4Z" fill="url(#g-brass)"/>' +
      '<path d="M50 12C47 10 43 12 44 16" fill="none" stroke="#f2d896" stroke-width="1"/>' +
      '<circle cx="50" cy="35" r="5" fill="url(#g-brass)"/>' +
      '<ellipse cx="50" cy="42" rx="9" ry="2.6" fill="url(#g-brass)"/>' +
      '<rect x="47.5" y="42" width="5" height="18" fill="url(#g-brass)"/>' +
      /* bowl */
      '<path d="M14 64Q50 58 86 64Q82 82 50 84Q18 82 14 64Z" fill="url(#g-brass)"/>' +
      '<ellipse cx="50" cy="63.5" rx="36" ry="4.5" fill="#f2d896" opacity=".75"/>' +
      '<path d="M18 70Q50 76 82 70" fill="none" stroke="#6b4718" stroke-width=".8" opacity=".6"/>' +
      '<ellipse cx="50" cy="88" rx="8" ry="4" fill="url(#g-brass)"/>' +
      /* stem */
      '<rect x="47" y="90" width="6" height="100" fill="url(#g-brass)"/>' +
      '<ellipse cx="50" cy="112" rx="7" ry="2.4" fill="url(#g-brass)"/>' +
      '<ellipse cx="50" cy="140" rx="9" ry="5" fill="url(#g-brass)"/>' +
      '<ellipse cx="50" cy="166" rx="7" ry="2.4" fill="url(#g-brass)"/>' +
      /* base */
      '<ellipse cx="50" cy="192" rx="11" ry="3" fill="url(#g-brass)"/>' +
      '<path d="M43 192Q46 206 28 214H72Q54 206 57 192Z" fill="url(#g-brass)"/>' +
      '<ellipse cx="50" cy="214" rx="24" ry="4" fill="#e3c27a"/>' +
      '<path d="M24 214H76V224H24Z" fill="url(#g-brass)"/>' +
      '<ellipse cx="50" cy="225" rx="32" ry="5.5" fill="url(#g-brass)"/>' +
      /* flames on the five wicks */
      '<g class="flames">' +
      flame(33, 62, 0.45, 0.2) + flame(67, 62, 0.45, 0.5) +
      flame(16, 64, 0.62, 0.1) + flame(84, 64, 0.62, 0.35) + flame(50, 60, 0.7, 0) +
      "</g></svg>";
  };

  /* Agal deepam — small brass oil lamp */
  Art.deepam = function () {
    return '<svg class="deepam" viewBox="0 0 70 80" aria-hidden="true" focusable="false">' +
      '<ellipse cx="35" cy="76" rx="16" ry="2.5" fill="rgba(0,0,0,.35)"/>' +
      '<path d="M26 64H44L41 74H29Z" fill="url(#g-brass)"/>' +
      '<path d="M6 50Q35 44 62 48L68 42Q66 50 62 52Q56 66 35 66Q12 66 6 50Z" fill="url(#g-brass)"/>' +
      '<ellipse cx="34" cy="49" rx="27" ry="3.4" fill="#5e3e14"/>' +
      '<path d="M10 54Q35 60 60 54" stroke="#f2d896" stroke-width=".8" fill="none" opacity=".7"/>' +
      '<g class="flames">' + flame(64, 44, 0.8, 0) + "</g></svg>";
  };

  /* Temple bell */
  Art.bell = function () {
    return '<svg class="bell" viewBox="0 0 40 48" aria-hidden="true" focusable="false">' +
      '<path d="M20 1V7" stroke="url(#g-brass)" stroke-width="2"/>' +
      '<circle cx="20" cy="8.5" r="3" fill="none" stroke="url(#g-brass)" stroke-width="1.6"/>' +
      '<path d="M20 11C11 11 9 20 9 28C9 34 5 36 4 38H36C35 36 31 34 31 28C31 20 29 11 20 11Z" fill="url(#g-brass)"/>' +
      '<path d="M4 38H36V40.5H4Z" fill="#6b4718"/>' +
      '<circle cx="20" cy="43.5" r="3" fill="url(#g-brass)"/></svg>';
  };

  /* Jasmine blossom */
  Art.jasmine = function (cls) {
    var p = "";
    for (var i = 0; i < 5; i++) {
      p += '<ellipse cx="0" cy="-5.6" rx="2.7" ry="5.4" transform="rotate(' + (i * 72) + ')"/>';
    }
    return '<svg class="' + (cls || "jasmine") + '" viewBox="-10 -10 20 20" aria-hidden="true" focusable="false">' +
      '<g fill="#fffdf6" stroke="#e7dcc1" stroke-width=".35">' + p + "</g>" +
      '<circle r="1.7" fill="#d9c98a"/></svg>';
  };

  /* Ornamental corner scroll */
  Art.corner = function () {
    return '<svg class="corner" viewBox="0 0 48 48" aria-hidden="true" focusable="false">' +
      '<g fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">' +
      '<path d="M3 45V17Q3 3 17 3H45"/>' +
      '<path d="M9 45V21Q9 9 21 9H45" opacity=".55"/>' +
      '<path d="M15 26Q15 15 26 15"/>' +
      '<path d="M26 15q4-5 9-2-3 5-9 2Z"/><path d="M15 26q-5 4-2 9 5-3 2-9Z"/>' +
      "</g>" +
      '<circle cx="21" cy="21" r="2.2" fill="currentColor"/></svg>';
  };

  /* Kolam separator — a single line with a lotus-dot motif */
  Art.divider = function () {
    return '<svg class="divider" viewBox="0 0 220 24" aria-hidden="true" focusable="false">' +
      '<g fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round">' +
      '<path d="M2 12H86"/><path d="M134 12H218"/>' +
      '<path d="M110 2Q120 12 110 22Q100 12 110 2Z"/>' +
      '<path d="M92 12Q101 4 110 12Q101 20 92 12Z"/><path d="M128 12Q119 4 110 12Q119 20 128 12Z"/>' +
      "</g>" +
      '<g fill="currentColor"><circle cx="110" cy="12" r="1.8"/><circle cx="82" cy="12" r="1.6"/><circle cx="138" cy="12" r="1.6"/>' +
      '<circle cx="74" cy="12" r="1.1"/><circle cx="146" cy="12" r="1.1"/></g></svg>';
  };

  /* Lotus kolam — every stroke draws itself (pathLength=1) */
  Art.kolam = function (cls) {
    var out = "", i, a, r = Math.PI / 180;
    function pt(rad, deg) { return [(rad * Math.cos(deg * r)).toFixed(2), (rad * Math.sin(deg * r)).toFixed(2)]; }
    for (i = 0; i < 8; i++) {
      a = i * 45;
      var b1 = pt(14, a - 14), b2 = pt(14, a + 14), c1 = pt(40, a - 26), c2 = pt(40, a + 26), t = pt(56, a);
      out += '<path pathLength="1" d="M' + b1 + "Q" + c1 + " " + t + "Q" + c2 + " " + b2 + '"/>';
      var a2 = a + 22.5, l1 = pt(58, a2 - 9), l2 = pt(58, a2 + 9), lc1 = pt(84, a2 - 20), lc2 = pt(84, a2 + 20), lt = pt(78, a2);
      out += '<path pathLength="1" d="M' + l1 + "C" + lc1 + " " + lc2 + " " + l2 + '"/>';
      void lt;
    }
    var dots = "";
    for (i = 0; i < 16; i++) { var d = pt(92, i * 22.5); dots += '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="1.9"/>'; }
    for (i = 0; i < 8; i++) { var d2 = pt(30, i * 45 + 22.5); dots += '<circle cx="' + d2[0] + '" cy="' + d2[1] + '" r="1.6"/>'; }
    return '<svg class="' + (cls || "kolam") + '" viewBox="-100 -100 200 200" aria-hidden="true" focusable="false">' +
      '<g class="kolam__lines" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">' +
      '<circle pathLength="1" r="9"/>' + out + '<circle pathLength="1" r="66"/>' + "</g>" +
      '<g class="kolam__dots" fill="currentColor">' + dots + "</g></svg>";
  };

  /* Gopuram — tiered temple tower, built procedurally */
  Art.gopuram = function (cls) {
    var W = 300, H = 400, paths = [], y = H, i;
    var pl = function (pts) { return '<path pathLength="1" d="M' + pts.join("L") + 'Z"/>'; };
    /* plinth with doorway */
    var bw = 236, bh = 70, bx = (W - bw) / 2;
    paths.push(pl([[bx, y], [bx, y - bh], [bx + bw, y - bh], [bx + bw, y]]));
    paths.push('<path pathLength="1" d="M' + (W / 2 - 22) + " " + y + "V" + (y - 38) + "Q" + (W / 2) + " " + (y - 58) + " " + (W / 2 + 22) + " " + (y - 38) + "V" + y + '"/>');
    y -= bh;
    var tiers = 7, w0 = 224, w1 = 92;
    for (i = 0; i < tiers; i++) {
      var wb = w0 - (w0 - w1) * (i / tiers), wt = w0 - (w0 - w1) * ((i + 1) / tiers);
      var th = 34 - i * 1.4;
      var xb = (W - wb) / 2, xt = (W - wt) / 2;
      paths.push(pl([[xb, y], [xt, y - th], [xt + wt, y - th], [xb + wb, y]]));
      /* cornice */
      paths.push('<path pathLength="1" d="M' + (xb - 3) + " " + (y - 4) + "H" + (xb + wb + 3) + '"/>');
      /* niches */
      var n = Math.max(3, Math.floor(wt / 22)), gap = wt / n;
      for (var k = 0; k < n; k++) {
        var nx = xt + gap * k + gap / 2 - 4, ny = y - th + 9;
        paths.push('<path pathLength="1" d="M' + nx + " " + (ny + 16) + "V" + (ny + 5) + "Q" + (nx + 4) + " " + ny + " " + (nx + 8) + " " + (ny + 5) + "V" + (ny + 16) + '"/>');
      }
      y -= th;
    }
    /* barrel-vault shala roof with curled ends */
    var sw = 104, sx = (W - sw) / 2;
    paths.push('<path pathLength="1" d="M' + sx + " " + y + "Q" + sx + " " + (y - 34) + " " + (W / 2) + " " + (y - 36) + "Q" + (sx + sw) + " " + (y - 34) + " " + (sx + sw) + " " + y + 'Z"/>');
    paths.push('<path pathLength="1" d="M' + (sx - 6) + " " + (y - 6) + "q-8-12 4-18" + '"/>');
    paths.push('<path pathLength="1" d="M' + (sx + sw + 6) + " " + (y - 6) + "q8-12-4-18" + '"/>');
    /* kalasams */
    var ky = y - 34;
    for (i = 0; i < 5; i++) {
      var kx = sx + 14 + i * ((sw - 28) / 4), kyy = ky + Math.abs(i - 2) * 3;
      paths.push('<path pathLength="1" d="M' + (kx - 4) + " " + kyy + "Q" + (kx - 5) + " " + (kyy - 9) + " " + kx + " " + (kyy - 16) + "Q" + (kx + 5) + " " + (kyy - 9) + " " + (kx + 4) + " " + kyy + 'Z"/>');
    }
    return '<svg class="' + (cls || "gopuram") + '" viewBox="0 0 300 400" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">' +
      '<g fill="currentColor" stroke="var(--gopuram-stroke, #c9a054)" stroke-width="1.1" stroke-linejoin="round">' + paths.join("") + "</g></svg>";
  };

  /* Thoranam — mango leaves and marigolds strung across the top */
  Art.thoranam = function (width) {
    var h = 78, step = 34, n = Math.max(6, Math.floor(width / step)), sp = width / n, g = "", i;
    function sag(x) { var t = x / width; return 6 + 16 * 4 * t * (1 - t); }
    for (i = 0; i < n; i++) {
      var x = sp * i + sp / 2, y = sag(x), len = i % 2 ? 40 : 48;
      g += '<g class="leaf" style="--ld:' + ((i % 5) * 0.37).toFixed(2) + 's" transform="translate(' + x.toFixed(1) + " " + y.toFixed(1) + ')">' +
        '<g class="leaf__sway"><path d="M0 0C7 ' + (len * 0.22) + " 8 " + (len * 0.6) + " 0 " + len + "C-8 " + (len * 0.6) + " -7 " + (len * 0.22) + ' 0 0Z" fill="url(#g-leaf)"/>' +
        '<path d="M0 2V' + (len - 3) + '" stroke="#b9d69a" stroke-width=".7" opacity=".7"/></g></g>';
      if (i < n - 1) {
        var mx = x + sp / 2, my = sag(mx) + 3;
        g += '<g transform="translate(' + mx.toFixed(1) + " " + my.toFixed(1) + ')"><circle r="6" fill="#e8891c"/><circle r="4" fill="#f5a623"/><circle r="1.6" fill="#c2410c"/></g>';
      }
    }
    var d = "M0 6Q" + width / 2 + " 38 " + width + " 6";
    return '<svg class="thoranam" viewBox="0 0 ' + width + " " + h + '" width="' + width + '" height="' + h + '" aria-hidden="true" focusable="false">' +
      '<path d="' + d + '" fill="none" stroke="#8a6424" stroke-width="1.4"/>' + g + "</svg>";
  };

  /* Hydrate every [data-art] placeholder in the document */
  Art.hydrate = function (root) {
    (root || document).querySelectorAll("[data-art]").forEach(function (el) {
      var fn = Art[el.getAttribute("data-art")];
      if (fn && !el.firstElementChild) el.innerHTML = fn(el.getAttribute("data-art-class"));
    });
  };

  Art.mountThoranam = function (el) {
    var draw = function () { el.innerHTML = Art.thoranam(Math.max(280, el.clientWidth)); };
    draw();
    var t;
    window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(draw, 200); });
  };

  /* ----------------------------------------------------------------------
     BELL — synthesised temple bell (Web Audio; no audio file needed)
     ---------------------------------------------------------------------- */
  var Bell = { ctx: null, muted: false };
  Bell.ring = function (vol) {
  if (Bell.muted) return;

  try {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;

    Bell.ctx = Bell.ctx || new AC();
    var ctx = Bell.ctx;

    function playBell() {
      var now = ctx.currentTime;

      var master = ctx.createGain();
      master.gain.value = vol || 0.13;
      master.connect(ctx.destination);

      var frequencies = [
        [612, 1, 3.2],
        [1224, 0.55, 2.4],
        [1690, 0.45, 1.8],
        [3305, 0.22, 1.1],
        [5465, 0.10, 0.7]
      ];

      frequencies.forEach(function (item) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = item[0];

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(
          item[1],
          now + 0.006
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + item[2]
        );

        osc.connect(gain);
        gain.connect(master);

        osc.start(now);
        osc.stop(now + item[2] + 0.05);
      });
    }

    if (ctx.state === "suspended") {
      ctx.resume().then(playBell);
    } else {
      playBell();
    }

  } catch (error) {
    console.warn("Bell sound error:", error);
  }
};
  /* ----------------------------------------------------------------------
     FX — one shared overlay canvas for bursts and petal showers
     ---------------------------------------------------------------------- */
  var FX = { parts: [], running: false };
  FX.init = function () {
    var c = document.createElement("canvas");
    c.className = "fx-canvas";
    c.setAttribute("aria-hidden", "true");
    document.body.appendChild(c);
    FX.c = c; FX.x = c.getContext("2d");
    FX.resize();
    window.addEventListener("resize", FX.resize);
  };
  FX.resize = function () {
    if (!FX.c) return;
    FX.dpr = Math.min(window.devicePixelRatio || 1, 2);
    FX.w = window.innerWidth; FX.h = window.innerHeight;
    FX.c.width = FX.w * FX.dpr; FX.c.height = FX.h * FX.dpr;
    FX.x.setTransform(FX.dpr, 0, 0, FX.dpr, 0, 0);
  };
  var GOLDS = ["#f2d896", "#e3c27a", "#c9a054", "#fff3c8", "#b8893b"];
  var FLOWERS = ["#fffdf6", "#fffdf6", "#f5a623", "#e8891c", "#b3202e"];
  function rnd(a, b) { return a + Math.random() * (b - a); }

  FX.burst = function (x, y, opt) {
    if (reduceMotion || !FX.c) return;
    opt = opt || {};
    var n = opt.count || 60;
    for (var i = 0; i < n; i++) {
      var ang = rnd(0, Math.PI * 2), sp = rnd(2, opt.power || 7);
      FX.parts.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 1.5, g: 0.12, drag: 0.965,
        life: 1, decay: rnd(0.008, 0.018), s: rnd(1.5, 3.6), rot: rnd(0, 6), vr: rnd(-0.2, 0.2),
        type: Math.random() < 0.7 ? "spark" : "diamond", col: GOLDS[(Math.random() * GOLDS.length) | 0] });
    }
    FX.run();
  };
  FX.shower = function (n) {
    if (reduceMotion || !FX.c) return;
    for (var i = 0; i < (n || 40); i++) {
      FX.parts.push({ x: rnd(0, FX.w), y: rnd(-FX.h * 0.6, -10), vx: rnd(-0.4, 0.4), vy: rnd(1.1, 2.3), g: 0, drag: 1,
        life: 1, decay: 0.0026, s: rnd(4, 7), rot: rnd(0, 6), vr: rnd(-0.04, 0.04), sway: rnd(0, 6), type: "petal",
        col: FLOWERS[(Math.random() * FLOWERS.length) | 0] });
    }
    FX.run();
  };
  FX.run = function () {
    if (FX.running) return;
    FX.running = true;
    requestAnimationFrame(FX.tick);
  };
  FX.tick = function () {
    var x = FX.x, p, i;
    x.clearRect(0, 0, FX.w, FX.h);
    for (i = FX.parts.length - 1; i >= 0; i--) {
      p = FX.parts[i];
      p.vx *= p.drag; p.vy = p.vy * p.drag + p.g;
      if (p.type === "petal") { p.sway += 0.03; p.x += p.vx + Math.sin(p.sway) * 0.6; } else p.x += p.vx;
      p.y += p.vy; p.rot += p.vr; p.life -= p.decay;
      if (p.life <= 0 || p.y > FX.h + 20) { FX.parts.splice(i, 1); continue; }
      x.globalAlpha = Math.min(1, p.life * 1.4);
      x.fillStyle = p.col;
      if (p.type === "spark") { x.beginPath(); x.arc(p.x, p.y, p.s, 0, 6.283); x.fill(); }
      else {
        x.save(); x.translate(p.x, p.y); x.rotate(p.rot);
        x.beginPath();
        if (p.type === "diamond") { x.moveTo(0, -p.s * 1.6); x.lineTo(p.s, 0); x.lineTo(0, p.s * 1.6); x.lineTo(-p.s, 0); }
        else x.ellipse(0, 0, p.s * 0.55, p.s, 0, 0, 6.283);
        x.fill(); x.restore();
      }
    }
    x.globalAlpha = 1;
    if (FX.parts.length) requestAnimationFrame(FX.tick);
    else { FX.running = false; x.clearRect(0, 0, FX.w, FX.h); }
  };

  /* ----------------------------------------------------------------------
     Ambient gold dust inside a container (runs only while visible)
     ---------------------------------------------------------------------- */
  function Dust(canvas, count) {
    this.c = canvas; this.x = canvas.getContext("2d"); this.n = count || 34; this.on = false; this.p = [];
    var self = this;
    this.resize = function () {
      var r = self.c.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2);
      self.w = r.width; self.h = r.height;
      self.c.width = r.width * d; self.c.height = r.height * d;
      self.x.setTransform(d, 0, 0, d, 0, 0);
    };
    this.resize();
    window.addEventListener("resize", this.resize);
    for (var i = 0; i < this.n; i++) this.p.push(this.spawn(true));
    this.loop = function () {
      if (!self.on) return;
      var x = self.x;
      x.clearRect(0, 0, self.w, self.h);
      for (var i = 0; i < self.p.length; i++) {
        var q = self.p[i];
        q.y -= q.v; q.x += Math.sin(q.t += 0.02) * 0.25;
        if (q.y < -8) self.p[i] = q = self.spawn(false);
        var a = (0.35 + 0.65 * Math.abs(Math.sin(q.t * 1.7))) * q.a;
        x.globalAlpha = a;
        x.fillStyle = q.c;
        x.beginPath(); x.arc(q.x, q.y, q.r, 0, 6.283); x.fill();
      }
      requestAnimationFrame(self.loop);
    };
  }
  Dust.prototype.spawn = function (anywhere) {
    return { x: Math.random() * this.w, y: anywhere ? Math.random() * this.h : this.h + 8, r: rnd(0.6, 2.2), v: rnd(0.15, 0.55),
      t: rnd(0, 6), a: rnd(0.4, 0.9), c: GOLDS[(Math.random() * 3) | 0] };
  };
  Dust.prototype.start = function () { if (reduceMotion || this.on) return; this.on = true; requestAnimationFrame(this.loop); };
  Dust.prototype.stop = function () { this.on = false; };

  /* Falling jasmine blossoms rendered as a few CSS-animated elements */
  function jasmineRain(container, count) {
    if (reduceMotion) return;
    var html = "";
    for (var i = 0; i < count; i++) {
      html += '<span class="petal" style="left:' + rnd(2, 96).toFixed(1) + "%;--dur:" + rnd(9, 16).toFixed(1) +
        "s;--delay:" + rnd(0, 9).toFixed(1) + "s;--size:" + rnd(12, 20).toFixed(0) + "px;--drift:" + rnd(-40, 40).toFixed(0) + 'px">' +
        Art.jasmine("petal__svg") + "</span>";
    }
    container.innerHTML = html;
  }

  /* ----------------------------------------------------------------------
     Scroll reveal — adds .is-in once; each section styles its own entrance
     ---------------------------------------------------------------------- */
  function observeReveals() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      els.forEach(function (e) { e.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.15 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* Split text into letters for staggered reveals */
  function splitLetters(el, baseDelay, step) {
    var text = el.textContent;
    el.setAttribute("aria-label", text);
    el.textContent = "";
    Array.prototype.forEach.call(text, function (ch, i) {
      var s = document.createElement("span");
      s.className = "ltr";
      s.setAttribute("aria-hidden", "true");
      s.style.setProperty("--ld", (baseDelay + i * step).toFixed(2) + "s");
      s.textContent = ch === " " ? "\u00a0" : ch;
      el.appendChild(s);
    });
  }

  window.Anim = { Art: Art, Bell: Bell, FX: FX, Dust: Dust, jasmineRain: jasmineRain, observeReveals: observeReveals,
    splitLetters: splitLetters, reduceMotion: reduceMotion };
})();

