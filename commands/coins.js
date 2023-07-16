import createFirmEmbed from '../utils/embed.js';

export default {
    name: 'coins',
    category: 'Игры',
    description: 'количество монет юзера',
    verboseDescription: 'Ты получаешь монеты после различных действий в игре',
    async execute(message, _) {
        const coins = (message.client.db.data.userData[message.author.id] ?? {coins: 0}).coins;
        message.reply({ embeds: [
            createFirmEmbed().setTitle(`Коинов у ${message.author.username}`).setDescription(coins.toString())
        ] });
    } 
}