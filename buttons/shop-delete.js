const { EmbedBuilder, Colors } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');

const database = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/users.db',
  logging: false,
  query: {
    raw: true,
  },
});

const Info = require('../models/Infos.js')(database, DataTypes);
const infoTypes = ['channel', 'role', 'webhook'];

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

    fs.rmSync(`./images/${interaction.guildId}/${item.id}.png`);
    
    const deletedEmbed = new EmbedBuilder()
      .setDescription('Item successfully deleted.')
      .setColor(Colors.Green);
     await interaction.editReply({
       files: [],
      embeds: [deletedEmbed],
      ephemeral: true,
    });

    const shopChannelId = await Info.findOne({
    where: {
      guildId: interaction.guildId,
      name: shopTypes[item.type],
      type: infoTypes.indexOf('channel'),
    },
  });
  if (!shopChannelId) return;

  let shopChannel;
  try {
    shopChannel = await interaction.guild.channels.fetch(
      shopChannelId.identifier
    );
  } catch {
    return;
  }

  if(item.messageId) {
    try {
      const prevMessage = await shopChannel.messages.fetch(item.messageId);
      await prevMessage.delete();
    } catch { }
  }
  },
};
