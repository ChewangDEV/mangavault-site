
// ==========================
// 🔍 GET GENRE FROM URL
// ==========================
const params = new URLSearchParams(window.location.search);
let genre = params.get("type") || "action";

document.title = `${genre} Manga List | MangaVault`;

let currentPage = 1;
let filteredData = null;


// ==========================
// 📄 ITEMS PER PAGE
// ==========================
function getItemsPerPage(){
    return window.innerWidth <= 768 ? 10 : 30;
}


// ==========================
// 🎯 LOAD GENRE
// ==========================
function loadGenre(){
    const container = document.getElementById("genre-list");
    const title = document.getElementById("genre-title");

    if (!container || !title) return;

    const data = filteredData || mangaByGenre[genre];

    // ❌ no data
    if (!Array.isArray(data)) {
        title.textContent = "COMING SOON";
        container.innerHTML = "";
        return;
    }

    // ✅ title
    title.textContent = genre.toUpperCase();

    // ❌ no results
    if (data.length === 0) {
        container.innerHTML = "<p style='padding:20px'>No results found</p>";
        return;
    }

    const perPage = getItemsPerPage();
    const start = (currentPage - 1) * perPage;
    const pageItems = data.slice(start, start + perPage);

    container.innerHTML = "";

    pageItems.forEach(manga => {
        const div = document.createElement("div");
        div.classList.add("grid-item");

        div.innerHTML = `
        <a href="./eachManga.html?title=${encodeURIComponent(manga.title)}&genre=${encodeURIComponent(genre)}">
            <img src="${manga.img}" alt="${manga.title} manga cover" loading="lazy">
            <h3 class="card-name">${manga.title}</h3>
        </a>
    `;

        container.appendChild(div);
    });

    renderPagination(data.length, perPage);
}


// ==========================
// 🔢 PAGINATION
// ==========================
function renderPagination(total, perPage){
    const pagination = document.getElementById("pagination");
    if (!pagination) return;

    pagination.innerHTML = "";

    const pages = Math.ceil(total / perPage);

    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;

        if (i === currentPage) {
            btn.classList.add("active");
        }

        btn.onclick = () => {
            currentPage = i;
            loadGenre();
        };

        pagination.appendChild(btn);
    }
}


// ==========================
// 🔍 SEARCH (LIVE FILTER)
// ==========================
function setupSearch(){
    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const value = searchInput.value.toLowerCase();

        // reset search
        if (value === "") {
            filteredData = null;
            currentPage = 1;
            loadGenre();
            return;
        }

        filteredData = mangaByGenre[genre].filter(manga =>
            manga.title.toLowerCase().includes(value)
        );

        currentPage = 1;
        loadGenre();
    });
}


// ==========================
// 🚀 INIT
// ==========================
window.addEventListener("DOMContentLoaded", () => {
    setupSearch();
    loadGenre();

    document.getElementById("genre-name").textContent = genre;

    // 🔙 BACK BUTTON
    const backBtn = document.querySelector(".back-btn-genre");

    if (backBtn) {
        backBtn.addEventListener("click", () => {

            const fromDetail = localStorage.getItem("fromDetail");

            if (fromDetail === "true") {
                localStorage.removeItem("fromDetail");
                window.location.href = "./manga.html";
            } else {
                history.back();
            }
        });
    }
});

window.addEventListener("resize", () => {
    currentPage = 1;
    loadGenre();
});

