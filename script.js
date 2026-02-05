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
                opacity: 0;
            }
        }
    `);
}

function createRainAnimation() {
    const container = document.getElementById('weather-background');
    
    for (let i = 0; i < 40; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'weather-particle';
        raindrop.innerHTML = '💧';
        
        const startX = Math.random() * 100;
        const duration = Math.random() * 2 + 1;
        const delay = Math.random() * 2;
        const size = Math.random() * 15 + 10;
        
        raindrop.style.cssText = `
            left: ${startX}%;
            font-size: ${size}px;
            animation: rainFall ${duration}s linear ${delay}s infinite;
            opacity: 0.7;
            color: #bbdefb;
        `;
        
        container.appendChild(raindrop);
    }
    
    addAnimationStyle('rainFall', `
        @keyframes rainFall {
            to {
                transform: translateY(100vh);
                opacity: 0;
            }
        }
    `);
}

function createHeartsAnimation() {
    const container = document.getElementById('weather-background');
    
    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('div');
        heart.className = 'weather-particle';
        heart.innerHTML = '❤️';
        
        const startX = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;
        const size = Math.random() * 25 + 15;
        
        heart.style.cssText = `
            left: ${startX}%;
            font-size: ${size}px;
            animation: float ${duration}s ease-in-out ${delay}s infinite;
            opacity: ${Math.random() * 0.4 + 0.1};
            color: #ff6b9d;
        `;
        
        container.appendChild(heart);
    }
    
    addAnimationStyle('float', `
        @keyframes float {
            0%, 100% {
                transform: translateY(0) translateX(0);
            }
            25% {
                transform: translateY(-20px) translateX(10px);
            }
            50% {
                transform: translateY(-40px) translateX(-10px);
            }
            75% {
                transform: translateY(-20px) translateX(10px);
            }
        }
    `);
}

function createSunnyAnimation() {
    const container = document.getElementById('weather-background');
    
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'weather-particle';
        sparkle.innerHTML = '✨';
        
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        const size = Math.random() * 20 + 10;
        
        sparkle.style.cssText = `
            left: ${startX}%;
            top: ${startY}%;
            font-size: ${size}px;
            animation: sparkle ${duration}s ease-in-out ${delay}s infinite;
            opacity: ${Math.random() * 0.6 + 0.2};
        `;
        
        container.appendChild(sparkle);
    }
    
    addAnimationStyle('sparkle', `
        @keyframes sparkle {
            0%, 100% {
                opacity: 0.2;
                transform: scale(1);
            }
            50% {
                opacity: 0.8;
                transform: scale(1.2);
            }
        }
    `);
}

function addAnimationStyle(name, css) {
    // Удаляем старый стиль если есть
    const oldStyle = document.getElementById(`animation-${name}`);
    if (oldStyle) oldStyle.remove();
    
    // Добавляем новый стиль
    const style = document.createElement('style');
    style.id = `animation-${name}`;
    style.textContent = css;
    document.head.appendChild(style);
}

// ===== 3. РАБОТА С GOOGLE SHEETS =====
async function loadCitiesFromSheet() {
    try {
        const sheetName = CONFIG.SHEET_NAMES.CITIES;
        // ИСПРАВЛЕННЫЙ URL для публичной таблицы
        const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vRcpGIDNKp-5UMW3ZkG_Xd-2Xt31J57yCQcPWE-Hp1pOo5ymcBMw0yO7n8v0jF5rF-wXM4MLoq8q0bT/pub?output=csv`;
        
        console.log('Загружаю города из:', url);
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        
        const csvText = await response.text();
        console.log('Получен CSV:', csvText.substring(0, 200) + '...');
        
        // Разбираем CSV
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        if (lines.length < 2) {
            throw new Error('Таблица пуста или нет данных');
        }
        
        // Заголовки (первая строка)
        const headers = lines[0].split(',').map(h => 
            h.trim().toLowerCase().replace(/ /g, '_')
        );
        console.log('Заголовки:', headers);
        
        // Данные (остальные строки)
        allCities = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const city = {};
            headers.forEach((header, index) => {
                city[header] = values[index] || '';
            });
            return city;
        });
        
        console.log(`Загружено ${allCities.length} городов`);
        console.log('Пример города:', allCities[0]);
        
        // Отображаем города на сайте
        displayCities(allCities);
        
        // Обновляем статистику
        updateCitiesStats();
        
    } catch (error) {
        console.error('Ошибка загрузки городов:', error);
        // Показываем заглушку с информацией об ошибке
        document.getElementById('citiesGrid').innerHTML = `
            <div class="error-city" style="text-align: center; padding: 40px; background: #fff0f0; border-radius: 20px; margin: 20px;">
                <p style="color: #ff3366; font-size: 1.2em;">
                    <i class="fas fa-exclamation-triangle"></i> Не удалось загрузить города
                </p>
                <p style="color: #666; margin-top: 10px;">${error.message}</p>
                <p style="color: #666; margin-top: 10px; font-size: 0.9em;">
                    Проверьте, что таблица опубликована и доступна по ссылке
                </p>
            </div>
        `;
    }
}

function displayCities(cities) {
    const container = document.getElementById('citiesGrid');
    
    if (!cities || cities.length === 0) {
        container.innerHTML = '<div class="no-cities">Городов пока нет в таблице</div>';
        return;
    }
    
    // Сортируем по дате (последние первыми)
    const sortedCities = [...cities].sort((a, b) => {
        const dateA = parseDate(a.дата || '');
        const dateB = parseDate(b.дата || '');
        return dateB - dateA;
    });
    
    // Создаем HTML для каждого города
    let html = '';
    sortedCities.forEach((city, index) => {
        const cityName = city.город || 'Неизвестный город';
        const cityDate = city.дата || 'Дата не указана';
        const cityPhoto = city.фото1 || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
        const cityDesc = city.описание || 'Описание отсутствует';
        
        html += `
            <a href="pages/${cityName.toLowerCase()}.html" class="city-card">
                <div class="city-photo-container">
                    <img src="${cityPhoto}" alt="${cityName}" class="city-photo" loading="lazy">
                </div>
                <div class="city-info">
                    <h3 class="city-name">${cityName}</h3>
                    <div class="city-date">
                        <i class="fas fa-calendar-day"></i>
                        ${cityDate}
                    </div>
                    <p class="city-desc">${cityDesc}</p>
                </div>
            </a>
        `;
    });
    
    container.innerHTML = html;
}

function parseDate(dateString) {
    // Пытаемся распарсить дату в разных форматах
    const formats = [
        'DD.MM.YYYY',
        'YYYY-MM-DD',
        'MM/DD/YYYY'
    ];
    
    for (const format of formats) {
        const parts = dateString.split(/[\.\/\-]/);
        if (parts.length === 3) {
            let year, month, day;
            
            if (format === 'DD.MM.YYYY') {
                day = parseInt(parts[0]);
                month = parseInt(parts[1]) - 1;
                year = parseInt(parts[2]);
            } else if (format === 'YYYY-MM-DD') {
                year = parseInt(parts[0]);
                month = parseInt(parts[1]) - 1;
                day = parseInt(parts[2]);
            }
            
            if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                return new Date(year, month, day);
            }
        }
    }
    
    // Если не удалось распарсить, возвращаем очень старую дату
    return new Date(2000, 0, 1);
}

function updateCitiesStats() {
    if (allCities.length === 0) return;
    
    // Общее количество городов
    document.getElementById('cityCount').textContent = allCities.length;
    
    // Последняя поездка
    const sortedByDate = [...allCities].sort((a, b) => {
        const dateA = parseDate(a.дата || '');
        const dateB = parseDate(b.дата || '');
        return dateB - dateA;
    });
    
    if (sortedByDate[0] && sortedByDate[0].дата) {
        document.getElementById('lastTrip').textContent = sortedByDate[0].дата;
    }
}

async function loadPhotosFromSheet() {
    try {
        const sheetName = CONFIG.SHEET_NAMES.PHOTOS;
        // Используем тот же публичный URL, но для другого листа
        const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vRcpGIDNKp-5UMW3ZkG_Xd-2Xt31J57yCQcPWE-Hp1pOo5ymcBMw0yO7n8v0jF5rF-wXM4MLoq8q0bT/pub?output=csv&gid=${getSheetGid(sheetName)}`;
        
        const response = await fetch(url);
        const csvText = await response.text();
        
        if (csvText.trim() !== '') {
            const lines = csvText.split('\n').filter(line => line.trim() !== '');
            if (lines.length > 1) {
                const headers = lines[0].split(',').map(h => 
                    h.trim().toLowerCase().replace(/ /g, '_')
                );
                
                allPhotos = lines.slice(1).map(line => {
                    const values = line.split(',').map(v => v.trim());
                    const photo = {};
                    headers.forEach((header, index) => {
                        photo[header] = values[index] || '';
                    });
                    return photo;
                });
                
                console.log(`Загружено ${allPhotos.length} фотографий`);
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки фотографий:', error);
        // Игнорируем ошибку, так как фото не обязательны
    }
}

async function loadQuotesFromSheet() {
    try {
        const sheetName = CONFIG.SHEET_NAMES.QUOTES;
        // Используем тот же публичный URL
        const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vRcpGIDNKp-5UMW3ZkG_Xd-2Xt31J57yCQcPWE-Hp1pOo5ymcBMw0yO7n8v0jF5rF-wXM4MLoq8q0bT/pub?output=csv&gid=${getSheetGid(sheetName)}`;
        
        const response = await fetch(url);
        const csvText = await response.text();
        
        if (csvText.trim() !== '') {
            const lines = csvText.split('\n').filter(line => line.trim() !== '');
            if (lines.length > 1) {
                const headers = lines[0].split(',').map(h => 
                    h.trim().toLowerCase().replace(/ /g, '_')
                );
                
                allQuotes = lines.slice(1).map(line => {
                    const values = line.split(',').map(v => v.trim());
                    const quote = {};
                    headers.forEach((header, index) => {
                        quote[header] = values[index] || '';
                    });
                    return quote;
                });
                
                console.log(`Загружено ${allQuotes.length} цитат`);
                
                // Показываем случайную цитату
                if (allQuotes.length > 0) {
                    showRandomQuote();
                }
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки цитат:', error);
        // Если нет цитат, показываем дефолтную
        document.getElementById('quoteText').textContent = "Любовь — это самое прекрасное чувство на свете";
        document.getElementById('quoteAuthor').textContent = "Лина & [Твое Имя]";
        document.getElementById('quoteDate').textContent = "Навсегда";
    }
}

// Вспомогательная функция для получения ID листа
function getSheetGid(sheetName) {
    const gids = {
        'ГОРОДА': '0',
        'ФОТО': '123456', // Замените на реальный ID листа
        'ЦИТАТЫ': '789012' // Замените на реальный ID листа
    };
    return gids[sheetName] || '0';
}

function showRandomQuote() {
    if (allQuotes.length === 0) return;
    
    currentQuoteIndex = Math.floor(Math.random() * allQuotes.length);
    const quote = allQuotes[currentQuoteIndex];
    
    document.getElementById('quoteText').textContent = quote.текст || quote.цитата || 'Нет текста цитаты';
    document.getElementById('quoteAuthor').textContent = quote.автор || 'Неизвестно';
    document.getElementById('quoteDate').textContent = quote.дата || '';
}

// ===== 4. ОБРАБОТЧИКИ СОБЫТИЙ =====
function setupEventListeners() {
    // Кнопка обновления погоды
    const refreshWeatherBtn = document.getElementById('refreshWeather');
    if (refreshWeatherBtn) {
        refreshWeatherBtn.addEventListener('click', loadWeather);
    }
    
    // Кнопка новой цитаты
    const newQuoteBtn = document.getElementById('newQuoteBtn');
    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', showRandomQuote);
    }
}

// ===== 5. АВТООБНОВЛЕНИЕ =====
function startAutoUpdates() {
    // Обновляем счётчик каждую секунду
    setInterval(updateRelationshipCounter, 1000);
    
    // Обновляем погоду каждые 10 минут
    setInterval(loadWeather, 10 * 60 * 1000);
    
    // Обновляем данные из таблицы каждые 5 минут
    setInterval(async () => {
        try {
            await loadCitiesFromSheet();
            await loadPhotosFromSheet();
            await loadQuotesFromSheet();
        } catch (error) {
            console.error('Ошибка автообновления:', error);
        }
    }, 5 * 60 * 1000);
}

// ===== 6. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    
    errorDiv.innerHTML = `
        <p><i class="fas fa-exclamation-circle"></i> ${message}</p>
    `;
    
    document.body.appendChild(errorDiv);
    
    // Убираем сообщение через 5 секунд
    setTimeout(() => {
        errorDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
    
    // Добавляем анимации если их нет
    addAnimationStyle('slideIn', `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `);
    
    addAnimationStyle('slideOut', `
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `);
}

// Экспортируем функции для отладки
if (typeof window !== 'undefined') {
    window.debug = {
        reloadCities: loadCitiesFromSheet,
        reloadWeather: loadWeather,
        showRandomQuote: showRandomQuote,
        getCities: () => allCities,
        getPhotos: () => allPhotos,
        getQuotes: () => allQuotes
    };
}
