const puppeteer = require('puppeteer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const schedule = require('node-schedule');
const dotenv = require('dotenv');

dotenv.config();

let message_id;

const handler = async (query) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(`https://www.google.com/search?q=${query}`);
  const element = await page.$('#tads');
  let result;
  if (element) {
    result = `Suspicious ads found! Please check the screenshot. ${new Date().toLocaleString()}`
    await page.screenshot({path: 'example.png'});
    console.log(`${result}`);
    const data = new FormData();
    data.append('chat_id', Number(process.env.CHAT_ID));
    data.append('photo', fs.createReadStream('example.png'));
    data.append('caption', result);
    if (message_id) {
      await axios({
        method: 'post',
        url: `https://api.telegram.org/bot${process.env.BOT_TOKEN}/deleteMessage`,
        data: {
          chat_id: Number(process.env.CHAT_ID),
          message_id: message_id,
        },
      })
          .catch((error) => {
            console.log(error);
          });
    }
    const res = await axios({
      method: 'post',
      url: `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`,
      data: data,
    })
        .catch((error) => {
          console.log(error);
        });
    message_id = res.data.result.message_id;
  } else {
    result = `No suspicious ads found. ${new Date().toLocaleString()}`
    console.log(result);
  }
  
  await browser.close();
};

let rule = new schedule.RecurrenceRule();
rule.minute = [0, 10, 20, 30, 40, 50];

schedule.scheduleJob(rule, () => {
  handler("nest+protocol");
});