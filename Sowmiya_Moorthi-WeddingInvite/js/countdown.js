/* ==========================================================================
   countdown.js — locked until the date is revealed, then ticks every second
   ========================================================================== */
(function () {
  "use strict";

  function Countdown(root, targetISO) {
    this.root = root;
    this.target = new Date(targetISO).getTime();
    this.units = {};
    var self = this;
    root.querySelectorAll("[data-unit]").forEach(function (el) {
      self.units[el.getAttribute("data-unit")] = { el: el.querySelector(".cd__num"), v: null };
    });
    this.timer = null;
  }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  Countdown.prototype.set = function (key, val) {
    var u = this.units[key];
    if (!u || u.v === val) return;
    u.v = val;
    u.el.textContent = val;
    u.el.classList.remove("tick");
    void u.el.offsetWidth;          /* restart the flip animation */
    u.el.classList.add("tick");
  };

  Countdown.prototype.render = function () {
    var diff = this.target - Date.now();
    if (diff <= 0) {
      this.root.classList.add("is-arrived");
      clearInterval(this.timer);
      return;
    }
    var s = Math.floor(diff / 1000);
    this.set("days", pad(Math.floor(s / 86400)));
    this.set("hours", pad(Math.floor((s % 86400) / 3600)));
    this.set("minutes", pad(Math.floor((s % 3600) / 60)));
    this.set("seconds", pad(s % 60));
  };

  Countdown.prototype.unlock = function (animate) {
    var self = this;
    if (this.timer) return;
    this.root.classList.add("is-unlocked");
    if (!animate) this.root.classList.add("is-instant");
    this.root.querySelector(".cd__live").removeAttribute("aria-hidden");
    this.render();
    /* align ticks to the wall-clock second */
    setTimeout(function () {
      self.render();
      self.timer = setInterval(function () { self.render(); }, 1000);
    }, 1000 - (Date.now() % 1000));
  };

  window.Countdown = Countdown;
})();
