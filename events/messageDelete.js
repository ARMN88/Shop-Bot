const { Events, EmbedBuilder } = require('discord.js');

const config = require("../config.json");

module.exports = {
  name: Events.MessageDelete,
  execute(message) {
    if(!config.guilds[interaction.guildId]) return interaction.reply({ content: "This server has not been paid for or set up. If you are an Administrator, please contact <@589877702543147058>. Otherwise, contact the owner of this server.", ephemeral: true });
    
    const messageEmbed = new EmbedBuilder()
      .setTitle("Deleted Message in " + message.channel.name)
      .setColor(0xFC3232)
      .setURL(message.channel.url)
      .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL() })
      .setDescription(message.content)
      .setTimestamp();

    const channel = message.guild.channels.cache.get(config.guilds[message.guildId].channels.logs);
    channel.send({ embeds: [messageEmbed] });
  },
};