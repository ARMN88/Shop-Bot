const { ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, PermissionsBitField, Colors, AttachmentBuilder, TextInputStyle, ModalBuilder, TextInputBuilder } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');
const Canvas = require('canvas');

const database = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/users.db',
  logging: false
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
	data: new SlashCommandBuilder()
		.setName('verification')
		.setDescription('Send a capcha verification message to this channel.')
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
	async execute(interaction) {
    const creatingEmbed = new EmbedBuilder().setDescription('Creating verification role...').setColor(Colors.Yellow);
    await interaction.reply({ embeds: [creatingEmbed], ephemeral: true });

    roleLabel: try {
      const oldRole = await Info.findOne({ where: { guildId: `${interaction.guildId}`, name: 'verified', type: infoTypes.indexOf('role') } }, { raw: true });
      if(oldRole) {
        if(await interaction.guild.roles.fetch(oldRole.identifier)) {
          const existsEmbed = new EmbedBuilder().setDescription(`Role already exists, using <@&${oldRole.identifier}>.`).setColor(Colors.Green);
          await interaction.editReply({ embeds: [existsEmbed], ephemeral: true });
          break roleLabel;
        }
      }
      
      const verificationRole = await interaction.guild.roles.create({
        name: 'Verified',
        color: Colors.Green,
        permissions: [
          PermissionsBitField.Flags.UseApplicationCommands,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.SendMessagesInThreads,
          PermissionsBitField.Flags.Connect,
          PermissionsBitField.Flags.Speak,
          PermissionsBitField.Flags.UseVAD
        ]
      });

      await Info.create({
        guildId: `${interaction.guildId}`,
        identifier: `${verificationRole.id}`,
        name: 'verified',
        type: infoTypes.indexOf('role')
      });

      const createdEmbed = new EmbedBuilder().setDescription(`Successfullly created ${verificationRole}! Be sure to set permissions for both ${interaction.guild.roles.everyone} and ${verificationRole}.`).setColor(Colors.Green);
      await interaction.editReply({ embeds: [createdEmbed], ephemeral: true });
    } catch(e) {
      console.error(e);
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
