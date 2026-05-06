// 🔥 SUPABASE
const client = window.supabase.createClient(
  "https://vhcrrmjwgutlzklmzdno.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoY3JybWp3Z3V0bHprbG16ZG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTAxNDQsImV4cCI6MjA5Mjg2NjE0NH0.2oyRol30Qy3K5Z-m-Qsx-zzprD1MPUbGu0ZgYNjCtpI"
);


let currentUser = null;

// ---------------- INIT ----------------
document.addEventListener("DOMContentLoaded", init);

async function init() {
  const { data, error } = await client.auth.getUser();

  if (error || !data.user) {
    window.location.href = "signup.html";
    return;
  }

  currentUser = data.user;

  // show email instantly
  document.getElementById("profileEmail").textContent = currentUser.email;

  await ensureProfile();
  await loadProfile();
}

// ---------------- ENSURE PROFILE ----------------
async function ensureProfile() {
  const { data } = await client
    .from("profiles")
    .select("*")
    .eq("email", currentUser.email)
    .limit(1);

  if (!data || data.length === 0) {
    await client.from("profiles").insert({
      email: currentUser.email,
      name: currentUser.email.split("@")[0],
      avatar: null
    });
  }
}

// ---------------- LOAD PROFILE ----------------
async function loadProfile() {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("email", currentUser.email)
    .limit(1);

  if (error) {
    console.error("Profile error:", error);
    return;
  }

  const profile = data?.[0];

  if (!profile) return;

  // NAME
  document.getElementById("profileName").textContent =
    profile.name || "User";

  // AVATAR
  const avatarBox = document.getElementById("profileAvatar");
  avatarBox.innerHTML = "";

  if (profile.avatar) {
    avatarBox.innerHTML = `
      <img src="${profile.avatar}" 
           style="width:100%;height:100%;border-radius:50%;object-fit:cover">
    `;
  } else {
    avatarBox.textContent = (profile.name || "U")[0].toUpperCase();
  }
}

// ---------------- EDIT NAME ----------------
function editProfile() {
  document.getElementById("editBox").style.display = "block";
}

function closeEdit() {
  document.getElementById("editBox").style.display = "none";
}

async function saveName() {
  const newName = document.getElementById("editInput").value.trim();

  if (!newName) {
    showToast("Enter a name ⚠️");
    return;
  }

  const { error } = await client
    .from("profiles")
    .update({ name: newName })
    .eq("email", currentUser.email);

  if (error) {
    console.error(error);
    showToast("Update failed ❌");
    return;
  }

  showToast("Name updated ✅");

  await loadProfile();
  closeEdit();
}

// ---------------- AVATAR ----------------
document.getElementById("avatarInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast("Max 5MB only ⚠️");
    return;
  }

  const reader = new FileReader();

  reader.onload = async function () {
    const base64 = reader.result;

    const { error } = await client
      .from("profiles")
      .update({ avatar: base64 })
      .eq("email", currentUser.email);

    if (error) {
      console.error(error);
      showToast("Avatar update failed ❌");
      return;
    }

    showToast("Avatar updated ✅");

    await loadProfile();
  };

  reader.readAsDataURL(file);
});

// ---------------- LOGOUT ----------------
async function logout() {
  await client.auth.signOut();
  window.location.href = "signup.html";
}

// -------SAVED POST ------------

function goToSaved() {
  window.location.href =
    "saved.html";
}



// ---------------- NAV ----------------
function goToMyPosts() {
  window.location.href = "my-post.html";
}

function goToCommunity() {
  window.location.href = "community.html";
}

// ---------------- TOAST ----------------
function showToast(msg, type = "normal") {
  let t = document.getElementById("toast");

  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    document.body.appendChild(t);
  }

  t.innerHTML = `
    <span class="toast-icon">⚔️</span>
    <span>${msg}</span>
  `;

  t.className = `toast show ${type}`;

  setTimeout(() => {
    t.classList.remove("show");
  }, 3000);
}