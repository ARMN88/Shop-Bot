const { Events, EmbedBuilder } = require('discord.js');

const config = require("../config.json");

module.exports = {
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage) {
    if(!config.guilds[interaction.guildId]) return interaction.reply({ content: "This server has not been paid for or set up. If you are an Administrator, please contact <@589877702543147058>. Otherwise, contact the owner of this server.", ephemeral: true });
    
    const messageEmbed = new EmbedBuilder()
      .setTitle("Edited Message in " + newMessage.channel.name)
      .setColor(0xffac30)
      .setURL(newMessage.url)
      .setAuthor({ name: newMessage.author.tag, iconURL: newMessage.author.avatarURL() })
      .addFields(
        { name: "Original Message", value: oldMessage.content },
        { name: "New Message", value: newMessage.content },
      )
      .setTimestamp();

    const channel = newMessage.guild.channels.cache.get(config.guilds[newMessage.guildId].channels.logs);
    channel.send({ embeds: [messageEmbed] });
  },
};