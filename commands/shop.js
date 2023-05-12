const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('View avaliable products!')
    .addSubcommand(subcommand =>
  		subcommand
  			.setName('gift-bases')
  			.setDescription('All avaliable gift bases.'))
  	.addSubcommand(subcommand =>
  		subcommand
  			.setName('bases')
  			.setDescription('All avaliable bases.'))
    .addSubcommand(subcommand =>
  		subcommand
  			.setName('lt2-cash')
  			.setDescription('All avaliable LT2 cash.'))
    .addSubcommand(subcommand =>
  		subcommand
  			.setName('wood')
  			.setDescription('All avaliable wood.')),
  
	async execute(interaction) {
    if(!config.guilds[interaction.guildId].shop[interaction.options.getSubcommand()].length) return await interaction.reply({ content: "No items avaliable.", ephemeral: true });
    let index = 0;

    const forwardButton = new ButtonBuilder()
      .setCustomId('shop-forward')
      .setLabel("Next →")
      .setDisabled(index+1 >= config.guilds[interaction.guildId].shop[interaction.options.getSubcommand()].length)
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
  	.setColor(0x52b788)
    .setThumbnail(interaction.guild.iconURL({size: 512}))
    .setAuthor({ name: interaction.options.getSubcommand(), iconURL: interaction.guild.iconURL() })
  	.setTitle(`${index+1} - `+ config.guilds[interaction.guildId].shop[interaction.options.getSubcommand()][index].name)
  	.addFields(
  		{ name: 'Robux', value: `${config.guilds[interaction.guildId].shop[interaction.options.getSubcommand()][index].price.robux} <:robux:1101191048425898236>` },
  		{ name: 'Dollars', value: "$" + config.guilds[interaction.guildId].shop[interaction.options.getSubcommand()][index].price.dollars.toFixed(2) }
  	)
  	// .setImage(config.guilds[interaction.guildId].shop[interaction.options.getSubcommand()][index].imageURL)
  	.setFooter({ text: `${interaction.user.username}'s Menu | Page ${index+1}/${config.guilds[interaction.guildId].shop[interaction.options.getSubcommand()].length}` });

    interaction.reply({embeds: [shopEmbed], components: [row] });
	},
};