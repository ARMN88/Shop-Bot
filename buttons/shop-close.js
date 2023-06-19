const { setTimeout } = require('node:timers');
const { EmbedBuilder, Colors } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');

const database = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/users.db',
  logging: false,
  query: {
    raw: true,
  },
});

const Info = require('../models/Infos.js')(database, DataTypes);
const infoTypes = ['channel', 'role', 'webhook'];

module.exports = {
  customId: 'shop-close',
  async execute(interaction) {
    setTimeout(async function () {
      await interaction.channel.delete();
    }, 1000);

    const closeTransactionEmbed = new EmbedBuilder()
      .setDescription('Thread deleting...')
      .setColor(Colors.Red);
    await interaction.reply({ embeds: [closeTransactionEmbed] });

    const buyerRoleId = await Info.findOne({
      where: {
        guildId: interaction.guildId,
        name: 'buyer',
        type: infoTypes.indexOf('role'),
      },
      attributes: ['identifier'],
    });
    
    if(!buyerRoleId) return;
    
    let buyerRole;
      
    try {
      buyerRole = await interaction.guild.roles.fetch(buyerRoleId.identifier);
    } catch { return; }

    if(interaction.member.roles.cache.has(buyerRole.id)) {
      interaction.member.roles.remove(buyerRole.id);
    }
  },
};
