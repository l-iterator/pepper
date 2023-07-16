import { Client, GatewayIntentBits, Partials, Collection } from 'discord.js';
import fs from 'fs';

import createFirmEmbed from './utils/embed.js';
import initDB from './utils/initdb.js'
import commands from './commands/index.js';

const { token, prefix } = JSON.parse(fs.readFileSync('./config.json'));

const client = new Client({ intents: [ 
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,], partials: [Partials.Channel] });

initDB(client);

client.commands = new Collection();
const helpData = new Collection();

for (const command of commands) {
    if (!(command.args)) command.args = [];
    const oneLineCommandHelp = '`' + prefix + command.name + (command.args.length ? " " : "") + command.args.map(arg => arg.required ? `<${arg.name}>` : `[${arg.name}]`).join(" ") + "` - " + command.description;
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
        .addFields({name: "Описание", value: command.verboseDescription}, ...commandArgs);

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
        const commandData = client.commands.get(command);
        if (args.length < commandData.requiredArgs) {
            if (commandData.requiredArgs - args.length == 1) {
                message.reply(`Пропущен обязательный аргумент: ${commandData.args[0].name}. Напиши ${prefix}help ${commandData.name} для более подробной информации!`);
            } else {
                message.reply(`Пропущены обязательные аргументы: ${commandData.args.slice(args.length, commandData.requiredArgs).join(", ")}. Напиши ${prefix}help ${commandData.name} для более подробной информации!`);
            }
        } else {
            await commandData.execute(message, args);
        }
    } catch (error) {
        console.error(error);
        message.reply("Неизвестная ошибка выполнения команды, сообщи Макасу или Сибе!");
    }
});
// Other code

client.login(token);