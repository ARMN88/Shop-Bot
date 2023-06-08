const { EmbedBuilder, Colors } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');

const database = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/users.db',
  logging: false,
  query: {
    raw: true,
  },
});

const Shop = require('../models/Shops.js')(database, DataTypes);
const shopTypes = ['gift-bases', 'bases', 'wood', 'accounts'];

module.exports = {
  customId: 'shop-delete',
  async execute(interaction) {
    const deletingEmbed = new EmbedBuilder()
      .setDescription('Deleting item...')
      .setColor(Colors.Orange);
    
    await interaction.update({
      embeds: [deletingEmbed],
      ephemeral: true,
      components: [],
    });

    let index = parseInt(interaction.message.embeds[0].title.split(' ')[0]);
    const item = await Shop.findOne({where: { id: index }});

    try {
      await Shop.destroy({ where: { id: item.id }, force: true });
    } catch {
      const errorEmbed = new EmbedBuilder()
        .setDescription('Unable to delete item.')
        .setColor(Colors.Red);
      return await interaction.editReply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }
    const deletedEmbed = new EmbedBuilder()
      .setDescription('Item successfully deleted.')
      .setColor(Colors.Green);
    return await interaction.editReply({
      embeds: [deletedEmbed],
      ephemeral: true,
    });
  },
};
