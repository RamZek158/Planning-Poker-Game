# Планирование задач — Полный обзор проекта

## 1. НАЗНАЧЕНИЕ ПРОЕКТА

Веб-приложение для Agile-команд, реализующее методику **Planning Poker** (покер планирования) — 
игру для оценки трудоёмкости задач. Участники голосуют картами с числовыми значениями 
(последовательность Фибоначчи) или размером футболок (T-shirt sizes), после чего 
результат подсчитывается и показывается всем.

Проект состоит из:
- **Фронтенд:** React 19 + React Router 7 + Socket.IO Client + Webpack
- **Бэкенд:** Express 5 + Socket.IO + PostgreSQL
- **Реальное время:** WebSocket (Socket.IO) для синхронизации голосования

---

## 2. ТЕХНОЛОГИЧЕСКИЙ СТЕК

### Фронтенд (React SPA)
| Технология | Версия | Назначение |
|-----------|--------|------------|
| React | 19 | UI-библиотека |
| React Router | 7 | Клиентская маршрутизация (HashRouter) |
| Socket.IO Client | - | WebSocket-соединение для real-time |
| Webpack | 5 | Сборщик + DevServer (порт 8080) |
| Babel | 7 | Транспиляция JSX/ES6+ |
| react-cookie | - | Управление куками (сессии) |
| @react-oauth/google | - | Вход через Google |
| axios | - | HTTP-запросы |
| qrcode.react | - | (установлен, не используется напрямую) |

### Бэкенд (API + WebSocket)
| Технология | Версия | Назначение |
|-----------|--------|------------|
| Express | 5 | HTTP-сервер |
| Socket.IO | - | WebSocket-сервер (порт 3001) |
| pg (node-postgres) | - | Клиент PostgreSQL |
| bcrypt | 12 раундов | Хеширование паролей |
| jsonwebtoken | - | JWT-токены (access 15m, refresh 30d) |
| helmet | - | HTTP-заголовки безопасности |
| cors | - | CORS (разрешены localhost:3000/3001/8080) |
| express-rate-limit | 100/15min | Лимит запросов к /api/login и /api/register |
| uuid | v4 | Генерация ID пользователей |
| dotenv | - | Загрузка .env |

### База данных
| Компонент | Значение |
|-----------|---------|
| СУБД | PostgreSQL |
| База | `ppg` |
| Таблицы | `users`, `game_settings` |

### Инструменты
| Инструмент | Назначение |
|-----------|-----------|
| Webpack DevServer (8080) | Горячая перезагрузка фронтенда |
| Прокси /api → localhost:3001 | API-запросы из браузера на бэкенд |
| npm test | Заглушка (нет тестов) |

---

## 3. СТРУКТУРА ФАЙЛОВ

```
Планирование задач/
│
├── .env                        # Переменные окружения (БД, JWT, порт)
├── .env.example                # Шаблон для .env
├── .gitignore
├── package.json                # Зависимости и скрипты
├── package-lock.json           # Lock-файл npm
├── babel.config.js             # Конфиг Babel
├── webpack.config.js           # Конфиг Webpack
├── server.js                   # ★ Главный сервер (Express + Socket.IO)
├── mock-api.js                 # (Легаси) Файловое API через ./tmp/
├── README.md                   # Инструкция по tmp/
│
├── public/
│   └── index.html              # HTML-шаблон (точка входа)
│
├── dist/                       # Сборка Webpack (gitignore)
│   ├── index.html
│   ├── main.js
│   └── images/
│
└── src/                        # ★ Исходный код фронтенда
    ├── index.jsx               # Точка входа: рендер App в HashRouter
    ├── App.jsx                 # Корневой компонент: маршруты + провайдеры
    ├── App.css                 # Глобальные стили + импорт variables.css / buttons.css
    ├── RouteWithHeader.jsx     # Обёртка: Header → Outlet
    ├── variables.css           # CSS-переменные (цвета, тени)
    ├── buttons.css             # Стили кнопок
    │
    ├── api/
    │   ├── gameSettings/
    │   │   └── gameSettings.js # API-функции: save, get, delete game-settings
    │   └── users/              # (пусто)
    │
    ├── assets/images/          # Статические изображения
    │   ├── logo.png
    │   ├── logowiner.png       # Лого в хедере
    │   ├── profile-icon.png
    │   └── user.png            # Аватар по умолчанию
    │
    ├── utils/
    │   ├── constants.js        # Системы голосования (Фибоначчи, T-shirt)
    │   └── index.js            # Реэкспорт
    │
    └── components/
        ├── index.js            # Barrel export всех компонентов
        ├── Header/             # Шапка сайта
        ├── HomePage/           # Главная страница
        ├── CreateGame/         # Создание комнаты
        ├── GameRoom/           # Комната голосования (ядро)
        ├── GameTable/          # Стол с игроками и результатами
        ├── PlayingCard/        # Игровая карта
        ├── Carousel/           # Карусель карт для выбора
        ├── Modal/              # Модальное окно (логин/регистрация)
        └── Account/            # Личный кабинет
```

---

## 4. АРХИТЕКТУРА ВЗАИМОДЕЙСТВИЯ

```
┌─ Браузер (React SPA, порт 8080) ──────────────────────┐
│                                                         │
│  HashRouter                                             │
│    ├─ "/"              → HomePage    (главная)          │
│    ├─ "/create-game"   → CreateGame (создание комнаты)  │
│    ├─ "/game/:gameId"  → GameRoom   (игра)             │
│    └─ "/account"       → Account     (профиль)         │
│                                                         │
│  Cookie: "logged-user-info" (данные сессии + JWT)       │
│  Google OAuth → @react-oauth/google                     │
│                                                         │
│  ── HTTP /api/* (через webpack proxy) ──→ localhost:3001│
│  ── WebSocket (socket.io-client) ────────→ localhost:3001│
│                                                         │
└─────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─ Express 5 Server (порт 3001) ─┐  ┌─ Socket.IO ─────────────┐
│  helmet, cors, rate-limit      │  │  join_room → room_state  │
│  REST API:                     │  │  vote → votes_update     │
│   POST /api/register           │  │  show_cards → revealed   │
│   POST /api/login              │  │  restart_game → restarted│
│   POST /api/refresh            │  │  disconnect → user_left  │
│   GET  /api/me                 │  │                          │
│   POST /api/save-game-settings │  │  roomsState (in-memory)  │
│   GET  /api/game-settings/:id  │  │  { roomId:               │
│   POST /api/game-settings/...  │  │    { users, votes,       │
│   DELETE /api/game-settings/:id│  │      showAllVotes } }    │
│   GET  /api/users              │  └──────────────────────────┘
│   DELETE /api/users/:id        │
│   GET  /api/test               │
└──────────────┬─────────────────┘
               │
               ▼
┌─ PostgreSQL (ppg) ──────────────────────────────────────┐
│  Таблица users:                                          │
│   id (UUID), email (UNIQUE), password (bcrypt),          │
│   name, picture, role (user/admin), provider (email/google)│
│                                                          │
│  Таблица game_settings:                                  │
│   id (TEXT PK), user_id (UUID FK), name, voting_type,    │
│   is_deleted (boolean), created_at, last_activity        │
│                                                          │
│  Очистка: раз в сутки удаляются комнаты старше 16 дней   │
└──────────────────────────────────────────────────────────┘
```

---

## 5. СХЕМА БАЗЫ ДАННЫХ (SQL)

### Таблица `users`
```sql
CREATE TABLE users (
    id       UUID PRIMARY KEY,
    email    TEXT UNIQUE NOT NULL,
    password TEXT,                   -- bcrypt hash (NULL для Google OAuth)
    name     TEXT,
    picture  TEXT,                   -- URL аватара
    role     TEXT DEFAULT 'user',    -- 'user' | 'admin'
    provider TEXT                    -- 'email' | 'google'
);
```

### Таблица `game_settings`
```sql
CREATE TABLE game_settings (
    id            TEXT PRIMARY KEY,   -- генерируется на клиенте
    user_id       UUID,              -- владелец комнаты
    name          TEXT,
    voting_type   TEXT,              -- сериализованный массив
    is_deleted    BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMP DEFAULT NOW(),
    last_activity TIMESTAMP
);
```

---

## 6. API — ПОЛНОЕ ОПИСАНИЕ

### Аутентификация

#### `POST /api/register` — Регистрация
- Body: `{ email, password, name? }`
- Ответ: `{ success, token, refreshToken, user: { id, email, user_name, user_picture, role } }`
- Особенности: пароль хешируется bcrypt (12 раундов), name = часть email до @ если не указан

#### `POST /api/login` — Вход
- Body: `{ email, password }`
- Ответ: тот же формат, что и register
- Проверяет также `provider='email'`

#### `POST /api/refresh` — Обновление токена
- Body: `{ refreshToken }`
- Ответ: `{ token, accessToken }`

#### `GET /api/me` — Профиль (JWT required)
- Header: `Authorization: Bearer <token>`
- Ответ: `{ id, email, role, name, picture, provider }`

### Комнаты (Game Settings)

#### `POST /api/save-game-settings` — Создать/обновить комнату
- Body: `{ id, userId, name, votingType }`
- `ON CONFLICT (id) DO UPDATE` — upsert

#### `GET /api/game-settings/:id` — Получить комнату
- Исключает soft-deleted (`is_deleted=false`)

#### `POST /api/game-settings/activity/:id` — Обновить активность
- Устанавливает `last_activity = NOW()`

#### `DELETE /api/game-settings/:id` — Удалить (soft delete)
- Проверка: владелец комнаты или admin
- Авторизация: сначала JWT, затем X-User-Id

### Пользователи

#### `GET /api/users` — Список всех
#### `DELETE /api/users/:id` — Удалить (JWT, себя или admin)

### Здоровье
#### `GET /api/test` — `{ message: "Backend alive" }`

---

## 7. SOCKET.IO — СОБЫТИЯ

| Событие | Направление | Описание | Данные |
|---------|------------|----------|--------|
| `join_room` | Client→Server | Вход в комнату | `{ roomId, user, token }` |
| `room_state` | Server→Client | Текущее состояние | `{ users, votes, showAllVotes }` |
| `users_update` | Server→Client | Список участников | `[{ id, name }]` |
| `vote` | Client→Server | Голосование | `{ roomId, userId, value }` |
| `votes_update` | Server→Client | Обновление голосов | `{ userId: { value } }` |
| `show_cards` | Client→Server | Показать карты (admin) | `{ roomId }` |
| `cards_revealed` | Server→Client | Карты раскрыты | — |
| `restart_game` | Client→Server | Новый раунд (admin) | `{ roomId }` |
| `game_restarted` | Server→Client | Игра перезапущена | — |
| `disconnect` | Client→Server | Отключение | (авто) |

**Логика админа:** проверка `game_settings.user_id === socket.userId` через БД.

---

## 8. КОМПОНЕНТЫ ФРОНТЕНДА — ДЕТАЛЬНО

### 8.1. `src/index.jsx` — Точка входа
- Рендерит `<App />` внутри `<HashRouter>`
- Использует `createRoot` (React 19 API)

### 8.2. `src/App.jsx` — Корень приложения
- Оборачивает в `GoogleOAuthProvider` (clientId из window или hardcoded)
- Оборачивает в `CookiesProvider`
- Определяет маршруты:
  - `"/"` → HomePage
  - `"/create-game"` → CreateGame
  - `"/game/:gameId"` → GameRoom
  - `"/account"` → Account
- Все маршруты внутри `RouteWithHeader` (Header + Outlet)

### 8.3. `src/RouteWithHeader.jsx`
- Простая обёртка: рендерит `<Header />` + `<Outlet />`

### 8.4. Header (Шапка)
**Файл:** `src/components/Header/Header.jsx`
- **Состояние:** menuOpen (дропдаун), isModalOpen (модалка)
- **Сессия:** читает куку `logged-user-info`
- **Логика:**
  - Логотип + ссылка "Планирование задач" → "/"
  - Кнопка "Создать новую игру" → "/create-game"
  - Неавторизован: "Войти / Зарегистрироваться" → Modal
  - Авторизован: аватар + имя → дропдаун (Личный кабинет, Выйти)
  - Выход: удаляет куку, редирект на "/"
- **displayName:** "Header"

### 8.5. HomePage (Главная)
**Файл:** `src/components/HomePage/HomePage.jsx`
- **Секции:**
  1. **Hero:** заголовок про оценку задач + подзаголовок
  2. **Features (4 карточки):** Реальное время, Визуальные результаты, Адаптивность, Интеграции
  3. **How It Works (3 шага):** Создать комнату → Добавить задачи → Начать голосование
  4. **Final CTA:** "Начать сейчас" → /create-game
- **displayName:** "HomePage"

### 8.6. CreateGame (Создание игры) ★
**Файл:** `src/components/CreateGame/CreateGame.jsx`
- **Состояние:** gameName, votingType (по умолч. Фибоначчи), modalOpen, gameId
- **Логика:**
  - Поле ввода названия игры
  - Select: Modified Fibonacci или T-shirts
  - Кнопка "Начать игру":
    - Если не авторизован → Modal
    - Если авторизован → генерирует `gameId` (Math.random + Date.now в base36)
  - `useEffect` на `gameId`: сохраняет настройки через API, редирект на `/game/${gameId}`
- **displayName:** "CreateGame"

### 8.7. GameRoom (Комната игры) ★★★ — ЯДРО СИСТЕМЫ
**Файл:** `src/components/GameRoom/GameRoom.jsx`
- **Состояние:** gameSettings, users, votes, showAllVotes, modalOpen, confirmCloseOpen, showToast, deleteError
- **Socket:** создаёт одно соединение `io(SOCKET_URL)` на уровне модуля
  - SOCKET_URL = `http://localhost:3001` для localhost, иначе `window.location.origin`
- **Жизненный цикл:**
  1. Проверка авторизации (кука) — если нет, Modal
  2. Загрузка gameSettings по `gameId` (из URL)
  3. Определение isAdmin (user_id === currentUserId)
  4. `join_room` → слушает: room_state, users_update, votes_update, cards_revealed, game_restarted
  5. Очистка слушателей при размонтировании
- **Действия:**
  - `handleCardClick(value)` → emit `vote`
  - `handleShowVotes()` → emit `show_cards` (admin)
  - `handleRestartGame()` → emit `restart_game` (admin)
  - `copyLink()` → clipboard API + toast
  - `handleDeleteRoom()` → DELETE /api/game-settings/:id + редирект на "/"
- **UI:** top bar (название, копировать, закрыть), toast, диалог подтверждения, GameTable, Carousel

### 8.8. GameTable (Стол игры) ★★★
**Файл:** `src/components/GameTable/GameTable.jsx`
- **Props:** users, votes, showAllVotes, isAdmin, onShowVotes, onRestartGame
- **Логика:**
  - Прогресс-бар голосования (votedCount / totalUsers)
  - Admin: кнопка "Показать карты" (disabled если 0 голосов, pulse если все проголосовали)
  - После reveal: финальный счёт + кнопка "Новый раунд"
  - **Подсчёт итогового результата (finalScore):**
    1. Нормализация голосов (½, 1/2 → ½)
    2. Фильтрация специальных (? и ☕)
    3. Если нечисловые голоса — большинством голосов
    4. Если все числовые — среднее арифметическое
    5. Если все T-shirt — среднее по индексу шкалы
    6. Иначе — большинством голосов
  - Отображение игроков:
    - Квадратный аватар (squircle) с первой буквой имени
    - Галочка если проголосовал
    - После reveal: анимированная PlayingCard с ответом

### 8.9. PlayingCard (Карта)
**Файл:** `src/components/PlayingCard/PlayingCard.jsx`
- **Props:** cardValue, isSelected
- Рендерит карту со значением и декоративными элементами

### 8.10. Carousel (Карусель)
**Файл:** `src/components/Carousel/Carousel.jsx`
- **Props:** items (массив значений), onCardClick
- **Хук useIsCarouselNeeded:** определяет, нужно ли скроллить
- Если не нужно — плоский список
- Если нужно — карусель с translateX, кнопками влево/вправо, touch-поддержкой
- Каждый элемент — `<PlayingCard />`

### 8.11. Modal (Модалка авторизации)
**Файл:** `src/components/Modal/Modal.jsx`
- **Props:** isOpen, onClose
- **Режимы:** login / register
- **Email регистрация:** POST /api/register → сохраняет в куку `logged-user-info`
- **Email вход:** POST /api/login → сохраняет в куку
- **Google OAuth:** `useGoogleLogin` → /oauth2/v3/userinfo → сохраняет в куку
- Структура куки:
  ```
  logged-user-info = {
    logged_as: "email" | "google",
    logged_in: timestamp,
    user_id: "...",
    user_email: "...",
    user_name: "...",
    user_picture: "..." | null,
    jwt: "...",         (только email)
    refresh_jwt: "..."  (только email)
  }
  ```

### 8.12. Account (Личный кабинет)
**Файл:** `src/components/Account/Account.jsx`
- Редирект на "/" если нет куки
- Для Google пользователей: данные из куки + заглушки
- Для Email пользователей: GET /api/me с JWT
- UI:
  - Левая колонка: аватар, имя, email, бейдж, прогрессбар профиля, инфо-сетка (телефон, роль, дата регистрации, последний вход)
  - Правая колонка: статистика (заказы, визиты, баллы), действия (редактировать, сменить пароль, уведомления, выход)

---

## 9. СИСТЕМЫ ГОЛОСОВАНИЯ

```javascript
// src/utils/constants.js
FIBONACCI_VOTING_SYSTEM = ['', '½', '01', '2', '3', '5', '8', '13', '20', '40', '100', '?', '☕']
T_SHIRT_VOTING_SYSTEM  = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '?', '☕']
```

Специальные карты:
- `?` — Не уверен / Нужно обсуждение
- `☕` — Перерыв / Пасс

---

## 10. БЕЗОПАСНОСТЬ

- **helmet:** HTTP-заголовки безопасности
- **CORS:** только разрешённые origin'ы (localhost:3000/3001/8080 + CLIENT_URL)
- **Rate limit:** 100 запросов за 15 минут на /login и /register
- **Пароли:** bcrypt с 12 раундами соли
- **JWT:**
  - Access token: 15 минут (секрет: JWT_SECRET)
  - Refresh token: 30 дней (секрет: JWT_REFRESH_SECRET)
  - Проверка: middleware `authenticateToken`
- **Soft-delete:** комнаты помечаются `is_deleted=true`, не удаляются физически сразу
- **Google OAuth:** access_token обменивается на userinfo, сохраняется в куку

---

## 11. ЛЕГАСИ / НЕИСПОЛЬЗУЕМЫЙ КОД

### mock-api.js
- Файловое API (читает/пишет в `./tmp/`)
- Не импортируется в `server.js` — не используется
- Функции: users CRUD, gameSettings CRUD через JSON-файлы
- Хранит: `./tmp/users.json` и `./tmp/gameSettings.json`

### src/api/users/ (пустая папка)
- Директория существует, но не содержит файлов

---

## 12. СБОРКА И ЗАПУСК

### Разработка
```bash
# Фронтенд (webpack-dev-server, порт 8080)
npm start          # webpack serve --port 8080

# Бэкенд (отдельно)
node server.js     # Express + Socket.IO, порт 3001

# Продакшен-сборка
npm run build      # webpack → dist/
```

### Webpack config (webpack.config.js)
- **Entry:** `./src/index.jsx`
- **Output:** `dist/main.js`
- **Loaders:** babel-loader (JS/JSX/TS/TSX), css-loader + style-loader (CSS), asset/resource (изображения)
- **Plugins:** HtmlWebpackPlugin (шаблон: public/index.html)
- **DevServer:** порт 8080, hot reload, historyApiFallback, proxy `/api` → `localhost:3001`

### Переменные окружения (.env)
```
PORT=3001
DB_USER=postgres
DB_HOST=localhost
DB_NAME=ppg
DB_PASSWORD=123
DB_PORT=5432
JWT_SECRET=CHANGE_ME_SUPER_SECRET
JWT_REFRESH_SECRET=CHANGE_ME_REFRESH_SECRET
CLIENT_URL=http://localhost:8080
```

---

## 13. ОЧИСТКА КОМНАТ

```javascript
// server.js — раз в 24 часа
DELETE FROM game_settings WHERE created_at < NOW() - INTERVAL '16 days'
```

---

## 14. ЗАМЕЧАНИЯ И ОСОБЕННОСТИ

1. **Нет миграций БД:** таблицы `users` и `game_settings` нужно создавать вручную
2. **Нет тестов:** devDependencies содержат Jest + Testing Library, но нет ни одного тестового файла
3. **Google OAuth fallback clientId** зашит в `App.jsx` (357030709892-...)
4. **Куки не httpOnly:** JWT хранится в куке доступной через JavaScript (react-cookie)
5. **mock-api.js не подключен** к основному серверу
6. **Socket.IO соединение** создаётся на уровне модуля (один экземпляр на всё приложение)
7. **GameID генерируется на клиенте** через Math.random + Date.now (не UUID)
8. **docker-compose / Dockerfile** отсутствуют
9. **Фронтенд на React 19** (новая версия, 2024-2025)
10. **Express 5** (новая версия с async error handling)
11. **Все тексты на русском языке** (интерфейс, сообщения, комментарии в коде)


