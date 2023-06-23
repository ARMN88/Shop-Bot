const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, AttachmentBuilder } = require('discord.js');
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

const Info = require('../models/Infos.js')(database, DataTypes);
const infoTypes = ['channel', 'role', 'webhook'];

module.exports = {
  customId: 'edit',
  async execute(interaction) {
    let index = parseInt(interaction.message.embeds[0].title.split(' ')[0]);
    const item = await Shop.findOne({ where: { id: index } });

    const nameInput =
      interaction.fields.getTextInputValue('nameInput') || item.name;
    const priceRInput =
      parseInt(interaction.fields.getTextInputValue('priceRInput')) ||
      item.priceRobux;
    const priceDInput =
      parseFloat(interaction.fields.getTextInputValue('priceDInput')) ||
      item.priceDollars;
    const dataSizeInput =
      parseInt(interaction.fields.getTextInputValue('dataSizeInput')) ||
      item.dataSize;
    const creatorInput = interaction.fields.getTextInputValue('creatorInput') || item.creator;

    await interaction.update({
      embeds: [
        new EmbedBuilder()
          .setDescription('Updating the shop...')
          .setColor(Colors.Orange),
      ],
      components: [],
      files: [],
      ephemeral: true,
    });

    await sendItemEmbed(interaction, {
      ...item,
      priceRobux: priceRInput,
      priceDollars: priceDInput,
      dataSize: dataSizeInput,
      creator: creatorInput
    });

    try {
      await Shop.update(
        {
          name: nameInput,
          priceRobux: priceRInput,
          priceDollars: priceDInput,
          dataSize: dataSizeInput,
          creator: creatorInput
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
        files: [],
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
        files: [],
      ephemeral: true,
    });
  },
};

async function sendItemEmbed(interaction, item) {
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

  const shopNewEmbed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setThumbnail(interaction.guild.iconURL({ size: 512 }))
    .setTitle(
      `${item.id} - ${item.name}`
    )
    .addFields(
      {
        name: 'Robux',
        value: `${item.priceRobux}`,
      },
      {
        name: 'Dollars',
        value:
          '$' + item.priceDollars.toFixed(2),
      }
    )
    .setImage(`attachment://${item.id}.png`)
    .setFooter({ text: `Created By ${item.creator}` });

  if (item.dataSize) {
    shopNewEmbed.addFields({
      name: 'Data Size',
      value: `${item.dataSize}`,
    });
  }

  const externalBuyButton = new ButtonBuilder()
    .setCustomId('external-buy-button')
    .setLabel('Buy Now')
    .setStyle(ButtonStyle.Success);

  const externalRow = new ActionRowBuilder().addComponents(
    externalBuyButton
  );

  const newItemResponse = await shopChannel.send({
    embeds: [shopNewEmbed],
    files: [new AttachmentBuilder(`./images/${interaction.guildId}/${item.id}.png`)],
    components: [externalRow],
  });

  return await Shop.update({ messageId: newItemResponse.id }, { where: { id: item.id } });
}