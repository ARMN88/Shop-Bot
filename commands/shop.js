const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, Colors, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const https = require('https');

const config = require('../config.json');

const database = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/users.db',
  logging: false
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
  imageType: {
    type: DataTypes.STRING
  }
}, { timestamps: false });

Shop.sync({ force: true });

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shop')
    .setDescription('View avaliable products!')
    .setDMPermission(false)
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
        .setDescription('All avaliable wood.'))
    .addSubcommandGroup(subcommandGroup => 
      subcommandGroup
        .setName('menu')
        .setDescription('Edit, add, or remove an item from the shop.')
        .addSubcommand(subcommand => 
          subcommand
            .setName('add')
            .setDescription('Add an item to the shop.')
            .addStringOption(option =>
              option
                .setName('type')
                .setDescription('Set the type of item.')
                .setRequired(true)
                .addChoices(
                  { name: 'Gift Bases', value: 'gift-bases' },
                  { name: 'Bases', value: 'bases' },
                  { name: 'Wood', value: 'wood' }
                ))
            .addStringOption(option =>
              option
                .setName('name')
                .setDescription('Set the name of item.')
                .setRequired(true)
              )
            .addIntegerOption(option =>
              option
                .setName('price-robux')
                .setDescription('Set the price in robux of item.')
                .setRequired(true)
                .setMaxValue(65535)
                .setMinValue(1)
              )
            .addNumberOption(option =>
              option
                .setName('price-dollars')
                .setDescription('Set the price in dollars of item.')
                .setRequired(true)
              )
            .addAttachmentOption(option =>
              option
                .setName('image')
                .setDescription("Set the image of the item.")
                .setRequired(true)
              ))
        .addSubcommand(subcommand => 
          subcommand
            .setName('edit')
            .setDescription('Edit an item in the shop.'))
        .addSubcommand(subcommand => 
          subcommand
            .setName('delete')
            .setDescription('Delete an item from the shop.'))),
  
  async execute(interaction) {
    if(interaction.options.getSubcommandGroup() === 'menu') {
      if(!interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `Unable to edit, you do not have permission.`, ephemeral: true });
        
      const menuEmbed = new EmbedBuilder().setColor(Colors.Purple).setTitle('Shop Editor').setTimestamp();
      switch(interaction.options.getSubcommand()) {
        case 'add':
          
          const newItem = await Shop.create({ 
            guildId: interaction.guildId,
            type: interaction.options.getString('type'),
            name: interaction.options.getString('name'),
            priceDollars: interaction.options.getNumber('price-dollars'),
            priceRobux: interaction.options.getInteger('price-robux'),
            imageType: interaction.options.getAttachment('image').contentType.split("/").pop()
          });
          
          https.get(interaction.options.getAttachment('image').url,(res) => {
            const path = `${__dirname}/../images/${interaction.guildId}/${newItem.dataValues.id}.${interaction.options.getAttachment('image').contentType.split("/").pop()}`; 
            if (!fs.existsSync(`${__dirname}/../images/${interaction.guildId}/`)){
              fs.mkdirSync(`${__dirname}/../images/${interaction.guildId}/`, { recursive: true });
            }
            const filePath = fs.createWriteStream(path);
            res.pipe(filePath);
            filePath.on('finish',() => {
              filePath.close();
            });
          });
          
          return await interaction.reply({
            embeds: [
              menuEmbed
                .setDescription('Successfully added item!')
                .addFields(
                  { name: 'Type', value: interaction.options.getString('type')},
                  { name: 'Name', value: interaction.options.getString('name')},
                  { name: 'Price', value: `\$${interaction.options.getNumber('price-dollars').toFixed(2)} OR ${interaction.options.getInteger('price-robux')} RBX`})
                .setImage(interaction.options.getAttachment('image').url)
            ], 
            ephemeral: true
          });  
          break;
        case 'edit':
          break;
        case 'delete':
          break;
      }
    }
    
    if (!config.guilds[interaction.guildId].shop[interaction.options.getSubcommand()].length) return await interaction.reply({ content: "No items avaliable.", ephemeral: true });
    let index = 0;

    const forwardButton = new ButtonBuilder()
      .setCustomId('shop-forward')
      .setLabel("Next →")
      .setDisabled(index + 1 >= config.guilds[interaction.guildId].shop[interaction.options.getSubcommand()].length)
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
      .setThumbnail(interaction.guild.iconURL({ size: 512 }))
      .setAuthor({ name: interaction.options.getSubcommand(), iconURL: interaction.guild.iconURL() })
      .setTitle(`${index + 1} - ` + config.guilds[interaction.guildId].shop[interaction.options.getSubcommand()][index].name)
      .addFields(
        { name: 'Robux', value: `${config.guilds[interaction.guildId].shop[interaction.options.getSubcommand()][index].price.robux}` },
        { name: 'Dollars', value: "$" + config.guilds[interaction.guildId].shop[interaction.options.getSubcommand()][index].price.dollars.toFixed(2) }
      )
      // .setImage(config.guilds[interaction.guildId].shop[interaction.options.getSubcommand()][index].imageURL)
      .setFooter({ text: `${interaction.user.username}'s Menu | Page ${index + 1}/${config.guilds[interaction.guildId].shop[interaction.options.getSubcommand()].length}` });

    interaction.reply({ embeds: [shopEmbed], components: [row] });
  },
};