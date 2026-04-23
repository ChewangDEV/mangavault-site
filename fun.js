/* =========================
   GLOBAL STATE
========================= */
let currentAnime = null;
let currentFilter = "all";

/* =========================
   ELEMENTS
========================= */
const display = document.getElementById("fact-content");
const titles = document.querySelectorAll(".title");
const randomBtn = document.getElementById("random-btn");

const filterBtn = document.getElementById("filter-btn");
const panel = document.getElementById("filter-panel");

/*==============================
   TOGGLE BUTTON MENU
==============================*/

const menuBtn = document.getElementById("menu-toggle");
const aside = document.querySelector("aside");

// TOGGLE MENU
if (menuBtn && aside) {
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    aside.classList.toggle("show");
    document.body.classList.toggle("menu-open");
  });
}

// OUTSIDE CLICK CLOSE
document.addEventListener("click", (e) => {
  // only run if menu is open
  if (!aside.classList.contains("show")) return;

  if (
    aside &&
    menuBtn &&
    !aside.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    aside.classList.remove("show");
    document.body.classList.remove("menu-open");
  }
});

/* =========================
   RANDOM FACT BUTTON
========================= */

if (randomBtn) {
  randomBtn.addEventListener("click", () => {
    let allFacts = [];

    // If anime selected → use that
    if (currentAnime && facts[currentAnime]) {
      allFacts = facts[currentAnime];
    } else {
      // Else → use all facts
      allFacts = Object.values(facts).flat();
    }

    // Safety check
    if (allFacts.length === 0) {
      display.innerHTML = `
                <div class="fact-card">
                    <h2>😅 No facts available</h2>
                </div>
            `;
      return;
    }

    const randomFact = allFacts[Math.floor(Math.random() * allFacts.length)];

    display.innerHTML = `
            <div class="fact-card">
                <h2>🎲 Random Fact</h2>
                <p> ${randomFact}</p>
            </div>
        `;
  });
}

/* =========================
   FILTER PANEL TOGGLE
========================= */
if (filterBtn && panel) {
  filterBtn.addEventListener("click", (e) => {
    e.preventDefault();

    panel.style.display = panel.style.display === "flex" ? "none" : "flex";
  });
}

/* =========================
   CLOSE PANEL ON OUTSIDE CLICK
========================= */
document.addEventListener("click", (e) => {
  if (
    panel &&
    !panel.contains(e.target) &&
    filterBtn &&
    !filterBtn.contains(e.target)
  ) {
    panel.style.display = "none";
  }
});

/* =========================
   FILTER CLICK HANDLER
========================= */
document.querySelectorAll(".filter-panel span").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (!currentAnime) {
      display.innerHTML = `
                <div class="fact-card">
                    <h2>⚠️ Select an anime first</h2>
                    <p>Choose from the sidebar to unlock facts</p>
                </div>
            `;
      return;
    }

    document
      .querySelectorAll(".filter-panel span")
      .forEach((b) => b.classList.remove("active"));

    btn.classList.add("active");

    currentFilter = btn.dataset.type;
    panel.style.display = "none";

    renderFacts();
  });
});

/* =========================
   RENDER FUNCTION
========================= */
function renderFacts() {
  if (!currentAnime) return;

  if (!facts[currentAnime]) {
    display.innerHTML = `
            <div class="fact-card">
                <h2>😅 No data available</h2>
            </div>
        `;
    return;
  }

  let animeFacts = facts[currentAnime];

  // Filter logic
  if (currentFilter !== "all") {
    const map = {
      dark: "🖤",
      romantic: "❤️",
      theory: "😈",
      hidden: "🧠",
      deep: "💀",
    };

    animeFacts = animeFacts.filter((f) => f.includes(map[currentFilter]));
  }

  // Empty state
  if (animeFacts.length === 0) {
    display.innerHTML = `
            <div class="fact-card">
                <h2>😅 No facts found</h2>
                <p>Try another filter</p>
            </div>
        `;
    return;
  }

  // Render facts
  display.innerHTML = `
        <div class="fact-card">
            <h2>🔥 ${currentAnime}</h2>
            <div class="facts-grid">
                ${animeFacts.map((f) => `<p>${f}</p>`).join("")}
            </div>
        </div>
    `;
}

/* =========================
   ANIME CLICK HANDLER
========================= */
titles.forEach((title) => {
  title.addEventListener("click", () => {
    // Active state
    titles.forEach((t) => t.classList.remove("active"));
    title.classList.add("active");

    // Reset filter UI
    document
      .querySelectorAll(".filter-panel span")
      .forEach((b) => b.classList.remove("active"));

    currentFilter = "all";

    // Hide random button
    if (randomBtn) randomBtn.style.display = "none";

    // Set anime + render
    currentAnime = title.textContent.trim();
    renderFacts();

    // 🔥 ADD THIS (IMPORTANT)
    aside.classList.remove("show");
    document.body.classList.remove("menu-open");
  });
});
