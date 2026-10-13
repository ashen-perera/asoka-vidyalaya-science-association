const app = document.querySelector("#app");

const defaultEvents = [
  { id: "ev-1", title: "Science Day 2026", category: "Annual showcase", date: "2026-11-14", location: "Asoka Vidyalaya", description: "A day of experiments, inventions and big questions, brought to life by our students.", image: "https://images.unsplash.com/photo-1560785496-3c9d27877182?auto=format&fit=crop&w=1100&q=85" },
  { id: "ev-2", title: "Young Inventors Lab", category: "Workshop", date: "2026-11-28", location: "Science Laboratory", description: "Build, test and refine an idea with guidance from our science mentors.", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1100&q=85" },
  { id: "ev-3", title: "Astronomy Evening", category: "Field experience", date: "2026-12-12", location: "School grounds", description: "An evening under the stars with telescope observations and short talks.", image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1100&q=85" },
  { id: "ev-4", title: "Science Quiz Challenge", category: "Competition", date: "2026-08-22", location: "Main Hall", description: "Teams from across the school put their curiosity and quick thinking to the test.", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1100&q=85" },
];

const committee = [
  { name: "N. Jayawardena", role: "President", group: "Leadership", image: "photo-1500648767791-00dcc994a43e" },
  { name: "A. Fernando", role: "Vice President", group: "Leadership", image: "photo-1534528741775-53994a69daeb" },
  { name: "D. Perera", role: "Secretary", group: "Administration", image: "photo-1506794778202-cad84cf45f1d" },
  { name: "S. Wijesinghe", role: "Assistant Secretary", group: "Administration", image: "photo-1544005313-94ddf0286df2" },
  { name: "M. Silva", role: "Treasurer", group: "Finance", image: "photo-1501196354995-cbb51c65aaea" },
  { name: "T. Perera", role: "Editor", group: "Publications", image: "photo-1531123897727-8f129e1688ce" },
  { name: "R. Senanayake", role: "Organising Secretary", group: "Events", image: "photo-1507003211169-0a1dd7228f2d" },
  { name: "K. Gunawardena", role: "Committee Member", group: "Research", image: "photo-1534528741775-53994a69daeb" },
];

const defaultSiteContent = {
  schoolName: "Asoka Vidyalaya",
  societyName: "Science Society",
  crestText: "AV",
  logoImage: "",
  navHome: "Home",
  navEvents: "Events",
  navCommittee: "Committee",
  navMerchandise: "T-shirt",
  footerExploreTitle: "Explore",
  footerContactTitle: "Get in touch",
  footerEventsLink: "Events & news",
  footerCommitteeLink: "Our committee",
  footerMerchandiseLink: "Society T-shirt",
  heroEyebrow: "Asoka Vidyalaya · Colombo",
  heroTitle: "Curiosity is where everything begins.",
  heroDescription: "We are a community of young thinkers, makers and explorers. Together, we turn questions into experiments and ideas into action.",
  heroNote: "Learning beyond the classroom, since 1978",
  heroImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=2000&q=90",
  heroPrimaryLink: "Discover our events",
  heroSecondaryLink: "Meet the society",
  aboutLink: "Meet the people behind it",
  aboutLabel: "A little about us",
  aboutTitle: "Science is better when we explore it together.",
  aboutText: "The Asoka Vidyalaya Science Society brings students together around a shared sense of wonder. From lively demonstrations to thoughtful discussions, we make room for everyone to learn by doing.\n\nOur aim is simple: build confidence, nurture curiosity and make science part of everyday life.",
  aboutQuote: "The important thing is to never stop questioning.",
  aboutImage: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1100&q=85",
  newsLabel: "On the society calendar",
  newsTitle: "News & upcoming events",
  newsDescription: "Come along, get involved and see where a question can take you.",
  newsLink: "All events",
  homeQuote: "Tell me and I forget. Teach me and I remember. Involve me and I learn.",
  homeQuoteCredit: "Learning by doing",
  statOneTitle: "Curious",
  statOneCaption: "by nature",
  statTwoTitle: "One",
  statTwoCaption: "community",
  statThreeTitle: "∞",
  statThreeCaption: "questions",
  homeCtaTitle: "There’s always room for one more question.",
  homeCtaDescription: "Join us at our next event and find your people.",
  eventsLabel: "The society calendar",
  eventsTitle: "Events & discoveries",
  eventsDescription: "From hands-on workshops to the annual science showcase, there is always something worth gathering around.",
  eventsEmptyText: "New society events will be announced soon.",
  committeeLabel: "The people behind the questions",
  committeeTitle: "Meet the committee",
  committeeDescription: "A team of students working together to make science more collaborative, creative and fun for everyone at Asoka Vidyalaya.",
  committeeNote: "Committee portraits and names shown are sample profiles. Replace these with the current board’s approved details before publishing.",
  merchandiseLabel: "Society merchandise",
  merchandiseTitle: "Wear your curiosity.",
  merchandiseDescription: "A limited-run society T-shirt for experiments, events and every day in between. Reserve yours below.",
  productKicker: "The 2026 society tee",
  productTitle: "Made for curious minds.",
  productDescription: "Classic maroon, comfortable cotton and a small society crest. Place your pre-order and the committee will share collection details with your class.",
  productPrice: "2500",
  shirtColor: "#531f2d",
  shirtColorLabel: "Maroon · Cotton",
  priceNote: "per T-shirt · payment on collection",
  preorderFootnote: "This is a pre-order request, not an online payment. Please check your contact number before submitting.",
  sizeGuideLabel: "Size guide · body measurements",
  sizes: [
    { size: "S", chest: "36 in", length: "26 in" },
    { size: "M", chest: "38 in", length: "27 in" },
    { size: "L", chest: "40 in", length: "28 in" },
    { size: "XL", chest: "42 in", length: "29 in" },
    { size: "XXL", chest: "44 in", length: "30 in" },
  ],
  footerDescription: "Curiosity in action. A community of young minds exploring science, sharing ideas and building what comes next.",
  address: "Asoka Vidyalaya\nColombo, Sri Lanka",
  email: "science@asokavidyalaya.edu.lk",
};

function readStore(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

if (!localStorage.getItem("asoka-events")) writeStore("asoka-events", defaultEvents);
const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const getEvents = () => readStore("asoka-events", defaultEvents);
const getOrders = () => readStore("asoka-orders", []);
const getSiteContent = () => ({ ...defaultSiteContent, ...readStore("asoka-site-content", {}) });
const getCommittee = () => readStore("asoka-committee", committee.map((member, index) => ({ ...member, id: `member-${index + 1}` })));
const currentRoute = () => (location.hash.replace(/^#/, "") || "/").replace(/\/$/, "") || "/";

function imageUrl(value, fallback) {
  if (/^data:image\/(?:jpeg|png|webp);base64,/i.test(value || "")) return value;
  if (/^https:\/\//i.test(value || "")) return value;
  if (/^photo-[a-z0-9-]+$/i.test(value || "")) return `https://images.unsplash.com/${value}?auto=format&fit=crop&w=700&q=85`;
  return fallback;
}

async function imageFileData(file) {
  if (!file || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Choose a JPG, PNG, or WebP image.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Choose an image smaller than 8 MB.");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("Could not process that image.")), "image/jpeg", 0.82));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), { once: true });
    reader.addEventListener("error", () => reject(new Error("Could not read that image.")), { once: true });
    reader.readAsDataURL(blob);
  });
}

function attachImageUpload(form, fieldName, labelText) {
  const target = form.elements.namedItem(fieldName);
  if (!target) return;
  target.type = "text";
  target.placeholder = "https://… or choose an image below";
  const upload = document.createElement("div");
  upload.className = "field field-full photo-upload";
  const uploadId = `${form.getAttribute("id") || "editor"}-${fieldName}-upload`;
  upload.innerHTML = `<label for="${uploadId}">${escapeHtml(labelText)} upload</label><input id="${uploadId}" type="file" accept="image/jpeg,image/png,image/webp"><span class="photo-upload-status" role="status">JPG, PNG or WebP, up to 8 MB. Large images are resized for browser storage.</span><img alt="Selected image preview" loading="lazy">`;
  target.closest(".field").insertAdjacentElement("afterend", upload);
  const fileInput = upload.querySelector('input[type="file"]');
  const preview = upload.querySelector("img");
  const status = upload.querySelector(".photo-upload-status");
  const initialSource = imageUrl(target.value, "");
  if (initialSource) {
    preview.src = initialSource;
    preview.hidden = false;
  } else preview.hidden = true;
  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];
    if (!file) return;
    try {
      const data = await imageFileData(file);
      target.value = data;
      preview.src = data;
      preview.hidden = false;
      status.textContent = "Image ready. Save the form to publish it.";
    } catch (error) {
      fileInput.value = "";
      status.textContent = error.message;
    }
  });
}

function applySiteContent(route) {
  const content = getSiteContent();
  const setText = (selector, value) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  };
  document.querySelectorAll(".brand-copy strong").forEach((element) => { element.textContent = content.schoolName; });
  document.querySelectorAll(".brand-copy span").forEach((element) => { element.textContent = content.societyName; });
  setText(".footer-copy", content.footerDescription);
  document.querySelectorAll(".crest, .shirt-crest").forEach((element) => { element.textContent = content.crestText; });
  document.querySelectorAll(".brand .crest, .footer-brand .crest, .auth-panel > .crest").forEach((element) => {
    if (content.logoImage) {
      element.innerHTML = `<img src="${escapeHtml(imageUrl(content.logoImage, ""))}" alt="${escapeHtml(content.schoolName)} ${escapeHtml(content.societyName)} logo">`;
    } else element.textContent = content.crestText;
  });
  const navLabels = [content.navHome, content.navEvents, content.navCommittee, content.navMerchandise];
  document.querySelectorAll(".nav a").forEach((element, index) => { if (navLabels[index]) element.textContent = navLabels[index]; });
  const footerColumns = document.querySelectorAll(".footer-col");
  if (footerColumns[0]) {
    footerColumns[0].querySelector("h3").textContent = content.footerExploreTitle;
    [...footerColumns[0].querySelectorAll("a")].forEach((element, index) => {
      const labels = [content.footerEventsLink, content.footerCommitteeLink, content.footerMerchandiseLink];
      if (labels[index]) element.textContent = labels[index];
    });
  }
  if (footerColumns[1]) footerColumns[1].querySelector("h3").textContent = content.footerContactTitle;
  const footerAddress = document.querySelector(".footer-col:last-of-type p");
  if (footerAddress) footerAddress.textContent = content.address;
  const footerEmail = document.querySelector('.footer-col:last-of-type a[href^="mailto:"]');
  if (footerEmail) {
    footerEmail.href = `mailto:${content.email}`;
    footerEmail.textContent = content.email;
  }

  if (route === "/") {
    setText(".hero .hero-copy > .eyebrow", content.heroEyebrow);
    setText(".hero h1", content.heroTitle);
    setText(".hero .hero-copy > p", content.heroDescription);
    setText(".hero-note", content.heroNote);
    const heroLinks = document.querySelectorAll(".hero-actions a");
    if (heroLinks[0]) heroLinks[0].textContent = content.heroPrimaryLink;
    if (heroLinks[1]) heroLinks[1].textContent = content.heroSecondaryLink;
    setText(".intro-grid .section-head .eyebrow", content.aboutLabel);
    setText(".intro-grid .section-head h2", content.aboutTitle);
    setText(".intro-copy", content.aboutText);
    const aboutLink = document.querySelector(".intro-grid .text-link");
    if (aboutLink) aboutLink.textContent = content.aboutLink;
    setText(".intro-mark p", `“${content.aboutQuote}”`);
    setText(".paper-band .section-head .eyebrow", content.newsLabel);
    setText(".paper-band .section-head h2", content.newsTitle);
    setText(".paper-band .section-head p", content.newsDescription);
    const newsLink = document.querySelector(".paper-band .text-link");
    if (newsLink) newsLink.textContent = content.newsLink;
    setText(".quote-band blockquote", `“${content.homeQuote}”`);
    setText(".quote-band p", content.homeQuoteCredit);
    setText(".cta-strip h2", content.homeCtaTitle);
    setText(".cta-strip p", content.homeCtaDescription);
    const stats = document.querySelectorAll(".quote-band .stat");
    [[content.statOneTitle, content.statOneCaption], [content.statTwoTitle, content.statTwoCaption], [content.statThreeTitle, content.statThreeCaption]].forEach(([title, caption], index) => {
      if (stats[index]) {
        stats[index].querySelector("strong").textContent = title;
        stats[index].querySelector("span").textContent = caption;
      }
    });
    const heroImage = document.querySelector(".hero-photo");
    if (heroImage) heroImage.src = imageUrl(content.heroImage, defaultSiteContent.heroImage);
    const aboutImage = document.querySelector(".intro-mark");
    if (aboutImage) aboutImage.style.backgroundImage = `linear-gradient(135deg, rgba(49,20,29,.14), rgba(49,20,29,.72)), url("${imageUrl(content.aboutImage, defaultSiteContent.aboutImage)}")`;
  }

  if (route === "/events" || route === "/committee" || route === "/pre-order") {
    const pageContent = route === "/events"
      ? [content.eventsLabel, content.eventsTitle, content.eventsDescription]
      : route === "/committee"
        ? [content.committeeLabel, content.committeeTitle, content.committeeDescription]
        : [content.merchandiseLabel, content.merchandiseTitle, content.merchandiseDescription];
    setText(".page-intro .eyebrow", pageContent[0]);
    setText(".page-intro h1", pageContent[1]);
    setText(".page-intro p", pageContent[2]);
  }
  if (route === "/events") setText(".events-list > .muted", content.eventsEmptyText);

  if (route === "/committee") {
    const grid = document.querySelector(".members-grid");
    if (grid) grid.innerHTML = getCommittee().map((member) => `<article class="member-card reveal"><div class="member-photo"><img src="${escapeHtml(imageUrl(member.image, defaultEvents[0].image))}" alt="Portrait of ${escapeHtml(member.name)}" loading="lazy"></div><div class="member-info"><span>${escapeHtml(member.group)}</span><h3>${escapeHtml(member.name)}</h3><p>${escapeHtml(member.role)}</p></div></article>`).join("");
    setText(".committee-note", content.committeeNote);
  }

  if (route === "/pre-order") {
    setText(".product-kicker", content.productKicker);
    setText(".order-copy h2", content.productTitle);
    setText(".order-copy > p", content.productDescription);
    setText(".price-line strong", `LKR ${Number(content.productPrice || 0).toLocaleString("en-US")}`);
    setText(".price-line span", content.priceNote);
    setText(".order-copy > .eyebrow", content.sizeGuideLabel);
    setText(".form-footnote", content.preorderFootnote);
    const shirtCaption = document.querySelectorAll(".shirt-caption span");
    if (shirtCaption[0]) shirtCaption[0].textContent = content.societyName;
    if (shirtCaption[1]) shirtCaption[1].textContent = content.shirtColorLabel;
    const chartBody = document.querySelector(".size-chart tbody");
    const sizes = Array.isArray(content.sizes) ? content.sizes : defaultSiteContent.sizes;
    if (chartBody) chartBody.innerHTML = sizes.map((item) => `<tr><td>${escapeHtml(item.size)}</td><td>${escapeHtml(item.chest)}</td><td>${escapeHtml(item.length)}</td></tr>`).join("");
    const sizeSelect = document.querySelector("#size");
    if (sizeSelect) sizeSelect.innerHTML = `<option value="">Choose a size</option>${sizes.map((item) => `<option value="${escapeHtml(item.size)}">${escapeHtml(item.size)}</option>`).join("")}`;
    document.documentElement.style.setProperty("--shirt-color", content.shirtColor);
  }
}

function header(route) {
  const links = [
    ["/", "Home"], ["/events", "Events"], ["/committee", "Committee"], ["/pre-order", "T-shirt"], ["/admin/login", "Sign in"],
  ];
  return `<header class="site-header"><div class="shell header-inner">
    <a class="brand" href="#/" aria-label="Asoka Science Society home"><span class="crest">AV</span><span class="brand-copy"><strong>Asoka Vidyalaya</strong><span>Science Society</span></span></a>
    <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false">☰</button>
    <nav class="nav" aria-label="Main navigation">${links.map(([path, label]) => `<a href="#${path}" class="${route === path ? "active" : ""} ${path === "/pre-order" ? "nav-order" : ""}">${label}</a>`).join("")}</nav>
  </div></header>`;
}

function footer() {
  return `<footer class="site-footer"><div class="shell footer-main">
    <div><a class="footer-brand" href="#/"><span class="crest">AV</span><span class="brand-copy"><strong>Asoka Vidyalaya</strong><span>Science Society</span></span></a><p class="footer-copy">Curiosity in action. A community of young minds exploring science, sharing ideas and building what comes next.</p></div>
    <div class="footer-col"><h3>Explore</h3><a href="#/events">Events & news</a><a href="#/committee">Our committee</a><a href="#/pre-order">Society T-shirt</a></div>
    <div class="footer-col"><h3>Get in touch</h3><p>Asoka Vidyalaya<br />Colombo, Sri Lanka</p><a href="mailto:science@asokavidyalaya.edu.lk">science@asokavidyalaya.edu.lk</a></div>
  </div><div class="shell footer-bottom"><span>© ${new Date().getFullYear()} Asoka Vidyalaya Science Society</span><a href="#/admin/login">Society admin</a></div></footer>`;
}

function eventCard(event) {
  const date = new Date(`${event.date}T12:00:00`);
  const day = Number.isNaN(date.getTime()) ? "--" : date.toLocaleDateString("en", { day: "2-digit" });
  const month = Number.isNaN(date.getTime()) ? "TBA" : date.toLocaleDateString("en", { month: "short" });
  return `<article class="event-card reveal"><div class="event-image"><img src="${escapeHtml(imageUrl(event.image, defaultEvents[0].image))}" alt="" loading="lazy"><div class="event-date"><strong>${day}</strong><span>${month}</span></div></div><div class="event-body"><span class="event-category">${escapeHtml(event.category || "Society event")}</span><h3>${escapeHtml(event.title)}</h3><p>${escapeHtml(event.description)}</p><div class="event-meta"><span>${date.toLocaleDateString("en", { month: "long", year: "numeric" })}</span><span>${escapeHtml(event.location || "Asoka Vidyalaya")}</span></div></div></article>`;
}

function pageIntro(eyebrow, title, copy) {
  return `<section class="page-intro"><div class="shell page-intro-inner"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1></div><p>${copy}</p></div></section>`;
}

function homePage() {
  const today = new Date().toISOString().slice(0, 10);
  const events = getEvents().filter((event) => event.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  return `<main>
    <section class="hero"><img class="hero-photo" src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=2000&q=90" alt="Students exploring a science laboratory" /><div class="hero-inner"><div class="hero-copy reveal"><span class="eyebrow">Asoka Vidyalaya · Colombo</span><h1>Curiosity is where <em>everything</em> begins.</h1><p>We are a community of young thinkers, makers and explorers. Together, we turn questions into experiments and ideas into action.</p><div class="hero-actions"><a class="button button-gold" href="#/events">Discover our events <span aria-hidden="true">↗</span></a><a class="button button-light" href="#/committee">Meet the society</a></div><div class="hero-note">Learning beyond the classroom, since 1978</div></div></div><div class="hero-seal" aria-hidden="true"><span>Observe<br />Question<br />Discover</span></div></section>
    <section class="section"><div class="shell intro-grid"><div><div class="section-head"><span class="eyebrow">A little about us</span><h2>Science is better<br />when we explore it together.</h2></div><p class="intro-copy">The Asoka Vidyalaya Science Society brings students together around a shared sense of wonder. From lively demonstrations to thoughtful discussions, we make room for everyone to learn by doing.<br /><br /><strong>Our aim is simple:</strong> build confidence, nurture curiosity and make science part of everyday life.</p><a class="text-link" href="#/committee" style="margin-top:20px">Meet the people behind it <span aria-hidden="true">→</span></a></div><div class="intro-mark"><p>“The important thing is to never stop questioning.”</p></div></div></section>
    <section class="section paper-band"><div class="shell"><div class="section-head"><div><span class="eyebrow">On the society calendar</span><h2>News & upcoming events</h2><p>Come along, get involved and see where a question can take you.</p></div><a class="text-link" href="#/events">All events <span aria-hidden="true">→</span></a></div><div class="event-grid">${events.map(eventCard).join("")}</div></div></section>
    <section class="quote-band"><div><blockquote>“Tell me and I forget. Teach me and I remember. Involve me and I learn.”</blockquote><p>Learning by doing</p></div><div><div class="stat-line"><div class="stat"><strong>Curious</strong><span>by nature</span></div><div class="stat"><strong>One</strong><span>community</span></div><div class="stat"><strong>∞</strong><span>questions</span></div></div></div></section>
    <section class="shell cta-strip"><div><h2>There’s always room for one more question.</h2><p>Join us at our next event and find your people.</p></div><a class="button" href="#/events">See what’s coming <span aria-hidden="true">→</span></a></section>
  </main>`;
}

function eventsPage() {
  const events = getEvents().slice().sort((a, b) => a.date.localeCompare(b.date));
  return `<main>${pageIntro("The society calendar", "Events & discoveries", "From hands-on workshops to the annual science showcase, there is always something worth gathering around.")}<section class="section"><div class="shell"><div class="events-list">${events.length ? events.map(eventCard).join("") : "<p class='muted'>New society events will be announced soon.</p>"}</div></div></section></main>`;
}

function committeePage() {
  return `<main>${pageIntro("The people behind the questions", "Meet the committee", "A team of students working together to make science more collaborative, creative and fun for everyone at Asoka Vidyalaya.")}<section class="section"><div class="shell"><div class="members-grid">${committee.map((member) => `<article class="member-card reveal"><div class="member-photo"><img src="https://images.unsplash.com/${member.image}?auto=format&fit=crop&w=700&q=85" alt="Portrait of ${member.name}" loading="lazy"></div><div class="member-info"><span>${member.group}</span><h3>${member.name}</h3><p>${member.role}</p></div></article>`).join("")}</div><div class="committee-note">Committee portraits and names shown are sample profiles. Replace these with the current board’s approved details before publishing.</div></div></section></main>`;
}

function preorderPage() {
  const success = sessionStorage.getItem("asoka-order-success");
  let profile = null;
  try { profile = JSON.parse(sessionStorage.getItem("asoka-account-profile") || "null"); } catch { profile = null; }
  return `<main class="preorder-page">
    <section class="preorder-card" aria-labelledby="preorder-title">
      <div class="preorder-heading">
        <span class="product-kicker eyebrow">The 2026 society tee</span>
        <h1 id="preorder-title">T-shirt pre-order</h1>
        <p>Asoka Vidyalaya Science Society · Annual Exhibition</p>
      </div>
      <div class="preorder-product">
        <strong>${escapeHtml(getSiteContent().productTitle)}</strong>
        <span>LKR ${Number(getSiteContent().productPrice || 0).toLocaleString("en-US")} · payment on collection</span>
      </div>
      ${success ? `<div class="success-panel" role="status" aria-live="polite">${escapeHtml(success)} The society committee will confirm collection details.</div>` : ""}
      <form id="order-form" aria-describedby="order-note">
        <div class="preorder-fields">
          <div class="field"><label for="student-name">Full name</label><input id="student-name" name="name" autocomplete="name" required maxlength="80" placeholder="Enter your full name" value="${escapeHtml(profile?.name || "")}"></div>
          <div class="field"><label for="admission">Admission number</label><input id="admission" name="admission" required maxlength="20" placeholder="Enter your admission number" value="${escapeHtml(profile?.admission || "")}"></div>
          <div class="field"><label for="grade">Grade / class</label><input id="grade" name="grade" required maxlength="30" placeholder="e.g. 12-M1" value="${escapeHtml(profile?.grade || "")}"></div>
          <div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" required readonly value="${escapeHtml(profile?.email || "")}" aria-describedby="email-hint"><span class="field-hint" id="email-hint">Your account email is used for this order.</span></div>
          <div class="field"><label for="phone">Phone number</label><input id="phone" name="phone" type="tel" autocomplete="tel" required pattern="[0-9+ ]{7,16}" maxlength="16" placeholder="07X XXX XXXX" aria-describedby="phone-hint" value="${escapeHtml(profile?.phone || "")}"><span class="field-hint" id="phone-hint">Use 7–16 characters: digits, spaces or +.</span></div>
          <div class="field"><label for="size">T-shirt size</label><select id="size" name="size" required><option value="">Choose a size</option>${getSiteContent().sizes.map((item) => `<option value="${escapeHtml(item.size)}">${escapeHtml(item.size)}</option>`).join("")}</select></div>
          <div class="field"><label for="quantity">Quantity</label><input id="quantity" name="quantity" type="number" min="1" max="10" step="1" value="1" required></div>
          <div class="field field-full"><label for="payment-slip">Payment slip</label><input id="payment-slip" name="paymentSlip" type="file" accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf" aria-describedby="payment-slip-hint" required><span class="field-hint" id="payment-slip-hint">JPG, PNG, WEBP, or PDF. Maximum 5 MB. Your slip is stored privately.</span></div>
        </div>
        <p class="form-footnote" id="order-note">This is a pre-order request, not an online payment. Please check your contact number before submitting.</p>
        <p class="form-status" id="order-status" role="status" aria-live="polite" aria-atomic="true"></p>
        <button class="button preorder-submit" type="submit">Place pre-order</button>
      </form>
    </section>
  </main>`;
}

function loginPage() {
  return `<main class="auth-wrap"><section class="auth-panel"><span class="crest">AV</span><span class="eyebrow">Society account</span><h1>Welcome back.</h1><p>Sign in to continue. New student and admin accounts require approval.</p><div id="auth-message" class="auth-message" role="status" hidden></div><div id="login-error" class="auth-error" role="alert" hidden></div><form id="login-form"><div class="form-grid"><div class="field field-full"><label for="admin-email">Email address</label><input id="admin-email" name="email" type="email" autocomplete="username" required placeholder="Enter your email"></div><div class="field field-full"><label for="admin-password">Password</label><input id="admin-password" name="password" type="password" autocomplete="current-password" required placeholder="Enter password"></div><div class="field field-full"><button class="button" type="submit">Sign in <span aria-hidden="true">→</span></button></div></div></form><p class="auth-switch">Need an account? <a href="#/register">Register as a student or admin</a></p></section></main>`;
}

function registerPage() {
  return `<main class="auth-wrap"><section class="auth-panel"><span class="crest">AV</span><span class="eyebrow">Society account</span><h1>Request an account.</h1><p>All student and admin accounts need approval from the main administrator.</p><div id="auth-message" class="auth-message" role="status" hidden></div><div id="register-error" class="auth-error" role="alert" hidden></div><form id="register-form"><div class="form-grid"><div class="field field-full"><label for="register-role">Account type</label><select id="register-role" name="role" required><option value="student">Student</option><option value="admin">Society admin</option><option value="main_admin" hidden>Main administrator</option></select></div><div class="field field-full"><label for="register-name">Full name</label><input id="register-name" name="name" autocomplete="name" required maxlength="80"></div><div class="field field-full"><label for="register-email">Email address</label><input id="register-email" name="email" type="email" autocomplete="email" required></div><div class="field field-full"><label for="register-password">Password</label><input id="register-password" name="password" type="password" autocomplete="new-password" minlength="8" required></div><div class="field field-full student-fields"><label for="register-admission">Admission number</label><input id="register-admission" name="admission" maxlength="20"></div><div class="field student-fields"><label for="register-grade">Grade / class</label><input id="register-grade" name="grade" maxlength="30"></div><div class="field student-fields"><label for="register-phone">Phone number</label><input id="register-phone" name="phone" type="tel" maxlength="16"></div><div class="field field-full"><button class="button" type="submit">Submit registration <span aria-hidden="true">→</span></button></div></div></form><p class="auth-switch">Already registered? <a href="#/admin/login">Sign in</a></p></section></main>`;
}

function applyAccountGate(route) {
  if (route !== "/pre-order") return;
  const page = document.querySelector(".preorder-page");
  if (!page) return;
  let profile = null;
  try { profile = JSON.parse(sessionStorage.getItem("asoka-account-profile") || "null"); } catch { profile = null; }
  const localDemoEnabled = window.asokaLocalDemoMode === true;
  const approvedStudent = window.asokaFirebaseConfigured === true &&
    profile?.status === "approved" &&
    profile?.role === "student" &&
    !localDemoEnabled;
  if (!approvedStudent) {
    const message = !window.asokaFirebaseConfigured || localDemoEnabled
      ? "Pre-orders require an approved Firebase student account and the connected order server."
      : profile ? "Only approved student accounts can place a pre-order." : "Sign in with an approved student account to place a pre-order.";
    page.innerHTML = `<section class="preorder-card account-gate"><span class="eyebrow">Student account required</span><h1>Pre-orders are for approved students.</h1><p>${message}</p><div class="hero-actions"><a class="button" href="#/admin/login">Sign in</a><a class="button button-light" href="#/register">Register</a></div></section>`;
    return;
  }
  const form = document.querySelector("#order-form");
  if (!form) return;
  for (const name of ["name", "admission", "grade", "phone", "email"]) {
    const input = form.elements.namedItem(name);
    if (input) input.value = profile[name] || "";
  }
}

function dashboardPage() {
  let profile = null;
  try { profile = JSON.parse(sessionStorage.getItem("asoka-account-profile") || "null"); } catch { profile = null; }
  const localDemoEnabled = window.asokaLocalDemoMode === true;
  if ((!window.asokaFirebaseConfigured && !localDemoEnabled) || sessionStorage.getItem("asoka-admin-auth") !== "true" || profile?.status !== "approved" || !["admin", "main_admin"].includes(profile?.role)) {
    location.hash = "/admin/login";
    return "";
  }
  const orders = getOrders();
  const events = getEvents().slice().sort((a, b) => a.date.localeCompare(b.date));
  const upcoming = events.filter((event) => event.date >= new Date().toISOString().slice(0, 10)).length;
  return `<main class="shell dashboard" aria-labelledby="dashboard-title">
    <div class="dashboard-top">
      <div><span class="eyebrow">Society administration</span><h1 id="dashboard-title">Admin dashboard</h1><p>Pre-orders and upcoming events, in one place.</p><span class="dashboard-account">${escapeHtml(profile?.email || "")}</span></div>
      <button class="button button-small" id="logout-button" type="button">Sign out</button>
    </div>
    <section class="dashboard-stats" aria-label="Dashboard summary">
      <div class="dashboard-stat"><span>Total T-shirt pre-orders</span><strong>${orders.length}</strong></div>
      <div class="dashboard-stat"><span>Events on calendar</span><strong>${events.length}</strong></div>
      <div class="dashboard-stat"><span>Upcoming events</span><strong>${upcoming}</strong></div>
    </section>
    <div class="admin-grid">
      <section class="admin-panel" aria-labelledby="orders-title">
        <div class="admin-panel-head"><h2 id="orders-title">Pre-orders</h2><span class="eyebrow">${orders.length} total</span></div>
        <div class="filter-row">
          <label class="filter-field" for="filter-size"><span>Filter by size</span><select id="filter-size"><option value="">All sizes</option>${["S", "M", "L", "XL", "XXL"].map((size) => `<option value="${size}">${size}</option>`).join("")}</select></label>
          <label class="filter-field" for="filter-grade"><span>Filter by grade or class</span><select id="filter-grade"><option value="">All grades / classes</option>${Array.from(new Set(orders.map((order) => order.grade))).sort().map((grade) => `<option value="${escapeHtml(grade)}">${escapeHtml(grade)}</option>`).join("")}</select></label>
        </div>
        <p id="orders-status" class="table-status" role="status" aria-live="polite" aria-atomic="true">${orders.length ? `Showing ${orders.length} pre-orders.` : "No pre-orders to display."}</p>
        <div class="table-wrap" role="region" aria-label="T-shirt pre-orders" tabindex="0">
          <table class="data-table">
            <caption class="sr-only">T-shirt pre-orders</caption>
            <thead><tr><th scope="col">Student</th><th scope="col">Admission</th><th scope="col">Grade / class</th><th scope="col">Phone</th><th scope="col">Size</th><th scope="col">Email</th><th scope="col">Quantity</th><th scope="col">Payment slip</th></tr></thead>
            <tbody id="orders-body">${orders.length ? orders.slice().reverse().map((order) => `<tr data-size="${escapeHtml(order.size)}" data-grade="${escapeHtml(order.grade)}"><th scope="row">${escapeHtml(order.name)}</th><td>${escapeHtml(order.admission)}</td><td>${escapeHtml(order.grade)}</td><td>${escapeHtml(order.phone)}</td><td>${escapeHtml(order.size)}</td><td>${escapeHtml(order.email || "—")}</td><td>${escapeHtml(order.quantity || 1)}</td><td>${order.paymentSlip ? `<button type="button" data-download-slip="${escapeHtml(order.id)}" aria-label="Download payment slip for ${escapeHtml(order.name)}">Download</button>` : "—"}</td></tr>`).join("") : `<tr><td colspan="8" class="empty-table">No pre-orders yet. New requests will appear here.</td></tr>`}</tbody>
          </table>
        </div>
      </section>
      <section class="admin-panel" aria-labelledby="events-admin-title">
        <div class="admin-panel-head"><h2 id="events-admin-title">Manage events</h2><span class="eyebrow">${events.length} listed</span></div>
        <form class="admin-form" id="event-form"><input type="hidden" name="id"><div class="field"><label for="event-title">Event title</label><input id="event-title" name="title" required maxlength="90" placeholder="e.g. Science Day"></div><div class="field"><label for="event-category">Category</label><input id="event-category" name="category" maxlength="40" placeholder="Workshop, showcase…"></div><div class="field"><label for="event-date">Date</label><input id="event-date" name="date" type="date" required></div><div class="field"><label for="event-location">Location</label><input id="event-location" name="location" required maxlength="80" placeholder="School hall"></div><div class="field"><label for="event-description">Short description</label><input id="event-description" name="description" required maxlength="180" placeholder="What will happen?"></div><button class="button button-small" type="submit" id="event-submit">Add event</button></form>
        <div class="managed-events">${events.map((event) => `<div class="managed-event"><div><strong>${escapeHtml(event.title)}</strong><span>${escapeHtml(event.date)} · ${escapeHtml(event.location)}</span></div><div class="managed-actions"><button type="button" data-edit-event="${escapeHtml(event.id)}">Edit</button><button type="button" data-delete-event="${escapeHtml(event.id)}" aria-label="Delete ${escapeHtml(event.title)}">Delete</button></div></div>`).join("")}</div>
        <div class="admin-hint">Event and order data is stored in this browser only. It is not shared across devices.</div>
      </section>
    </div>
  </main>`;
}

function render() {
  const route = currentRoute();
  app.dataset.page = route;
  let content;
  if (route === "/events") content = eventsPage();
  else if (route === "/committee") content = committeePage();
  else if (route === "/pre-order") content = preorderPage();
  else if (route === "/admin/login") content = loginPage();
  else if (route === "/register") content = registerPage();
  else if (route === "/admin/dashboard") content = dashboardPage();
  else content = homePage();
  app.innerHTML = `${header(route)}${content}${footer()}`;
  applySiteContent(route);
  applyAccountGate(route);
  bindCommon();
  window.asokaBindAuthForms?.();
  if (route === "/pre-order" && document.querySelector("#order-form")) bindOrderForm();
  if (route === "/admin/dashboard" && sessionStorage.getItem("asoka-admin-auth") === "true") bindDashboard();
  window.scrollTo(0, 0);
}

function bindCommon() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => nav.classList.remove("is-open")));
}

function bindOrderForm() {
  document.querySelector("#order-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const order = Object.fromEntries(data.entries());
    const submitButton = form.querySelector('button[type="submit"]');
    const status = form.querySelector("#order-status");
    submitButton.disabled = true;
    submitButton.textContent = "Submitting…";
    status.textContent = "Submitting your pre-order and payment slip.";
    try {
      await window.asokaCreateOrder(new FormData(form));
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Confirm pre-order";
    }
  });
}

function bindDashboard() {
  const filterSize = document.querySelector("#filter-size");
  const filterGrade = document.querySelector("#filter-grade");
  const orderBody = document.querySelector("#orders-body");
  if (!filterSize || !filterGrade || !orderBody) return;
  const logoutButton = document.querySelector("#logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      if (window.asokaSignOut) {
        window.asokaSignOut();
        return;
      }
      sessionStorage.removeItem("asoka-admin-auth");
      sessionStorage.removeItem("asoka-account-profile");
      location.hash = "/admin/login";
    });
  }
  const availableSizes = getSiteContent().sizes.map((item) => item.size);
  filterSize.innerHTML = `<option value="">All sizes</option>${availableSizes.map((size) => `<option value="${escapeHtml(size)}">${escapeHtml(size)}</option>`).join("")}`;
  const filterOrders = () => {
    const size = filterSize.value;
    const grade = filterGrade.value;
    const rows = [...document.querySelectorAll("#orders-body tr[data-size]")];
    const visibleCount = rows.filter((row) => {
      const hidden = Boolean((size && row.dataset.size !== size) || (grade && row.dataset.grade !== grade));
      row.hidden = hidden;
      return !hidden;
    }).length;
    const status = document.querySelector("#orders-status");
    status.textContent = visibleCount
      ? `Showing ${visibleCount} of ${rows.length} pre-orders.`
      : "No pre-orders match the selected filters.";
  };
  filterSize.addEventListener("change", filterOrders);
  filterGrade.addEventListener("change", filterOrders);
  orderBody.querySelectorAll("[data-download-slip]").forEach((button) => {
    button.addEventListener("click", () => window.asokaDownloadPaymentSlip(button.dataset.downloadSlip));
  });
  const orderHeader = orderBody.closest("table").querySelector("thead tr");
  const actionsHeader = document.createElement("th");
  actionsHeader.textContent = "Actions";
  actionsHeader.scope = "col";
  orderHeader.append(actionsHeader);
  const emptyCell = orderBody.querySelector(".empty-table");
  if (emptyCell) emptyCell.colSpan = 9;
  const orderedOrders = getOrders().slice().reverse();
  orderBody.querySelectorAll("tr[data-size]").forEach((row, index) => {
    const order = orderedOrders[index];
    row.dataset.orderId = order.id;
    const actionsCell = row.insertCell();
    actionsCell.className = "order-actions";
    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => editOrderRow(row, order));
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete order for ${order.name}`);
    deleteButton.addEventListener("click", () => {
      if (window.asokaDeleteOrder) window.asokaDeleteOrder(order.id);
      writeStore("asoka-orders", getOrders().filter((item) => item.id !== order.id));
      render();
    });
    actionsCell.append(editButton, deleteButton);
  });
  const form = document.querySelector("#event-form");
  const imageField = document.createElement("div");
  imageField.className = "field";
  imageField.innerHTML = '<label for="event-image">Event photo URL</label><input id="event-image" name="image" type="url" placeholder="https://…">';
  form.insertBefore(imageField, form.querySelector("button"));
  attachImageUpload(form, "image", "Event photo");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    const events = getEvents();
    const previousEvent = events.find((item) => item.id === values.id);
    const eventRecord = { ...values, id: values.id || `ev-${Date.now()}`, image: imageUrl(values.image, previousEvent?.image || defaultEvents[0].image) };
    const existingIndex = events.findIndex((item) => item.id === values.id);
    if (existingIndex >= 0) events[existingIndex] = eventRecord;
    else events.push(eventRecord);
    writeStore("asoka-events", events);
    render();
  });
  document.querySelectorAll("[data-edit-event]").forEach((button) => button.addEventListener("click", () => {
    const eventRecord = getEvents().find((item) => item.id === button.dataset.editEvent);
    if (!eventRecord) return;
    Object.entries(eventRecord).forEach(([key, value]) => {
      const input = form.elements.namedItem(key);
      if (input) input.value = value;
    });
    document.querySelector("#event-submit").textContent = "Save changes";
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    form.elements.namedItem("title").focus();
  }));
  document.querySelectorAll("[data-delete-event]").forEach((button) => button.addEventListener("click", () => {
    writeStore("asoka-events", getEvents().filter((item) => item.id !== button.dataset.deleteEvent));
    render();
  }));
  bindWebsiteEditors();
}

function contentField(name, label, value, type = "text") {
  const id = `content-${name}`;
  if (type === "textarea") return `<div class="field"><label for="${id}">${label}</label><textarea id="${id}" name="${name}" rows="3" required>${escapeHtml(value)}</textarea></div>`;
  return `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${name}" type="${type}" value="${escapeHtml(value)}" required></div>`;
}

function bindWebsiteEditors() {
  const content = getSiteContent();
  const sizesText = content.sizes.map((item) => `${item.size}, ${item.chest}, ${item.length}`).join("\n");
  const siteFields = [
    ["schoolName", "School name"], ["societyName", "Society name"], ["crestText", "Logo mark"], ["logoImage", "Logo image URL", "url"],
    ["navHome", "Navigation: home"], ["navEvents", "Navigation: events"], ["navCommittee", "Navigation: committee"], ["navMerchandise", "Navigation: merchandise"],
    ["footerExploreTitle", "Footer: explore heading"], ["footerContactTitle", "Footer: contact heading"],
    ["footerEventsLink", "Footer: events link"], ["footerCommitteeLink", "Footer: committee link"], ["footerMerchandiseLink", "Footer: merchandise link"],
    ["heroEyebrow", "Home eyebrow"], ["heroTitle", "Home headline"], ["heroDescription", "Home introduction", "textarea"], ["heroNote", "Home note"], ["heroImage", "Home hero photo URL", "url"],
    ["heroPrimaryLink", "Home primary button"], ["heroSecondaryLink", "Home second button"],
    ["aboutLabel", "About label"], ["aboutTitle", "About heading"], ["aboutText", "About text", "textarea"], ["aboutQuote", "About quote"], ["aboutImage", "About photo URL", "url"],
    ["aboutLink", "About link label"],
    ["newsLabel", "News section label"], ["newsTitle", "News heading"], ["newsDescription", "News description", "textarea"],
    ["newsLink", "News section link"], ["homeQuote", "Home quote", "textarea"], ["homeQuoteCredit", "Quote attribution"],
    ["statOneTitle", "First home statistic"], ["statOneCaption", "First statistic caption"], ["statTwoTitle", "Second home statistic"], ["statTwoCaption", "Second statistic caption"], ["statThreeTitle", "Third home statistic"], ["statThreeCaption", "Third statistic caption"],
    ["homeCtaTitle", "Home call-to-action heading"], ["homeCtaDescription", "Home call-to-action text", "textarea"],
    ["eventsLabel", "Events page label"], ["eventsTitle", "Events page heading"], ["eventsDescription", "Events page introduction", "textarea"], ["eventsEmptyText", "Empty events message"],
    ["committeeLabel", "Committee page label"], ["committeeTitle", "Committee page heading"], ["committeeDescription", "Committee page introduction", "textarea"], ["committeeNote", "Committee note", "textarea"],
    ["footerDescription", "Footer description", "textarea"], ["address", "Footer address", "textarea"], ["email", "Contact email", "email"],
  ];
  const siteForm = `<form id="site-content-form" class="admin-form content-fields">${siteFields.map(([name, label, type]) => contentField(name, label, content[name], type || "text")).join("")}<button class="button button-small" type="submit">Save website text</button></form>`;
  const productForm = `<form id="product-content-form" class="admin-form content-fields">${[
    contentField("merchandiseLabel", "Merchandise page label", content.merchandiseLabel),
    contentField("merchandiseTitle", "Merchandise page heading", content.merchandiseTitle),
    contentField("merchandiseDescription", "Merchandise page introduction", content.merchandiseDescription, "textarea"),
    contentField("productKicker", "Product label", content.productKicker),
    contentField("productTitle", "Product heading", content.productTitle),
    contentField("productDescription", "Product description", content.productDescription, "textarea"),
    contentField("productPrice", "Price in LKR", content.productPrice, "number"),
    contentField("shirtColor", "T-shirt color", content.shirtColor, "color"),
    contentField("shirtColorLabel", "T-shirt color/material label", content.shirtColorLabel),
    contentField("priceNote", "Price note", content.priceNote),
    contentField("preorderFootnote", "Pre-order note", content.preorderFootnote, "textarea"),
    contentField("sizeGuideLabel", "Size guide label", content.sizeGuideLabel),
    contentField("sizesText", "Sizes: one size, chest, and length per line", sizesText, "textarea"),
  ].join("")}<button class="button button-small" type="submit">Save merchandise settings</button></form>`;
  const committeeForm = `<form id="committee-form" class="admin-form content-fields"><input name="id" type="hidden">${contentField("name", "Member name", "")}${contentField("role", "Role", "")}${contentField("group", "Committee group", "")}${contentField("image", "Portrait URL or Unsplash photo ID", "", "text")}<button class="button button-small" type="submit" id="committee-submit">Add member</button></form>`;
  const committeeList = getCommittee().map((member) => `<div class="managed-event"><div><strong>${escapeHtml(member.name)}</strong><span>${escapeHtml(member.role)} · ${escapeHtml(member.group)}</span></div><div class="managed-actions"><button type="button" data-edit-member="${escapeHtml(member.id)}">Edit</button><button type="button" data-delete-member="${escapeHtml(member.id)}" aria-label="Delete ${escapeHtml(member.name)}">Delete</button></div></div>`).join("");
  document.querySelector(".admin-grid").insertAdjacentHTML("afterend", `<section class="content-admin-grid"><details class="admin-panel" open><summary class="admin-panel-head"><h2>Website text & contact</h2><span class="eyebrow">Public pages</span></summary>${siteForm}</details><details class="admin-panel" open><summary class="admin-panel-head"><h2>Merchandise & sizing</h2><span class="eyebrow">Pre-order page</span></summary>${productForm}</details><section class="admin-panel"><div class="admin-panel-head"><h2>Committee profiles</h2><span class="eyebrow">${getCommittee().length} members</span></div>${committeeForm}<div class="managed-events">${committeeList || "<p class='admin-hint'>No committee profiles yet.</p>"}</div></section></section>`);
  const siteFormElement = document.querySelector("#site-content-form");
  siteFormElement.elements.namedItem("logoImage").required = false;
  attachImageUpload(siteFormElement, "logoImage", "Society logo");
  attachImageUpload(siteFormElement, "heroImage", "Home hero photo");
  attachImageUpload(siteFormElement, "aboutImage", "About section photo");
  const committeeFormElement = document.querySelector("#committee-form");
  attachImageUpload(committeeFormElement, "image", "Committee portrait");

  document.querySelector("#site-content-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const nextContent = { ...getSiteContent(), ...values };
    nextContent.logoImage = imageUrl(values.logoImage, "");
    nextContent.heroImage = imageUrl(values.heroImage, defaultSiteContent.heroImage);
    nextContent.aboutImage = imageUrl(values.aboutImage, defaultSiteContent.aboutImage);
    writeStore("asoka-site-content", nextContent);
    render();
  });
  document.querySelector("#product-content-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const sizes = values.sizesText.split(/\r?\n/).map((line) => line.split(",").map((part) => part.trim())).filter((parts) => parts.length === 3 && parts.every(Boolean)).map(([size, chest, length]) => ({ size, chest, length }));
    const nextContent = { ...getSiteContent(), ...values, productPrice: String(Math.max(0, Number(values.productPrice) || 0)), sizes: sizes.length ? sizes : defaultSiteContent.sizes };
    delete nextContent.sizesText;
    writeStore("asoka-site-content", nextContent);
    render();
  });
  const memberForm = document.querySelector("#committee-form");
  memberForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!memberForm.reportValidity()) return;
    const values = Object.fromEntries(new FormData(memberForm).entries());
    const members = getCommittee();
    const member = { ...values, id: values.id || `member-${Date.now()}` };
    member.image = imageUrl(values.image, committee[0].image);
    const index = members.findIndex((item) => item.id === values.id);
    if (index >= 0) members[index] = member;
    else members.push(member);
    writeStore("asoka-committee", members);
    render();
  });
  document.querySelectorAll("[data-edit-member]").forEach((button) => button.addEventListener("click", () => {
    const member = getCommittee().find((item) => item.id === button.dataset.editMember);
    if (!member) return;
    Object.entries(member).forEach(([name, value]) => {
      const input = memberForm.elements.namedItem(name);
      if (input) input.value = value;
    });
    document.querySelector("#committee-submit").textContent = "Save member";
    memberForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }));
  document.querySelectorAll("[data-delete-member]").forEach((button) => button.addEventListener("click", () => {
    writeStore("asoka-committee", getCommittee().filter((member) => member.id !== button.dataset.deleteMember));
    render();
  }));
}

function editOrderRow(row, order) {
  const fields = [
    ["name", "text", order.name],
    ["admission", "text", order.admission],
    ["grade", "text", order.grade],
    ["phone", "tel", order.phone],
  ];
  fields.forEach(([name, type, value], index) => {
    const input = document.createElement("input");
    input.className = "order-edit-input";
    input.type = type;
    input.name = name;
    input.value = value || "";
    input.required = true;
    row.cells[index].replaceChildren(input);
  });
  const sizeSelect = document.createElement("select");
  sizeSelect.className = "order-edit-input";
  sizeSelect.name = "size";
  const availableSizes = getSiteContent().sizes.map((item) => item.size);
  if (!availableSizes.includes(order.size)) availableSizes.unshift(order.size);
  availableSizes.forEach((size) => {
    const option = document.createElement("option");
    option.value = size;
    option.textContent = size;
    option.selected = order.size === size;
    sizeSelect.append(option);
  });
  row.cells[4].replaceChildren(sizeSelect);
  const actionsCell = row.cells[8];
  actionsCell.replaceChildren();
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.textContent = "Save";
  saveButton.addEventListener("click", () => {
    const inputs = [...row.querySelectorAll(".order-edit-input")];
    if (!inputs.every((input) => input.reportValidity())) return;
    const updatedOrder = Object.fromEntries(inputs.map((input) => [input.name, input.value.trim()]));
    writeStore("asoka-orders", getOrders().map((item) => item.id === order.id ? { ...item, ...updatedOrder } : item));
    if (window.asokaUpdateOrder) window.asokaUpdateOrder(order.id, updatedOrder);
    render();
  });
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", render);
  actionsCell.append(saveButton, cancelButton);
}

window.addEventListener("hashchange", render);
window.render = render;
window.currentRoute = currentRoute;
render();