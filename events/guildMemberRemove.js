const { Events, EmbedBuilder, Colors } = require("discord.js");
const { Sequelize, DataTypes } = require('sequelize');

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
    // if(!config.guilds[member.guild.id]) return;

    const auditChannelId = await Info.findOne({ where: { guildId: interaction.guildId, name: 'logs', type: infoTypes.indexOf('channel') } });
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
      auditChannel = await interaction.guild.channels.cache.get(auditChannelId.identifier);
    } catch {
      const channelErrorEmbed = new EmbedBuilder().setDescription(`Log channel does not exist.`).setColor(Colors.Red);
      return await interaction.reply({ embeds: [channelErrorEmbed], ephemeral: true });
    }
    auditChannel.send({ embeds: [memberLeaveEmbed] });
  }
};