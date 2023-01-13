# Phishing Ad Monitor Bot

This bot monitors a list of phishing ad domains and reports them to the Telegram group.

## How to use

1. Create a Telegram bot and get the token.
2. Create a Telegram group and add the bot to the group. You need some people to report the phishing ads to Google.
3. Get the group ID by sending a message to the bot and check the log.(getUpdates)
4. Edit .env, set BOT_TOKEN and CHAT_ID.
5. Add the bot to your group and set it as an admin.
6. Run the bot. Like: `pm2 start index.js --name "Phishing Ad Monitor Bot"`.
7. Enjoy it.