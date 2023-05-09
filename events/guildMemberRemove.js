const { Events, EmbedBuilder } = require("discord.js");
const config = require("../config.json");

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    if(!config.guilds[interaction.guildId]) return interaction.reply({ content: "This server has not been paid for or set up. If you are an Administrator, please contact <@589877702543147058>. Otherwise, contact the owner of this server.", ephemeral: true });

    const auditChannel = await member.guild.channels.fetch(config.guilds[member.guild.id].channels.logs);
    const memberLeaveEmbed = new EmbedBuilder()
      .setColor(0xff3d3d)
      .setAuthor({ name: `${member.user.tag}`, iconURL: member.user.displayAvatarURL() })
      .setDescription(`${member.user.tag} left the server!`)
      .addFields(
        { name: 'Joined Server', value: `<t:${Math.floor(member.joinedTimestamp/1000)}:F>` },
        { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp/1000)}:R>`},
        { name: 'Member Count', value: `${member.guild.memberCount} Members` },
      )
      .setTimestamp()
    
    auditChannel.send({ embeds: [memberLeaveEmbed] });
  }
};