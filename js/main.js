/* WOW Gym – Workout World
   Everything the gym may need to update lives in CONFIG below. */

const CONFIG = {
  whatsapp: "918796576868",
  phone: "+919821421657",
  timezone: "Asia/Kolkata",
  reviewUrl: "https://www.google.com/maps/search/?api=1&query=WOW+Gym+Workout+World+Shaheen+Bagh",
  // [open, close] in 24h "HH:MM", indexed Sunday = 0. Source: Mappls listing.
  hours: [
    ["12:00", "20:00"],
    ["05:00", "22:00"],
    ["05:00", "23:00"],
    ["05:00", "23:00"],
    ["05:00", "23:00"],
    ["05:00", "23:00"],
    ["05:00", "23:00"],
  ],
  // Set `price` to a number (₹) to show it; leave null to show "Ask for price".
  plans: [
    { name: "Monthly", duration: "30 days", price: null },
    { name: "Quarterly", duration: "90 days", price: null },
    { name: "Half-yearly", duration: "6 months", price: null, tag: "Popular" },
    { name: "Annual", duration: "12 months", price: null, tag: "Best value" },
  ],
  extras: [
    { name: "Personal training", note: "1-on-1 coaching, custom plan, form correction" },
    { name: "Zumba", note: "High-energy group dance cardio" },
    { name: "Yoga", note: "Mobility, flexibility and recovery" },
  ],
  heroWords: ["each day.", "each rep.", "at WOW."],
  kinetic: [
    ["Every rep.", "Every day."],
    ["One floor.", "No waiting."],
    ["Stronger.", "Together."],
  ],
  quotes: [
    ["The only bad workout is the one that didn't happen.", "Gym floor wisdom"],
    ["Discipline is the bridge between goals and accomplishment.", "Jim Rohn"],
    ["We are what we repeatedly do. Excellence, then, is not an act, but a habit.", "Will Durant"],
  ],
  // Gallery marquee: two rows, real WOW photos first
  gallery: [
    ["images/exterior-night.jpg", "The WOW signboard, Thokar No. 6"],
    ["images/member-flex.jpg", "Member on the floor"],
    ["images/smith-machine.jpg", "Smith machine zone"],
    ["images/member-training.jpg", "Back day at the rack"],
    ["images/exterior-day.jpg", "WOW Gym & Supplements Store"],
    ["images/stock-dumbbells.jpg", "Dumbbell racks"],
    ["images/stock-cardio.jpg", "Cardio deck"],
    ["images/stock-deadlift.jpg", "Pull day"],
    ["images/stock-curl.jpg", "Arms"],
    ["images/stock-pt.jpg", "Personal training"],
    ["images/stock-ropes.jpg", "Conditioning"],
    ["images/stock-squat.jpg", "Squat"],
    ["images/stock-rack.jpg", "Dumbbell rack"],
    ["images/stock-group.jpg", "Group class"],
  ],
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;
const arrow = '<svg><use href="#i-arrow" /></svg>';

function bindWhatsApp(root = document) {
  $$("[data-wa]", root).forEach((el) => {
    el.href = waLink(el.dataset.wa);
    el.target = "_blank";
    el.rel = "noopener";
  });
}

/* ---------- Theme ---------- */
function initTheme() {
  $("#theme-toggle").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("wow-theme", next); } catch (e) {}
  });
}

/* ---------- Header, drawer, scroll progress ---------- */
function initHeader() {
  const header = $("#header");
  const burger = $("#burger");
  const drawer = $("#drawer");
  const toTop = $("#to-top");
  const ring = $("#to-top-progress");
  const circumference = 2 * Math.PI * 22;

  const setDrawer = (open) => {
    burger.setAttribute("aria-expanded", open);
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", !open);
    header.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => setDrawer(!drawer.classList.contains("is-open")));
  $$("a", drawer).forEach((a) => a.addEventListener("click", () => setDrawer(false)));
  document.addEventListener("keydown", (e) => e.key === "Escape" && setDrawer(false));
  window.addEventListener("resize", () => window.innerWidth > 1080 && setDrawer(false));

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("is-scrolled", y > 40);
    toTop.classList.toggle("is-visible", y > 600);
    ring.style.strokeDashoffset = circumference * (1 - Math.min(y / max, 1));
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  // Highlight the nav link for the section in view
  const links = $$(".nav-pill a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${e.target.id}`));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  links.forEach((l) => { const s = $(l.getAttribute("href")); if (s) spy.observe(s); });
}

/* ---------- Hero: panel crossfade + rotating word ---------- */
function initHero() {
  const word = $("#rotating-word");
  const dots = $$(".hero__dots i");
  let w = 0;
  let set = 0;
  if (reducedMotion) return;

  setInterval(() => {
    const current = word.firstElementChild;
    current.className = "word-out";
    setTimeout(() => {
      w = (w + 1) % CONFIG.heroWords.length;
      word.innerHTML = `<span class="word-in">${CONFIG.heroWords[w]}</span>`;
    }, 450);
  }, 3000);

  setInterval(() => {
    set = (set + 1) % 2;
    $$(".hero__panel").forEach((p) => $$("img", p).forEach((img, i) => img.classList.toggle("is-active", i === set)));
    dots.forEach((d, i) => {
      d.classList.remove("is-active");
      void d.offsetWidth; // restart the fill animation
      d.classList.toggle("is-active", i === set);
    });
  }, 6000);
}

/* ---------- On our floor: collage + kinetic words ---------- */
function initFloor() {
  if (reducedMotion) return;
  const cols = $$(".floor__col");
  let tick = 0;
  setInterval(() => {
    const col = cols[tick % cols.length];
    $$("img", col).forEach((img) => img.classList.toggle("is-active"));
    tick++;
  }, 2200);

  const word = $(".kinetic__word");
  const count = $(".kinetic__count");
  let k = 0;
  setInterval(() => {
    word.classList.remove("is-in");
    word.classList.add("is-out");
    setTimeout(() => {
      k = (k + 1) % CONFIG.kinetic.length;
      const [a, b] = CONFIG.kinetic[k];
      word.innerHTML = `${a}<br /><b>${b}</b>`;
      count.textContent = String(k + 1).padStart(2, "0");
      word.classList.remove("is-out");
      word.classList.add("is-in");
    }, 500);
  }, 3200);
}

/* ---------- Scroll reveals ---------- */
function initReveal() {
  const targets = $$(".reveal, .reveal-group > *, .reveal-clip, .rule");
  if (reducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  targets.forEach((el) => io.observe(el));
}

/* ---------- Zones carousel ---------- */
function initCarousel(root) {
  const track = $(".carousel__track", root);
  const bar = $(".carousel__progress i", root);
  const toggle = $('[data-act="toggle"]', root);
  const delay = +root.dataset.autoplay || 4500;
  let timer = null;
  let paused = reducedMotion;

  const step = () => {
    const card = track.firstElementChild;
    return card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0);
  };
  const go = (dir) => {
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    const atStart = track.scrollLeft <= 8;
    if (dir > 0 && atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
    else track.scrollBy({ left: dir * step(), behavior: "smooth" });
  };
  const updateBar = () => {
    const visible = track.clientWidth / track.scrollWidth;
    const max = track.scrollWidth - track.clientWidth;
    const p = max > 0 ? track.scrollLeft / max : 0;
    bar.style.width = `${visible * 100}%`;
    bar.style.transform = `translateX(${p * (1 / visible - 1) * 100}%)`;
  };
  const start = () => { clearInterval(timer); if (!paused) timer = setInterval(() => go(1), delay); };
  const setPaused = (p) => {
    paused = p;
    root.classList.toggle("is-paused", p);
    toggle.setAttribute("aria-label", p ? "Play slideshow" : "Pause slideshow");
    start();
  };

  $('[data-act="next"]', root).addEventListener("click", () => { go(1); start(); });
  $('[data-act="prev"]', root).addEventListener("click", () => { go(-1); start(); });
  toggle.addEventListener("click", () => setPaused(!paused));
  track.addEventListener("scroll", () => requestAnimationFrame(updateBar), { passive: true });
  track.addEventListener("pointerenter", () => clearInterval(timer));
  track.addEventListener("pointerleave", start);
  track.addEventListener("touchstart", () => clearInterval(timer), { passive: true });
  window.addEventListener("resize", updateBar);

  // Only autoplay while the carousel is on screen
  new IntersectionObserver(([e]) => (e.isIntersecting ? start() : clearInterval(timer))).observe(root);
  setPaused(paused);
  updateBar();
}

/* ---------- Plans ---------- */
function renderPlans() {
  $("#plan-grid").innerHTML = CONFIG.plans.map((p) => {
    const msg = `Hi WOW Gym! Please share the price for the ${p.name} plan (${p.duration}).`;
    const price = p.price
      ? `<span class="plan__price">₹${p.price.toLocaleString("en-IN")}</span>`
      : `<span class="plan__ask">Ask for price</span>`;
    return `
      <a class="card glow-card plan" data-wa="${msg}">
        <span class="plan__name">${p.name}${p.tag ? `<span class="plan__tag">${p.tag}</span>` : ""}</span>
        ${price}
        <span class="plan__meta">${p.duration}</span>
        <span class="plan__link">Get price on WhatsApp ${arrow}</span>
      </a>`;
  }).join("");

  $("#extra-grid").innerHTML = CONFIG.extras.map((x) => `
    <a class="card extra" data-wa="Hi WOW Gym! I'd like details about ${x.name}.">
      <div><h3>${x.name}</h3><p>${x.note}</p></div>
      <span class="icon-btn">${arrow}</span>
    </a>`).join("");
}

/* ---------- Open / closed status ---------- */
function nowInGymTime() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CONFIG.timezone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { day, minutes: +get("hour") * 60 + +get("minute") };
}
const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
const fmt = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return `${h % 12 || 12}${m ? ":" + String(m).padStart(2, "0") : ""} ${h >= 12 ? "PM" : "AM"}`;
};

function renderStatus() {
  const { day, minutes } = nowInGymTime();
  const [open, close] = CONFIG.hours[day];
  const isOpen = minutes >= toMin(open) && minutes < toMin(close);
  let text;
  if (isOpen) text = `Open now · closes ${fmt(close)}`;
  else if (minutes < toMin(open)) text = `Closed · opens ${fmt(open)}`;
  else text = `Closed · opens ${fmt(CONFIG.hours[(day + 1) % 7][0])} tomorrow`;

  $$("[data-status]").forEach((el) => {
    el.classList.toggle("is-open", isOpen);
    el.classList.toggle("is-closed", !isOpen);
    $("[data-status-text]", el).textContent = text;
  });

  const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  $("#hours").innerHTML = [1, 2, 3, 4, 5, 6, 0]
    .map((d) => `<tr class="${d === day ? "is-today" : ""}"><td>${names[d]}</td><td>${fmt(CONFIG.hours[d][0])} – ${fmt(CONFIG.hours[d][1])}</td></tr>`)
    .join("");
}

/* ---------- BMI ---------- */
function initBMI() {
  const form = $("#bmi-form");
  let unit = "metric";

  $$(".seg__btn", form).forEach((btn) => btn.addEventListener("click", () => {
    unit = btn.dataset.unit;
    $$(".seg__btn", form).forEach((b) => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-pressed", b === btn); });
    $$(".fields", form).forEach((f) => (f.hidden = f.dataset.units !== unit));
  }));

  const bands = [
    { max: 18.5, label: "Underweight", color: "#38bdf8", goal: "Muscle gain", tip: "Focus on progressive strength training and a calorie surplus. A structured muscle-gain plan will help you build size safely." },
    { max: 25, label: "Healthy", color: "#22c55e", goal: "General fitness", tip: "You're in the healthy range. Build strength and conditioning to improve body composition and performance." },
    { max: 30, label: "Overweight", color: "#f59e0b", goal: "Fat loss", tip: "Strength training, cardio on our 20+ stations and a simple diet plan work best for steady fat loss." },
    { max: Infinity, label: "Obese", color: "#ef4444", goal: "Fat loss", tip: "Start with low-impact cardio and guided strength work. Personal training is recommended so a coach can pace your progress safely." },
  ];

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const n = (k) => parseFloat(data.get(k));
    const inputs = $$(`.fields[data-units="${unit}"] input`, form);
    inputs.forEach((i) => i.classList.remove("is-invalid"));

    const kg = unit === "metric" ? n("kg") : n("lb") * 0.453592;
    const m = unit === "metric" ? n("cm") / 100 : ((n("ft") || 0) * 12 + (n("in") || 0)) * 0.0254;
    if (!(kg > 20 && kg < 300) || !(m > 1 && m < 2.5)) {
      inputs.filter((i) => i.name !== "in").forEach((i) => i.classList.add("is-invalid"));
      return;
    }

    const bmi = kg / (m * m);
    const band = bands.find((b) => bmi < b.max);
    const pos = Math.min(Math.max(((bmi - 10) / 30) * 100, 2), 98); // gauge spans BMI 10–40

    $("#bmi-result").hidden = false;
    $("#bmi-value").textContent = bmi.toFixed(1);
    $("#bmi-cat").textContent = band.label;
    $("#bmi-cat").style.color = band.color;
    $("#bmi-tip").textContent = band.tip;
    requestAnimationFrame(() => ($("#bmi-marker").style.left = `${pos}%`));

    const cta = $("#bmi-cta");
    cta.dataset.wa = `Hi WOW Gym! My BMI is ${bmi.toFixed(1)} (${band.label}). I'm interested in a ${band.goal.toLowerCase()} plan.`;
    bindWhatsApp(cta.parentElement);
  });
}

/* ---------- Gallery marquee + lightbox ---------- */
function initGallery() {
  const rows = $$(".marquee__track");
  const half = Math.ceil(CONFIG.gallery.length / 2);
  const groups = [CONFIG.gallery.slice(0, half), CONFIG.gallery.slice(half)];

  rows.forEach((track, r) => {
    const items = groups[r];
    // Render the row twice so the -50% marquee loops seamlessly
    track.innerHTML = [...items, ...items].map(([src, cap], i) => `
      <button class="marquee__item" data-index="${CONFIG.gallery.indexOf(items[i % items.length])}" ${i >= items.length ? 'tabindex="-1" aria-hidden="true"' : ""} aria-label="Open photo: ${cap}">
        <img src="${src}" alt="${cap}" loading="lazy" />
      </button>`).join("");
  });

  const lb = $("#lightbox");
  const img = $("img", lb);
  const cap = $("figcaption", lb);
  let idx = 0;
  let lastFocus;

  const show = (i) => {
    idx = (i + CONFIG.gallery.length) % CONFIG.gallery.length;
    const [src, caption] = CONFIG.gallery[idx];
    img.src = src;
    img.alt = caption;
    cap.textContent = `${caption} · ${idx + 1} / ${CONFIG.gallery.length}`;
  };
  const open = (i) => {
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    show(i);
    $(".lightbox__close", lb).focus();
  };
  const close = () => {
    lb.hidden = true;
    document.body.style.overflow = "";
    lastFocus?.focus();
  };

  $("#gallery-marquee").addEventListener("click", (e) => {
    const item = e.target.closest(".marquee__item");
    if (item) open(+item.dataset.index);
  });
  $(".lightbox__close", lb).addEventListener("click", close);
  $(".lightbox__nav--prev", lb).addEventListener("click", () => show(idx - 1));
  $(".lightbox__nav--next", lb).addEventListener("click", () => show(idx + 1));
  lb.addEventListener("click", (e) => e.target === lb && close());
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });

  let x0 = null;
  lb.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
    x0 = null;
  });
}

/* ---------- Review QR ---------- */
function initQR() {
  const el = $("#qr");
  if (!el || typeof QRCode === "undefined") return;
  new QRCode(el, { text: CONFIG.reviewUrl, width: 152, height: 152, colorDark: "#0c0a09", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
}

/* ---------- FAQ accordion ---------- */
function initFAQ() {
  const items = $$("#faq-list .acc__item");
  items.forEach((item) => {
    $(".acc__q", item).addEventListener("click", () => {
      const open = !item.classList.contains("is-open");
      items.forEach((o) => {
        o.classList.toggle("is-open", o === item && open);
        $(".acc__q", o).setAttribute("aria-expanded", o === item && open);
      });
    });
  });
}

/* ---------- Floating "Need help?" panel ---------- */
function initHelp() {
  const btn = $("#enquire");
  const panel = $("#help");
  const toggle = (open = panel.hidden) => {
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", open);
  };
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggle();
  });
  $("#help-close").addEventListener("click", () => toggle(false));
  $$("[data-help-close], [data-wa]", panel).forEach((el) => el.addEventListener("click", () => toggle(false)));
  document.addEventListener("click", (e) => {
    if (!panel.hidden && !panel.contains(e.target)) toggle(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) toggle(false);
  });
}

/* ---------- Enquiry form → WhatsApp ---------- */
function initEnquiry() {
  const form = $("#enquiry");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = Object.fromEntries(new FormData(form));
    const lines = [
      "Hi WOW Gym! New enquiry from the website:",
      `Name: ${d.name}`,
      `Phone: ${d.phone}`,
      `Goal: ${d.goal}`,
      `Preferred time: ${d.time}`,
      d.msg && `Message: ${d.msg}`,
    ].filter(Boolean);
    window.open(waLink(lines.join("\n")), "_blank", "noopener");
    form.reset();
  });
}

/* ---------- Rotating quote, letters blur in ---------- */
function initQuote() {
  const section = $(".quote");
  const p = $("p", section);
  const cite = $("cite", section);
  let q = 0;

  const render = () => {
    const [text, author] = CONFIG.quotes[q];
    let n = 0;
    // Wrap each word so lines only break between words, then each letter for the stagger
    p.innerHTML = `“${text}”`.split(" ").map((word) =>
      `<span class="w">${[...word].map((ch) => `<span class="ch" style="animation-delay:${(n++) * 18}ms">${ch}</span>`).join("")}</span>`
    ).join(" ");
    cite.textContent = `— ${author}`;
  };
  render();
  if (reducedMotion) return;

  setInterval(() => {
    section.classList.add("is-leaving");
    setTimeout(() => {
      q = (q + 1) % CONFIG.quotes.length;
      section.classList.remove("is-leaving");
      render();
    }, 500);
  }, 7000);
}

/* ---------- Boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  renderPlans();
  bindWhatsApp();
  initTheme();
  initHeader();
  initHero();
  initFloor();
  initReveal();
  initCarousel($("#zones"));
  renderStatus();
  setInterval(renderStatus, 60_000);
  initBMI();
  initGallery();
  initQR();
  initFAQ();
  initHelp();
  initEnquiry();
  initQuote();
});
