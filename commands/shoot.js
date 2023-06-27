module.exports = {
    name: 'shoot',
    category: 'Утилиты',
    description: 'Стреляет',
    args: [
        {
            name: 'user',
            description: 'Упоминание или ник юзера. Стреляет в него с вероятностью попасть 0.1%',
            required: true
        }
    ],
    execute(message, args) {
        // does stuff
    },
};