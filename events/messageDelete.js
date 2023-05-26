const { Events, EmbedBuilder, Colors } = require('discord.js');
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
  name: Events.MessageDelete,
  async execute(message) {
    if(message.author.bot) return;
    const auditChannelId = await Info.findOne({ where: { guildId: message.guildId, name: 'logs', type: infoTypes.indexOf('channel') } });
    if(!auditChannelId) return;
    
    const messageEmbed = new EmbedBuilder()
      .setTitle("Deleted Message in " + message.channel.name)
      .setColor(Colors.Red)
      .setURL(message.channel.url)
      .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
      .setDescription(message.content || "None")
      .setTimestamp();
    
    let auditChannel;
    try {
      auditChannel = await interaction.guild.channels.cache.get(auditChannelId.identifier);
    } catch {
      const channelErrorEmbed = new EmbedBuilder().setDescription(`Log channel does not exist.`).setColor(Colors.Red);
      return await interaction.reply({ embeds: [channelErrorEmbed], ephemeral: true });
    }
    auditChannel.send({ embeds: [messageEmbed] });
  },
};