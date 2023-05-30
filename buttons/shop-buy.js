const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, Colors } = require("discord.js");
const { Sequelize, DataTypes } = require('sequelize');
const { randomInt } = require('node:crypto');

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

const Info = database.define('Info', {
  guildId: {
    type: DataTypes.STRING
  },
  identifier: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.TINYINT
  }
}, { timestamps: false });

const infoTypes = ['channel', 'role', 'webhook'];

module.exports = {
	customId: "shop-buy",
	async execute(interaction) {
    if(interaction.message.interaction.user.id !== interaction.user.id) return await interaction.reply({content: `This is ${interaction.message.interaction.user.username}'s shop menu, use /shop to browse the shop.`, ephemeral: true });
    const items = await Shop.findAll({ where: { guildId: interaction.guildId, type: shopTypes.indexOf(interaction.message.embeds[0].author.name) }}, { raw: true });    
    
    const shopIndex = parseInt(interaction.message.embeds[0].title.split(' ')[0])-1;
    const shopItem = items[shopIndex];

    const buyChannelId = await Info.findOne({ where: { name: 'transactions', guildId: `${interaction.guildId}` }});

   if(!buyChannelId) {
      const errorEmbed = new EmbedBuilder().setDescription('Transactions have not been setup.').setColor(Colors.Red);
      return await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    let buyChannel;
    try {
      buyChannel = await interaction.guild.channels.fetch(buyChannelId.identifier);
    } catch {
      const channelErrorEmbed = new EmbedBuilder().setDescription(`Transactions channel does not exist.`).setColor(Colors.Red);
      return await interaction.reply({ embeds: [channelErrorEmbed], ephemeral: true });
    }

    const buyEmbed = new EmbedBuilder()
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setTitle(shopItem.name)
      .setColor(Colors.Blue)
      .addFields(
        { name: "Robux", value: `${shopItem.priceRobux}` },
        { name: "Dollars", value: `\$${shopItem.priceDollars.toFixed(2)}` }
      )
      .setThumbnail(interaction.guild.iconURL({ size: 512 }))
      .setTimestamp();

    const closeButton = new ButtonBuilder()
      .setCustomId('shop-close')
      .setLabel("Close Transaction")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
      .addComponents(closeButton);

    const buyThread = await buyChannel.threads.create({
      name: `Transaction ${randomInt(1000, 10000)}`,
      message: { content: `<@${interaction.user.id}>`, embeds: [buyEmbed], components: [row] },
    });

    buyThread.lastMessage.pin();
    buyThread.members.add(interaction.user);

    setTimeout(function() {
        interaction.message.delete();
      }, 3000);

    const newTransactionEmbed = new EmbedBuilder().setDescription(`Transaction created in <#${buyThread.id}>`).setColor(Colors.Green);
    
    return interaction.reply({embeds: [newTransactionEmbed], ephemeral: true });
  }
};