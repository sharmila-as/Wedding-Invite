/* ==========================================================================
   WEDDING CONFIGURATION — edit everything about the invitation here.
   Nothing else in the code needs to change for normal content updates.
   ========================================================================== */
window.WEDDING = {
  couple: {
    bride: "Sowmiya",
    groom: "Moorthi"
  },

  /* Main wedding moment. dateISO drives the countdown (IST = +05:30). */
  wedding: {
    dateISO: "2026-10-25T10:30:00+05:30",
    day: "25",
    month: "October",
    year: "2026",
    fullDate: "25 October 2026",
    time: "10:30 AM",
    timezone: "IST"
  },

  venue: {
    name: "VG MAHAL",
    address: "VG MAHAL, Sholavandan, Madurai, Tamil Nadu 625214",
    mapsUrl: "https://www.google.com/maps/dir//VG+MAHAL,+MDR568,+Tamil+Nadu+625214/@9.9088978,78.1022558,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3b00cb490b1a33d5:0x1bc6eb546325edc4!2m2!1d77.967936!2d10.0296624?entry=ttu&g_ep=EgoyMDI2MDkyNy4xIKXMDSoASAFQAw%3D%3D"
  },

  families: {
    bride: { label: "Bride's Family", tamil: "மணமகள் வீட்டார்", parents: "Raja & Kala" },
    groom: { label: "Groom's Family", tamil: "மணமகன் வீட்டார்", parents: "Murugan & Malliga" }
  },

  /* EVENTS — only confirmed events are shown.
     To add one later (e.g. an engagement), copy the template below,
     fill in real details and set confirmed: true.
     hideDateUntilReveal keeps the date secret until the scratch card is scratched. */
  events: [
    {
      id: "muhurtham",
      confirmed: true,
      title: "Muhurtham",
      tamil: "சுப முகூர்த்தம்",
      date: "25 October 2026",
      time: "10:30 AM",
      venue: "VG MAHAL",
      address: "VG MAHAL, Sholavandan, Madurai, Tamil Nadu 625214",
      mapsUrl: "https://www.google.com/maps/dir//VG+MAHAL,+MDR568,+Tamil+Nadu+625214/@9.9088978,78.1022558,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3b00cb490b1a33d5:0x1bc6eb546325edc4!2m2!1d77.967936!2d10.0296624?entry=ttu&g_ep=EgoyMDI2MDkyNy4xIKXMDSoASAFQAw%3D%3D",
      hideDateUntilReveal: true
    }
    /* ,{
      id: "engagement",
      confirmed: false,            // set true once confirmed
      title: "Engagement",
      tamil: "நிச்சயதார்த்தம்",
      date: "DD Month YYYY",
      time: "HH:MM AM/PM",
      venue: "Venue name",
      address: "Full address",
      mapsUrl: "https://maps.google.com/...",
      hideDateUntilReveal: false
    } */
  ],

  /* OUR STORY — placeholder lines. Replace text with the couple's own words. */
  story: [
    { title: "The Beginning",  text: "Every beautiful story starts with a single moment. Ours is waiting to be written here." },
    { title: "The Journey",    text: "Conversations, laughter and quiet understanding, the chapters that brought two hearts closer." },
    { title: "The Promise",    text: "With the blessings of our elders, a promise to walk every step of life together." },
    { title: "Forever Begins", text: "In the presence of family and friends, two lives become one beautiful beginning." }
  ],

  /* Photo shown in the opening reveal. w/h keep the original proportions. */
  heroPhoto: { src: "assets/images/couple-1.jpg", w: 956, h: 853, alt: "Sowmiya and Moorthi smiling together" },

  /* Full-width cinematic image at the top of the gallery. */
  galleryBanner: { src: "assets/images/couple-2.jpg", w: 1100, h: 797, alt: "Sowmiya and Moorthi, a portrait together" },

  /* Swipeable gallery. Add or remove photos freely. */
  gallery: [
    { src: "assets/images/bride-1.jpg",     w: 733, h: 1100, caption: "Sowmiya",  alt: "Sowmiya in a maroon silk saree and temple jewellery" },
    { src: "assets/images/groom-white.jpg", w: 847, h: 842,  caption: "Moorthi",  alt: "Moorthi in a white shirt, smiling" },
    { src: "assets/images/couple-1.jpg",    w: 956, h: 853,  caption: "Together", alt: "Sowmiya and Moorthi smiling together" },
    { src: "assets/images/bride-2.jpg",     w: 733, h: 1100, caption: "Sowmiya",  alt: "Sowmiya smiling, in a maroon and gold saree" },
    { src: "assets/images/groom-blue.jpg",  w: 825, h: 1100, caption: "Moorthi",  alt: "Moorthi in a blue striped shirt" }
  ],

  /* MUSIC — drop your licensed audio file in assets/audio/ and set src.
     Leave src empty ("") to hide the music button entirely.
     playOnOpen starts it softly only after the guest taps "Open Invitation". */
  music: {
    src: "assets/audio/Thodakkam mangalyam.mp3",
    title: "Mangalyam",
    playOnOpen: true,
    volume: 0.45
  },

  scratch: {
    threshold: 0.58,        // 0.55–0.65 of the card scratched = auto reveal
    rememberReveal: true    // returning guests see the date without re-scratching
  }
};
