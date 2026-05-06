// 🔥 SUPABASE CLIENT
const client = window.supabase.createClient(
  "https://vhcrrmjwgutlzklmzdno.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoY3JybWp3Z3V0bHprbG16ZG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTAxNDQsImV4cCI6MjA5Mjg2NjE0NH0.2oyRol30Qy3K5Z-m-Qsx-zzprD1MPUbGu0ZgYNjCtpI"
);

// 🔥 GLOBAL
let selectedFile = null;
let mediaType = null;
let currentUser = null;
let profileMap = {};

// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", init);

// ============================
// AUTO GROW TEXTAREA
// ============================

window.addEventListener(
  "DOMContentLoaded",
  () => {

    const thoughts =
      document.getElementById(
        "thoughts"
      );

    if (!thoughts) return;

    thoughts.addEventListener(
      "input",
      () => {

        thoughts.style.height =
          "auto";

        thoughts.style.height =
          thoughts.scrollHeight + "px";

      }
    );

  }
);


async function init() {

  const { data } = await client.auth.getUser();

  currentUser = data.user;

  if (!currentUser) {
    window.location.href = "signup.html";
    return;
  }

  await loadProfiles();

  setUserUI();
  setupNav();

  await loadPosts();

  // 🔥 NOTIFICATIONS
  await loadNotifications();

  setTimeout(() => {
    initNotificationRealtime();
  }, 1000);

}


// ---------------- LOAD PROFILES ----------------
async function loadProfiles() {
  const { data } = await client.from("profiles").select("*");

  profileMap = {};
  data.forEach(p => {
    profileMap[p.email] = p;
  });
}

// ---------------- USER UI ----------------
function setUserUI() {
  const profile = profileMap[currentUser.email];

  const avatarHTML = profile?.avatar
    ? `<img src="${profile.avatar}" class="avatar-img">`
    : (profile?.name || "U")[0].toUpperCase();

  document.getElementById("user-profile").innerHTML = avatarHTML;
  document.getElementById("user-avatar").innerHTML = avatarHTML;
}

// ---------------- NAV ----------------
function setupNav() {
  document.getElementById("user-profile").onclick = () => {
    window.location.href = "profile.html";
  };

  document.getElementById("floatingPostBtn").onclick = () => {
    document.querySelector(".post").scrollIntoView({ behavior: "smooth" });
    document.getElementById("thoughts").focus();
  };
}

// ---------------- EMBED ----------------
function convertToEmbed(url) {
  if (!url) return null;

  try {
    if (url.includes("youtube.com/watch")) {
      const id = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${id}`;
    }

    if (url.includes("youtu.be/")) {
      return `https://www.youtube.com/embed/${url.split("youtu.be/")[1]}`;
    }

    return url;
  } catch {
    return null;
  }
}

// ---------------- FILE ----------------
document.getElementById("imageInput").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 20 * 1024 * 1024) {
    showToast("File too large ❌");

    document.getElementById("linkBox").style.display = "block";
    document.getElementById("imageInput").value = "";

    selectedFile = null;
    mediaType = null;
    return;
  }

  selectedFile = file;
  mediaType = file.type.startsWith("image/") ? "image" : "video";

  showPreview(URL.createObjectURL(file), mediaType);
});

// ---------------- ADD POST ----------------
async function addPost() {
  const text = document.getElementById("thoughts").value.trim();
  const rawLink = document.getElementById("videoLinkInput").value;
  const linkInput = convertToEmbed(rawLink);

  const pollInputs = document.querySelectorAll(".poll-option");

  let pollData = [];
  pollInputs.forEach(input => {
    if (input.value.trim()) {
      pollData.push({ text: input.value.trim(), votes: 0 });
    }
  });

  // ❌ validation
  if (pollData.length > 0 && pollData.length < 2) {
    showToast("Add at least 2 options ⚠️");
    return;
  }

  if (!text && !selectedFile && !linkInput && pollData.length === 0) {
    showToast("Post cannot be empty ❌");
    return;
  }

  // ❌ prevent file + link together
  if (selectedFile && linkInput) {
    showToast("Use file OR link, not both ❌");
    return;
  }

  let mediaURL = null;

  // 🔥 upload file
  if (selectedFile) {
    const fileName = Date.now() + "_" + selectedFile.name;

    const { error: uploadError } = await client.storage
      .from("posts")
      .upload(fileName, selectedFile);

    if (uploadError) {
      console.error(uploadError);
      showToast("Upload failed ❌");
      return;
    }

    const { data } = client.storage.from("posts").getPublicUrl(fileName);
    mediaURL = data.publicUrl;
  }

  // 🔥 PREPARE TEXT
  const finalText = pollData.length
    ? JSON.stringify({
        poll: pollData,
        question: text || ""
      })
    : text;

  // 🔥 DETERMINE TYPE
  let finalType = "text";

  if (pollData.length > 0) {
    finalType = "poll";
  } else if (mediaURL) {
    finalType = mediaType || "image";
  } else if (linkInput) {
    finalType = "link";
  }

  // 🔥 INSERT
  const { error: insertError } = await client.from("posts").insert([{
    email: currentUser.email,
    text: finalText,
    media: mediaURL || linkInput,
    type: finalType
  }]);

  if (insertError) {
    console.error(insertError);
    showToast(insertError.message);
    return;
  }

  showToast("Posted ✅");

  // 🔥 RESET UI
  document.getElementById("thoughts").value = "";
  document.getElementById("videoLinkInput").value = "";
  document.getElementById("imagePreview").innerHTML = "";
  document.getElementById("linkBox").style.display = "none";

  selectedFile = null;
  mediaType = null;

  document.querySelectorAll(".poll-option").forEach(input => {
    input.value = "";
  });

  await loadPosts();
}

// ---------------- LOAD POSTS ----------------
async function loadPosts() {
  await loadProfiles();

  const { data, error } = await client
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    showToast("Failed to load posts ❌");
    return;
  }

  const container = document.getElementById("posts-container");
  container.innerHTML = "";

  for (const post of data) {

    const el = await renderPost(
      post,
      currentUser,
      profileMap
    );
  
    container.appendChild(el);
  
  }
}

// ---------------- VOTE ----------------
async function vote(postId, index) {
  const votedKey = `voted_${postId}_${currentUser.email}`;

  if (localStorage.getItem(votedKey)) {
    showToast("Already voted ⚠️");
    return;
  }

  const { data } = await client
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  let parsed = JSON.parse(data.text);
  parsed.poll[index].votes += 1;

  await client
    .from("posts")
    .update({ text: JSON.stringify(parsed) })
    .eq("id", postId);

  localStorage.setItem(votedKey, true);

  await loadPosts();
}

// ---------------- UI ----------------
function showPreview(src, type) {
  document.getElementById("imagePreview").innerHTML = `
    <div class="preview-box">
      ${
        type === "video"
          ? `<video src="${src}" class="preview-img" controls></video>`
          : `<img src="${src}" class="preview-img">`
      }
      <button onclick="removeMedia()">×</button>
    </div>
  `;
}

function removeMedia() {
  selectedFile = null;
  mediaType = null;
  document.getElementById("imagePreview").innerHTML = "";
  document.getElementById("imageInput").value = "";
}

function togglePoll() {
  document.getElementById("pollBox").classList.toggle("active");
}

function addPollOption() {
  const box = document.getElementById("pollBox");
  const count = document.querySelectorAll(".poll-option").length;

  if (count >= 5) return;

  const input = document.createElement("input");
  input.className = "poll-option";
  input.placeholder = `Option ${count + 1}`;

  box.insertBefore(input, box.querySelector("button"));
}

function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show";

  setTimeout(() => t.classList.remove("show"), 3000);
}