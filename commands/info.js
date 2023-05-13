const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get information about this server.'),
    async execute(interaction) {
        const infoEmbed = new EmbedBuilder()
            .setTitle(`${interaction.guild.name} Info`)
            .setColor(0x1c73ba)
            .setImage(interaction.guild.iconURL({size: 512}))
            .addFields(
                { name: "Member Count", value: `${interaction.guild.memberCount}` },
                { name: "Created At", value: `<t:${interaction.guild.createdTimestamp}:R>` },
                { name: "Created By", value: `<@${interaction.guild.ownerId}>` }
            );

        return await interaction.reply({ embeds: [infoEmbed] });
    },
};