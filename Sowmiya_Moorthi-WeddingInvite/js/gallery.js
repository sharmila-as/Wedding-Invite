/* ==========================================================================
   gallery.js — cinematic banner, swipeable polaroid track, lightbox
   ========================================================================== */
(function () {
  "use strict";

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function Gallery(root, cfg) {
    this.root = root;
    this.items = [cfg.galleryBanner].concat(cfg.gallery);   /* lightbox order */
    this.build(cfg);
    this.lightbox();
  }

  Gallery.prototype.build = function (cfg) {
    var b = cfg.galleryBanner, self = this;
    var banner = this.root.querySelector(".gal__banner");
    banner.innerHTML =
      '<button class="gal__banner-btn" type="button" data-open="0" aria-label="Open photo: ' + esc(b.alt) + '">' +
      '<span class="gal__banner-frame" style="aspect-ratio:' + b.w + "/" + b.h + '">' +
      '<img src="' + b.src + '" alt="' + esc(b.alt) + '" width="' + b.w + '" height="' + b.h + '" loading="lazy" decoding="async"></span></button>';

    var track = this.root.querySelector(".gal__track"), dots = this.root.querySelector(".gal__dots");
    track.innerHTML = cfg.gallery.map(function (g, i) {
      return '<li class="gal__slide" style="--tilt:' + (i % 2 ? 2.2 : -2.2) + 'deg">' +
        '<button class="polaroid" type="button" data-open="' + (i + 1) + '" aria-label="Open photo ' + (i + 1) + " of " + cfg.gallery.length + ": " + esc(g.alt) + '">' +
        '<span class="polaroid__img" style="aspect-ratio:' + g.w + "/" + g.h + '">' +
        '<img src="' + g.src + '" alt="' + esc(g.alt) + '" width="' + g.w + '" height="' + g.h + '" loading="lazy" decoding="async"></span>' +
        '<span class="polaroid__cap">' + esc(g.caption || "") + "</span></button></li>";
    }).join("");
    dots.innerHTML = cfg.gallery.map(function (_, i) { return '<span class="gal__dot' + (i ? "" : " is-on") + '"></span>'; }).join("");

    var slides = track.querySelectorAll(".gal__slide"), dotEls = dots.querySelectorAll(".gal__dot");
    var counter = this.root.querySelector(".gal__count");
    var setActive = function (idx) {
      slides.forEach(function (s, i) { s.classList.toggle("is-active", i === idx); });
      dotEls.forEach(function (d, i) { d.classList.toggle("is-on", i === idx); });
      if (counter) counter.textContent = (idx + 1) + " / " + slides.length;
      self.active = idx;
    };
    setActive(0);

    /* which slide sits in the middle of the track */
    var raf;
    track.addEventListener("scroll", function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        var mid = track.scrollLeft + track.clientWidth / 2, best = 0, bd = 1e9;
        slides.forEach(function (s, i) {
          var c = s.offsetLeft + s.offsetWidth / 2, d = Math.abs(c - mid);
          if (d < bd) { bd = d; best = i; }
        });
        if (best !== self.active) setActive(best);
      });
    }, { passive: true });

    var go = function (dir) {
      var i = Math.max(0, Math.min(slides.length - 1, self.active + dir)), s = slides[i];
      track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2, behavior: "smooth" });
    };
    this.root.querySelector(".gal__prev").addEventListener("click", function () { go(-1); });
    this.root.querySelector(".gal__next").addEventListener("click", function () { go(1); });

    this.root.addEventListener("click", function (e) {
      var t = e.target.closest("[data-open]");
      if (t) self.open(+t.getAttribute("data-open"), t);
    });
  };

  Gallery.prototype.lightbox = function () {
    var lb = document.getElementById("lightbox"), self = this;
    this.lb = lb;
    this.img = lb.querySelector(".lb__img");
    this.cap = lb.querySelector(".lb__cap");
    this.stage = lb.querySelector(".lb__stage");
    lb.querySelector(".lb__close").addEventListener("click", function () { self.close(); });
    lb.querySelector(".lb__prev").addEventListener("click", function () { self.step(-1); });
    lb.querySelector(".lb__next").addEventListener("click", function () { self.step(1); });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target === self.stage) self.close(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") self.close();
      else if (e.key === "ArrowRight") self.step(1);
      else if (e.key === "ArrowLeft") self.step(-1);
      else if (e.key === "Tab") {           /* keep focus inside */
        var f = lb.querySelectorAll("button"), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* swipe with finger-follow */
    var sx = 0, dx = 0, dragging = false;
    this.stage.addEventListener("pointerdown", function (e) { dragging = true; sx = e.clientX; dx = 0; self.img.style.transition = "none"; });
    this.stage.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      dx = e.clientX - sx;
      self.img.style.transform = "translateX(" + dx + "px) scale(" + (1 - Math.min(Math.abs(dx) / 2000, 0.06)) + ")";
    });
    var up = function () {
      if (!dragging) return;
      dragging = false;
      self.img.style.transition = "";
      if (Math.abs(dx) > 50) self.step(dx < 0 ? 1 : -1, dx < 0 ? 1 : -1);
      else self.img.style.transform = "";
    };
    this.stage.addEventListener("pointerup", up);
    this.stage.addEventListener("pointercancel", up);
  };

  Gallery.prototype.show = function (i, dir) {
    var it = this.items[i], img = this.img, self = this;
    this.idx = i;
    img.classList.remove("is-in-l", "is-in-r", "is-in");
    img.style.transform = "";
    img.src = it.src; img.alt = it.alt; img.width = it.w; img.height = it.h;
    this.cap.innerHTML = (it.caption ? "<span>" + esc(it.caption) + "</span>" : "") + '<span class="lb__num">' + (i + 1) + " / " + this.items.length + "</span>";
    void img.offsetWidth;
    img.classList.add(dir > 0 ? "is-in-r" : dir < 0 ? "is-in-l" : "is-in");
    /* warm the neighbours */
    [i - 1, i + 1].forEach(function (n) { var j = (n + self.items.length) % self.items.length; var p = new Image(); p.src = self.items[j].src; });
  };

  Gallery.prototype.step = function (d) { this.show((this.idx + d + this.items.length) % this.items.length, d); };

  Gallery.prototype.open = function (i, opener) {
    this.opener = opener;
    this.lb.hidden = false;
    document.body.classList.add("lb-open");
    var lb = this.lb;
    requestAnimationFrame(function () { lb.classList.add("is-open"); });
    this.show(i, 0);
    lb.querySelector(".lb__close").focus();
  };

  Gallery.prototype.close = function () {
    var lb = this.lb;
    lb.classList.remove("is-open");
    document.body.classList.remove("lb-open");
    setTimeout(function () { lb.hidden = true; }, 350);
    if (this.opener) this.opener.focus();
  };

  window.Gallery = Gallery;
})();
