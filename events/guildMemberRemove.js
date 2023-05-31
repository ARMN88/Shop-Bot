const { Events, EmbedBuilder, Colors } = require("discord.js");
const { Sequelize, DataTypes } = require('sequelize');
const verifiedGuilds = require('../guilds.json');

const database = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/users.db',
  logging: false,
  query: {
    raw: true
  }
});

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
  name: Events.GuildMemberRemove,
  async execute(member) {
    if(!Object.keys(verifiedGuilds).includes(member.guild.id)) return;

    const auditChannelId = await Info.findOne({ where: { guildId: member.guild.id, name: 'logs', type: infoTypes.indexOf('channel') } });
    if(!auditChannelId) return;
    
    const memberLeaveEmbed = new EmbedBuilder()
      .setColor(Colors.Red)
      .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
      .setDescription(`${member.user.tag} left the server!`)
      .addFields(
        { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp/1000)}:F>` },
        { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp/1000)}:R>`},
        { name: 'Member Count', value: `${member.guild.memberCount} Members` },
      )
      .setTimestamp()

    let auditChannel;
    try {
      auditChannel = await member.guild.channels.fetch(auditChannelId.identifier);
    } catch {
      return;
    }
    auditChannel.send({ embeds: [memberLeaveEmbed] });
  }
};