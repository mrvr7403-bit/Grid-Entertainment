const ADMIN_KEY = "GRID_ADMIN_7403"; // поменяй на свой
let isAdmin = false;

const bannedUsers = JSON.parse(localStorage.getItem("bannedUsers")) || [];
const comments = JSON.parse(localStorage.getItem("comments")) || [];

function adminLogin() {
  const key = prompt("Введите админ-ключ");
  if (key === ADMIN_KEY) {
    isAdmin = true;
    alert("Админ-доступ активирован");
    renderComments();
  } else {
    alert("Неверный ключ");
  }
}

function isDangerous(text) {
  const bad = [
    "взлом", "hack", "ddos", "убью",
    "сломаю", "угроза", "kill", "destroy"
  ];
  return bad.some(w => text.toLowerCase().includes(w));
}

function addComment() {
  const name = document.getElementById("name").value.trim();
  const text = document.getElementById("text").value.trim();

  if (!name || !text) {
    alert("Заполните все поля");
    return;
  }

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

  document.getElementById("text").value = "";
  renderComments();
}

function renderComments() {
  const box = document.getElementById("comments");
  box.innerHTML = "";

  comments.forEach((c, i) => {
    const div = document.createElement("div");
    div.className = "comment";
    div.innerHTML = `<b>${c.name}</b>: ${c.text}`;

    if (isAdmin) {
      const del = document.createElement("button");
      del.textContent = "Удалить";
      del.style.marginLeft = "10px";
      del.onclick = () => {
        comments.splice(i, 1);
        localStorage.setItem("comments", JSON.stringify(comments));
        renderComments();
      };
      div.appendChild(del);
    }

    box.appendChild(div);
  });
}

renderComments();