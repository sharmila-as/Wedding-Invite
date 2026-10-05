/* ==========================================================================
   main.js — renders content from config and orchestrates the experience
   ========================================================================== */
(function () {
  "use strict";

  var C = window.WEDDING, A = window.Anim, $ = function (s, r) { return (r || document).querySelector(s); },
    $$ = function (s, r) { return (r || document).querySelectorAll(s); };
  var STORE_KEY = "sm-wedding-date-revealed";
  var revealed = false;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function get(path) { return path.split(".").reduce(function (o, k) { return o && o[k]; }, C); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------------- content binding ---------------- */
  function bindContent() {
    $$("[data-bind]").forEach(function (el) { var v = get(el.getAttribute("data-bind")); if (v != null) el.textContent = v; });
    $$("[data-maps]").forEach(function (a) { a.href = C.venue.mapsUrl; });

    var hp = C.heroPhoto, img = $("#introPhoto");
    img.src = hp.src; img.alt = hp.alt; img.width = hp.w; img.height = hp.h;
    $(".intro__photo").style.setProperty("--ar", hp.w + "/" + hp.h);

    /* events (only confirmed) */
    $("#eventList").innerHTML = C.events.filter(function (e) { return e.confirmed; }).map(function (e) {
      var date = e.hideDateUntilReveal
        ? '<span class="date-lock" data-date-lock data-date-value="' + esc(e.date) + '">Revealed on the scratch card</span>'
        : esc(e.date);
      return '<article class="event" data-reveal>' +
        '<span class="event__corner event__corner--tl" data-art="corner"></span><span class="event__corner event__corner--tr" data-art="corner"></span>' +
        '<span class="event__corner event__corner--bl" data-art="corner"></span><span class="event__corner event__corner--br" data-art="corner"></span>' +
        '<div class="event__lamp st" style="--i:1" data-art="lamp"></div>' +
        '<h3 class="event__title st" style="--i:0">' + esc(e.title) + '<span class="event__ta" lang="ta">' + esc(e.tamil || "") + "</span></h3>" +
        '<div class="event__div st" style="--i:2" data-art="divider"></div>' +
        '<dl class="event__meta">' +
        '<div class="st" style="--i:3"><dt>Date</dt><dd class="event__date">' + date + "</dd></div>" +
        '<div class="st" style="--i:4"><dt>Time</dt><dd class="event__time">' + esc(e.time) + " <small>" + esc(C.wedding.timezone) + "</small></dd></div>" +
        '<div class="st" style="--i:5"><dt>Venue</dt><dd class="event__venue">' + esc(e.venue) + '<span class="event__addr">' + esc(e.address) + "</span></dd></div>" +
        "</dl>" +
        '<a class="btn btn--maroon st" style="--i:6" href="' + esc(e.mapsUrl) + '" target="_blank" rel="noopener">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" fill="currentColor"/></svg>' +
        "Get directions</a></article>";
    }).join("");

    /* story */
    var roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
    $("#storyList").innerHTML = C.story.map(function (s, i) {
      return '<li class="story__item ' + (i % 2 ? "is-right" : "is-left") + '" data-reveal>' +
        '<span class="story__mark" aria-hidden="true">' + (roman[i] || i + 1) + "</span>" +
        '<div class="story__card"><h3>' + esc(s.title) + "</h3><p>" + esc(s.text) + "</p></div></li>";
    }).join("");
  }

  /* ---------------- date secrecy ---------------- */
  function fillLockedDates(animate) {
    $$("[data-date-lock]").forEach(function (el, i) {
      el.textContent = el.getAttribute("data-date-value") || C.wedding.fullDate;
      el.classList.add("is-unlocked");
      if (animate) el.style.setProperty("--d", (0.1 * i) + "s");
    });
    document.body.classList.add("date-known");
  }

  function onDateRevealed(animate) {
    revealed = true;
    fillLockedDates(animate);
    countdown.unlock(animate);
    if (C.scratch.rememberReveal) store(STORE_KEY, "1");
    $("#live").textContent = "Wedding date revealed: " + C.wedding.fullDate + ", " + C.wedding.time + " " + C.wedding.timezone;
    if (animate) {
      var r = $("#scratch").getBoundingClientRect();
      A.FX.burst(r.left + r.width / 2, r.top + r.height / 2, { count: 90, power: 9 });
      setTimeout(function () { A.FX.shower(46); }, 260);
      setTimeout(function () { A.Bell.ring(0.09); }, 120);
    }
  }

  /* ---------------- music ---------------- */
  var music = { audio: null, ok: false, playing: false, btn: null };
  function setupMusic() {
    var m = C.music, btn = $("#musicBtn");
    music.btn = btn;
    if (!m || !m.src) return;
    var a = new Audio();
    a.loop = true; a.preload = "metadata"; a.volume = 0;
    a.addEventListener("loadedmetadata", function () { music.ok = true; if (document.body.classList.contains("is-open")) btn.hidden = false; });
    a.addEventListener("error", function () { music.ok = false; btn.hidden = true; });
    a.src = m.src;
    music.audio = a;
    btn.addEventListener("click", function () { music.playing ? pauseMusic() : playMusic(); });
    document.addEventListener("visibilitychange", function () {
      if (!music.audio) return;
      if (document.hidden && music.playing) { music.audio.pause(); music.resume = true; }
      else if (!document.hidden && music.resume) { music.resume = false; music.audio.play().catch(function () {}); }
    });
  }
  function fadeTo(target, ms) {
    var a = music.audio, start = a.volume, t0 = performance.now();
    (function step(t) {
      var k = Math.min(1, (t - t0) / ms);
      a.volume = Math.max(0, Math.min(1, start + (target - start) * k));
      if (k < 1) requestAnimationFrame(step); else if (target === 0) a.pause();
    })(t0);
  }
  function playMusic() {
    if (!music.audio) return;
    var p = music.audio.play();
    var ok = function () { music.playing = true; A.Bell.muted = false; updateMusicBtn(); fadeTo(C.music.volume || 0.45, 1800); };
    if (p && p.then) p.then(ok).catch(function () { music.playing = false; updateMusicBtn(); });
    else ok();
  }
  function pauseMusic() { music.playing = false; updateMusicBtn(); fadeTo(0, 500); }
  function updateMusicBtn() {
    var b = music.btn;
    b.classList.toggle("is-playing", music.playing);
    b.setAttribute("aria-pressed", String(music.playing));
    b.setAttribute("aria-label", music.playing ? "Pause background music" : "Play background music");
    $(".music__state", b).textContent = music.playing ? "Music on" : "Music off";
  }

  /* ---------------- intro sequence ---------------- */
  var dust, countdown, card;
  function playIntro() {
    var intro = $("#intro");
    A.splitLetters($(".intro__bride"), 3.6, 0.07);
    A.splitLetters($(".intro__groom"), 4.3, 0.07);
    A.jasmineRain($(".intro__petals"), window.innerWidth < 600 ? 9 : 14);
    dust = new A.Dust($(".intro__dust"), window.innerWidth < 600 ? 28 : 46);
    var begin = function () {
      intro.classList.add("play");
      setTimeout(function () { dust.start(); }, 700);
    };
    if (A.reduceMotion) { intro.classList.add("play", "is-static"); return; }
    var fontWait = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([fontWait, new Promise(function (r) { setTimeout(r, 1400); })]).then(function () { setTimeout(begin, 150); });

    /* tap anywhere on the intro to skip ahead to the button */
    intro.addEventListener("click", function (e) {
      if (e.target.closest(".open-btn")) return;
      if (intro.classList.contains("play") && !intro.classList.contains("is-static")) intro.classList.add("is-static");
    });
  }

  function openInvitation() {
    var intro = $("#intro"), btn = $(".open-btn"), main = $("#main");
    if (intro.classList.contains("is-opening")) return;
    btn.classList.add("is-pressed");

var r = btn.getBoundingClientRect(),
    cx = r.left + r.width / 2,
    cy = r.top + r.height / 2;

intro.style.setProperty("--ox", cx + "px");
intro.style.setProperty("--oy", cy + "px");

/* Play temple bell FIRST */
A.Bell.ring(0.18);

/* Visual celebration */
A.FX.burst(cx, cy, { count: 70, power: 8 });

/* Start wedding music AFTER bell is triggered */
if (C.music.playOnOpen && music.audio) {
  setTimeout(function () {
    playMusic();
  }, 180);
}

    var wait = A.reduceMotion ? 0 : 420;
    setTimeout(function () { intro.classList.add("is-opening"); }, wait);
    setTimeout(function () {
      main.removeAttribute("inert");
      main.removeAttribute("aria-hidden");
      document.body.classList.remove("locked");
      document.body.classList.add("is-open");
      window.scrollTo(0, 0);
      if (music.ok) music.btn.hidden = false;
      $("#heroTitle").focus({ preventScroll: true });
      A.observeReveals();
    }, wait + (A.reduceMotion ? 0 : 1000));
    setTimeout(function () { intro.hidden = true; dust.stop(); }, wait + (A.reduceMotion ? 50 : 1900));
  }

  /* ---------------- scroll-linked motion ---------------- */
  function scrollFx() {
    if (A.reduceMotion) { document.documentElement.style.setProperty("--story-p", 1); return; }
    var story = $("#storyList"), banner = $(".gal__banner"), heroMotif = $(".hero__kolam"), ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight, r;
      r = story.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, (vh * 0.75 - r.top) / r.height));
      story.style.setProperty("--p", p.toFixed(3));
      r = banner.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) banner.style.setProperty("--py", ((r.top + r.height / 2 - vh / 2) * -0.07).toFixed(1) + "px");
      r = heroMotif.getBoundingClientRect();
      if (r.bottom > 0) heroMotif.style.setProperty("--rot", (window.scrollY * 0.04).toFixed(2) + "deg");
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  function finaleFx() {
    var fin = $("#finale"), finDust = new A.Dust($(".finale__dust"), window.innerWidth < 600 ? 22 : 36), petals = false;
    if (!("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) {
          finDust.resize(); finDust.start();
          if (!petals) { petals = true; A.jasmineRain($(".finale__petals"), window.innerWidth < 600 ? 8 : 12); }
        } else finDust.stop();
      });
    }, { threshold: 0.05 }).observe(fin);
  }

  /* ---------------- boot ---------------- */
  function boot() {
    bindContent();
    A.Art.hydrate();
    $$("[data-thoranam]").forEach(A.Art.mountThoranam);
    A.FX.init();
    setupMusic();

    countdown = new window.Countdown($("#countdown"), C.wedding.dateISO);
    card = new window.ScratchCard($("#scratch"), { threshold: C.scratch.threshold, onReveal: onDateRevealed });
    var remembered = C.scratch.rememberReveal && store(STORE_KEY) === "1";
    card.start(remembered);

    $("#scratchAlt").addEventListener("click", function () { card.reveal(true); });
    $$("[data-goto-scratch]").forEach(function (b) {
      b.addEventListener("click", function () { $("#reveal").scrollIntoView({ behavior: A.reduceMotion ? "auto" : "smooth", block: "center" }); });
    });

    new window.Gallery($("#gallery"), C);
    $(".open-btn").addEventListener("click", openInvitation);
    playIntro();
    scrollFx();
    finaleFx();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
