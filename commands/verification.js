const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionsBitField, Colors } = require('discord.js');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verification')
		.setDescription('Send a capcha verification message to this channel.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
	async execute(interaction) {
    const verificationEmbed = new EmbedBuilder()
      .setDescription("Please click the button below to verify your account.")
      .setColor(Colors.Blue);

    const verifyButton = new ButtonBuilder()
      .setCustomId('verification')
      .setLabel('Verify')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(verifyButton);

    return await interaction.reply({ embeds: [verificationEmbed], components: [row] });
  }
};