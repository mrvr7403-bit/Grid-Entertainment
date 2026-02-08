// Симуляция базы данных на клиенте (для локального теста)
let users = {}; // { email: {nick, password, code, verified, galочка} }

// Показ формы
function showForm(type) {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.add('hidden');

    if(type === 'login') document.getElementById('login-form').classList.remove('hidden');
    if(type === 'register') document.getElementById('register-form').classList.remove('hidden');
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
    users[email] = { nick, password, code, verified: false, galочка: null };

    // Показ блока кода
    document.getElementById('reg-code-block').classList.remove('hidden');
    document.getElementById('reg-msg').innerText = `Код отправлен на e-mail (для локального теста код: ${code})`;
}

// Проверка кода регистрации
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
    document.getElementById('login-msg').innerText = `Код отправлен на e-mail (для локального теста код: ${code})`;
}

// Проверка кода входа
function verifyLoginCode() {
    const email = document.getElementById('login-email').value;
    const codeInput = document.getElementById('login-code').value;

    if(users[email] && users[email].code === codeInput) {
        document.getElementById('login-msg').innerText = `Вход успешен! Добро пожаловать, ${users[email].nick}`;
        document.getElementById('login-code-block').classList.add('hidden');
    } else {
        document.getElementById('login-msg').innerText = "Неверный код. Попробуйте снова.";
    }
}