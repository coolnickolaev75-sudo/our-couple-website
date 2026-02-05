// config.js - Настройки сайта
const CONFIG = {
    // ВАЖНО: Это ID вашей Google Таблицы из ссылки
    SPREADSHEET_ID: '1-7GI_aSrE-4jdh4IfwgLKMde1gYzGj9jbL675viIZ7M',

    // Названия листов в таблице (должны совпадать!)
    SHEET_NAMES: {
        CITIES: 'ГОРОДА',   // Лист с городами
        PHOTOS: 'ФОТО',     // Лист с фотографиями
        QUOTES: 'ЦИТАТЫ'    // Лист с цитатами
    },

    // Настройки отношений
    RELATIONSHIP_START_DATE: '2025-02-18', // Дата начала отношений

    // Настройки погоды (используем бесплатный OpenWeather API)
    WEATHER: {
        // Замените этот ключ на свой с сайта openweathermap.org (бесплатно)
        API_KEY: 'b9b8e5c6c5e5d5c6b9b8e5c6c5e5d5c6', // Тестовый ключ
        CITY: 'Perm,RU',
        UNITS: 'metric', // Градусы Цельсия
        LANGUAGE: 'ru'
    },

    // Название пары (можно поменять)
    COUPLE_NAMES: 'Лина & [Твое Имя]'
};

// Делаем конфиг глобально доступным
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
}
