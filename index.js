const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Переменные окружения
const TELEGRAM_TOKEN = process.env.TG_TOKEN;          // токен твоего Telegram бота
const TELEGRAM_CHAT_ID = process.env.TG_CHAT_ID;     // твой Telegram ID
const VK_CONFIRMATION = process.env.VK_CONFIRMATION; // строка подтверждения ВК, например "71ef37f4"

app.post("/", async (req, res) => {
    const data = req.body;

    // Проверка подтверждения Callback API
    if (data.type === "confirmation") {
        console.log("VK подтверждение запроса");
        return res.send(VK_CONFIRMATION); // очень важно вернуть ровно эту строку
    }

    // Новое сообщение ВК
    if (data.type === "message_new") {
        const message = data.object.message.text;
        const fromId = data.object.message.from_id;

        const text = `📩 Новое сообщение VK\n\n👤 От: ${fromId}\n\n💬 ${message}`;

        try {
            await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                chat_id: TELEGRAM_CHAT_ID,
                text: text
            });
        } catch (err) {
            console.error("Ошибка при отправке в Telegram:", err.message);
        }

        return res.send("ok");
    }

    // Любые другие события
    res.send("ok");
});

// Слушаем порт Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
