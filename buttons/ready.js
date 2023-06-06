const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
	customId: "ready",
	async execute(interaction) {
    const verificationModal = new ModalBuilder()
      .setCustomId('verification')
      .setTitle('Verification')

    const verifyInput = new TextInputBuilder()
      .setCustomId('verifyInput')
      .setLabel("Enter Verification")
      .setStyle(TextInputStyle.Short)
      .setMaxLength(6)
      .setMinLength(6)
      .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(verifyInput);

    verificationModal.addComponents(firstActionRow);

    return await interaction.showModal(verificationModal);
	},
};