const { EmbedBuilder } = require("discord.js");
const config = require('../config.json')

module.exports = {
	customId: "verification",
	async execute(interaction) {
    const capcha = interaction.message.attachments.values().next().value.description;
    const verificationInput = interaction.fields.getTextInputValue('verifyInput');

    if(capcha.toUpperCase() !== verificationInput.toUpperCase()) {
      interaction.update('Incorrect, try again!');
      return;
    }
    
    const verifiedRole = await interaction.guild.roles.fetch(config.guilds[interaction.guildId].roles.verified);
    interaction.member.roles.add(verifiedRole);
    interaction.update({
      content: "Successfully Verified!",
      components: [],
      attachments: []
    });
    
    const auditChannel = await interaction.guild.channels.cache.get(config.guilds[interaction.guildId].channels.logs);
     const memberJoinEmbed = new EmbedBuilder()
      .setColor(0xa434eb)
      .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setDescription(`<@${interaction.user.id}> was successfully verified!`)
      .addFields(
        { name: 'Joined Server', value: `<t:${Math.floor(interaction.member.joinedTimestamp/1000)}:F>` },
        { name: 'Account Created', value: `<t:${Math.floor(interaction.user.createdTimestamp/1000)}:R>`, },
        { name: 'Member Count', value: `${interaction.guild.memberCount} Members`, },
      )
      .setTimestamp()

    await auditChannel.send({ embeds: [memberJoinEmbed] });

    const welcomeEmbed = new EmbedBuilder()
      .setDescription(`Welcome to ${interaction.guild.name}, <@${interaction.user.id}>!`)
      .setColor(0x36ff40);
    
    const welcomeChannel = await interaction.guild.channels.fetch(config.guilds[interaction.guildId].channels.welcome);
    
    return welcomeChannel.send({embeds: [welcomeEmbed] });
	},
};
