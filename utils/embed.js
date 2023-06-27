const { EmbedBuilder } = require('discord.js');
const { primaryColor } = require('../config.json');
const embedColor = parseInt(primaryColor, 16);

module.exports = () => new EmbedBuilder().setColor(embedColor);