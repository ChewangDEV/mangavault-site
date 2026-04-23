/*NAVBAR*/

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {

if(window.scrollY > 50){
navbar.classList.add("scrolled");
}else{
navbar.classList.remove("scrolled");
}

});

const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

toggle.addEventListener("click", () => {

    navLinks.classList.toggle("active");

    if(navLinks.classList.contains("active")){
        toggle.textContent = "✕";
    }else{
        toggle.textContent = "☰";
    }

});

const links = document.querySelectorAll(".nav-links a");

links.forEach(link => {
    link.addEventListener("click", () => {

      navLinks.classList.remove("active");
      toggle.textContent = "☰";

    });
});
document.addEventListener("click", (e) => {

    if(
      !navLinks.contains(e.target) &&
      !toggle.contains(e.target)
    ){
      navLinks.classList.remove("active");
      toggle.textContent = "☰";
    }

});



/*CATEGORY*/

const categoryContainer = document.querySelector(".category-cards");
const cards = document.querySelectorAll(".category-card");

let index = 0;

function autoSlide(){

    const cardWidth = cards[0].offsetWidth + 20; // gap
    const visibleCards = window.innerWidth <= 768 ? 1 : 3;

    index++;

    if(index > cards.length - visibleCards){
        index = 0;
    }

    categoryContainer.scrollTo({
        left: cardWidth * index,
        behavior: "smooth"
    });

}


let slider = setInterval(autoSlide,3000);

categoryContainer.addEventListener("touchstart",()=>{
    clearInterval(slider);
    });
    
    categoryContainer.addEventListener("mousedown",()=>{
    clearInterval(slider);
    });

    categoryContainer.addEventListener("touchend",()=>{
        slider = setInterval(autoSlide,3000);
    });
        
    categoryContainer.addEventListener("mouseup",()=>{
        slider = setInterval(autoSlide,3000);
    });
;

/*FLIP CARD*/

const factsCards = document.querySelectorAll(".facts-card");

factsCards.forEach(card => {
  card.addEventListener("click", () => {
    card.classList.toggle("flip");
  });
});

/* ===== COMMUNITY FORM (FINAL VERSION) ===== */

const popup = document.getElementById("devPopup");
const closePopup = document.getElementById("closePopup");

const form = document.querySelector(".subscribe-form");
const iframe = document.getElementById("hidden_iframe");

let submitted = false;

form.addEventListener("submit", function () {
    submitted = true;

    const btn = form.querySelector("button");

    // 🔒 Disable button while submitting
    btn.disabled = true;
    btn.textContent = "Submitting...";
});

iframe.addEventListener("load", function () {

    if (submitted) {
        popup.style.display = "flex";

        document.querySelector(".dev-box h2").textContent = "🎉 Success!";
        document.querySelector(".dev-box p").textContent =
            "You have successfully subscribed to MangaVault!";

        // 🔄 Reset form
        form.reset();

        // 🔓 Enable button again
        const btn = form.querySelector("button");
        btn.disabled = false;
        btn.textContent = "Subscribe";

        submitted = false;

        // ⏳ Auto close popup
        setTimeout(() => {
            popup.style.display = "none";
        }, 3000);
    }
});




/*BACK TO  TOP ARROW*/

const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {

if(window.scrollY > 300){
backToTop.style.display = "flex";
}else{
backToTop.style.display = "none";
}

});

backToTop.addEventListener("click", () => {

window.scrollTo({
top:0,
behavior:"smooth"
});

});

//POP UP

const intro = document.getElementById("animeIntro");
const text = document.getElementById("introText");
const btn = document.getElementById("enterSite");



const lines = [
    "Loading system...",
    "Initializing anime core...",
    "Syncing manga database...",
    "Preparing experience...",
    "Entering Anime World..."
];

let currentLine = 0;

// show intro only first time
if(!localStorage.getItem("introShown")){
    intro.style.display = "flex";
    startIntro();
} else {
    intro.style.display = "none";

    // ✅ ADD OPTIONAL FIX HERE
    if (!sessionStorage.getItem("popupShown")) {
        setTimeout(() => {
            popup.style.display = "flex";
            sessionStorage.setItem("popupShown", "true");
        }, 800);
    }

}

function startIntro(){
    addLine();
}

function addLine(){
    if(currentLine >= lines.length){
        btn.classList.add("show");
        return;
    }

    const p = document.createElement("div");
    p.classList.add("line");
    text.appendChild(p);

    let i = 0;

    function type(){
        if(i < lines[currentLine].length){
            p.textContent += lines[currentLine][i];
            i++;
            setTimeout(type, 35);
        } else {
            currentLine++;
            setTimeout(addLine, 400);
        }
    }

    type();
}

// ENTER button
btn.addEventListener("click", () => {
    intro.classList.add("hide");

    setTimeout(() => {
        intro.style.display = "none";

        
    
        setTimeout(() => {
            if (!sessionStorage.getItem("popupShown")) {
                popup.style.display = "flex";
                sessionStorage.setItem("popupShown", "true");
            }
        }, 300);
    
    }, 800);

    localStorage.setItem("introShown", "true");
});






// close button
closePopup.addEventListener("click", () => {
    popup.style.display = "none";
});


// ===== NAVBAR SEARCH (USING EXISTING ID) =====

const searchInput = document.getElementById("search");
const suggestionBox = document.getElementById("search-suggestions");

if (searchInput && suggestionBox) {

    searchInput.addEventListener("input", () => {
        const value = searchInput.value.toLowerCase().trim();

        suggestionBox.innerHTML = "";

        if (!value) return;

        let results = [];

        // 🔍 search ALL manga (same as mangaDetail)
        for (let g in mangaByGenre) {
            mangaByGenre[g].forEach(m => {
                if (m.title.toLowerCase().includes(value)) {
                    results.push({ ...m, genre: g });
                }
            });
        }

        if (results.length === 0) return;

        // limit results
        results.slice(0, 8).forEach(m => {
            const div = document.createElement("div");
            div.textContent = m.title;

            div.addEventListener("click", () => {
                window.location.href =
                    `eachManga.html?title=${encodeURIComponent(m.title)}&genre=${m.genre}`;
            });

            suggestionBox.appendChild(div);
        });
    });

    // ENTER key → go to first match
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

    // hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
        if (
            !searchInput.contains(e.target) &&
            !suggestionBox.contains(e.target)
        ) {
            suggestionBox.innerHTML = "";
        }
    });
}