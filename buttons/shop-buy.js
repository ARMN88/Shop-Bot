const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, Colors } = require("discord.js");
const config = require("../config.json");
const { randomInt } = require('node:crypto');

module.exports = {
	customId: "shop-buy",
	async execute(interaction) {
    if(interaction.message.interaction.user.id !== interaction.user.id) return await interaction.reply({content: `This is ${interaction.message.interaction.user.username}'s shop menu, use /shop to browse the shop.`, ephemeral: true });
    
    const shopType = interaction.message.embeds[0].author.name;
    const shopIndex = parseInt(interaction.message.embeds[0].title.split(' ')[0])-1;
    const shopItem = config.guilds[interaction.guildId].shop[shopType][shopIndex];

    const buyChannel = await interaction.guild.channels.fetch(config.guilds[interaction.guildId].channels.transactions);
    
    const buyEmbed = new EmbedBuilder()
      .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
      .setTitle(shopItem.name)
      .setColor(Colors.Blue)
      .addFields(
        { name: "Robux", value: `${shopItem.price.robux}` },
        { name: "Dollars", value: `\$${shopItem.price.dollars.toFixed(2)}` }
      )
      .setThumbnail(interaction.guild.iconURL({ size: 512 }))
      .setTimestamp();

    const closeButton = new ButtonBuilder()
      .setCustomId('shop-close')
      .setLabel("Close Transaction")
      .setStyle(ButtonStyle.Danger);

     const infoButton = new ButtonBuilder()
      .setCustomId('shop-close')
      .setLabel("Close Transaction")
      .setStyle(ButtonStyle.Primary);

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