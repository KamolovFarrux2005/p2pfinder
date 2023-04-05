const { TELEGRAM_BOT_TOKEN } = process.env;
const { Telegraf, Markup, Context} = require('telegraf');
const context = new Context()
const session = require('telegraf-session-mongoose');
const db = require('../models/index.js');

module.exports = class Telegram {
    constructor(args = []) {
        const { hooks } = args;

        this._bot;
        this._hooks = hooks;
        this._token = TELEGRAM_BOT_TOKEN;
        // this._adminIds = ADMIN_IDS.split(',');

        this._inlinekeyboards = {
            'start': Markup.inlineKeyboard([
                Markup.button.callback('Top Routes', 'routes'),
                Markup.button.callback('Settings', 'settings'),
            ], {
                columns: 1
            }).resize().oneTime(),
            'confirm': Markup.inlineKeyboard([
                Markup.button.callback('Confirm✅', 'confirm'),
                Markup.button.callback('Reset❌', 'dispatch'),
            ], {
                columns: 1
            }).resize().oneTime(),
        }
        this._keyboard = Markup.keyboard([
            '/back',
            '/help',
        ], {
            columns: 1,
        }).resize().oneTime();

        this._start();
    }

    get bot() {
        return this._bot;
    }

    async _startReply(ctx) {
        try {
            const chatId = ctx.update.callback_query
                ? ctx.update.callback_query.message.chat.id
                : ctx.message.chat.id;
            let user = await db["User"].findOne({
                telegram_id: chatId
            });
            if (!user) {
                user = await db["User"].create({
                    name: ctx.message.chat.first_name,
                    telegram_id: chatId,
                })
            }

            ctx.reply(
                'Hi ' + user.name +'\n' +
                'Welcome to the P2PFinder bot\n please choose one option',
                this._inlinekeyboards['start']
            )
        } catch (error) {
            console.log(error)
        }
    }

    async _inputConfirmation(ctx) {
        const chatId = ctx.update.callback_query
            ? ctx.update.callback_query.message.chat.id
            : ctx.message.chat.id;
        if (ctx.session.step === 'newprokey') {
            if (ctx.session.commission) {
                
            }
        }

    }

    sendMsg(args = []) {
        const { message } = args;
        try {
            if (this._bot) {
                this._bot.telegram.sendMessage(+chatId, message).catch((err) => {
                    console.log('error on sending message')
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    _inputChecker(ctx) {
        if (ctx.session.step === 'newprokey') {
            ctx.session.commission = ctx.message.text;
        } else if (ctx.session.step === 'txhash') {
            ctx.session.tx = ctx.message.text;
        } else if (ctx.session.step === 'txPayId') {
            ctx.session.txPayId = ctx.message.text;
        }

        if (ctx.session.step) {
            const extraObject = {
                parse_mode: 'MarkdownV2',
                ...this._inlinekeyboards['confirm']
            }
            ctx.reply('*Input* :' + '`' + ctx.message.text + '`', extraObject)
        }
    }


    _start() {
        const bot = new Telegraf(this._token);


        bot.use(session);
        bot.use(async (ctx, next) => {
            console.time(`Processing update ${ctx.update.update_id}`)
            await next() // runs next middleware
            // runs after next middleware finishes
            console.timeEnd(`Processing update ${ctx.update.update_id}`)
        });

        bot.start(async(ctx) => {
            await this._startReply(ctx);
        });


        bot.action('routes', async (ctx) => {
            const routes = await db["Route"].find({});

            const extraObject = {
                ...Markup.inlineKeyboard([
                    ...routes.map((p, i) => {
                        return Markup.button.callback(`${i + 1} - ${p.name} - $${p.price}`, `route-${i + 1}`);
                    })
                ], {
                    columns: 1
                }).resize().oneTime(),
                ...Markup.removeKeyboard(['test'])
            }

            ctx.reply('top routes', extraObject)
        });

        bot.action(/^route-(\d+)$/, async (ctx) => {
            const routeIdx = ctx.match[1];
        })

        bot.action('txhash', async (ctx) => {
            ctx.session.step = 'txhash';
            ctx.reply('Send your transaction hash', this._keyboard)
        });

        bot.action('dispatch', async (ctx) => {
            await this._startReply(ctx);
        })

        bot.action('confirm', async (ctx) => {
            this._inputConfirmation(ctx)
            ctx.session.step = '';
        });

        bot.command('/back', async (ctx) => {
            ctx.session.step = '';
            await this._startReply(ctx);
        });

        bot.on('text', (ctx) => {

            this._inputChecker(ctx);
        });

        bot.launch();

        process.once('SIGINT', () => bot.stop('SIGINT'));
        process.once('SIGTERM', () => bot.stop('SIGTERM'));

        this._bot = bot;

    }

    _stop() {
        this._bot.stop();
    }

}
