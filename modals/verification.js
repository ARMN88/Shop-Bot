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
    
    const verifiedRole = await interaction.guild.roles.fetch(config.guilds[interaction.guildId].roles.Verified);
    interaction.member.roles.add(verifiedRole);
    interaction.update({
      content: "Successfully Verified!",
      components: [],
      attachments: []
    });

    const welcomeEmbed = new EmbedBuilder()
      .setDescription(`Welcome to ${interaction.guild.name}, <@${interaction.user.id}>!`)
      .setColor(0x36ff40);
    
    const welcomeChannel = await interaction.guild.channels.fetch(config.guilds[interaction.guildId].channels.welcome);
    
    return welcomeChannel.send({embeds: [welcomeEmbed] });
	},
};