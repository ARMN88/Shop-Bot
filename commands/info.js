const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get information about this server.'),
    async execute(interaction) {
        const infoEmbed = new EmbedBuilder()
            .setDescription("info");
        return await interaction.reply({ embeds: [infoEmbed] });
    },
};