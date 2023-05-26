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
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage) {
    // if(!config.guilds[newMessage.guildId]) return;
    if(newMessage.author.bot) return;
    const auditChannelId = await Info.findOne({ where: { guildId: newMessage.guildId, name: 'logs', type: infoTypes.indexOf('channel') } });
    if(!auditChannelId) return;
    
    const messageEmbed = new EmbedBuilder()
      .setTitle("Edited Message in " + newMessage.channel.name)
      .setColor(Colors.Orange)
      .setURL(newMessage.url)
      .setAuthor({ name: newMessage.author.tag, iconURL: newMessage.author.avatarURL() })
      .addFields(
        { name: "Original Message", value: oldMessage.content || "None" },
        { name: "New Message", value: newMessage.content || "None" },
      )
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