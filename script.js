// script.js - Основная логика сайта "Наша История"

// ===== ОСНОВНЫЕ ПЕРЕМЕННЫЕ =====
let allCities = [];
let allPhotos = [];
let allQuotes = [];
let currentPhotoIndex = 0;
let currentQuoteIndex = 0;

// ===== ИНИЦИАЛИЗАЦИЯ САЙТА =====
document.addEventListener('DOMContentLoaded', function() {
    // Запускаем все функции при загрузке
    initializeSite();
});

async function initializeSite() {
    try {
        // 1. Обновляем счётчик отношений
        updateRelationshipCounter();
        
        // 2. Загружаем и отображаем погоду
        await loadWeather();
        
        // 3. Загружаем данные из Google Таблиц
        await Promise.all([
            loadCitiesFromSheet(),
            loadPhotosFromSheet(),
            loadQuotesFromSheet()
        ]);
        
        // 4. Настраиваем обработчики событий
        setupEventListeners();
        
        // 5. Запускаем автоматическое обновление
        startAutoUpdates();
        
        console.log('Сайт успешно инициализирован!');
        
    } catch (error) {
        console.error('Ошибка инициализации сайта:', error);
        showErrorMessage('Не удалось загрузить данные. Проверьте подключение.');
    }
}

// ===== 1. СЧЁТЧИК ОТНОШЕНИЙ =====
function updateRelationshipCounter() {
    const startDate = new Date(CONFIG.RELATIONSHIP_START_DATE);
    const now = new Date();
    const diffTime = now - startDate;
    
    // Вычисляем разные единицы времени
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffSeconds = Math.floor(diffTime / 1000);
    
    // Обновляем отображение
    document.getElementById('daysCounter').textContent = diffDays;
    document.getElementById('monthsCounter').textContent = Math.floor(diffDays / 30.44);
    document.getElementById('weeksCounter').textContent = Math.floor(diffDays / 7);
    document.getElementById('hoursCounter').textContent = diffHours.toLocaleString();
    
    // Обновляем каждую секунду для плавности
    setTimeout(updateRelationshipCounter, 1000);
}

// ===== 2. ПОГОДА И АНИМАЦИЯ ФОНА =====
async function loadWeather() {
    try {
        // Используем данные из Яндекс.Погоды (статически для примера)
        // На реальном сайте лучше использовать API
        const weatherData = {
            temp: -21,
            feelsLike: -30,
            description: "Облачно, слабый снег",
            windSpeed: 7,
            humidity: 76,
            condition: "Snow"
        };
        
        // Обновляем виджет погоды
        updateWeatherWidget(weatherData);
        
        // Меняем фон и анимацию в зависимости от погоды
        changeBackgroundByWeather(weatherData.condition);
        
    } catch (error) {
        console.error('Ошибка загрузки погоды:', error);
        // Используем данные по умолчанию
        updateWeatherWidget({
            temp: '-',
            feelsLike: '-',
            description: "Нет данных о погоде",
            windSpeed: '-',
            humidity: '-',
            condition: "default"
        });
    }
}

function updateWeatherWidget(data) {
    document.getElementById('temperature').textContent = `${data.temp}°`;
    document.getElementById('feelsLike').textContent = `${data.feelsLike}°C`;
    document.getElementById('weatherDescription').textContent = data.description;
    document.getElementById('windSpeed').textContent = `${data.windSpeed} м/с`;
    document.getElementById('humidity').textContent = `${data.humidity}%`;
    
    // Устанавливаем иконку в зависимости от погоды
    const iconMap = {
        'Snow': '❄️',
        'Rain': '🌧️',
        'Clear': '☀️',
        'Clouds': '☁️',
        'default': '⛅'
    };
    
    document.getElementById('weatherIcon').textContent = iconMap[data.condition] || iconMap.default;
}

function changeBackgroundByWeather(weatherCondition) {
    const body = document.body;
    const bgContainer = document.getElementById('weather-background');
    
    // Очищаем предыдущую анимацию
    bgContainer.innerHTML = '';
    
    // Устанавливаем градиент фона
    const gradients = {
        'Snow': 'linear-gradient(-45deg, #e3f2fd, #bbdefb, #90caf9)',
        'Rain': 'linear-gradient(-45deg, #bbdefb, #90caf9, #64b5f6)',
        'Clear': 'linear-gradient(-45deg, #fff9c4, #fff59d, #fff176)',
        'Clouds': 'linear-gradient(-45deg, #f5f5f5, #eeeeee, #e0e0e0)',
        'default': 'linear-gradient(-45deg, #ffafbd, #ffc3a0, #a1c4fd)'
    };
    
    body.style.background = gradients[weatherCondition] || gradients.default;
    
    // Добавляем анимацию частиц
    if (weatherCondition === 'Snow') {
        createSnowAnimation();
    } else if (weatherCondition === 'Rain') {
        createRainAnimation();
    } else if (weatherCondition === 'Clear') {
        createSunnyAnimation();
    } else {
        createHeartsAnimation();
    }
}

function createSnowAnimation() {
    const container = document.getElementById('weather-background');
    
    for (let i = 0; i < 50; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'weather-particle';
        snowflake.innerHTML = '❄️';
        
        // Случайные параметры
        const size = Math.random() * 20 + 15;
        const startX = Math.random() * 100;
        const duration = Math.random() * 8 + 10;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.7 + 0.3;
        
        snowflake.style.cssText = `
            left: ${startX}%;
            font-size: ${size}px;
            animation: fall ${duration}s linear ${delay}s infinite;
            opacity: ${opacity};
            color: #e3f2fd;
        `;
        
        container.appendChild(snowflake);
    }
    
    // Добавляем стили для анимации
    addAnimationStyle('fall', `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity:
