const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionsBitField, Colors } = require('discord.js');
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verification')
		.setDescription('Send a capcha verification message to this channel.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
	async execute(interaction) {
    const creatingEmbed = new EmbedBuilder().setDescription('Creating verification role...').setColor(Colors.Yellow);
    await interaction.reply({ embeds: [creatingEmbed], ephemeral: true });

    try {
      const verificationRole = await interaction.guild.roles.create({
        name: 'Verified',
        color: Colors.Green
      });

      const createdEmbed = new EmbedBuilder().setDescription(`Successfullly created ${verificationRole}! Be sure to set permissions for both ${interaction.guild.roles.everyone} and ${verificationRole}.`).setColor(Colors.Green);
      await interaction.editReply({ embeds: [createdEmbed], ephemeral: true });
    } catch(e) {
      console.log(e);
      const failEmbed = new EmbedBuilder().setDescription('Unable to create Verification Role.').setColor(Colors.Red);
      return await interaction.editReply({ embeds: [failEmbed], ephemeral: true });
    }
    
    const verificationEmbed = new EmbedBuilder()
      .setDescription("Please click the button below to verify your account.")
      .setColor(Colors.Blue);

    const verifyButton = new ButtonBuilder()
      .setCustomId('verification')
      .setLabel('Verify')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(verifyButton);

    return await interaction.channel.send({ embeds: [verificationEmbed], components: [row] });
  }
};