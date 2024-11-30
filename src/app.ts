import express from 'express';
import bodyParser from 'body-parser';
import { CakeShopBot } from './cakeShopBot';
import { config } from './config';

const app = express();
const bot = new CakeShopBot();

app.use(bodyParser.json());

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
    bot.startBot();
});