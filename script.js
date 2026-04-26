/* ==========================================================
   AI Workshop Companion — main script
   - Hash router (#/, #/images, #/canvas, #/gems)
   - Renders track sections from content.js
   - Copy-prompt buttons
   - Idea filters (subject + grade)
   - Toast notifications
   ========================================================== */

(function () {
  "use strict";

  // -------- DOM helpers --------
  const $ = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.from(scope.querySelectorAll(sel));
  const escapeHTML = (str) =>
    String(str ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  // -------- Toast --------
  let toastTimer;
  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }

  // -------- Render a track --------
  function renderTrack(routeKey, data) {
    const section = document.querySelector(`.route[data-route="/${routeKey}"]`);
    if (!section || section.dataset.rendered === "true") return;

    const metaPills = data.meta
      .map(
        (m) =>
          `<span class="meta-pill ${m.accent ? "meta-pill--accent" : ""}">${escapeHTML(m.text)}</span>`
      )
      .join("");

    const facts = data.intro.facts
      .map(
        (f) => `
        <div class="fact">
          <div class="fact__label">${escapeHTML(f.label)}</div>
          <div class="fact__value">${escapeHTML(f.value)}</div>
        </div>`
      )
      .join("");

    const introParagraphs = data.intro.paragraphs
      .map((p) => `<p>${p}</p>`)
      .join("");

    const steps = data.steps
      .map((step, idx) => {
        const promptHTML = step.prompt
          ? `
            <div class="prompt-box">
              <div class="prompt-box__label">פרומפט מומלץ להעתקה</div>
              <div class="prompt-box__text">${escapeHTML(step.prompt)}</div>
              <button type="button" class="prompt-box__copy" data-copy="${escapeHTML(step.prompt)}" aria-label="העתק פרומפט">
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
                </svg>
                <span>העתק</span>
              </button>
            </div>`
          : "";

        const tipHTML = step.tip ? `<div class="tip">${step.tip}</div>` : "";

        return `
        <li class="step">
          <div class="step__num" aria-hidden="true"></div>
          <div class="step__body">
            <h3 class="step__title">${escapeHTML(step.title)}</h3>
            <div class="step__text">${step.text}</div>
            ${promptHTML}
            ${tipHTML}
          </div>
        </li>`;
      })
      .join("");

    // Collect unique subjects + grades for filter chips
    const subjects = [...new Set(data.ideas.map((i) => i.subject))];
    const grades = [...new Set(data.ideas.flatMap((i) => i.grade))];

    const subjectChips = [
      `<button class="filter-chip is-active" data-filter="subject" data-value="all" type="button">הכל</button>`,
      ...subjects.map(
        (s) =>
          `<button class="filter-chip" data-filter="subject" data-value="${escapeHTML(s)}" type="button">${escapeHTML(s)}</button>`
      ),
    ].join("");

    const gradeChips = [
      `<button class="filter-chip is-active" data-filter="grade" data-value="all" type="button">כל השכבות</button>`,
      ...grades.map(
        (g) =>
          `<button class="filter-chip" data-filter="grade" data-value="${escapeHTML(g)}" type="button">${escapeHTML(g)}</button>`
      ),
    ].join("");

    const ideas = data.ideas
      .map((idea) => {
        const tags = [
          ...idea.grade.map(
            (g) => `<span class="idea__tag">${escapeHTML(g)}</span>`
          ),
          `<span class="idea__tag idea__tag--subject">${escapeHTML(idea.subject)}</span>`,
        ].join("");

        return `
        <article class="idea"
                 data-subject="${escapeHTML(idea.subject)}"
                 data-grades="${escapeHTML(idea.grade.join("|"))}">
          <div class="idea__tags">${tags}</div>
          <h3 class="idea__title">${escapeHTML(idea.title)}</h3>
          <p class="idea__desc">${escapeHTML(idea.desc)}</p>
          <div class="idea__prompt-box">
            <div class="idea__prompt-label">פרומפט מוכן להעתקה</div>
            <div class="idea__prompt-text">${escapeHTML(idea.prompt)}</div>
            <button type="button" class="prompt-box__copy idea__copy" data-copy="${escapeHTML(idea.prompt)}" aria-label="העתק פרומפט">
              <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16 1H4a2 2 0 00-2 2v14h2V3h12V1zm3 4H8a2 2 0 00-2 2v14a2 2 0 002 2h11a2 2 0 002-2V7a2 2 0 00-2-2zm0 16H8V7h11v14z" fill="currentColor"/>
              </svg>
              <span>העתק פרומפט</span>
            </button>
          </div>
        </article>`;
      })
      .join("");

    const sources = data.sources
      .map(
        (src) => `
        <a class="source-link" href="${src.url}" target="_blank" rel="noopener">
          <span>${escapeHTML(src.title)}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3z M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7z" fill="currentColor"/>
          </svg>
        </a>`
      )
      .join("");

    section.innerHTML = `
      <header class="track-header">
        <a href="#/" class="track-back">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>חזרה לבחירת מסלול</span>
        </a>
        <div class="track-eyebrow">${escapeHTML(data.eyebrow)}</div>
        <h1 class="track-title">
          ${escapeHTML(data.title)}
          <span class="track-title__sub">${escapeHTML(data.subtitle)}</span>
        </h1>
        <div class="track-meta">${metaPills}</div>
      </header>

      <section class="section-block" aria-labelledby="intro-${routeKey}">
        <header class="section-head">
          <span class="section-head__num">01</span>
          <h2 class="section-head__title" id="intro-${routeKey}">מה זה בכלל?</h2>
        </header>
        <div class="prose">${introParagraphs}</div>
        <div class="facts-grid">${facts}</div>
      </section>

      <section class="section-block" aria-labelledby="steps-${routeKey}">
        <header class="section-head">
          <span class="section-head__num">02</span>
          <h2 class="section-head__title" id="steps-${routeKey}">צעד אחר צעד — מתחילים</h2>
        </header>
        <ol class="steps">${steps}</ol>
      </section>

      <section class="section-block" aria-labelledby="ideas-${routeKey}">
        <header class="section-head">
          <span class="section-head__num">03</span>
          <h2 class="section-head__title" id="ideas-${routeKey}">רעיונות ליישום בכיתה</h2>
        </header>
        <div class="filters" role="group" aria-label="סינון לפי מקצוע">
          <span class="filters__label">מקצוע:</span>
          ${subjectChips}
        </div>
        <div class="filters" role="group" aria-label="סינון לפי שכבת גיל">
          <span class="filters__label">שכבה:</span>
          ${gradeChips}
        </div>
        <div class="ideas">
          ${ideas}
          <div class="no-results" hidden>אין רעיונות שמתאימים לסינון. נסו לבחור הכל.</div>
        </div>
      </section>

      <section class="section-block" aria-labelledby="sources-${routeKey}">
        <header class="section-head">
          <span class="section-head__num">04</span>
          <h2 class="section-head__title" id="sources-${routeKey}">מקורות והעמקה</h2>
        </header>
        <div class="sources">${sources}</div>
      </section>

      <div class="track-footer">
        <h3 class="track-footer__title">סיימתם? יופי. רוצים לחקור עוד?</h3>
        <p class="track-footer__sub">חזרו לבחור מסלול אחר. כל אחד עצמאי לחלוטין — ללא תלות.</p>
        <a href="#/" class="track-footer__cta">
          <span>חזרה לבחירת מסלול</span>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>
    `;

    section.dataset.rendered = "true";
    bindTrackInteractions(section);
  }

  // -------- Per-track interactions (after render) --------
  function bindTrackInteractions(section) {
    // Copy buttons
    $$(".prompt-box__copy", section).forEach((btn) => {
      btn.addEventListener("click", async () => {
        const text = btn.dataset.copy || "";
        try {
          await navigator.clipboard.writeText(text);
          btn.classList.add("is-copied");
          const labelEl = btn.querySelector("span");
          const original = labelEl.textContent;
          labelEl.textContent = "הועתק!";
          showToast("הפרומפט הועתק. תדביקו ב-ChatGPT / Gemini.");
          setTimeout(() => {
            btn.classList.remove("is-copied");
            labelEl.textContent = original;
          }, 1800);
        } catch (err) {
          showToast("לא הצלחתי להעתיק. תסמנו ידנית.");
        }
      });
    });

    // Filter state per section
    const state = { subject: "all", grade: "all" };

    $$(".filter-chip", section).forEach((chip) => {
      chip.addEventListener("click", () => {
        const filterType = chip.dataset.filter;
        const value = chip.dataset.value;

        // Update active state within the same group
        chip.parentElement
          .querySelectorAll(".filter-chip")
          .forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");

        state[filterType] = value;
        applyFilters(section, state);
      });
    });
  }

  function applyFilters(section, state) {
    const ideas = $$(".idea", section);
    let visibleCount = 0;
    ideas.forEach((idea) => {
      const subjMatch =
        state.subject === "all" || idea.dataset.subject === state.subject;
      const gradeMatch =
        state.grade === "all" ||
        idea.dataset.grades.split("|").includes(state.grade);

      const visible = subjMatch && gradeMatch;
      idea.style.display = visible ? "" : "none";
      if (visible) visibleCount++;
    });

    const noResults = $(".no-results", section);
    if (noResults) noResults.hidden = visibleCount > 0;
  }

  // -------- Router --------
  function renderRoute() {
    let route = (location.hash || "#/").replace(/^#/, "");
    if (!route || route === "/") route = "/";

    // Lazy-render track if first visit
    if (route === "/images") renderTrack("images", TRACKS.images);
    if (route === "/canvas") renderTrack("canvas", TRACKS.canvas);
    if (route === "/gems") renderTrack("gems", TRACKS.gems);

    // Show/hide
    $$(".route").forEach((el) => {
      const isMatch = el.dataset.route === route;
      el.hidden = !isMatch;
      el.classList.toggle("is-visible", isMatch);
    });

    // Update nav active state
    $$(".nav-link").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.route === route);
    });

    // Scroll to top, but only on hashchange (not initial load)
    if (window.__appBooted) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Update document title
    const titleMap = {
      "/": "סדנת AI למורים · חט\"ב אחד העם פתח תקווה",
      "/images": "ChatGPT Images 2.0 · סדנת AI",
      "/canvas": "Gemini Canvas · סדנת AI",
      "/gems": "Gemini Gems · סדנת AI",
    };
    document.title = titleMap[route] || titleMap["/"];
  }

  // -------- Boot --------
  window.addEventListener("hashchange", renderRoute);
  document.addEventListener("DOMContentLoaded", () => {
    renderRoute();
    window.__appBooted = true;
  });
})();
