module.exports = {
    name: 'help',
    category: 'Утилиты',
    description: 'Выдаёт справку по командам',
    execute(message, args) {
        if (args[0]) {
            const commandName = args[0].toLowerCase();
            if (message.client.commands.has(commandName)) {
                const embed = message.client.commands.get(commandName).helpEmbed;
                message.author.send({ embeds: [embed] });
            } else {
                message.reply("Нет такой команды");
            }
        } else {
            message.author.send({ embeds: [message.client.helpEmbed] });
        }
    },
};