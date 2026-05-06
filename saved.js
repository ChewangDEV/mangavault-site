
// 🔥 SUPABASE
const client = window.supabase.createClient(
  "https://vhcrrmjwgutlzklmzdno.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoY3JybWp3Z3V0bHprbG16ZG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyOTAxNDQsImV4cCI6MjA5Mjg2NjE0NH0.2oyRol30Qy3K5Z-m-Qsx-zzprD1MPUbGu0ZgYNjCtpI"
);

let currentUser = null;
let profileMap = {};

// ============================
// INIT
// ============================

document.addEventListener(
  "DOMContentLoaded",
  init
);

async function init(){

  const { data } =
    await client.auth.getUser();

  currentUser = data.user;

  if(!currentUser){

    window.location.href =
      "signup.html";

    return;
  }

  await loadProfiles();

  await loadSavedPosts();
}

// ============================
// LOAD PROFILES
// ============================

async function loadProfiles(){

  const { data } =
    await client
      .from("profiles")
      .select("*");

  profileMap = {};

  data.forEach(profile => {

    profileMap[
      profile.email
    ] = profile;

  });
}

// ============================
// LOAD SAVED POSTS
// ============================

async function loadSavedPosts(){

  const container =
    document.getElementById(
      "saved-container"
    );

  container.innerHTML = "";

  const { data: saved } =
    await client
      .from("saved_posts")
      .select("*")
      .eq(
        "user_email",
        currentUser.email
      )
      .order("created_at", {
        ascending:false
      });

  if(!saved.length){

    container.innerHTML = `
      <div class="empty-saved">
        No saved posts yet 📌
      </div>
    `;

    return;
  }

  for(const item of saved){

    const { data: post } =
      await client
        .from("posts")
        .select("*")
        .eq("id", item.post_id)
        .single();

    if(!post) continue;

    const profile =
      profileMap[post.email] || {};

    const card =
      document.createElement("div");

    card.className =
      "saved-post";

    
      let postContent = "";
      
      // ============================
      // POLL
      // ============================
      
      if(post.type === "poll"){
      
        const parsed =
          JSON.parse(post.text);
      
        postContent = `
      
          <div class="saved-text">
            ${parsed.question || ""}
          </div>
      
        `;
      
        parsed.poll.forEach(option => {
      
          postContent += `
      
            <div class="saved-poll-option">
      
              <span>
                ${option.text}
              </span>
      
              <span>
                ${option.votes}
              </span>
      
            </div>
      
          `;
      
        });
      
      }
      
      // ============================
      // NORMAL POSTS
      // ============================
      
      else{
      
        

            postContent = `
          
              <div class="saved-text">
                ${post.text || ""}
              </div>
          
            
          
      
        `;
      }
      
      

    card.innerHTML = `

      <div class="saved-header">

        <div class="saved-user">

          <div class="saved-avatar">

            ${
              profile.avatar
                ? `
                  <img src="${profile.avatar}">
                `
                : (
                    profile.name || "U"
                  )[0].toUpperCase()
            }

          </div>

          <div class="saved-info">

            <strong>
              ${
                profile.name ||
                "User"
              }
            </strong>

            <p>
              ${new Date(
                post.created_at
              ).toLocaleString()}
            </p>

          </div>

        </div>

      </div>

      <div class="saved-content">

      ${postContent}

        ${
          post.type === "image"
            ? `
              <img
                src="${post.media}"
                class="saved-media"
              >
            `
            : ""
        }

        ${
          post.type === "video"
            ? `
              <video
                src="${post.media}"
                class="saved-media"
                controls
              ></video>
            `
            : ""
        }

      </div>

      <div class="saved-actions">

        <button
          onclick="downloadPost(
            '${post.media}',
            '${post.id}'
          )"
        >
          Download
        </button>

        <button
          onclick="removeSaved(
            '${item.id}'
          )"
        >
          Remove
        </button>

      </div>

    `;

    container.appendChild(card);
  }
}

// ============================
// DOWNLOAD
// ============================

async function downloadPost(
  media,
  id
){

  if(!media) return;

  try{

    const response =
      await fetch(media);

    const blob =
      await response.blob();

    const blobUrl =
      window.URL.createObjectURL(
        blob
      );

    const a =
      document.createElement("a");

    a.href = blobUrl;

    a.download =
      `post-${id}`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(
      blobUrl
    );

  }

  catch(err){

    console.error(err);

  }
}

// ============================
// REMOVE SAVE
// ============================

async function removeSaved(id){

  await client
    .from("saved_posts")
    .delete()
    .eq("id", id);

  loadSavedPosts();
}

// ============================
// BACK
// ============================

function goBack(){
  window.history.back();
}

