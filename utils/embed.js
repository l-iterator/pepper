import { EmbedBuilder } from 'discord.js';
import fs from 'fs';

const { primaryColor } = JSON.parse(fs.readFileSync('./config.json'));
const embedColor = parseInt(primaryColor, 16);

export default function() { return new EmbedBuilder().setColor(embedColor) };