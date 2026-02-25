const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
    const data = req.body;

    if (data.type === "confirmation") {
        return res.send(process.env.VK_CONFIRMATION);
    }

    if (data.type === "message_new") {
        const message = data.object.message.text;
        const fromId = data.object.message.from_id;

        const text = `📩 Новое сообщение VK\n\n👤 От: ${fromId}\n\n💬 ${message}`;

        await axios.post(`https://api.telegram.org/bot${process.env.TG_TOKEN}/sendMessage`, {
            chat_id: process.env.TG_CHAT_ID,
            text: text
        });

        return res.send("ok");
    }

    res.send("ok");
});

app.listen(process.env.PORT || 3000);
