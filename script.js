const ADMIN_KEY = "GRID_ADMIN_7403";
const VERIFIED_ACCOUNT = "Grid Entertainment";

let isAdmin = false;

const bannedUsers = JSON.parse(localStorage.getItem("bannedUsers")) || [];
const comments = JSON.parse(localStorage.getItem("comments")) || [];

function adminLogin() {
  const key = prompt("Админ-ключ:");
  if (key === ADMIN_KEY) {
    isAdmin = true;
    alert("Админ-режим включён");
    renderComments();
  }
}

function isDangerous(text) {
  const bad = ["взлом", "hack", "ddos", "убью", "kill", "destroy"];
  return bad.some(w => text.toLowerCase().includes(w));
}

function addComment() {
  const name = nameInput.value.trim();
  const text = textInput.value.trim();

  if (!name || !text) return;

  if (bannedUsers.includes(name)) {
    alert("Вы заблокированы");
    return;
  }

  if (isDangerous(text)) {
    bannedUsers.push(name);
    localStorage.setItem("bannedUsers", JSON.stringify(bannedUsers));
    alert("Обнаружены угрозы. Вы заблокированы.");
    return;
  }

  comments.push({ name, text });
  localStorage.setItem("comments", JSON.stringify(comments));
  textInput.value = "";
  renderComments();
}

function renderComments() {
  commentsBox.innerHTML = "";

  comments.forEach((c, i) => {
    const div = document.createElement("div");
    div.className = "comment";

    const verified = c.name === VERIFIED_ACCOUNT ? " ✔" : "";
    div.innerHTML = `<b>${c.name}${verified}</b><br>${c.text}`;

    if (isAdmin) {
      const del = document.createElement("button");
      del.textContent = "Удалить";
      del.onclick = () => {
        comments.splice(i, 1);
        localStorage.setItem("comments", JSON.stringify(comments));
        renderComments();
      };
      div.appendChild(del);
    }

    commentsBox.appendChild(div);
  });
}

const nameInput = document.getElementById("name");
const textInput = document.getElementById("text");
const commentsBox = document.getElementById("comments");

renderComments();