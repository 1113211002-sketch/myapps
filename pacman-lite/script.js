const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const gameOverScreen = document.getElementById('game-over-screen');
const endTitle = document.getElementById('end-title');
const finalScoreEl = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

// 地圖大小設定：20x20 的格子，每格 20 像素 (共 400x400)
const tileSize = 20;
const mapSize = 20;

let score = 0;
let isGameActive = false;
let gameInterval;

// 二維地圖陣列：1 = 藍色牆壁, 0 = 有豆子的空地
let map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,0,1,1,0,0,1,1,0,1,1,0,1,0,1],
    [1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1],
    [1,1,1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,1],
    [1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1],
    [1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,0,1,1,1,1,0,1,1,0,1,1,1,1,0,1,1,1],
    [1,1,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,1,1],
    [1,1,1,0,1,0,1,1,0,1,1,0,1,1,0,1,0,1,1,1],
    [1,0,0,0,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,1],
    [1,0,1,0,1,1,0,1,1,0,0,1,1,0,1,1,0,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// 複製一份乾淨的地圖供重玩時重置
const originalMap = JSON.parse(JSON.stringify(map));

// 角色物件（座標皆以「網格索引」計算，例如 x:1, y:1 代表在第一格）
let pacman = { x: 1, y: 1, nextDir: null, currentDir: null };
let ghost = { x: 18, y: 17, dir: 'LEFT' };

// 監聽鍵盤方向鍵
window.addEventListener('keydown', (e) => {
    if (!isGameActive) return;
    if (e.key === 'ArrowUp') pacman.nextDir = 'UP';
    if (e.key === 'ArrowDown') pacman.nextDir = 'DOWN';
    if (e.key === 'ArrowLeft') pacman.nextDir = 'LEFT';
    if (e.key === 'ArrowRight') pacman.nextDir = 'RIGHT';
    
    // 防止網頁按方向鍵時滾動
    if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
});

// 開始與重新開始按鈕
startBtn.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    initGame();
});
restartBtn.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    initGame();
});

function initGame() {
    score = 0;
    scoreEl.innerText = score;
    isGameActive = true;
    map = JSON.parse(JSON.stringify(originalMap)); // 重置地圖豆子
    pacman = { x: 1, y: 1, nextDir: null, currentDir: null };
    ghost = { x: 18, y: 17, dir: 'LEFT' };
    
    // 每 250 毫秒（0.25秒）前進一格，節奏比較適合復古遊戲
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameStep, 230);
}

// 核心：每一步的遊戲邏輯
function gameStep() {
    if (!isGameActive) return;

    movePacman();
    moveGhost();
    checkCollisions();
    checkWinCondition();

    // 繪製新畫面
    draw();
}

// 嘗試移動吃豆人
function movePacman() {
    // 優先看玩家有沒有按新的方向，如果新方向撞牆，就繼續走舊方向
    let dirToTry = pacman.nextDir || pacman.currentDir;
    if (!dirToTry) return;

    let nextX = pacman.x;
    let nextY = pacman.y;

    if (dirToTry === 'UP') nextY--;
    if (dirToTry === 'DOWN') nextY++;
    if (dirToTry === 'LEFT') nextX--;
    if (dirToTry === 'RIGHT') nextX++;

    // 如果下一步不是牆壁 (不等於 1)，就移動過去
    if (map[nextY] && map[nextY][nextX] !== 1) {
        pacman.x = nextX;
        pacman.y = nextY;
        pacman.currentDir = dirToTry; // 成功轉向
    } else if (pacman.currentDir !== dirToTry) {
        // 如果新方向撞牆，嘗試繼續走原來的方向
        nextX = pacman.x;
        nextY = pacman.y;
        if (pacman.currentDir === 'UP') nextY--;
        if (pacman.currentDir === 'DOWN') nextY++;
        if (pacman.currentDir === 'LEFT') nextX--;
        if (pacman.currentDir === 'RIGHT') nextX++;
        
        if (map[nextY] && map[nextY][nextX] !== 1) {
            pacman.x = nextX;
            pacman.y = nextY;
        }
    }

    // 檢查吃豆子 (0 代表有豆子，吃完變成 2 代表空地)
    if (map[pacman.y][pacman.x] === 0) {
        map[pacman.y][pacman.x] = 2;
        score += 10;
        scoreEl.innerText = score;
    }
}

// 隨機移動鬼魂
function moveGhost() {
    const directions = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    let validMoves = [];

    // 找出周圍所有不是牆壁的路
    directions.forEach(d => {
        let gx = ghost.x;
        let gy = ghost.y;
        if (d === 'UP') gy--;
        if (d === 'DOWN') gy++;
        if (d === 'LEFT') gx--;
        if (d === 'RIGHT') gx++;

        if (map[gy] && map[gy][gx] !== 1) {
            validMoves.push(d);
        }
    });

    // 隨機選一條路走（如果原本的方向能走，有較高機率繼續直走，增加智能感）
    if (validMoves.includes(ghost.dir) && Math.random() > 0.3) {
        // 保持原方向
    } else if (validMoves.length > 0) {
        ghost.dir = validMoves[Math.floor(Math.random() * validMoves.length)];
    }

    if (ghost.dir === 'UP') ghost.y--;
    if (ghost.dir === 'DOWN') ghost.y++;
    if (ghost.dir === 'LEFT') ghost.x--;
    if (ghost.dir === 'RIGHT') ghost.x++;
}

// 檢查是否被抓
function checkCollisions() {
    if (pacman.x === ghost.x && pacman.y === ghost.y) {
        endGame(false);
    }
}

// 檢查是否獲勝 (地圖上沒有半個 0 就算贏)
function checkWinCondition() {
    let hasDots = false;
    for (let r = 0; r < map.length; r++) {
        if (map[r].includes(0)) {
            hasDots = true;
            break;
        }
    }
    if (!hasDots) {
        endGame(true);
    }
}

function endGame(isWin) {
    isGameActive = false;
    clearInterval(gameInterval);
    finalScoreEl.innerText = score;
    
    if (isWin) {
        endTitle.innerText = "🎉 恭喜獲勝！ 🎉";
        endTitle.style.color = "#48bb78";
    } else {
        endTitle.innerText = "💥 遊戲結束 💥";
        endTitle.style.color = "#f56565";
    }
    gameOverScreen.classList.remove('hidden');
}

// 繪製地圖與角色
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === 1) {
                // 畫藍色牆壁
                ctx.fillStyle = '#1e3a8a';
                ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
            } else if (map[r][c] === 0) {
                // 畫黃色小豆子
                ctx.fillStyle = '#fef08a';
                ctx.beginPath();
                ctx.arc(c * tileSize + tileSize/2, r * tileSize + tileSize/2, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    // 畫吃豆人 (黃色圓形)
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(pacman.x * tileSize + tileSize/2, pacman.y * tileSize + tileSize/2, tileSize/2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // 畫鬼魂 (紅色圓角矩形/簡單形狀)
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(ghost.x * tileSize + 2, ghost.y * tileSize + 2, tileSize - 4, tileSize - 4);
}