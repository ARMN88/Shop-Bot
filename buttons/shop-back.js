const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder, Colors } = require("discord.js")
const config = require("../config.json");

module.exports = {
  customId: "shop-back",
  async execute(interaction) {
    if (interaction.message.interaction.user.id !== interaction.user.id) return await interaction.reply({ content: `This is ${interaction.message.interaction.user.username}'s shop menu, use /shop to browse the shop.`, ephemeral: true });
    let index = parseInt(interaction.message.embeds[0].title.split(' ')[0]) - 2;

    const forwardButton = new ButtonBuilder()
      .setCustomId('shop-forward')
      .setLabel("Next →")
      .setDisabled(index + 1 >= config.guilds[interaction.guildId].shop[interaction.message.embeds[0].author.name].length)
      .setStyle(ButtonStyle.Primary);

    const backButton = new ButtonBuilder()
      .setCustomId('shop-back')
      .setLabel("← Back")
      .setDisabled(index <= 0)
      .setStyle(ButtonStyle.Primary);

    const buyButton = new ButtonBuilder()
      .setCustomId('shop-buy')
      .setLabel("Buy Now")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder()
      .addComponents(backButton, buyButton, forwardButton);

    const shopEmbed = new EmbedBuilder()
      .setColor(Colors.Purple)
      .setAuthor({ name: interaction.message.embeds[0].author.name, iconURL: interaction.guild.iconURL() })
      .setTitle(`${index + 1} - ` + config.guilds[interaction.guildId].shop[interaction.message.embeds[0].author.name][index].name)
      .addFields(
        { name: 'Robux', value: `${config.guilds[interaction.guildId].shop[interaction.message.embeds[0].author.name][index].price.robux}` },
        { name: 'Dollars', value: "$" + config.guilds[interaction.guildId].shop[interaction.message.embeds[0].author.name][index].price.dollars.toFixed(2) }
      )
      // .setImage(config.guilds[interaction.guildId].shop[interaction.message.embeds[0].author.name][index].imageURL)
      .setFooter({ text: `${interaction.user.username}'s Menu | Page ${index + 1}/${config.guilds[interaction.guildId].shop[interaction.message.embeds[0].author.name].length}` });

    return await interaction.update({ embeds: [shopEmbed], components: [row] });
  }
};