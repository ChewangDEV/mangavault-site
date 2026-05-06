// ---------------- SVG ----------------
const likeSVG = () => "❤️";
const commentSVG = () => "💬";
const shareSVG = () => "🔗";
const viewSVG = () => "👁️";

// ============================
// RENDER POST
// ============================

async function renderPost(
  post,
  user,
  profileMap
) {

  const profile =
    profileMap[post.email] || {};

  const el =
    document.createElement("div");

    
    el.className = "post-card";
    
    el.setAttribute(
      "data-post-id",
      post.id
    );
    
    

  // ============================
  // CONTENT
  // ============================

  let contentHTML = "";

  // TEXT
  if (post.type === "text") {

    contentHTML = `
      <div class="post-text">
        ${post.text || ""}
      </div>
    `;
  }

  // IMAGE
  else if (post.type === "image") {

    contentHTML = `
      <div class="post-text">
        ${post.text || ""}
      </div>

      <img
        src="${post.media}"
        class="post-img"
      >
    `;
  }

  // VIDEO
  else if (post.type === "video") {

    contentHTML = `
      <div class="post-text">
        ${post.text || ""}
      </div>

      <video
        src="${post.media}"
        class="post-img"
        controls
      ></video>
    `;
  }

  // LINK
  else if (post.type === "link") {

    contentHTML = `
      <div class="post-text">
        ${post.text || ""}
      </div>

      <iframe
        src="${post.media}"
        class="post-img"
        frameborder="0"
        allowfullscreen
      ></iframe>
    `;
  }

  // POLL
  else if (post.type === "poll") {

    const parsed =
      JSON.parse(post.text);

    contentHTML = `
      <div class="post-text">
        ${parsed.question || ""}
      </div>
    `;

    parsed.poll.forEach(
      (option, index) => {

        const totalVotes =
          parsed.poll.reduce(
            (sum, p) =>
              sum + p.votes,
            0
          );

        const percent =
          totalVotes
            ? (
                option.votes /
                totalVotes
              ) * 100
            : 0;

        contentHTML += `

          <div
            class="poll-option-ui"
            onclick="
              vote(
                ${post.id},
                ${index}
              )
            "
          >

            <div
              class="poll-bar"
              style="
                width:${percent}%
              "
            ></div>

            <div class="poll-row">

              <span>
                ${option.text}
              </span>

              <span class="poll-votes">
                ${option.votes}
              </span>

            </div>

          </div>

        `;
      }
    );
  }

  // ============================
  // HTML
  // ============================

  el.innerHTML = `

  
  <div class="post-header">
  
    <div class="post-user">
  
      <div class="avatar">
  
        ${
          profile.avatar
            ? `
              <img
                src="${profile.avatar}"
                class="avatar-img"
              >
            `
            : (
                profile.name ||
                "U"
              )[0].toUpperCase()
        }
  
      </div>
  
      <div class="post-user-info">
  
        <strong>
          ${
            profile.name ||
            "User"
          }
        </strong>
  
        <p class="time">
          ${new Date(
            post.created_at
          ).toLocaleString()}
        </p>
  
      </div>
  
    </div>
  
    <div class="post-menu-wrapper">
  
      <button class="post-menu-btn">
        ⋮
      </button>
  
      
<div class="post-menu-dropdown">

  <button class="save-post-btn">
    Save Post
  </button>

  ${
    post.media
      ? `
        <button class="download-post-btn">
          Download Media
        </button>
      `
      : ""
  }

</div>


  
    </div>
  
  </div>
  
  

    ${contentHTML}

    <div class="post-interactions">

      <div class="left-actions">

        <button class="anime-btn like-btn">

          ${likeSVG()}

          <span class="like-count">
            ${post.likes || 0}
          </span>

        </button>

        <button class="anime-btn comment-btn">

          ${commentSVG()}

          <span>0</span>

        </button>

      </div>

      <div class="right-actions">

        <button class="anime-btn share-btn">

          ${shareSVG()}

          <span>
            ${post.shares || 0}
          </span>

        </button>

        <div class="anime-view">

          ${viewSVG()}

          <span>
            ${post.views || 0}
          </span>

        </div>

      </div>

    </div>

    <div
      class="comment-box"
      style="display:none;"
    >

      <div class="comment-input-row">

        <input
          class="comment-input"
          placeholder="
            Write a comment...
          "
        >

        <button class="comment-send">
          Post
        </button>

      </div>

      <div class="comment-list"></div>

    </div>

  `;

  // ============================
  // ELEMENTS
  // ============================

  const likeBtn =
    el.querySelector(".like-btn");

  const likeCount =
    el.querySelector(".like-count");

  const commentBtn =
    el.querySelector(".comment-btn");

  const commentBox =
    el.querySelector(".comment-box");

  const commentInput =
    el.querySelector(".comment-input");

  const commentSend =
    el.querySelector(".comment-send");

  const commentList =
    el.querySelector(".comment-list");

   
    const menuBtn =
      el.querySelector(".post-menu-btn");
    
    const menuDropdown =
      el.querySelector(
        ".post-menu-dropdown"
      );
    
    const saveBtn =
      el.querySelector(
        ".save-post-btn"
      );
    
    const downloadBtn =
      el.querySelector(
        ".download-post-btn"
      );

 
const commentCount =
  commentBtn.querySelector("span");



      // ============================
      // MENU TOGGLE
      // ============================
      
      menuBtn.onclick = (e) => {

        e.stopPropagation();
      
        menuDropdown.classList.toggle(
          "active"
        );
      
      };
      
      window.onclick = () => {
      
        document
          .querySelectorAll(
            ".post-menu-dropdown"
          )
          .forEach(menu => {
      
            menu.classList.remove(
              "active"
            );
      
          });
      
      };

     
      // ============================
      // SAVE POST
      // ============================
      
      
      saveBtn.onclick = async () => {
      
        try {
      
          // CHECK EXISTING
          const { data, error } =
            await client
              .from("saved_posts")
              .select("*")
              .eq(
                "user_email",
                user.email
              )
              .eq(
                "post_id",
                post.id
              );
      
          if (error) {
      
            console.error(error);
      
            showToast(
              "Save failed ❌"
            );
      
            return;
          }
      
          if (data && data.length) {
      
            showToast(
              "Already saved 📌"
            );
      
            return;
          }
      
          // INSERT SAVE
          const {
            error: insertError
          } = await client
            .from("saved_posts")
            .insert({
      
              user_email:
                user.email,
      
              post_id:
                post.id
      
            });
      
          if (insertError) {
      
            console.error(
              insertError
            );
      
            showToast(
              "Save failed ❌"
            );
      
            return;
          }
      
          showToast(
            "Post saved ✅"
          );
      
        }
      
        catch(err){
      
          console.error(err);
      
          showToast(
            "Something went wrong ❌"
          );
      
        }
      
      };
     
      
      // ============================
      // DOWNLOAD
      // ============================
      
      if (downloadBtn) {
      
        downloadBtn.onclick = async () => {
      
          try {
      
            if (!post.media) {
      
              showToast(
                "No media found ❌"
              );
      
              return;
            }
      
            const response =
              await fetch(post.media);
      
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
              `post-${post.id}`;
      
            document.body.appendChild(a);
      
            a.click();
      
            a.remove();
      
            window.URL.revokeObjectURL(
              blobUrl
            );
      
            showToast(
              "Download started ✅"
            );
      
          }
      
          catch (err) {
      
            console.error(err);
      
            showToast(
              "Download failed ❌"
            );
      
          }
      
        };
      
      }
      
      
      

     
      // ============================
      // VIEWS
      // ============================
      
      const { data: existingView } =
        await client
          .from("post_views")
          .select("*")
          .eq(
            "post_id",
            post.id
          )
          .eq(
            "viewer_email",
            user.email
          );
      
      if (
        !existingView ||
        !existingView.length
      ) {
      
        // INSERT VIEW
        await client
          .from("post_views")
          .insert({
      
            post_id:
              post.id,
      
            viewer_email:
              user.email
      
          });
      
        // UPDATE POST COUNT
        const newViews =
          (post.views || 0) + 1;
      
        post.views =
          newViews;
      
        await client
          .from("posts")
          .update({
            views: newViews
          })
          .eq("id", post.id);
      
        const viewSpan =
          el.querySelector(
            ".anime-view span"
          );
      
        if (viewSpan) {
      
          viewSpan.textContent =
            newViews;
      
        }
      
      }
      
      
  
  

  // ============================
  // LIKE TOGGLE
  // ============================
  
  const likedKey =
    `liked_${post.id}_${user.email}`;
  
  if (
    localStorage.getItem(
      likedKey
    )
  ) {
    likeBtn.classList.add(
      "active"
    );
  }
  
  likeBtn.onclick =
    async () => {
  
      let currentLikes =
        post.likes || 0;
  
      // UNLIKE
      if (
        localStorage.getItem(
          likedKey
        )
      ) {
  
        currentLikes--;
  
        if (currentLikes < 0) {
          currentLikes = 0;
        }
  
        localStorage.removeItem(
          likedKey
        );
  
        likeBtn.classList.remove(
          "active"
        );
  
      }
  
      // LIKE
      else {
  
        currentLikes++;
  
        localStorage.setItem(
          likedKey,
          "true"
        );
  
        likeBtn.classList.add(
          "active"
        );
  
      }
  
      post.likes =
        currentLikes;
  
      likeCount.textContent =
        currentLikes;
  
      await client
        .from("posts")
        .update({
          likes: currentLikes
        })
        .eq("id", post.id);

        // CREATE NOTIFICATION
if (
  currentLikes > 0 &&
  post.email !== user.email
) {

  await client
    .from("notifications")
    .insert({



  receiver_email:
    post.email,

  sender_email:
    user.email,

  sender_name:
    profileMap[user.email]?.name ||
    user.email.split("@")[0],

  sender_avatar:
    profileMap[user.email]?.avatar || "",

  type: "like",

  message:
    "liked your post ❤️",

    post_preview:

    post.type === "poll"
  
      ? "📊 Poll post"
  
      : (post.text || "")
          .slice(0, 80),

  post_id:
    post.id,

  is_read: false




    });

}
  
    };
  
  

  // ============================
  // COMMENT TOGGLE
  // ============================

  commentBtn.onclick =
    () => {

      commentBox.style.display =
        commentBox.style.display ===
        "none"
          ? "block"
          : "none";

    };

  // ============================
  // ADD COMMENT
  // ============================

commentSend.onclick =
  async () => {

    const text =
      commentInput.value.trim();

    if (!text) return;

    const profile =
      profileMap[user.email] || {};

    // INSERT COMMENT
    const { error } =
      await client
        .from("comments")
        .insert({

          post_id: post.id,

          email: user.email,

          name:
            profile.name ||
            user.email.split("@")[0],

          avatar:
            profile.avatar ||
            null,

          text,

          parent_id: null

        });

    if (error) {
      console.error(error);
      return;
    }

    // COMMENT NOTIFICATION
    if (
      post.email !== user.email
    ) {

      await client
        .from("notifications")
        .insert({

        


  receiver_email:
    post.email,

  sender_email:
    user.email,

  sender_name:
    profile.name ||
    user.email.split("@")[0],

  sender_avatar:
    profile.avatar || "",

  type: "comment",

  message:
    "commented on your post 💬",

  comment_text:
    text,

    post_preview:

    post.type === "poll"
  
      ? "📊 Poll post"
  
      : (post.text || "")
          .slice(0, 80),

  post_id:
    post.id,

  is_read: false




        });

    }

    commentInput.value = "";

    loadComments(
      post.id,
      commentList,
      commentCount,
      user,
      profileMap
    );

  };

// ============================
// INITIAL COMMENTS LOAD
// ============================

await loadComments(
  post.id,
  commentList,
  commentCount,
  user,
  profileMap
);

// ============================
// SHARE
// ============================

el.querySelector(
  ".share-btn"
).onclick = async () => {

  const url =
    `${window.location.origin}/community.html?post=${post.id}`;

  showSharePopup(

    url,

    post.id,

    async () => {

      const newShares =
        (post.shares || 0) + 1;

      post.shares =
        newShares;

      await client
        .from("posts")
        .update({
          shares: newShares
        })
        .eq("id", post.id);

      const shareSpan =
        el.querySelector(
          ".share-btn span"
        );

      shareSpan.textContent =
        newShares;

    }

  );

};



  return el;

}

// ============================
// LOAD COMMENTS
// ============================

async function loadComments(
  postId,
  listEl,
  countEl,
  user,
  profileMap
) {

  const { data } = await client
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", {
      ascending: false
    });

  listEl.innerHTML = "";

  const commentsData =
  data || [];

const main =
  commentsData.filter(
    c => !c.parent_id
  );

const replies =
  commentsData.filter(
    c => c.parent_id
  );

    countEl.textContent =
    main.length;

  // ============================
  // CREATE COMMENT
  // ============================

  function createComment(comment) {

    const div =
      document.createElement("div");

    div.className =
      "comment-item";

    div.innerHTML = `

      <div class="comment-row">

        <div class="comment-avatar">

          ${
            comment.avatar
              ? `
                <img
                  src="${comment.avatar}"
                  class="comment-avatar-img"
                />
              `
              : `
                <span>
                  ${(comment.name || "U")[0].toUpperCase()}
                </span>
              `
          }

        </div>

        <div class="comment-content">

          <strong>
            ${comment.name || "User"}
          </strong>

          <p class="comment-text">
            ${comment.text}
          </p>

          <div class="comment-actions">

            <span class="reply-btn">
              Reply
            </span>

            ${
              user.email === comment.email
                ? `
                  <button
                    class="comment-delete"
                  >
                    Delete
                  </button>
                `
                : ""
            }

          </div>

          <div class="reply-container"></div>

        </div>

      </div>

    `;

    const replyBtn =
      div.querySelector(".reply-btn");

    const deleteBtn =
      div.querySelector(".comment-delete");

    const replyContainer =
      div.querySelector(".reply-container");

    // ============================
    // REPLY
    // ============================

    replyBtn.onclick = () => {

      if (
        replyContainer.querySelector(
          ".reply-box"
        )
      ) return;

      const box =
        document.createElement("div");

      box.className =
        "reply-box";

      box.innerHTML = `

        <input
          class="reply-input"
          placeholder="Reply..."
        />

        <button>
          Send
        </button>

      `;

      replyContainer.appendChild(box);

      const input =
        box.querySelector("input");

      const send =
        box.querySelector("button");

        send.onclick =
          async () => {
        
            const text =
              input.value.trim();
        
            if (!text) return;
        
            const userProfile =
              profileMap[user.email] || {};
        
            // =========================
            // INSERT REPLY
            // =========================
        
            const { error } =
              await client
                .from("comments")
                .insert({
        
                  post_id: postId,
        
                  email: user.email,
        
                  name:
                    userProfile.name ||
                    user.email.split("@")[0],
        
                  avatar:
                    userProfile.avatar ||
                    null,
        
                  text,
        
                  parent_id:
                    comment.id
        
                });
        
            if (error) {
              console.error(error);
              return;
            }
        
            // =========================
            // REPLY NOTIFICATION
            // =========================
        
            if (
              comment.email !== user.email
            ) {
        
              await client
                .from("notifications")
                .insert({
        
                  receiver_email:
                    comment.email,
        
                  sender_email:
                    user.email,
        
                  sender_name:
                    userProfile.name ||
                    user.email.split("@")[0],
        
                  sender_avatar:
                    userProfile.avatar || "",
        
                  type: "reply",
        
                  message:
                    "replied to your comment 🔥",
        
                  comment_text:
                    text,
        
                  post_preview:
                    comment.text,
        
                  post_id:
                    postId,
        
                  is_read: false
        
                });
        
            }
        
            input.value = "";
        
            box.remove();
        
            loadComments(
              postId,
              listEl,
              countEl,
              user,
              profileMap
            );
        
          };
        
    };

    // ============================
    // DELETE
    // ============================

    if (deleteBtn) {

      deleteBtn.onclick =
        async () => {

          // DELETE REPLIES FIRST
        await client
        .from("comments")
        .delete()
        .eq(
        "parent_id",
         comment.id
        );

        // DELETE MAIN COMMENT
        await client
      .from("comments")
      .delete()
      .match({
        id: comment.id,
        email: user.email
      });

          loadComments(
            postId,
            listEl,
            countEl,
            user,
            profileMap
          );

        };

    }

    // ============================
    // NESTED REPLIES
    // ============================

    const childReplies =
      replies.filter(
        r =>
          r.parent_id ===
          comment.id
      );

    childReplies.forEach(reply => {

      const child =
        createComment(reply);

      child.classList.add(
        "reply"
      );

      replyContainer.appendChild(
        child
      );

    });

    return div;

  }

  // ============================
  // ROOT COMMENTS
  // ============================

  main.forEach(comment => {

    const root =
      createComment(comment);

    listEl.appendChild(root);

  });

}

// ---------------- SHARE POPUP ----------------
function showSharePopup(
  url,
  postId,
  updateShareCount
) {

  const popup =
    document.createElement("div");

  popup.className =
    "share-popup";

  const encoded =
    encodeURIComponent(url);

  const sharedKey =
    `shared_${postId}`;

  popup.innerHTML = `

    <div class="share-box">

      <h3>
        Share this post
      </h3>

      <a
        class="share-link"
        href="https://wa.me/?text=${encoded}"
        target="_blank"
        rel="noopener noreferrer"
      >
        WhatsApp
      </a>

      <a
        class="share-link"
        href="https://www.facebook.com/sharer/sharer.php?u=${encoded}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Facebook
      </a>

      <a
        class="share-link"
        href="https://twitter.com/intent/tweet?url=${encoded}"
        target="_blank"
        rel="noopener noreferrer"
      >
        Twitter
      </a>

      <button class="copy-link">
        Copy Link
      </button>

      <button class="close-share">
        Close
      </button>

    </div>

  `;

  document.body.appendChild(
    popup
  );

  // =========================
  // COUNT SHARE ONCE
  // =========================

  async function countShareOnce() {

    if (
      sessionStorage.getItem(
        sharedKey
      )
    ) return;

    sessionStorage.setItem(
      sharedKey,
      "true"
    );

    await updateShareCount();

  }

  // =========================
  // SOCIAL LINKS
  // =========================

  popup.querySelectorAll(
    ".share-link"
  ).forEach(link => {

    link.onclick = async () => {

      await countShareOnce();
    
    };

  });

  // =========================
  // COPY
  // =========================

  popup.querySelector(
    ".copy-link"
  ).onclick = async () => {

    navigator.clipboard.writeText(
      url
    );

    await countShareOnce();

    showToast("Copied 🔗");

  };

  // =========================
  // CLOSE
  // =========================

  popup.querySelector(
    ".close-share"
  ).onclick = () => {

    popup.remove();

  };

  // =========================
  // OUTSIDE CLICK
  // =========================

  popup.onclick = (e) => {

    if (e.target === popup) {

      popup.remove();

    }

  };

}

