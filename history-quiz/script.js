// 歷史知識題庫資料庫
const quizData = [
    {
        question: "世界上最長的古代防禦建築，被譽為世界七大奇蹟之一的是？",
        options: ["羅馬競技場", "萬里長城", "獅身人面像", "巨石陣"],
        correct: 1 // 萬里長城 (索引值從 0 開始計算)
    },
    {
        question: "歐洲文藝復興運動發源於哪一個國家？",
        options: ["英國", "法國", "德國", "義大利"],
        correct: 3 // 義大利
    },
    {
        question: "發明活字印刷術，對人類文化傳播做出重大貢獻的古代發明家是？",
        options: ["蔡倫", "畢昇", "張衡", "祖沖之"],
        correct: 1 // 畢昇
    },
    {
        question: "歷史上著名的「大航海時代」，哥倫布首航橫渡大西洋是在哪一年？",
        options: ["1492年", "1588年", "1624年", "1776年"],
        correct: 0 // 1492年
    },
    {
        question: "古代世界三大宗教之中，發源時間最早的是哪一個？",
        options: ["佛教", "基督教", "伊斯蘭教", "印度教"],
        correct: 0 // 佛教 (約西元前6世紀，印度教雖古老但一般不在三大宗教之列)
    }
];

let currentIdx = 0;
let currentScore = 0;

// 取得 DOM 元素
const currentQuestionEl = document.getElementById('current-question');
const totalQuestionsEl = document.getElementById('total-questions');
const scoreEl = document.getElementById('score');
const progressBarFill = document.getElementById('progress-bar-fill');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');

const resultScreen = document.getElementById('result-screen');
const finalScoreEl = document.getElementById('final-score');
const resultEvaluation = document.getElementById('result-evaluation');
const restartBtn = document.getElementById('restart-btn');

// 初始化測驗
function startQuiz() {
    currentIdx = 0;
    currentScore = 0;
    totalQuestionsEl.innerText = quizData.length;
    scoreEl.innerText = currentScore;
    resultScreen.classList.add('hidden');
    loadQuestion();
}

// 載入當前題目
function loadQuestion() {
    nextBtn.classList.add('hidden');
    optionsContainer.innerHTML = ''; // 清空先前的選項

    const currentQuiz = quizData[currentIdx];
    
    // 更新題號與題目文字
    currentQuestionEl.innerText = currentIdx + 1;
    questionText.innerText = currentQuiz.question;

    // 更新進度條
    const progressPercent = (currentIdx / quizData.length) * 100;
    progressBarFill.style.width = `${progressPercent}%`;

    // 動態生成四個選項按鈕
    currentQuiz.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('option-btn');
        // 綁定點擊事件
        button.addEventListener('click', () => selectAnswer(index, button));
        optionsContainer.appendChild(button);
    });
}

// 玩家選擇答案時的處理
function selectAnswer(selectedIndex, clickedBtn) {
    const currentQuiz = quizData[currentIdx];
    const allButtons = optionsContainer.querySelectorAll('.option-btn');

    // 1. 鎖定所有按鈕，不允許重複點擊或修改答案
    allButtons.forEach(btn => btn.disabled = true);

    // 2. 判斷答案是否正確
    if (selectedIndex === currentQuiz.correct) {
        clickedBtn.classList.add('correct'); // 答對了：變綠色
        currentScore += 20;                  // 每題 20 分
        scoreEl.innerText = currentScore;
    } else {
        clickedBtn.classList.add('wrong');   // 答錯了：選中的變紅色
        // 同時把正確的答案標記出來（綠色），給玩家回饋
        allButtons[currentQuiz.correct].classList.add('correct');
    }

    // 3. 顯示下一題按鈕
    nextBtn.classList.remove('hidden');
}

// 點擊下一題按鈕
nextBtn.addEventListener('click', () => {
    currentIdx++;
    if (currentIdx < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// 顯示最終結算畫面
function showResults() {
    progressBarFill.style.width = '100%';
    finalScoreEl.innerText = currentScore;

    // 根據分數給予動態評語
    let evaluation = "";
    if (currentScore === 100) {
        evaluation = "👑 太厲害了！你是無所不知的歷史小學霸！";
    } else if (currentScore >= 60) {
        evaluation = "👍 表現得很好！你對歷史有相當程度的了解！";
    } else {
        evaluation = "📚 再接再厲！多看點歷史故事，下次一定能拿高分！";
    }
    resultEvaluation.innerText = evaluation;
    
    resultScreen.classList.remove('hidden');
}

// 重新開始挑戰
restartBtn.addEventListener('click', startQuiz);

// 網頁載入後自動啟動
startQuiz();