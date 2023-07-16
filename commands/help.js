export default {
    name: 'help',
    category: 'Утилиты',
    description: 'выдаёт справку по командам',
    verboseDescription: 'Рассказывает кратко про все команды, либо может рассказать про команду более подробно, если отправить её в качестве аргумента.',
    args: [
        {
            name: 'команда',
            description: 'Если есть этот аргумент, команда выведет подробную справку по этой команде',
            required: false
        }
    ],
    async execute(message, args) {
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