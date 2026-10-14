(() => {
  "use strict";
  const slides = [
    [
      "CLARITY IN VALUE. CONFIDENCE IN DECISIONS.",
      "Business valuation.",
      "Built for your next move.",
      "Know what a business is truly worth. Independent valuation and financial due diligence for mergers, acquisitions, and the decisions that shape your future.",
    ],
    [
      "LOOK BEYOND THE NUMBERS.",
      "Financial due diligence.",
      "A clearer picture of risk.",
      "Understand the earnings, cash flows, and financial realities behind a transaction. Turn complex information into a more informed investment decision.",
    ],
    [
      "FROM FIRST QUESTION TO NEXT CHAPTER.",
      "M&A decision support.",
      "Move forward with clarity.",
      "Bring a considered perspective to your next merger or acquisition. Connect business fundamentals, valuation assumptions, and the bigger transaction picture.",
    ],
  ];
  let current = 0,
    paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const one = (selector) => document.querySelector(selector);
  const all = (selector) => [...document.querySelectorAll(selector)];
  function setSlide(index) {
    current = (index + 3) % 3;
    ["eyebrow", "title", "accent", "copy"].forEach((name, i) => {
      one("[data-slide-" + name + "]").textContent = slides[current][i];
    });
    all("[data-slide-image]").forEach((el, i) => el.classList.toggle("active", i === current));
    all("[data-dot]").forEach((el, i) => {
      el.classList.toggle("active", i === current);
      el.setAttribute("aria-current", i === current ? "true" : "false");
    });
    one("[data-slide-count]").textContent = "0" + (current + 1) + " / 03";
  }
  const pauseIcon = one('[data-action="pause"]').innerHTML;
  function updatePause() {
    const el = one('[data-action="pause"]');
    el.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
    el.title = paused ? "Play slideshow" : "Pause slideshow";
    el.innerHTML = paused
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 5 12 7-12 7z"/></svg>'
      : pauseIcon;
  }
  all("[data-dot]").forEach((el) =>
    el.addEventListener("click", () => {
      setSlide(Number(el.dataset.dot));
      paused = true;
      updatePause();
    }),
  );
  one('[data-action="next"]').addEventListener("click", () => {
    setSlide(current + 1);
    paused = true;
    updatePause();
  });
  one('[data-action="prev"]').addEventListener("click", () => {
    setSlide(current - 1);
    paused = true;
    updatePause();
  });
  one('[data-action="pause"]').addEventListener("click", () => {
    paused = !paused;
    updatePause();
  });
  setInterval(() => {
    if (!paused && !document.hidden) setSlide(current + 1);
  }, 8000);
  setSlide(0);
  updatePause();
  one('[data-action="menu"]').addEventListener("click", () => {
    const nav = one("[data-nav]");
    nav.classList.toggle("open");
    one('[data-action="menu"]').setAttribute(
      "aria-expanded",
      String(nav.classList.contains("open")),
    );
  });
  all("[data-nav] a").forEach((a) =>
    a.addEventListener("click", () => {
      one("[data-nav]").classList.remove("open");
      one('[data-action="menu"]').setAttribute("aria-expanded", "false");
    }),
  );
  const counters = all("[data-counter]");
  counters.forEach((el) => (el.textContent = "00"));
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      function frame(now) {
        const p = matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 1
          : Math.min((now - start) / 1000, 1);
        counters.forEach(
          (el) =>
            (el.textContent = String(Math.round(Number(el.dataset.counter) * p)).padStart(2, "0")),
        );
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    },
    { threshold: 0.25 },
  );
  observer.observe(one(".stats"));
  const form = one("[data-inquiry-form]");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const text = [
      "ValPal consultation inquiry",
      ...["name", "email", "company", "service", "message"].map(
        (key) => key + ": " + (data.get(key) || ""),
      ),
    ].join("\n\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "ValPal-inquiry.txt";
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    one("[data-form-status]").textContent =
      "Your inquiry has been prepared and downloaded. It has not been sent.";
  });
  const backdrop = one("[data-offline-modal]");
  const content = one("[data-modal-content]");
  let previousFocus;
  function close() {
    backdrop.hidden = true;
    document.body.style.overflow = "";
    previousFocus?.focus();
  }
  one("[data-close-modal]").addEventListener("click", close);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  document.addEventListener("keydown", (e) => {
    if (backdrop.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "Tab") {
      const els = [...backdrop.querySelectorAll("button,input,a")];
      const first = els[0],
        last = els.at(-1);
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  const searchItems = [
    ["Overview", "Business valuation company audit independent advisory", "#overview"],
    [
      "Our expertise",
      "Valuation financial due diligence mergers acquisitions M&A services",
      "#expertise",
    ],
    ["Our approach", "Methods income market asset process", "#approach"],
    ["Frequently asked questions", "FAQ information timeline value company", "#faq"],
    ["Start a conversation", "Contact inquiry consultation transaction", "#contact"],
  ];
  const text = {
    login:
      "The client portal is not connected in this standalone website. No account credentials are collected. For access, prepare a request through our inquiry form.",
    signup:
      "Client registration is not connected in this standalone website. Begin by preparing an inquiry about your business and the support you need.",
    privacy:
      "This standalone website does not send form information or account credentials to a server. The inquiry form generates a text file on your device. No analytics or tracking cookies are used. A final company privacy policy should be provided before online data collection is enabled.",
    terms:
      "This website provides general information, not a valuation opinion, financial advice, or an offer of professional services. Engagement scope, fees, and confidentiality terms must be agreed separately. Online account access and inquiry delivery are not connected.",
  };
  ["search", "login", "signup", "privacy", "terms"].forEach((kind) =>
    one('[data-action="' + kind + '"]').addEventListener("click", () => {
      previousFocus = document.activeElement;
      backdrop.hidden = false;
      document.body.style.overflow = "hidden";
      one("#modal-title").textContent = {
        search: "Find your perspective",
        login: "Client access",
        signup: "Start with ValPal",
        privacy: "Privacy notice",
        terms: "Terms of use",
      }[kind];
      content.replaceChildren();
      if (kind === "search") {
        const input = document.createElement("input");
        input.className = "search-input";
        input.setAttribute("aria-label", "Search ValPal");
        input.placeholder = "Search services, valuation, FAQs…";
        const results = document.createElement("div");
        results.className = "search-results";
        content.append(input, results);
        function search() {
          results.replaceChildren();
          const matches = searchItems.filter((s) =>
            s.join(" ").toLowerCase().includes(input.value.toLowerCase()),
          );
          matches.forEach((s) => {
            const a = document.createElement("a");
            a.href = s[2];
            a.textContent = s[0] + " ↗";
            a.addEventListener("click", close);
            results.append(a);
          });
          if (!matches.length) {
            const p = document.createElement("p");
            p.textContent = "No matching sections. Try “valuation” or “contact”.";
            results.append(p);
          }
        }
        input.addEventListener("input", search);
        search();
      } else {
        const p = document.createElement("p");
        p.textContent = text[kind];
        const a = document.createElement("a");
        a.href = "#contact";
        a.className = "vp-button";
        a.textContent = "Start a conversation ↗";
        a.addEventListener("click", close);
        content.append(p, a);
      }
      one("[data-close-modal]").focus();
    }),
  );
})();
