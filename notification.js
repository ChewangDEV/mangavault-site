// ---------------- ELEMENTS ----------------
const notifBtn = document.getElementById("notifBtn");
const notifDropdown = document.getElementById("notifDropdown");
const notifList = document.getElementById("notifList");
const notifBadge = document.getElementById("notifBadge");

// ---------------- TOGGLE DROPDOWN ----------------
notifBtn.onclick = () => {
  notifDropdown.classList.toggle("active");
};

// ---------------- CLOSE DROPDOWN ----------------
document.addEventListener("click", (e) => {

  if (
    !notifBtn.contains(e.target) &&
    !notifDropdown.contains(e.target)
  ) {
    notifDropdown.classList.remove("active");
  }

});

// ---------------- LOAD NOTIFICATIONS ----------------
async function loadNotifications() {

  if (!currentUser) return;

  const { data, error } = await client
    .from("notifications")
    .select("*")
    .eq("receiver_email", currentUser.email)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Notification Load Error:", error);
    return;
  }


  // ---------------- BADGE ----------------
  const unreadCount =
    data.filter(n => !n.is_read).length;

  if (unreadCount <= 0) {

    notifBadge.style.display = "none";
    notifBadge.textContent = "";

  } else {

    notifBadge.style.display = "flex";
    notifBadge.textContent = unreadCount;

  }

  // ---------------- EMPTY STATE ----------------
  notifList.innerHTML = `
  <div class="notif-header">
    Notifications
  </div>
`;

if (!data.length) {

  notifList.innerHTML += `
    <div class="empty-notif">
      No notifications yet 🔥
    </div>
  `;

  return;
}

  // ---------------- RENDER ----------------
  data.forEach((n) => {

    const item = document.createElement("div");

    item.className = `
      notif-item
      ${!n.is_read ? "unread" : ""}
    `;

    item.innerHTML = `
      <div class="notif-content">

      
      <div class="notif-top">
      
        <div class="notif-avatar">
      
          ${
            n.sender_avatar
              ? `
                <img
                  src="${n.sender_avatar}"
                  class="notif-avatar-img"
                >
              `
              : `
                <span>
                  ${n.sender_name?.[0] || "U"}
                </span>
              `
          }
      
        </div>
      
        <div class="notif-text">
      
          <strong>
            ${n.sender_name}
          </strong>
      
          <div class="notif-message">
            ${n.message}
          </div>
      
          ${
            n.comment_text
              ? `
                <div class="notif-comment">
                  "${n.comment_text}"
                </div>
              `
              : ""
          }
      
          ${
            n.post_preview
              ? `
                <div class="notif-post-preview">
                  ${n.post_preview}
                </div>
              `
              : ""
          }
      
          <div class="notif-time">
            ${timeAgo(n.created_at)}
          </div>
      
        </div>
      
      </div>

        

      </div>
    `;

    // ---------------- CLICK ----------------
    item.onclick = async () => {

      const { error } = await client
        .from("notifications")
        .update({
          is_read: true
        })
        .eq("id", n.id);

      if (error) {
        console.error(
          "Read Notification Error:",
          error
        );
      }

      
      
      // MARK AS READ IN UI
      item.classList.remove("unread");
      
      // UPDATE BADGE
      loadNotifications();
      
      // CLOSE DROPDOWN
      notifDropdown.classList.remove("active");
      
      // SCROLL TO POST
      const targetPost =
        document.querySelector(
          `[data-post-id="${n.post_id}"]`
        );
      
      if (targetPost) {
      
        targetPost.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      
        targetPost.classList.add(
          "highlight-post"
        );
      
        setTimeout(() => {
      
          targetPost.classList.remove(
            "highlight-post"
          );
      
        }, 2000);
      
      }
      
      

    };

    notifList.appendChild(item);

  });

}

// ---------------- REALTIME ----------------
function initNotificationRealtime() {

  if (!currentUser) return;

  // REMOVE OLD CHANNELS
  client.removeAllChannels();

  client
    .channel(
      `notifications-${currentUser.email}`
    )
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter:
          `receiver_email=eq.${currentUser.email}`
      },
      (payload) => {

        console.log(
          "Realtime notification:",
          payload
        );

        showToast("New notification 🔥");

        loadNotifications();

      }
    )
    .subscribe((status) => {

      console.log(
        "Realtime Status:",
        status
      );

    });

}

// ---------------- TIME AGO ----------------
function timeAgo(date) {

  const seconds = Math.floor(
    (new Date() - new Date(date)) / 1000
  );

  const intervals = {

    y: 31536000,
    mo: 2592000,
    d: 86400,
    h: 3600,
    m: 60

  };

  for (let key in intervals) {

    const value =
      Math.floor(seconds / intervals[key]);

    if (value >= 1) {
      return `${value}${key} ago`;
    }

  }

  return "Just now";

}
