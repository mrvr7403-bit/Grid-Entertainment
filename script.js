// --- Локальные пользователи ---
let users = {};
let currentUser = null;

// --- Частицы на фоне ---
const canvas = document.getElementById('particle-bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 80;

for(let i=0;i<particleCount;i++){
    particles.push({
        x: Math.random()*canvas.width,
        y: Math.random()*canvas.height,
        vx: (Math.random()-0.5)*1.5,
        vy: (Math.random()-0.5)*1.5,
        size: Math.random()*3+1
    });
}

function animateParticles(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let p of particles){
        p.x += p.vx;
        p.y += p.vy;

        // Реакция на мышь
        let dx = mouse.x - p.x;
        let dy = mouse.y - p.y;
        let dist = Math.sqrt(dx*dx+dy*dy);
        if(dist<100){
            p.vx += dx*0.0005;
            p.vy += dy*0.0005;
        }

        ctx.beginPath();
        ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
    requestAnimationFrame(animateParticles);
}

let mouse = {x:0,y:0};
window.addEventListener('mousemove', e=>{ mouse.x=e.clientX; mouse.y=e.clientY; });

animateParticles();

// --- Модальные окна ---
function openModal(type){
    document.getElementById('modal-login').classList.add('hidden');
    document.getElementById('modal-register').classList.add('hidden');
    if(type==='login') document.getElementById('modal-login').classList.remove('hidden');
    if(type==='register') document.getElementById('modal-register').classList.remove('hidden');
}

function closeModal(type){
    if(type==='login') document.getElementById('modal-login').classList.add('hidden');
    if(type==='register') document.getElementById('modal-register').classList.add('hidden');
}

// --- Генерация кода ---
function generateCode(){ return Math.floor(100000+Math.random()*900000).toString(); }

// --- Регистрация ---
function registerUser(){
    const email = document.getElementById('reg-email').value;
    const nick = document.getElementById('reg-nick').value;
    const password = document.getElementById('reg-password').value;
    if(users[email]){ document.getElementById('reg-msg').innerText="Аккаунт существует"; return; }
    const code = generateCode();
    users[email] = { nick,password,code,verified:false,badge:'Ver3',posts:[] };
    document.getElementById('reg-code-block').classList.remove('hidden');
    document.getElementById('reg-msg').innerText = `Код (тест): ${code}`;
}

function verifyRegCode(){
    const email=document.getElementById('reg-email').value;
    const codeInput=document.getElementById('reg-code').value;
    if(users[email]&&users[email].code===codeInput){
        users[email].verified=true;
        document.getElementById('reg-msg').innerText="Аккаунт подтвержден! Войдите.";
        document.getElementById('reg-code-block').classList.add('hidden');
    } else document.getElementById('reg-msg').innerText="Неверный код.";
}

// --- Вход ---
function loginUser(){
    const email=document.getElementById('login-email').value;
    const password=document.getElementById('login-password').value;
    if(!users[email]){ document.getElementById('login-msg').innerText="Аккаунт не найден"; return; }
    if(users[email].password!==password){ document.getElementById('login-msg').innerText="Неверный пароль"; return; }
    const code=generateCode(); users[email].code=code;
    document.getElementById('login-code-block').classList.remove('hidden');
    document.getElementById('login-msg').innerText=`Код (тест): ${code}`;
}

function verifyLoginCode(){
    const email=document.getElementById('login-email').value;
    const codeInput=document.getElementById('login-code').value;
    if(users[email]&&users[email].code===codeInput){
        currentUser=users[email];
        showUserPanel();
        closeModal('login');
        document.getElementById('auth-screen').classList.add('hidden');
    } else document.getElementById('login-msg').innerText="Неверный код.";
}

// --- Панель пользователя ---
function showUserPanel(){
    document.getElementById('user-panel').classList.remove('hidden');
    document.getElementById('user-nick').innerText=currentUser.nick;
    document.getElementById('user-badge').src=`Ver logo/${currentUser.badge}.png`;
    renderPosts();
}

// --- Посты ---
function addPost(){
    const postText=document.getElementById('new-post').value.trim();
    if(!postText) return;
    currentUser.posts.push({text:postText});
    renderPosts();
    document.getElementById('new-post').value='';
}

function renderPosts(){
    const list=document.getElementById('posts-list'); list.innerHTML='';
    currentUser.posts.forEach(p=>{
        const div=document.createElement('div'); div.className='post';
        div.innerText=p.text; list.appendChild(div);
    });
}