// 🔥 SUPABASE CLIENT
const client = window.supabase.createClient(
  "https://vhcrrmjwgutlzklmzdno.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoY3JybWp3Z3V0bHprbG16ZG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTAxNDQsImV4cCI6MjA5Mjg2NjE0NH0.2oyRol30Qy3K5Z-m-Qsx-zzprD1MPUbGu0ZgYNjCtpI"
);

const msg = document.getElementById("authMessage");

// ==========================
// AUTO SESSION CHECK
// ==========================
async function checkSession() {
  const { data: { session } } = await client.auth.getSession();

  if (session) {
    window.location.href = "community.html";
  }
}

checkSession();

// ==========================
// SIGNUP
// ==========================
async function signup() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    msg.textContent = "Fill all fields ❌";
    return;
  }

  if (password.length < 6) {
    msg.textContent = "Password must be at least 6 characters ❌";
    return;
  }

  // 🔥 SIGNUP
  const { data, error } = await client.auth.signUp({
    email,
    password
  });

  if (error) {
    msg.textContent = error.message;
    return;
  }

  // 🔥 AUTO LOGIN
  const { error: loginError } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (loginError) {
    msg.textContent = "Login failed after signup ❌";
    return;
  }

  // 🔥 CREATE PROFILE (SAFE UPSERT)
  await client.from("profiles").upsert({
    email,
    name,
    avatar: null
  });

  msg.textContent = "Account created ✅";

  setTimeout(() => {
    window.location.href = "community.html";
  }, 800);
}

// ==========================
// LOGIN
// ==========================
async function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    msg.textContent = "Fill all fields ❌";
    return;
  }

  const { error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    msg.textContent = error.message || "Login failed ❌";
    return;
  }

  msg.textContent = "Login successful ✅";

  setTimeout(() => {
    window.location.href = "community.html";
  }, 500);
}

// ==========================
// UI TOGGLE
// ==========================
function showSignup() {
  document.getElementById("signupForm").style.display = "block";
  document.getElementById("loginForm").style.display = "none";

  document.getElementById("signupTab").classList.add("active");
  document.getElementById("loginTab").classList.remove("active");
}

function showLogin() {
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";

  document.getElementById("signupTab").classList.remove("active");
  document.getElementById("loginTab").classList.add("active");
}

// ==========================
// FORM HANDLERS
// ==========================
document.getElementById("signupForm").addEventListener("submit", (e) => {
  e.preventDefault();
  signup();
});

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});