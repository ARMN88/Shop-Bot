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
  customId: 'edit',
  async execute(interaction) {
    let index = parseInt(interaction.message.embeds[0].title.split(' ')[0]);
    const item = await Shop.findOne({where: { id: index }});

    const nameInput =
      interaction.fields.getTextInputValue('nameInput') || item.name;
    const priceRInput =
      parseInt(interaction.fields.getTextInputValue('priceRInput')) ||
      item.priceRobux;
    const priceDInput =
      parseInt(interaction.fields.getTextInputValue('priceDInput')) ||
      item.priceDollars;
    const dataSizeInput =
      parseInt(interaction.fields.getTextInputValue('dataSizeInput')) ||
      item.dataSize;

    await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setDescription('Updating the shop...')
          .setColor(Colors.Orange),
      ],
      components: [],
      ephemeral: true,
    });

    try {
      await Shop.update(
        {
          name: nameInput,
          priceRobux: priceRInput,
          priceDollars: priceDInput,
          dataSize: dataSizeInput,
        },
        { where: { id: item.id } }
      );
    } catch {
      return await interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setDescription('An error occurred, unable to update.')
            .setColor(Colors.Red),
        ],
        components: [],
        ephemeral: true,
      });
    }
    return await interaction.editReply({
      embeds: [
        new EmbedBuilder()
          .setDescription('Successfully updated the shop!')
          .setColor(Colors.Green),
      ],
      components: [],
      ephemeral: true,
    });
  },
};
