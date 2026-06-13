// 請在此處填入你從 OpenWeatherMap 取得的 API Key
const apiKey = 'd25a5a517983583c4cc738bd21e57e70'; 

const searchBtn = document.getElementById('search-btn');
const citySelect = document.getElementById('city-select');
const weatherInfo = document.getElementById('weather-info');
const errorMsg = document.getElementById('error-msg');

// 英文城市名對應中文顯示的對照表
const cityNameMapping = {
    'Taipei': '基隆市 / 台北市 / 新北市',
    'Taoyuan': '桃園市',
    'Hsinchu': '新竹縣市',
    'Miaoli': '苗栗縣',
    'Taichung': '台中市',
    'Changhua': '彰化縣',
    'Nantou': '南投縣',
    'Yunlin': '雲林縣',
    'Chiayi': '嘉義縣市',
    'Tainan': '台南市',
    'Kaohsiung': '高雄市',
    'Pingtung': '屏東縣',
    'Yilan': '宜蘭縣',
    'Hualien': '花蓮縣',
    'Taitung': '台東縣'
};

searchBtn.addEventListener('click', () => {
    getWeather();
});

async function getWeather() {
    const city = citySelect.value;
    
    if (city === '') {
        alert('請先選擇一個縣市！');
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},TW&units=metric&appid=${apiKey}&lang=zh_tw`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayWeather(data, city);

    } catch (error) {
        weatherInfo.classList.add('hidden');
        errorMsg.classList.remove('hidden');
    }
}

function displayWeather(data, selectedCityKey) {
    errorMsg.classList.add('hidden');
    weatherInfo.classList.remove('hidden');

    // 優先使用對照表轉為中文縣市名稱，若找不到則顯示 API 回傳名稱
    const displayName = cityNameMapping[selectedCityKey] || data.name;

    document.getElementById('city-name').innerText = displayName;
    document.getElementById('temperature').innerText = Math.round(data.main.temp);
    document.getElementById('weather-desc').innerText = data.weather[0].description;
    document.getElementById('humidity').innerText = `${data.main.humidity}%`;
    document.getElementById('wind-speed').innerText = `${data.wind.speed} m/s`;

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('weather-icon').src = iconUrl;
}