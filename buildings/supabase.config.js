/* Подключение к Supabase.
   Пока пусто — сайт работает в локальном режиме на данных из models.js.

   Чтобы подключить базу: вписать адрес проекта и publishable-ключ
   из Supabase → Settings → API. Секретный ключ сюда НЕ класть.

   Прежнее содержимое файла было сломано и роняло страницу:
   адрес "https://.ergregor-cloud.supabase.co" — лишняя точка после //
   ключ без кавычек — не строка, а имя переменной
   Старое лежит в supabase.config.js.bak
*/
window.EGREGOR_SUPABASE_CONFIG = {
  url: "",
  publishableKey: ""
};
