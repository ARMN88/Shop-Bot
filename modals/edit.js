const { EmbedBuilder, Colors } = require("discord.js");
const { Sequelize, DataTypes } = require('sequelize');

const database = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/users.db',
  logging: false,
  query: {
    raw: true
  }
});

const Shop = require('../models/Shops.js')(database, DataTypes);
const shopTypes = ['gift-bases', 'bases', 'wood', 'accounts'];

module.exports = {
  customId: "edit",
  async execute(interaction) {
    const items = await Shop.findAll({ where: { guildId: interaction.guildId }});
    let index = parseInt(interaction.message.embeds[0].title.split(' ')[0])-1;    

    const nameInput = interaction.fields.getTextInputValue('nameInput') || items[index].name;
    const priceRInput = parseInt(interaction.fields.getTextInputValue('priceRInput')) || items[index].priceRobux;
    const priceDInput = parseInt(interaction.fields.getTextInputValue('priceDInput')) || items[index].priceDollars;
    const dataSizeInput = parseInt(interaction.fields.getTextInputValue('dataSizeInput')) || items[index].dataSize;

    
    await interaction.update({ embeds: [new EmbedBuilder().setDescription('Updating the shop...').setColor(Colors.Orange)], components: [], ephemeral: true });

    try {
      await Shop.update({
        name: nameInput,
        priceRobux: priceRInput,
        priceDollars: priceDInput,
        dataSize: dataSizeInput
      }, { where: { id: items[index].id }});
    } catch {
      return await interaction.editReply({ embeds: [new EmbedBuilder().setDescription('An error occurred, unable to update.').setColor(Colors.Red)], components: [], ephemeral: true });  
    }
    return await interaction.editReply({ embeds: [new EmbedBuilder().setDescription('Successfully updated the shop!').setColor(Colors.Green)], components: [], ephemeral: true });
  },
};
