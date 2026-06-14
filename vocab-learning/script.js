// 預設高頻核心單字資料庫
const vocabData = [
    {
        word: "Analyze",
        translation: "分析",
        enExample: "We need to analyze the test results carefully.",
        zhExample: "我們需要仔細分析測試結果。"
    },
    {
        word: "Approach",
        translation: "方法 / 接近",
        enExample: "An alternative approach is to solve the problem directly.",
        zhExample: "另一種方法是直接解決這個問題。"
    },
    {
        word: "Context",
        translation: "上下文 / 背景情況",
        enExample: "This word makes sense only in this specific context.",
        zhExample: "這個字只有在這個特定的語境下才講得通。"
    },
    {
        word: "Evaluate",
        translation: "評估 / 評價",
        enExample: "The school will evaluate the students' language proficiency.",
        zhExample: "學校將評估學生的語言熟練度。"
    },
    {
        word: "Significant",
        translation: "顯著的 / 重要的",
        enExample: "There has been a significant increase in online sales.",
        zhExample: "網路銷售額有了顯著的增長。"
    }
];

let currentIndex = 0;
let masteredCount = 0;
let forgotCount = 0;

// DOM 元素獲取
const vocabCard = document.getElementById('vocab-card');
const wordText = document.getElementById('word-text');
const pronounceBtn = document.getElementById('pronounce-btn');
const translationText = document.getElementById('translation-text');
const exampleEn = document.getElementById('example-en');
const exampleZh = document.getElementById('example-zh');

const currentIndexEl = document.getElementById('current-index');
const totalCountEl = document.getElementById('total-count');
const progressBarFill = document.getElementById('progress-bar-fill');

const forgotBtn = document.getElementById('forgot-btn');
const masteredBtn = document.getElementById('mastered-btn');

const resultOverlay = document.getElementById('result-overlay');
const masteredScoreEl = document.getElementById('mastered-score');
const forgotScoreEl = document.getElementById('forgot-score');
const restartBtn = document.getElementById('restart-btn');

// 初始化設定
function initSystem() {
    currentIndex = 0;
    masteredCount = 0;
    forgotCount = 0;
    totalCountEl.innerText = vocabData.length;
    resultOverlay.classList.add('hidden');
    showCard();
}

// 渲染當前單字卡
function showCard() {
    if (currentIndex >= vocabData.length) {
        showSummary();
        return;
    }

    // 確保切換新字時卡片是正面
    vocabCard.classList.remove('flipped');

    // 延遲更新文字，避免翻轉過程中穿幫
    setTimeout(() => {
        const currentData = vocabData[currentIndex];
        wordText.innerText = currentData.word;
        translationText.innerText = currentData.translation;
        exampleEn.innerText = currentData.enExample;
        exampleZh.innerText = currentData.zhExample;

        // 更新上方計數與進度條
        currentIndexEl.innerText = currentIndex + 1;
        const progressPercent = (currentIndex / vocabData.length) * 100;
        progressBarFill.style.width = `${progressPercent}%`;
    }, 150);
}

// 點擊卡片本體：切換 3D 翻面
vocabCard.addEventListener('click', (e) => {
    // 如果點擊的是發音按鈕，不要觸發翻牌
    if (e.target.id === 'pronounce-btn') return;
    vocabCard.classList.toggle('flipped');
});

// 點擊語音按鈕：調用瀏覽器原生 TTS 發音
pronounceBtn.addEventListener('click', () => {
    const currentWord = vocabData[currentIndex].word;
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.lang = 'en-US'; // 設定美式英語發音
    utterance.rate = 0.9;     // 語速稍微放慢一點點，聽得更清楚
    window.speechSynthesis.speak(utterance);
});

// 互動按鈕：記住了
masteredBtn.addEventListener('click', () => {
    masteredCount++;
    currentIndex++;
    showCard();
});

// 互動按鈕：還不熟
forgotBtn.addEventListener('click', () => {
    forgotCount++;
    currentIndex++;
    showCard();
});

// 學習完成：顯示結算畫面
function showSummary() {
    progressBarFill.style.width = '100%';
    masteredScoreEl.innerText = masteredCount;
    forgotScoreEl.innerText = forgotCount;
    resultOverlay.classList.remove('hidden');
}

// 點擊重新開始複習
restartBtn.addEventListener('click', initSystem);

// 啟動系統
initSystem();