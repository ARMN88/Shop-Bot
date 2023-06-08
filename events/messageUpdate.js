const { Events, EmbedBuilder, Colors } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');
const verifiedGuilds = require('../guilds.json');

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
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage) {
    if (
      !Object.keys(verifiedGuilds).includes(newMessage.guild.id) ||
      oldMessage.content === newMessage.content
    )
      return;
    if (newMessage.author.bot) return;
    const auditChannelId = await Info.findOne({
      where: {
        guildId: newMessage.guildId,
        name: 'logs',
        type: infoTypes.indexOf('channel'),
      },
    });
    if (!auditChannelId) return;

    const messageEmbed = new EmbedBuilder()
      .setTitle('Edited Message in ' + newMessage.channel.name)
      .setColor(Colors.Orange)
      .setURL(newMessage.url)
      .setAuthor({
        name: newMessage.author.tag,
        iconURL: newMessage.author.avatarURL(),
      })
      .addFields(
        { name: 'Original Message', value: oldMessage.content || 'None' },
        { name: 'New Message', value: newMessage.content || 'None' }
      )
      .setTimestamp();

    let auditChannel;
    try {
      auditChannel = await newMessage.guild.channels.fetch(
        auditChannelId.identifier
      );
    } catch {
      return;
    }
    auditChannel.send({ embeds: [messageEmbed] });
  },
};
