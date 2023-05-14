const { Events, EmbedBuilder } = require('discord.js');

const config = require("../config.json");

module.exports = {
  name: Events.MessageDelete,
  execute(message) {
    if(!config.guilds[message.guildId]) return;
    if(message.author.bot) return;
    
    const messageEmbed = new EmbedBuilder()
      .setTitle("Deleted Message in " + message.channel.name)
      .setColor(0xFC3232)
      .setURL(message.channel.url)
      .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
      .setDescription(message.content || "None")
      .setTimestamp();

    const channel = message.guild.channels.cache.get(config.guilds[message.guildId].channels.logs);
    channel.send({ embeds: [messageEmbed] });
  },
};