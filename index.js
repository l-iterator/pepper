const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const client = new Client({ intents: [ 
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,], partials: [Partials.Channel] });
const { token, prefix } = require('./config.json');
const createFirmEmbed = require('./utils/embed.js');
const fs = require('fs');

client.commands = new Collection();
const helpData = new Collection();


const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (!(command.args)) command.args = [];
    const oneLineCommandHelp = prefix + command.name + " " + command.args.map(arg => arg.required ? `<${arg.name}>` : `[${arg.name}]`).join(" ") + " " + command.description;
    command.requiredArgs = command.args.filter(c => c.required).length;

    const commandArgs = command.args.map(param => {
        return {
            name: `\`${param.name}\` (${param.required ? "обязательный" : "необязательный"})`,
            value: `${param.description};`
        }
    });

    const commandHelpEmbed = createFirmEmbed()
        .setTitle(`Справка по команде ${command.name}`)
        .setDescription(oneLineCommandHelp)
        .addFields(...commandArgs);
    console.log(command.name);


    command.helpEmbed = commandHelpEmbed
    
    client.commands.set(command.name, command);
    if (helpData.has(command.category)) {
        helpData.get(command.category).push(oneLineCommandHelp);
    } else {
        helpData.set(command.category, [oneLineCommandHelp])
    }
}

const helpEmbed = createFirmEmbed().setTitle("Список команд");

for (const [category, commands] of helpData) {
    helpEmbed.addFields({name: category, value: commands.join("\n")});
}

client.helpEmbed = helpEmbed;

console.log("ready");

client.on("messageCreate", async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;
    try {
        client.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("There was an issue executing that command!");
    }
});
// Other code

client.login(token);