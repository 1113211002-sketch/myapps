const monthYearDisplay = document.getElementById('month-year-display');
const calendarDays = document.getElementById('calendar-days');
const prevBtn = document.getElementById('prev-month');
const nextBtn = document.getElementById('next-month');

// 儲存當前正在瀏覽的年與月 (預設為今天)
let currentDate = new Date();
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth(); // 0 代表 1 月，5 代表 6 月

const monthNames = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

function renderCalendar() {
    // 1. 取得當前瀏覽月份的第一天是星期幾
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    // 2. 取得當前瀏覽月份的總天數 (下一月的第0天就是本月的最後一天)
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    // 清空舊的日曆格子
    calendarDays.innerHTML = '';

    // 更新頂部的年月顯示
    monthYearDisplay.innerText = `${currentYear}年 ${monthNames[currentMonth]}`;

    // 3. 渲染第一天之前的空白格子（用來對齊星期）
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty');
        calendarDays.appendChild(emptyDiv);
    }

    // 4. 渲染這個月的所有日期
    const today = new Date();
    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.innerText = day;

        // 判斷這一天是不是「今天」，如果是就加上高亮樣式
        if (
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        ) {
            dayDiv.classList.add('today');
        }

        calendarDays.appendChild(dayDiv);
    }
}

// 監聽按鈕：切換到上個月
prevBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
});

// 監聽按鈕：切換到下個月
nextBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
});

// 首次載入執行日曆初始化
renderCalendar();