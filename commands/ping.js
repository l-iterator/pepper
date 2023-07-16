export default {
    name: 'ping',
    category: 'Утилиты',
    description: 'отвечает понгом',
    verboseDescription: 'Эта команда обычно используется для быстрой проверки того, работает ли бот и можно ли с ним взаимодействовать.',
    async execute(message, _) {
        message.channel.send('Понг!');
    },
};