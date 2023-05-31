const { EmbedBuilder, Colors } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');

const database = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/users.db',
  logging: false,
  query: {
    raw: true
  }
});

const Shop = database.define('Shops', {
  guildId: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.TINYINT
  },
  name: {
    type: DataTypes.STRING
  },
  priceRobux: {
    type: DataTypes.SMALLINT
  },
  priceDollars: {
    type: DataTypes.DOUBLE
  },
  attachment: {
    type: DataTypes.STRING
  }
}, { timestamps: false });

const shopTypes = ['gift-bases', 'bases', 'wood'];

module.exports = {
  customId: "shop-delete",
  async execute(interaction) {
    const deletingEmbed = new EmbedBuilder().setDescription('Deleting item...').setColor(Colors.Orange);
    await interaction.update({ embeds: [deletingEmbed], ephemeral: true, components: [] });
    
    const items = await Shop.findAll({ where: { guildId: interaction.guildId }});
    let index = parseInt(interaction.message.embeds[0].title.split(' ')[0])-1;
    
    try {
      await Shop.destroy({ where: { id: items[index].id }, force: true });
    } catch {
      const errorEmbed = new EmbedBuilder().setDescription('Unable to delete item.').setColor(Colors.Red);
      return await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
    }
    const deletedEmbed = new EmbedBuilder().setDescription('Item successfully deleted.').setColor(Colors.Green);
    return await interaction.editReply({ embeds: [deletedEmbed], ephemeral: true });
  },
};