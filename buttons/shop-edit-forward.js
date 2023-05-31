const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, Colors } = require("discord.js")
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
	customId: "shop-edit-forward",
	async execute(interaction) {
    if(interaction.message.interaction.user.id !== interaction.user.id) return await interaction.reply({content: `This is ${interaction.message.interaction.user.username}'s shop menu, use /shop to browse the shop.`, ephemeral: true });
    const items = await Shop.findAndCountAll({ where: { guildId: interaction.guildId }});
    let index = parseInt(interaction.message.embeds[0].title.split(' ')[0]);

    const forwardButton = new ButtonBuilder()
      .setCustomId('shop-edit-forward')
      .setLabel("Next →")
      .setDisabled(index + 1 >= items.count)
      .setStyle(ButtonStyle.Primary);

    const backButton = new ButtonBuilder()
      .setCustomId('shop-edit-back')
      .setLabel("← Back")
      .setStyle(ButtonStyle.Primary);

    const editButton = new ButtonBuilder()
      .setCustomId('shop-edit')
      .setLabel("Edit")
      .setStyle(ButtonStyle.Secondary);

    const deleteButton = new ButtonBuilder()
      .setCustomId('shop-delete')
      .setLabel("Delete")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
      .addComponents(backButton, editButton, deleteButton, forwardButton);
    
    const shopEmbed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setThumbnail(interaction.guild.iconURL({ size: 512 }))
      .setAuthor({ name: shopTypes[items.rows[index].type], iconURL: interaction.guild.iconURL() })
      .setTitle(`${index + 1} - ` + items.rows[index].name)
      .addFields(
        { name: 'Robux', value: `${items.rows[index].priceRobux}` },
        { name: 'Dollars', value: "$" + items.rows[index].priceDollars.toFixed(2) }
      )
      .setImage(items.rows[index].attachment)
      .setFooter({ text: `${interaction.user.username}'s Menu | Page ${index + 1}/${items.count}` });

    return await interaction.update({embeds: [shopEmbed], components: [row], ephemeral: true });
  }
};