/* ==========================================================================
   scratch-card.js — gold-foil scratch surface (touch + mouse + pen)
   ========================================================================== */
(function () {
  "use strict";

  function ScratchCard(root, opts) {
    this.root = root;
    this.canvas = root.querySelector(".scratch__canvas");
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    this.hint = root.querySelector(".scratch__hint");
    this.threshold = opts.threshold || 0.58;
    this.onReveal = opts.onReveal || function () {};
    this.done = false;
    this.touched = false;
    this.last = null;
    this.lastCheck = 0;
    this.bind();
  }

  ScratchCard.prototype.paint = function () {
    var c = this.canvas, r = c.getBoundingClientRect(), d = Math.min(window.devicePixelRatio || 1, 2), x = this.ctx;
    this.w = r.width; this.h = r.height; this.d = d;
    c.width = Math.round(r.width * d); c.height = Math.round(r.height * d);
    x.setTransform(d, 0, 0, d, 0, 0);
    x.globalCompositeOperation = "source-over";
    var w = this.w, h = this.h;

    /* brushed gold foil */
    var g = x.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#8a6424"); g.addColorStop(0.28, "#d9b566"); g.addColorStop(0.46, "#f6e4ab");
    g.addColorStop(0.62, "#c49a48"); g.addColorStop(1, "#7d5a1f");
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    for (var i = 0; i < 90; i++) {
      x.strokeStyle = "rgba(255,248,220," + (Math.random() * 0.12) + ")";
      x.lineWidth = Math.random() * 1.2;
      var yy = Math.random() * h;
      x.beginPath(); x.moveTo(0, yy); x.lineTo(w, yy + (Math.random() - 0.5) * 8); x.stroke();
    }
    for (i = 0; i < 900; i++) {
      x.fillStyle = Math.random() < 0.5 ? "rgba(255,250,225,.18)" : "rgba(70,40,10,.12)";
      x.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }

    /* double engraved border */
    x.strokeStyle = "rgba(90,55,15,.55)"; x.lineWidth = 1.2;
    x.strokeRect(10, 10, w - 20, h - 20);
    x.strokeStyle = "rgba(255,244,205,.6)"; x.lineWidth = 0.8;
    x.strokeRect(15, 15, w - 30, h - 30);

    /* lotus medallion */
    var cx = w / 2, cy = h / 2 - 16;
    x.save(); x.translate(cx, cy);
    x.strokeStyle = "rgba(94,20,32,.7)"; x.lineWidth = 1.2;
    for (i = 0; i < 8; i++) {
      x.rotate(Math.PI / 4);
      x.beginPath(); x.ellipse(0, -15, 5.5, 12, 0, 0, Math.PI * 2); x.stroke();
    }
    x.beginPath(); x.arc(0, 0, 5, 0, Math.PI * 2); x.fillStyle = "rgba(94,20,32,.75)"; x.fill();
    x.restore();

    x.fillStyle = "#5a1420";
    x.textAlign = "center"; x.textBaseline = "middle";
    x.font = "400 " + Math.round(Math.min(22, w / 15)) + "px Marcellus, Georgia, serif";
    x.fillText("SCRATCH HERE", cx, cy + 46);
    x.font = "400 " + Math.round(Math.min(15, w / 22)) + "px Arima, 'Noto Serif Tamil', serif";
    x.fillStyle = "rgba(90,20,32,.8)";
    x.fillText("இங்கே தேய்க்கவும்", cx, cy + 72);
  };

  ScratchCard.prototype.bind = function () {
    var self = this, c = this.canvas;
    function pos(e) { var r = c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }

    c.addEventListener("pointerdown", function (e) {
      if (self.done) return;
      e.preventDefault();
      try { c.setPointerCapture(e.pointerId); } catch (err) {}
      self.down = true;
      self.last = pos(e);
      self.scratch(self.last, self.last);
      if (!self.touched) { self.touched = true; self.root.classList.add("is-scratching"); }
    });
    c.addEventListener("pointermove", function (e) {
      if (!self.down || self.done) return;
      e.preventDefault();
      var p = pos(e);
      self.scratch(self.last, p);
      self.last = p;
      var now = performance.now();
      if (now - self.lastCheck > 160) { self.lastCheck = now; self.check(); }
    });
    var end = function () { if (self.down) { self.down = false; self.check(); } };
    c.addEventListener("pointerup", end);
    c.addEventListener("pointercancel", end);
    c.addEventListener("lostpointercapture", end);
    /* belt and braces: stop iOS from scrolling while a finger is on the foil */
    c.addEventListener("touchmove", function (e) { if (!self.done) e.preventDefault(); }, { passive: false });

    var t;
    window.addEventListener("resize", function () {
      clearTimeout(t);
      t = setTimeout(function () { if (!self.done && !self.touched) self.paint(); }, 200);
    });
  };

  ScratchCard.prototype.scratch = function (a, b) {
    var x = this.ctx;
    x.globalCompositeOperation = "destination-out";
    x.lineCap = "round"; x.lineJoin = "round";
    x.lineWidth = Math.max(34, this.w * 0.11);
    x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x + 0.1, b.y + 0.1); x.stroke();
  };

  ScratchCard.prototype.check = function () {
    if (this.done) return;
    var c = this.canvas, data;
    try { data = this.ctx.getImageData(0, 0, c.width, c.height).data; } catch (e) { return; }
    var stride = 4 * 24, clear = 0, total = 0;
    for (var i = 3; i < data.length; i += stride) { total++; if (data[i] < 128) clear++; }
    var pct = clear / total;
    this.root.style.setProperty("--progress", pct.toFixed(2));
    if (pct >= this.threshold) this.reveal(true);
  };

  ScratchCard.prototype.reveal = function (animate) {
    if (this.done) return;
    this.done = true;
    var root = this.root, c = this.canvas;
    root.classList.add("is-revealed");
    if (!animate) root.classList.add("is-instant");
    c.setAttribute("aria-hidden", "true");
    setTimeout(function () { c.style.display = "none"; }, animate ? 900 : 0);
    this.onReveal(animate);
  };

  ScratchCard.prototype.start = function (alreadyRevealed) {
    var self = this;
    if (alreadyRevealed) { this.reveal(false); return; }
    var go = function () { self.paint(); };
    if (document.fonts && document.fonts.load) {
      Promise.all([document.fonts.load("20px Marcellus"), document.fonts.load("15px Arima", "இங்கே")]).then(go, go);
    } else go();
  };

  window.ScratchCard = ScratchCard;
})();
