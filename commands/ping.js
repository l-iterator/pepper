module.exports = {
    name: 'ping',
    category: 'Утилиты',
    description: 'Отвечает понгом!',
    execute(message, _) {
        message.channel.send('Понг!');
    },
};