const {
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  Colors,
} = require('discord.js');
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
  customId: 'shop-back',
  async execute(interaction) {
    if (interaction.message.interaction.user.id !== interaction.user.id)
      return await interaction.reply({
        content: `This is ${interaction.message.interaction.user.username}'s shop menu, use /shop to browse the shop.`,
        ephemeral: true,
      });
    const items = await Shop.findAndCountAll(
      {
        where: {
          guildId: interaction.guildId,
          type: shopTypes.indexOf(interaction.message.embeds[0].author.name),
        },
      },
      { raw: true }
    );
    let index = parseInt(interaction.message.embeds[0].title.split(' ')[0]) - 2;

    const forwardButton = new ButtonBuilder()
      .setCustomId('shop-forward')
      .setLabel('Next →')
      .setStyle(ButtonStyle.Primary);

    const backButton = new ButtonBuilder()
      .setCustomId('shop-back')
      .setLabel('← Back')
      .setDisabled(index <= 0)
      .setStyle(ButtonStyle.Primary);

    const buyButton = new ButtonBuilder()
      .setCustomId('shop-buy')
      .setLabel('Buy Now')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(
      backButton,
      buyButton,
      forwardButton
    );

    const shopEmbed = new EmbedBuilder()
      .setColor(Colors.Purple)
      .setThumbnail(interaction.guild.iconURL({ size: 512 }))
      .setAuthor({
        name: interaction.message.embeds[0].author.name,
        iconURL: interaction.guild.iconURL(),
      })
      .setTitle(`${index + 1} - ` + items.rows[index].name)
      .addFields(
        { name: 'Robux', value: `${items.rows[index].priceRobux}` },
        {
          name: 'Dollars',
          value: '$' + items.rows[index].priceDollars.toFixed(2),
        }
      )
      .setImage(`attachment://${items.rows[index].id}.png`)
      .setFooter({
        text: `${interaction.user.username}'s Menu | Page ${index + 1}/${
          items.count
        }`,
      });

    if (items.rows[index].dataSize) {
      shopEmbed.addFields({
        name: 'Data Size',
        value: `${items.rows[index].dataSize}`,
      });
    }

    if (items.rows[index].creator !== 'Unknown') {
      shopEmbed.addFields({
        name: 'Created By',
        value: items.rows[index].creator,
      });
    }

    return await interaction.update({
      embeds: [shopEmbed],
      components: [row],
      files: [new AttachmentBuilder(`./images/${interaction.guildId}/${items.rows[index].id}.png`)],
      ephemeral: true,
    });
  },
};
