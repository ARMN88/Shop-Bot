const {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ChannelType,
  Colors,
} = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');
const { randomInt } = require('node:crypto');

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
  customId: 'external-buy-button',
  async execute(interaction) {
    interaction.deferReply({ ephemeral: true });

    const shopIndex = parseInt(
      interaction.message.embeds[0].title.split(' ')[0]
    );
    const shopItem = await Shop.findOne({ where: { id: shopIndex } });

    const buyChannelId = await Info.findOne({
      where: { name: 'transactions', guildId: `${interaction.guildId}` },
    });

    if (!buyChannelId) {
      const errorEmbed = new EmbedBuilder()
        .setDescription('Transactions have not been setup.')
        .setColor(Colors.Red);
      return await interaction.editReply({
        embeds: [errorEmbed],
        ephemeral: true,
      });
    }

    let buyChannel;
    try {
      buyChannel = await interaction.guild.channels.fetch(
        buyChannelId.identifier
      );
    } catch {
      const channelErrorEmbed = new EmbedBuilder()
        .setDescription(`Transactions channel does not exist.`)
        .setColor(Colors.Red);
      return await interaction.editReply({
        embeds: [channelErrorEmbed],
        ephemeral: true,
      });
    }

    const buyEmbed = new EmbedBuilder()
      .setAuthor({
        name: interaction.user.username,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setTitle(shopItem.name)
      .setColor(Colors.Blue)
      .addFields(
        { name: 'Robux', value: `${shopItem.priceRobux}` },
        { name: 'Dollars', value: `\$${shopItem.priceDollars.toFixed(2)}` }
      )
      .setImage(shopItem.attachment)
      .setThumbnail(interaction.guild.iconURL({ size: 512 }))
      .setTimestamp();

    if (shopItem.dataSize) {
      buyEmbed.addFields({ name: 'Data Size', value: `${shopItem.dataSize}` });
    }

    const closeButton = new ButtonBuilder()
      .setCustomId('shop-close')
      .setLabel('Close Transaction')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(closeButton);

    let buyThread;
    let response;

    if (buyChannel.type === ChannelType.GuildCategory) {
      buyThread = await buyChannel.children.create({
        name: `Transaction ${randomInt(1000, 10000)}`,
        type: ChannelType.GuildText,
      });
      response = await buyThread.send({
        content: `<@${interaction.user.id}>`,
        embeds: [buyEmbed],
        components: [row],
      });
    } else {
      const channelErrorEmbed = new EmbedBuilder()
        .setDescription(`Transactions is not a category.`)
        .setColor(Colors.Red);
      return await interaction.editReply({
        embeds: [channelErrorEmbed],
        ephemeral: true,
      });
    }

    await response.pin();
    await buyThread.permissionOverwrites.create(interaction.user, {
      ViewChannel: true,
      SendMessages: true,
    });

    const newTransactionEmbed = new EmbedBuilder()
      .setDescription(`Transaction created in ${buyThread}`)
      .setColor(Colors.Green);

    return interaction.editReply({
      embeds: [newTransactionEmbed],
      ephemeral: true,
    });
  },
};
