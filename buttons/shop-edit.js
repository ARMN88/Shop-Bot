const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
  customId: "shop-edit",
  async execute(interaction) {
    const editModal = new ModalBuilder()
      .setCustomId('edit')
      .setTitle('Edit Item')

    const nameInput = new TextInputBuilder()
      .setCustomId('nameInput')
      .setLabel("New Name")
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const priceRInput = new TextInputBuilder()
      .setCustomId('priceRInput')
      .setLabel("New Robux Price")
      .setStyle(TextInputStyle.Short)
      .setRequired(false);
    
    const priceDInput = new TextInputBuilder()
      .setCustomId('priceDInput')
      .setLabel("New Dollar Price")
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    const firstActionRow = new ActionRowBuilder().addComponents(nameInput);
    const secondActionRow = new ActionRowBuilder().addComponents(priceRInput);
    const thirdActionRow = new ActionRowBuilder().addComponents(priceDInput);
    

    editModal.addComponents(firstActionRow, secondActionRow, thirdActionRow);
    
    return await interaction.showModal(editModal);
  },
};