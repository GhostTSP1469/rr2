# DebtFlow

DebtFlow — это персональный трекер долгов и платежей на React + Vite. Приложение работает с авторизацией, контактами, папками, долгами и платежами.

## Что делает проект

- Авторизация и регистрация через API
- Дашборд с общей картиной баланса
- Управление контактами: создание, редактирование, удаление
- Управление папками: создание, редактирование, удаление, баланс папки по контактам
- Управление долгами: создание, редактирование, удаление, просмотр деталей
- Запись платежей по долгам
- Поиск по контактам и долгам
- Мобильная навигация и адаптивные карточки на мобильных экранах

## Структура проекта

### Основные файлы

- `src/App.tsx` — маршрутизация приложения через React Router
- `src/pages/auth-page.tsx` — экран входа и регистрации
- `src/components/home.tsx` — основной экран с дашбордом, страницами `debts`, `contacts`, `folders`, `profile`
- `src/store/authStore.ts` — Zustand-хранилище и работа с API
- `src/components/axconfig/axconfig.ts` — Axios-конфигурация, авторизационные заголовки, refresh/logout
- `src/constants/navigation.ts` — набор пунктов навигации

### Вспомогательные компоненты

- `src/components/layout/app-sidebar.tsx` — десктопный сайдбар
- `src/components/layout/mobile-nav.tsx` — мобильная нижняя навигация
- `src/components/layout/app-header.tsx` — заголовок, поиск, кнопка обновления данных
- `src/components/common/feedback-messages.tsx` — вывод ошибок и уведомлений
- `src/components/common/logout-toast.tsx` — уведомление об успешном выходе
- `src/components/ui/button.tsx` — компонент кнопки
- `src/components/ui/dialog.tsx` — обёртка Radix Dialog для модалок
- `src/components/folders/folder-card.tsx` — карточка папки
- `src/routes/protected-route.tsx`, `src/routes/public-route.tsx` — защита маршрутов по токену
- `src/lib/utils.ts` — утилита `cn` для объединения CSS-классов

## Используемые библиотеки

- `react`, `react-dom` — UI
- `react-router-dom` — роутинг
- `zustand` — глобальное состояние
- `react-hook-form` — формы
- `axios` — HTTP-запросы
- `@radix-ui/react-dialog` — модальные окна
- `tailwindcss` — стили
- `vite` — сборка и дев-сервер
- `typescript` — типизация

## API и переменные окружения

Приложение обращается к API через переменную `VITE_API_URL`.

Пример `.env`:

```env
VITE_API_URL=https://debt-back-prod.onrender.com/api
```

Все SPA-маршруты перенаправляются на `index.html` через `vercel.json`.

## Как запускать

1. Установить зависимости:

```bash
npm install
```

2. Запустить дев-сервер:

```bash
npm run dev
```

3. Открыть адрес, который покажет Vite.

## Особенности мобильной версии

- Поисковая строка теперь адаптивная на мобильных экранах
- Нижняя панель навигации фиксирована и не перекрывает контент
- Основной экран получает дополнительный отступ снизу для мобильной навигации
- Таблицы `Upcoming payments` и `All debts` на мобильных экранах заменяются на карточки

## Что важно знать

- Токены хранятся в `localStorage`: `access_token`, `refresh_token`
- `axiosRequest` автоматически добавляет `Authorization: Bearer` к запросам
- Компоненты форм используют `react-hook-form` для валидации
- Модальные окна построены на `@radix-ui/react-dialog`
- API должен возвращать токен и пользователя в полях `token`/`accessToken`/`access_token` и `user`
