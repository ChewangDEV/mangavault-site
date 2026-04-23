// ==========================
// 📚 MANGA DATA (WITH LINKS)
// ==========================
const mangaData = [
    { title: "Chainsaw Man", img: "./image/mangadenji.png"},
    { title: "Jujutsu Kaisen", img: "./image/jjkmanga.png"},
    { title: "Sakamoto Days", img: "./image/sakamotomanga.png"},
    { title: "Attack on Titan", img: "./image/aot.png"},
    { title: "Demon Slayer", img: "./image/demonslayer.png"},
    { title: "Solo Leveling", img: "./image/mangasololevel.png"},
    { title: "My Hero Academia", img: "./image/mha.png"},
    { title: "Tokyo Revengers", img: "./image/tokyorevengers.png"},
    { title: "Black Clover", img: "./image/blackclover.png"},
    { title: "Fire Force", img: "./image/fireforce.png"},

    { title: "One Piece", img: "./image/mangaonepiece.png"},
    { title: "Naruto", img: "./image/naruto.png" },
    { title: "Boruto", img: "./image/boruto.png" },
    { title: "Bleach", img: "./image/bleach.png" },
    { title: "Hunter x Hunter", img: "./image/hxh.png"},
    { title: "Dragon Ball Super", img: "./image/dbs.png"},
    { title: "Fullmetal Alchemist", img: "./image/fma.png"},
    { title: "Mob Psycho 100", img: "./image/mobpsycho.png"},
    { title: "Vinland Saga", img: "./image/vinland.png"},
    { title: "Akame ga Kill", img: "./image/akame.png"},

    { title: "Blue Exorcist", img: "./image/blueexorcist.png"},
    { title: "Noragami", img: "./image/noragami.png" },
    { title: "God of High School", img: "./image/goh.png" },
    { title: "Tower of God", img: "./image/towerofgod.png" },
    { title: "Seraph of the End", img: "./image/seraph.png" },
    { title: "Parasyte", img: "./image/parasyte.png" },
    { title: "Dororo", img: "./image/dororo.png" },
    { title: "Kill la Kill", img: "./image/killlakill.png" },
    { title: "Bungo Stray Dogs", img: "./image/bungo.png" },
    { title: "Fate Stay Night", img: "./image/fate.png" },

    { title: "Made in Abyss", img: "./image/madeinabyss.png" },
    { title: "Magi", img: "./image/magi.png" },
    { title: "Dr Stone", img: "./image/drstone.png" },
    { title: "Seven Deadly Sins", img: "./image/sds.png" },
    { title: "Fairy Tail", img: "./image/fairytale.png"},
    { title: "Sword Art Online", img: "./image/sao.png" },
    { title: "Re Zero", img: "./image/rezero.png"},
    { title: "That Time I Got Reincarnated as a Slime", img: "./image/slime.png"},
    { title: "No Game No Life", img: "./image/ngnl.png" },
    { title: "Log Horizon", img: "./image/loghorizon.png"},

    { title: "Kino no Tabi", img: "./image/kino.png" },
    { title: "The Rising of the Shield Hero", img: "./image/shieldhero.png" },
    { title: "Spice and Wolf", img: "./image/spicewolf.png" },
    { title: "Ranking of Kings", img: "./image/rankingofkings.png"},
    { title: "Tokyo Ghoul", img: "./image/tokyoghoul.png" },
    { title: "Death Note", img: "./image/deathnote.png" },
    { title: "Devilman Crybaby", img: "./image/devilman.png"},
    { title: "Dorohedoro", img: "./image/dorohedoro.png"},
    { title: "Berserk", img: "./image/berserk.png"},

    { title: "Hell's Paradise", img: "./image/hellsparadise.png" },
    { title: "Future Diary", img: "./image/futurediary.png"},
    { title: "Another", img: "./image/another.png" },
    { title: "Erased", img: "./image/erased.png"},
    { title: "Psycho Pass", img: "./image/psychopass.png" },
    { title: "Monster", img: "./image/monster.png" },

    { title: "Black Lagoon", img: "./image/blacklagoon.png" },
    { title: "Elfen Lied", img: "./image/elfenlied.png" },
    { title: "Hellsing Ultimate", img: "./image/hellsing.png" },
    { title: "Claymore", img: "./image/claymore.png"},
    { title: "Deadman Wonderland", img: "./image/deadman.png" },
    { title: "Zankyou no Terror", img: "./image/terror.png"},
    { title: "Goblin Slayer", img: "./image/goblinslayer.png"},
    { title: "The Promised Neverland", img: "./image/neverland.png" },
    { title: "Serial Experiments Lain", img: "./image/lain.png" },
    { title: "Shiki", img: "./image/shiki.png" },
    { title: "Junji Ito Collection", img: "./image/junjiito.png" },
    { title: "Uzumaki", img: "./image/uzumaki.png"},
    { title: "Tomie", img: "./image/tomie.png"},

    { title: "Corpse Party", img: "./image/corpseparty.png"},
    { title: "Higurashi When They Cry", img: "./image/higurashi.png"},
    { title: "Blood C", img: "./image/bloodc.png"},
    { title: "Highschool of the Dead", img: "./image/hotd.png" },
    { title: "Kabaneri of the Iron Fortress", img: "./image/kabaneri.png" },
    { title: "Yamishibai", img: "./image/yamishibai.png" },

    { title: "Ghost Hunt", img: "./image/ghosthunt.png" },
    { title: "Mononoke", img: "./image/mononoke.png" },
    { title: "Boogiepop Phantom", img: "./image/boogiepop.png" },

    { title: "Perfect Blue", img: "./image/perfectblue.png" },
    { title: "Paprika", img: "./image/paprika.png" },
    { title: "Housing Complex C", img: "./image/housingc.png" },
    { title: "Dark Gathering", img: "./image/darkgathering.png"},
    { title: "Zom 100", img: "./image/zom100.png" },
    { title: "Your Name", img: "./image/yourname.png"},
    { title: "Weathering With You", img: "./image/weathering.png" },
    { title: "Golden Time", img: "./image/goldentime.png" },
    { title: "Clannad", img: "./image/clannad.png" },
    { title: "Clannad After Story", img: "./image/clannad2.png"},

    { title: "Lovely Complex", img: "./image/lovelycomplex.png" },
    { title: "The Angel Next Door Spoils Me Rotten", img: "./image/angelnextdoor.png"},
    { title: "Say I Love You", img: "./image/sayiloveyou.png" },
    { title: "Domestic Girlfriend", img: "./image/domesticgf.png"},

    { title: "Snow White with the Red Hair", img: "./image/snowwhite.png" },
    { title: "Insomniacs After School", img: "./image/insomniacs.png"},
    { title: "I Want to Eat Your Pancreas", img: "./image/pancreas.png"},
    { title: "Gintama", img: "./image/gintama.png"},
    { title: "One Punch Man", img: "./image/opm.png"},
    { title: "KonoSuba", img: "./image/konosuba.png" },
    { title: "The Disastrous Life of Saiki K", img: "./image/saiki.png" },
    { title: "Grand Blue", img: "./image/grandblue.png"},
    { title: "Nichijou", img: "./image/nichijou.png" },
    { title: "Asobi Asobase", img: "./image/asobi.png" },
    { title: "Prison School", img: "./image/prisonschool.png" },
    { title: "Daily Lives of High School Boys", img: "./image/dailylife.png" },

    { title: "The Devil is a Part-Timer", img: "./image/devilisaparttimer.png"},
    { title: "Spy x Family", img: "./image/spyfamily.png" },
    { title: "Mashle", img: "./image/mashle.png"},
    { title: "Hinamatsuri", img: "./image/hinamatsuri.png" },
    { title: "Barakamon", img: "./image/barakamon.png"},

    { title: "Sket Dance", img: "./image/sketdance.png" },
    { title: "Beelzebub", img: "./image/beelzebub.png"},
    { title: "The Way of the Househusband", img: "./image/househusband.png"},
    { title: "School Rumble", img: "./image/schoolrumble.png" },
    { title: "Lucky Star", img: "./image/luckystar.png"},
    { title: "Azumanga Daioh", img: "./image/azumanga.png" },
    { title: "Konohana Kitan", img: "./image/konohana.png" },
    { title: "Romantic Killer", img: "./image/romantickiller.png"},
    { title: "Classroom of the Elite", img: "./image/classroom.png"},
    { title: "Assassination Classroom", img: "./image/assassination.png" },
    { title: "The Quintessential Quintuplets", img: "./image/quintuplets.png" },
    { title: "Komi Can't Communicate", img: "./image/komi.png" },
    { title: "Angel Beats", img: "./image/angelbeats.png"},
    { title: "Charlotte", img: "./image/charlotte.png"},
    { title: "Food Wars", img: "./image/foodwars.png" },
    { title: "Code Geass", img: "./image/codegeass.png" },
    { title: "Steins Gate", img: "./image/steinsgate.png" },

    { title: "Welcome to the NHK", img: "./image/nhk.png"},
    { title: "Kaiji", img: "./image/kaiji.png"},
    { title: "Akagi", img: "./image/akagi.png"},
    { title: "Odd Taxi", img: "./image/oddtaxi.png" },
    { title: "Sonny Boy", img: "./image/sonnyboy.png" },
    { title: "Tomodachi Game", img: "./image/tomodachi.png"},
    { title: "Paranoia Agent", img: "./image/paranoia.png"},
    { title: "Ghost in the Shell", img: "./image/gitss.png" },
    { title: "Overlord", img: "./image/overlord.png"},
    { title: "DanMachi", img: "./image/danmachi.png" },
    { title: "Fate Zero", img: "./image/fatezero.png"},
    { title: "The Ancient Magus Bride", img: "./image/magusbride.png" },
    { title: "Grimgar", img: "./image/grimgar.png"},
    { title: "Cyberpunk Edgerunners", img: "./image/cyberpunk.png" },
    { title: "Akira", img: "./image/akira.png" },
    { title: "Neon Genesis Evangelion", img: "./image/evangelion.png" },
    { title: "Ergo Proxy", img: "./image/ergoproxy.png"},

    { title: "Gurren Lagann", img: "./image/gurrenlagann.png" },
    { title: "Darling in the Franxx", img: "./image/franxx.png" },
    { title: "86 Eighty Six", img: "./image/86.png"},
    { title: "Astra Lost in Space", img: "./image/astra.png"},
    { title: "Space Dandy", img: "./image/spacedandy.png"},
    { title: "Cowboy Bebop", img: "./image/cowboybebop.png"},
    { title: "Trigun", img: "./image/trigun.png"},
    { title: "Planetes", img: "./image/planetes.png"},
    { title: "Blame", img: "./image/blame.png"},
    { title: "Knights of Sidonia", img: "./image/sidonia.png"},

    { title: "No Guns Life", img: "./image/nogunslife.png"},
    { title: "Vivy Fluorite Eye's Song", img: "./image/vivy.png"},
    { title: "Heavenly Delusion", img: "./image/heavenly.png"},
    { title: "Deca Dence", img: "./image/decadence.png" },
    { title: "Eden of the East", img: "./image/eden.png" },
    { title: "Dimension W", img: "./image/dimensionw.png"},
    { title: "Expelled from Paradise", img: "./image/expelled.png"},
    { title: "Aldnoah Zero", img: "./image/aldnoah.png"},
    { title: "Zegapain", img: "./image/zegapain.png" },
    { title: "Time of Eve", img: "./image/timeofeve.png" }
];



// ==========================
// 📅 WEEK SEED
// ==========================
function getWeekSeed() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    return Math.floor((now - start) / (7 * 24 * 60 * 60 * 1000));
}


// ==========================
// 🔢 RANDOM + SHUFFLE
// ==========================
function seededRandom(seed) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

function seededShuffle(array, seed) {
    let arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const rand = Math.floor(seededRandom(seed + i) * (i + 1));
        [arr[i], arr[rand]] = [arr[rand], arr[i]];
    }
    return arr;
}


// ==========================
// 🎯 LOAD TRENDING
// ==========================
function loadTrending() {
    const container = document.getElementById("trend-list");
    if (!container) return;

    container.innerHTML = "";

    const seed = getWeekSeed();
    const count = window.innerWidth <= 768 ? 6 : 10;

    const shuffled = seededShuffle(mangaData, seed).slice(0, count);

    shuffled.forEach((manga, index) => {
        const div = document.createElement("div");
        div.className = "trend-item";

        const link = document.createElement("a");
        link.href = `./eachManga.html?title=${encodeURIComponent(manga.title)}&genre=action`;

        const rank = document.createElement("span");
        rank.className = "rank";
        rank.textContent = `#${index + 1}`;

        const img = document.createElement("img");
        img.src = manga.img;
        img.alt = manga.title;

        const titleText = document.createElement("p");
        titleText.className = "trend-title";
        titleText.textContent = manga.title;

        link.append(rank, img, titleText);
        div.appendChild(link);
        container.appendChild(div);
    });
}


// ==========================
// 🔝 BACK TO TOP
// ==========================
function setupBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    btn.style.display = "none";

    window.addEventListener("scroll", () => {
        btn.style.display = window.scrollY > 10 ? "flex" : "none";
    });

    btn.onclick = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
}


// ==========================
// 📄 DETAIL PAGE (SAFE)
// ==========================
function loadMangaDetail() {
    const params = new URLSearchParams(window.location.search);
    const title = params.get("title");

    let manga = mangaData.find(
        m => m.title.toLowerCase().trim() === title?.toLowerCase().trim()
    );

    if (!manga && typeof mangaDetails !== "undefined") {
        const key = title.toLowerCase().replace(/\s+/g, "");
        manga = mangaDetails[key];
    }

    const titleEl = document.getElementById("manga-title");
    if (!title || !titleEl) return;

    if (!manga) {
        titleEl.textContent = "Manga Not Found";
        return;
    }

    // safe DOM updates

    titleEl.textContent = manga.title;

    const headerEl = document.getElementById("manga-header-title");
    if (headerEl) headerEl.textContent = manga.title;

    const descEl = document.getElementById("manga-desc");
    if (descEl) descEl.textContent = manga.desc || "No description";

    const imgEl = document.getElementById("manga-img");
    if (imgEl) {
    imgEl.setAttribute("src", manga.img);
}
    
}


// ==========================
// 🚀 INIT (FINAL FIX)
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    console.log("APP STARTED");

    loadTrending();        // ✅ ALWAYS runs
    setupBackToTop();      // ✅ ALWAYS works
    if (window.location.pathname.includes("eachManga.html")) {
        loadMangaDetail();
    }
});


// ==========================
// 🔄 RESIZE UPDATE
// ==========================
let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(loadTrending, 300);
});



