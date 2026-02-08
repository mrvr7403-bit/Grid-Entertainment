const ADMIN_KEY = "GRID_ADMIN_7403"; // поменяй на СВОЙ ключ
const bannedUsers = JSON.parse(localStorage.getItem("bannedUsers")) || [];
const comments = JSON.parse(localStorage.getItem("comments")) || [];

let isAdmin = false;

// ====== ВХОД АДМИНА ======
function adminLogin() {
  const key = prompt("Введите админ-ключ:");
  if (key === ADMIN_KEY) {
    isAdmin = true;
    alert("Админ-доступ активирован");
    renderComments();
  } else {
    alert("Неверный ключ");
  }
}

// ====== ФИЛЬТР УГРОЗ ======
function isDangerous(text) {
  const badWords = [
    "взлом", "hack", "ddos", "убью", "угрожаю",
    "сломаю сайт", "взломаю", "kill", "destroy"
  ];
  return badWords.some(word => text.toLowerCase().includes(word));
}

// ====== ДОБАВЛЕНИЕ КОММЕНТАРИЯ ======
function addComment() {
  const name = document.getElementById("name").value.trim();
  const text = document.getElementById("text").value.trim();

  if (!name || !text) return alert("Заполните поля");

  if (bannedUsers.includes(name)) {
    return alert("Вы заблокированы");
  }

  if (isDangerous(text)) {
    alert("Комментарий содержит угрозы. Вы заблокированы.");
    bannedUsers.push(name);
    localStorage.setItem("bannedUsers", JSON.stringify(bannedUsers));
    return;
  }

  comments.push({ name, text });
  localStorage.setItem("comments", JSON.stringify(comments));
  renderComments();
}

// ====== ОТОБРАЖЕНИЕ ======
function renderComments() {
  const box = document.getElementById("comments");
  box.innerHTML = "";

  comments.forEach((c, i) => {
    const div = document.createElement("div");
    div.innerHTML = `<b>${c.name}</b>: ${c.text}`;

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

    box.appendChild(div);
  });
}