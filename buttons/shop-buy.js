const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const config = require("../config.json");
const { randomInt } = require('node:crypto');

module.exports = {
	customId: "shop-buy",
	async execute(interaction) {
    if(interaction.message.interaction.user.id !== interaction.user.id) return await interaction.reply({content: `This is ${interaction.message.interaction.user.username}'s shop menu, use /shop to browse the shop.`, ephemeral: true });
    
    const shopType = interaction.message.embeds[0].author.name;
    const shopIndex = parseInt(interaction.message.embeds[0].title.split(' ')[0])-1;
    const shopItem = config.guilds[interaction.guildId].shop[shopType][shopIndex];

    const buyChannel = await interaction.guild.channels.create({
      name: `transaction-${randomInt(1000, 10000)}`
    });
    
    buyChannel.setParent("1101017403640516619");
    buyChannel.permissionOverwrites.create(interaction.user, { ViewChannel: true, SendMessages: true });

    const buyEmbed = new EmbedBuilder()
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setTitle(shopItem.name)
      .setColor(0x3481cf)
      .addFields(
        { name: "Robux", value: `${shopItem.price.robux} <:robux:1101191048425898236>` },
        { name: "Dollars", value: `\$${shopItem.price.dollars.toFixed(2)}` }
      )
      .setThumbnail("https://cdn.discordapp.com/attachments/898063879614124042/1100548021680341052/Untitled1.png")
      .setImage(shopItem.imageURL)
      .setTimestamp();

    const closeButton = new ButtonBuilder()
      .setCustomId('shop-close')
      .setLabel("Close Transaction")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
      .addComponents(closeButton);
      
    const transactionMessage = await buyChannel.send({ content: `<@${interaction.user.id}>`, embeds: [buyEmbed], components: [row] });
    transactionMessage.pin();
    return interaction.deferUpdate();
  }
};