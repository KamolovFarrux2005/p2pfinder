const Finder = require('./finder/index');
const Telegram = require('./telegram/index');

let bot;
let finder;

const init = () => {
    bot = new Telegram();
    
    finder = new Finder({ hooks: bot });
}

module.exports = {
    init, bot, finder
}