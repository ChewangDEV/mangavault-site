// 🔥 SUPABASE (MUST BE FIRST)
const client = window.supabase.createClient(
  "https://vhcrrmjwgutlzklmzdno.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoY3JybWp3Z3V0bHprbG16ZG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTAxNDQsImV4cCI6MjA5Mjg2NjE0NH0.2oyRol30Qy3K5Z-m-Qsx-zzprD1MPUbGu0ZgYNjCtpI"
);


// 🔥 INIT
init();

async function init() {
  const { data } = await client.auth.getUser();
  const user = data.user;

  if (!user) {
    showToast("Login required ⚠️");

    setTimeout(() => {
      window.location.href = "signup.html";
    }, 1200);

    return;
  }

  loadMyPosts(user);
}

// 🔥 LOAD POSTS (OPTIMIZED)
async function loadMyPosts(user) {
  const container = document.getElementById("posts-container");

  container.innerHTML = "<p style='text-align:center;color:#aaa;'>Loading...</p>";

  // ✅ FETCH POSTS
  const { data: posts, error } = await client
    .from("posts")
    .select("*")
    .eq("email", user.email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    showToast("Error loading posts ❌");
    return;
  }

  // ✅ FETCH PROFILES ONCE (KEY OPTIMIZATION)
  const { data: profiles } = await client
    .from("profiles")
    .select("*");

  const profileMap = {};
  profiles.forEach(p => {
    profileMap[p.email] = p;
  });

  container.innerHTML = "";

  if (!posts.length) {
    container.innerHTML =
      "<p style='text-align:center;color:#aaa;'>No posts yet</p>";
    return;
  }

  // ✅ RENDER POSTS (NO EXTRA DB CALLS)
 
for (const post of posts) {

  const el = await renderPost(
    post,
    user,
    profileMap
  );

  el.setAttribute(
    "data-id",
    post.id
  );

  // =========================
  // DELETE ONLY FOR MY POSTS
  // =========================

  const actions =
    document.createElement("div");
  
  actions.className =
    "my-post-actions";
  
  actions.innerHTML = `
  
    <button class="delete-btn">
      Delete
    </button>
  
    <button class="my-share-btn">
      Share
    </button>
  
  `;
  
  el.appendChild(actions);
  
  // DELETE
  actions.querySelector(
    ".delete-btn"
  ).onclick = () =>
    deletePost(post.id);
  
  // SHARE
  actions.querySelector(
    ".my-share-btn"
  ).onclick = () =>
    sharePost(post.text);
  
  container.appendChild(el);
  
  

}


}

// 🔥 DELETE
let deleteId = null;

function deletePost(id) {
  deleteId = id;
  document.getElementById("confirmBox").classList.add("show");
}

document.getElementById("confirmYes").onclick = async () => {
  if (!deleteId) return;

  const { error } = await client
    .from("posts")
    .delete()
    .eq("id", deleteId);

  if (error) {
    console.error(error);
    showToast("Delete failed ❌");
    return;
  }

  document.getElementById("confirmBox").onclick = (e) => {
    if (e.target.id === "confirmBox") {
      closeConfirm();
    }
  };

  // ✅ REMOVE UI (FAST)
  const postEl = document.querySelector(`[data-id="${deleteId}"]`);
  if (postEl) postEl.remove();

  showToast("Post deleted ✅", "success");
  closeConfirm();
};

document.getElementById("confirmNo").onclick = closeConfirm;

function closeConfirm() {
  document.getElementById("confirmBox").classList.remove("show");
  deleteId = null;
}

// 🔥 SHARE
function sharePost(text) {

  const shareText =
    text || "Check out my post!";

  navigator.clipboard.writeText(
    shareText
  );

  showToast(
    "Post copied 📋",
    "success"
  );
}

// 🔥 TOAST
function showToast(message, type = "warning") {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast show ${type}`;

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}