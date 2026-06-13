const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const startScreen = document.getElementById('start-screen'); // 🏆 新增
const startBtn = document.getElementById('start-btn');       // 🏆 新增
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// 遊戲狀態變數
let score = 0;
let lives = 3; 
let isGameOver = false;
let keys = {}; 

// 1. 玩家太空船物件
const player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 50,
    width: 30,
    height: 30,
    speed: 6,
    color: '#38bdf8' 
};

// 儲存子彈與敵人的陣列
let bullets = [];
let enemies = [];
let enemySpawnTimer = 0;

// 監聽鍵盤事件
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// 監聽空白鍵發射子彈
window.addEventListener('keydown', (e) => {
    // 必須在遊戲開始且還沒結束時才能射擊，並防止網頁按空白鍵時滾動頁面
    if (e.key === ' ') {
        if (startScreen.classList.contains('hidden') && !isGameOver) {
            bullets.push({
                x: player.x + player.width / 2 - 2,
                y: player.y,
                width: 4,
                height: 10,
                speed: 8,
                color: '#fde047' 
            });
        }
        e.preventDefault(); 
    }
});

// 🏆 監聽按鈕：點擊開始遊戲 🏆
startBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden'); // 隱藏說明畫面
    initGame();                          // 正式初始化並跑遊戲
});

// 點擊重新開始
restartBtn.addEventListener('click', initGame);

// 初始化/重置遊戲
function initGame() {
    score = 0;
    lives = 3; 
    isGameOver = false;
    bullets = [];
    enemies = [];
    enemySpawnTimer = 0;
    player.x = canvas.width / 2 - 15;
    scoreEl.innerText = score;
    updateLivesDisplay(); 
    gameOverScreen.classList.add('hidden');
    gameLoop();
}

function updateLivesDisplay() {
    let heartStr = '';
    for (let i = 0; i < lives; i++) {
        heartStr += '❤️';
    }
    livesEl.innerText = heartStr || '❌'; 
}

// 遊戲主要循環
function gameLoop() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    updateLogic();
    drawObjects();

    requestAnimationFrame(gameLoop);
}

// 更新所有物件的座標與邏輯
function updateLogic() {
    // 控制太空船移動
    if ((keys['ArrowLeft'] || keys['a'] || keys['A']) && player.x > 0) {
        player.x -= player.speed;
    }
    if ((keys['ArrowRight'] || keys['d'] || keys['D']) && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    // 更新子彈位置
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) bullets.splice(index, 1);
    });

    // 每隔一段時間隨機產生敵人 (隕石)
    enemySpawnTimer++;
    if (enemySpawnTimer % 40 === 0) {
        const size = Math.random() * 20 + 15; 
        enemies.push({
            x: Math.random() * (canvas.width - size),
            y: -size,
            width: size,
            height: size,
            speed: Math.random() * 2 + 2, 
            color: '#f87171' 
        });
    }

    // 更新敵人位置
    enemies.forEach((enemy, eIndex) => {
        enemy.y += enemy.speed;

        if (checkCollision(player, enemy)) {
            lives--; 
            updateLivesDisplay();
            enemies.splice(eIndex, 1); 

            if (lives <= 0) {
                endGame(); 
            } else {
                enemies = [];
            }
        }

        if (enemy && enemy.y > canvas.height) enemies.splice(eIndex, 1);

        // 檢查子彈是否擊中敵人
        bullets.forEach((bullet, bIndex) => {
            if (enemy && checkCollision(bullet, enemy)) {
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
                score += 10;
                scoreEl.innerText = score;
            }
        });
    });
}

// 繪製畫布上的所有圖形
function drawObjects() {
    // 畫飛船
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();
    ctx.fill();

    // 畫子彈
    bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // 畫敵人
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// AABB 矩形碰撞偵測
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// 遊戲結束處理
function endGame() {
    isGameOver = true;
    finalScoreEl.innerText = score;
    gameOverScreen.classList.remove('hidden');
}

// 🏆 移除原本直撥 initGame() 的動作，交給按鈕控制