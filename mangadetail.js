    document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(window.location.search);
    const title = params.get("title");

    if (!title) {
        document.getElementById("manga-title").textContent = "No Manga Selected";
        return;
    }

    const key = title.toLowerCase().replace(/\s+/g, "");

    let manga = null;

    // ✅ detailed data
    if (typeof mangaDetails !== "undefined") {
        manga = mangaDetails[key];
    }

    // ✅ fallback
    if (!manga && typeof mangaData !== "undefined") {
        manga = mangaData.find(m => m.title === title);
    }

    if (!manga) {
        document.getElementById("manga-title").textContent = "Manga Not Found";
        return;
    }

    // ✅ SAFE rendering
    document.getElementById("manga-title").textContent = manga.title;
    const imgEl = document.getElementById("manga-img");

    imgEl.src = manga.img;
    imgEl.alt = `${manga.title} manga cover by ${manga.author}`;

    document.getElementById("manga-desc").textContent = manga.desc || "No description available";
    document.getElementById("manga-author").textContent = manga.author || "Unknown";

    document.getElementById("manga-type").textContent = manga.type || "-";
    document.getElementById("manga-volumes").textContent = manga.volumes || "-";
    document.getElementById("manga-chapters").textContent = manga.chapters || "-";
    document.getElementById("manga-status").textContent = manga.status || "-";
    document.getElementById("manga-published").textContent = manga.published || "-";
    // theme
    if (manga.theme) {
        document.getElementById("manga-theme").textContent =
        Array.isArray(manga.theme) ? manga.theme.join(", ") : manga.theme;
    } else {
        document.getElementById("manga-theme").textContent = "-";
    }

    // serialization
    document.getElementById("manga-serialization").textContent =
    manga.serialization || "-";

    //rating
    const ratingEl = document.getElementById("manga-rating");

    if (ratingEl && manga.rating) {
        const rating = manga.rating / 2; // convert 10 → 5 scale
        const full = Math.floor(rating);
        const half = rating % 1 >= 0.5;
        const empty = 5 - full - (half ? 1 : 0);

        let stars = "";

        // full stars
        for (let i = 0; i < full; i++) {
            stars += '<span class="star full">★</span>';
        }

        // half star
        if (half) {
            stars += '<span class="star half">⯨</span>';
        }

        // empty stars
        for (let i = 0; i < empty; i++) {
            stars += '<span class="star empty">☆</span>';
        }

        ratingEl.innerHTML = `
        <div class="star-box">
            ${stars}
            <span class="score">${manga.rating}/10</span>
        </div>
        `;
    } 

    // genres
    if (manga.genres) {
        const box = document.getElementById("manga-genres");
        box.innerHTML = "";
        manga.genres.forEach(g => {
            const span = document.createElement("span");
            span.textContent = g;
            box.appendChild(span);
        });
    }

    // trailer
    if (manga.trailer) {
        const iframe = document.getElementById("manga-trailer");

        if (iframe && manga.trailer) {
            iframe.src = manga.trailer;
            iframe.setAttribute("title", `${manga.title} trailer`);
            iframe.setAttribute("allowfullscreen", "true");
            iframe.setAttribute("loading", "lazy");
        }
    }

    // watch links with logos
    if (manga.watch) {
        const list = document.getElementById("manga-sites");
        list.innerHTML = "";

        manga.watch.forEach(site => {
            const li = document.createElement("li");

            const a = document.createElement("a");
            a.href = site.url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.className = "watch-btn";

            const img = document.createElement("img");
            img.src = site.logo;
            img.alt = site.name;

            a.appendChild(img); // ✅ ONLY THIS

            li.appendChild(a);
            list.appendChild(li);
        });
    }

    // read links with logos
    if (manga.read) {
        const list = document.getElementById("manga-read");
        list.innerHTML = "";

        manga.read.forEach(site => {
            const li = document.createElement("li");

            const a = document.createElement("a");
            a.href = site.url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";

            const img = document.createElement("img");
            img.src = site.logo;
            img.alt = site.name;

            a.appendChild(img);
            li.appendChild(a);
            list.appendChild(li);
        });
    }

    // buy links with logos
    if (manga.buy) {
        const list = document.getElementById("manga-buy");
        list.innerHTML = "";

        manga.buy.forEach(site => {
            const li = document.createElement("li");

            const a = document.createElement("a");
            a.href = site.url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";

            const img = document.createElement("img");
            img.src = site.logo;
            img.alt = site.name;

            a.appendChild(img);
            li.appendChild(a);
            list.appendChild(li);
        });
    }

    // ==========================
    // 🔥 RELATED (SMART + RANDOM)
    // ==========================
    const relatedContainer = document.querySelector(".related-list");

    if (relatedContainer && manga && manga.genres) {

        const currentTitle = manga.title;
        const currentGenres = manga.genres;

        const allMangas = Object.values(mangaDetails);

        const related = allMangas
        .filter(m => m.title !== currentTitle)
        .map(m => {
            let score = 0;

            // 🎯 genre match
            m.genres.forEach(g => {
                if (currentGenres.includes(g)) score += 2;
            });

            // 🎯 theme match (optional boost)
            if (m.theme && manga.theme) {
                m.theme.forEach(t => {
                    if (manga.theme.includes(t)) score += 1;
                });
            }

            return { ...m, score };
        })
        .sort((a, b) => {
            // 🔥 primary: score
            if (b.score !== a.score) return b.score - a.score;

            // 🎲 secondary: randomness
            return Math.random() - 0.5;
        })
        .slice(0, 8);

        relatedContainer.innerHTML = "";

        related.forEach(m => {
            const div = document.createElement("div");
            div.classList.add("related-card");

            div.innerHTML = `
                <img src="${m.img}" alt="${m.title} manga cover by ${m.author}">
                <h4>${m.title}</h4>
            `;

            div.onclick = () => {

                const savedGenre = localStorage.getItem("lastGenre");
                const genreToUse = genreParam || savedGenre;
            
                if (genreToUse) {
                    window.location.href =
                    `eachManga.html?title=${encodeURIComponent(m.title)}&genre=${genreToUse}`;
                } else {
                    window.location.href =
                    `eachManga.html?title=${encodeURIComponent(m.title)}`;
                }
            };

            relatedContainer.appendChild(div);
        });
    }

    document.title = `${manga.title} Manga Review | MangaVault`;

    const meta = document.querySelector("meta[name='description']");
    if (meta) {
        meta.setAttribute(
            "content",
            `${manga.title} manga details, story, genres, rating, and where to read or watch.`
        );
    } 
    // 🔙 Back button → go to genre page
    const genreParam = params.get("genre");
    // 🔥 mark that user came from detail page
    if (!localStorage.getItem("fromDetail")) {
        localStorage.setItem("fromDetail", "true");
    }

    // 🔥 store genre when available
    if (genreParam) {
        localStorage.setItem("lastGenre", genreParam);
    } else {
        localStorage.removeItem("lastGenre");
    }
    
    const backBtn = document.querySelector(".back-btn");
    
    if (backBtn) {
        backBtn.addEventListener("click", () => {
    
            const savedGenre = localStorage.getItem("lastGenre");
    
            if (genreParam) {
                window.location.href = `genre.html?type=${genreParam}`;
            } else if (savedGenre) {
                window.location.href = `genre.html?type=${savedGenre}`;
            } else {
                window.location.href = "manga.html";
            }
    
        });
    }

     // 🔍 SEARCH SYSTEM
     const searchInput = document.getElementById("search-input-allmanga");
     const suggestionBox = document.getElementById("search-suggestions");
 
     if (searchInput && suggestionBox) {
 
         let timeout;
 
         searchInput.addEventListener("input", () => {
             clearTimeout(timeout);
 
             timeout = setTimeout(() => {
 
                 const value = searchInput.value.toLowerCase().trim();
                 suggestionBox.innerHTML = "";
 
                 if (!value) return;
 
                 let results = [];
 
                 for (let g in mangaByGenre) {
                     mangaByGenre[g].forEach(m => {
                         if (m.title.toLowerCase().includes(value)) {
                             results.push({ ...m, genre: g });
                         }
                     });
                 }
 
                 if (results.length === 0) return;
 
                 results.slice(0, 8).forEach(m => {
                     const div = document.createElement("div");
                     div.textContent = m.title;
 
                     div.addEventListener("click", () => {
                         window.location.href =
                             `eachManga.html?title=${encodeURIComponent(m.title)}&genre=${m.genre}`;
                     });
 
                     suggestionBox.appendChild(div);
                 });
 
             }, 300); // debounce
         });
 
         document.addEventListener("click", (e) => {
             if (!searchInput.contains(e.target)) {
                 suggestionBox.innerHTML = "";
             }
         });
 
         searchInput.addEventListener("keypress", (e) => {
             if (e.key === "Enter") {
 
                 const value = searchInput.value.toLowerCase().trim();
                 if (!value) return;
 
                 for (let g in mangaByGenre) {
                     const found = mangaByGenre[g].find(m =>
                         m.title.toLowerCase().includes(value)
                     );
 
                     if (found) {
                         window.location.href =
                             `eachManga.html?title=${encodeURIComponent(found.title)}&genre=${g}`;
                         return;
                     }
                 }
 
                 alert("Manga not found");
             }
         });
     }
});





   


