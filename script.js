// Локальная база данных для теста
let users = {}; // { email: {nick, password, code, verified, badge} }
let currentUser = null;

// --- Модальные окна ---
function openModal(type) {
    document.getElementById('modal-login').classList.add('hidden');
    document.getElementById('modal-register').classList.add('hidden');

    if(type === 'login') document.getElementById('modal-login').classList.remove('hidden');
    if(type === 'register') document.getElementById('modal-register').classList.remove('hidden');
}

function closeModal(type) {
    if(type === 'login') document.getElementById('modal-login').classList.add('hidden');
    if(type === 'register') document.getElementById('modal-register').classList.add('hidden');
}

// Генерация 6-значного кода
function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// --- РЕГИСТРАЦИЯ ---
function registerUser() {
    const email = document.getElementById('reg-email').value;
    const nick = document.getElementById('reg-nick').value;
    const password = document.getElementById('reg-password').value;

    if(users[email]) {
        document.getElementById('reg-msg').innerText = "Аккаунт с таким e-mail уже существует. Попробуйте войти.";
        return;
    }

    const code = generateCode();
    users[email] = { nick, password, code, verified: false, badge: 'Ver3' }; // по умолчанию синяя галочка

    document.getElementById('reg-code-block').classList.remove('hidden');
    document.getElementById('reg-msg').innerText = `Код отправлен на e-mail (тестовый код: ${code})`;
}

function verifyRegCode() {
    const email = document.getElementById('reg-email').value;
    const codeInput = document.getElementById('reg-code').value;

    if(users[email] && users[email].code === codeInput) {
        users[email].verified = true;
        document.getElementById('reg-msg').innerText = "Аккаунт подтвержден! Вы можете войти.";
        document.getElementById('reg-code-block').classList.add('hidden');
    } else {
        document.getElementById('reg-msg').innerText = "Неверный код. Попробуйте снова.";
    }
}

// --- ВХОД ---
function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if(!users[email]) {
        document.getElementById('login-msg').innerText = "Аккаунт с таким e-mail не найден.";
        return;
    }

    if(users[email].password !== password) {
        document.getElementById('login-msg').innerText = "Неверный пароль.";
        return;
    }

    const code = generateCode();
    users[email].code = code;

    document.getElementById('login-code-block').classList.remove('hidden');
    document.getElementById('login-msg').innerText = `Код отправлен на e-mail (тестовый код: ${code})`;
}

function verifyLoginCode() {
    const email = document.getElementById('login-email').value;
    const codeInput = document.getElementById('login-code').value;

    if(users[email] && users[email].code === codeInput) {
        currentUser = users[email];
        showUserPanel();
        document.getElementById('login-code-block').classList.add('hidden');
        document.getElementById('login-msg').innerText = "";
        closeModal('login');
    } else {
        document.getElementById('login-msg').innerText = "Неверный код. Попробуйте снова.";
    }
}

// --- Панель пользователя ---
function showUserPanel() {
    document.getElementById('user-panel').classList.remove('hidden');
    document.getElementById('user-nick').innerText = currentUser.nick;
    document.getElementById('user-badge').src = `Ver logo/${currentUser.badge}`;
}