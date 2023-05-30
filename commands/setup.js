const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, Colors } = require('discord.js');
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
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription("Access the bot's settings in this server.")
    .addSubcommandGroup(subCommandGroup =>
      subCommandGroup
        .setName('set')
        .setDescription('Set up roles and channels with this bot.')
        .addSubcommand(subcommand =>
          subcommand
            .setName('channel')
              .setDescription('Set a channel.')
              .addStringOption(option =>
                option
                  .setRequired(true)
                  .setName('channel-type')
                  .setDescription('The type of channel you want to set.')
                  .addChoices(
                    { name: 'Welcome', value: 'welcome' },
                    { name: 'Gift Bases', value: 'gift-bases' },
                    { name: 'Bases', value: 'bases' },
                    { name: 'Wood', value: 'wood' },
                    { name: 'Transactions', value: 'transactions' },
                    { name: 'Audit Logs', value: 'logs' }
                  ))
              .addChannelOption(option =>
                option
                  .setRequired(true)
                  .setName('server-channel')
                  .setDescription('The corresponding channel in your server.')))
        .addSubcommand(subcommand =>
          subcommand
            .setName('role')
              .setDescription('Set a role.')
              .addStringOption(option =>
                option
                  .setRequired(true)
                  .setName('role-type')
                  .setDescription('The type of role you want to set.')
                  .addChoices(
                    { name: 'Verified', value: 'verified' }
                  ))
              .addRoleOption(option =>
                option
                  .setRequired(true)
                  .setName('server-role')
                  .setDescription('The corresponding role in your server.'))))
    .addSubcommandGroup(subCommandGroup =>
      subCommandGroup
        .setName('delete')
        .setDescription('Set up roles and channels with this bot.')
        .addSubcommand(subcommand =>
          subcommand
            .setName('channel')
              .setDescription('Set a channel.')
              .addStringOption(option =>
                option
                  .setRequired(true)
                  .setName('channel-type')
                  .setDescription('The type of channel you want to set.')
                  .addChoices(
                    { name: 'Welcome', value: 'welcome' },
                    { name: 'Gift Bases', value: 'gift-bases' },
                    { name: 'Bases', value: 'bases' },
                    { name: 'Wood', value: 'wood' },
                    { name: 'Transactions', value: 'transactions' },
                    { name: 'Audit Logs', value: 'logs' }
                  )))
        .addSubcommand(subcommand =>
          subcommand
            .setName('role')
              .setDescription('Set a role.')
              .addStringOption(option =>
                option
                  .setRequired(true)
                  .setName('role-type')
                  .setDescription('The type of role you want to set.')
                  .addChoices(
                    { name: 'Verified', value: 'verified' }
                  ))))
    .addSubcommand(subcommand =>
          subcommand
            .setName('show')
              .setDescription('Show options for this server.')
              )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction) {
    switch(interaction.options.getSubcommandGroup()) {
      case 'set':
        switch (interaction.options.getSubcommand()) {
          case 'channel':
            const creatingChannelEmbed = new EmbedBuilder().setDescription(`Adding <#${interaction.options.getChannel('server-channel').id}> channel...`).setColor(Colors.Orange);
            await interaction.reply({embeds: [creatingChannelEmbed], ephemeral: true });
            const databaseChannel = await Info.findOne({ where: { guildId: interaction.guildId, type: infoTypes.indexOf('channel'), name: interaction.options.getString('channel-type') }});
            const createdChannelEmbed = new EmbedBuilder().setDescription(`${Capitalize(interaction.options.getString('channel-type'))} channel set to <#${interaction.options.getChannel('server-channel').id}>.`).setColor(Colors.Green);
            if(!databaseChannel) {
              await Info.create({
                guildId: interaction.guildId,
                type: infoTypes.indexOf('channel'),
                name: interaction.options.getString('channel-type'),
                identifier: interaction.options.getChannel('server-channel').id
              });
            } else {
              createdChannelEmbed.setDescription(`${Capitalize(interaction.options.getString('channel-type'))} channel changed to <#${interaction.options.getChannel('server-channel').id}>.`)
              await Info.update({ identifier: interaction.options.getChannel('server-channel').id }, { where: { guildId: interaction.guildId, type: infoTypes.indexOf('channel'), name: interaction.options.getString('channel-type') }});
            }
            await interaction.editReply({embeds: [createdChannelEmbed], ephemeral: true });
            break;
          case 'role':
            const creatingRoleEmbed = new EmbedBuilder().setDescription(`Adding <@&${interaction.options.getRole('server-role').id}> role...`).setColor(Colors.Orange);
            await interaction.reply({embeds: [creatingRoleEmbed], ephemeral: true });
            const databaseRole = await Info.findOne({ where: { guildId: interaction.guildId, type: infoTypes.indexOf('role'), name: interaction.options.getString('role-type') }});
            const createdRoleEmbed = new EmbedBuilder().setDescription(`${Capitalize(interaction.options.getString('role-type'))} role set to <@&${interaction.options.getRole('server-role').id}>.`).setColor(Colors.Green);
            if(!databaseRole) {
              await Info.create({
                guildId: interaction.guildId,
                type: infoTypes.indexOf('role'),
                name: interaction.options.getString('role-type'),
                identifier: interaction.options.getRole('server-role').id
              });
            } else {
              createdRoleEmbed.setDescription(`${Capitalize(interaction.options.getString('role-type'))} role changed to <@&${interaction.options.getRole('server-role').id}>.`);
              await Info.update({ identifier: interaction.options.getRole('server-role').id }, { where: { guildId: interaction.guildId, type: infoTypes.indexOf('role'), name: interaction.options.getString('role-type') }});
            }
            await interaction.editReply({embeds: [createdRoleEmbed], ephemeral: true });
            break;
        }
        break;
      case 'delete':
        switch (interaction.options.getSubcommand()) {
          case 'channel':
            const deleteChannelEmbed = new EmbedBuilder().setDescription(`Removing ${interaction.options.getString('channel-type')} channel...`).setColor(Colors.Orange);
            await interaction.reply({embeds: [deleteChannelEmbed], ephemeral: true });
            
            const databaseChannel = await Info.findOne({ where: { guildId: interaction.guildId, type: infoTypes.indexOf('channel'), name: interaction.options.getString('channel-type') }});
            if(!databaseChannel) return await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`${Capitalize(interaction.options.getString('channel-type'))} channel does not exist.`).setColor(Colors.Yellow)], ephemeral: true });
            await Info.destroy({ where: { guildId: interaction.guildId, type: infoTypes.indexOf('channel'), name: interaction.options.getString('channel-type') }, force: true});
            
            const deletedChannelEmbed = new EmbedBuilder().setDescription(`Removed ${interaction.options.getString('channel-type')} channel.`).setColor(Colors.Green);
            await interaction.editReply({embeds: [deletedChannelEmbed], ephemeral: true });
            break;
          case 'role':
            const deleteRoleEmbed = new EmbedBuilder().setDescription(`Removing ${interaction.options.getString('role-type')} role...`).setColor(Colors.Orange);
            await interaction.reply({embeds: [deleteRoleEmbed], ephemeral: true });
            
            const databaseRole = await Info.findOne({ where: { guildId: interaction.guildId, type: infoTypes.indexOf('role'), name: interaction.options.getString('role-type') }});
            if(!databaseRole) return await interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`${Capitalize(interaction.options.getString('role-type'))} role does not exist.`).setColor(Colors.Yellow)], ephemeral: true });
            await Info.destroy({ where: { guildId: interaction.guildId, type: infoTypes.indexOf('role'), name: interaction.options.getString('role-type') }, force: true});
            
            const deletedRoleEmbed = new EmbedBuilder().setDescription(`Removed ${interaction.options.getString('role-type')} role.`).setColor(Colors.Green);
            await interaction.editReply({embeds: [deletedRoleEmbed], ephemeral: true });
            break;
        }
        break;
      default:
        const databaseRoles = await Info.findAll({ where: { guildId: interaction.guildId, type: infoTypes.indexOf('role')}});
        const databaseChannels = await Info.findAll({ where: { guildId: interaction.guildId, type: infoTypes.indexOf('channel')}})

        let roleString = '';
        let channelString = '';
        
        databaseRoles.forEach(role => {
          roleString += `${Capitalize(role.name)}: <@&${role.identifier}>\n`
        });

        databaseChannels.forEach(channel => {
          channelString += `${Capitalize(channel.name)}: <#${channel.identifier}>\n`
        });

        const showEmbed = new EmbedBuilder()
          .setTitle('Current Info for ' + interaction.guild.name)
          .addFields(
            { name: 'Roles', value: roleString || 'None' },
            { name: 'Channels', value: channelString || 'None' }
          )
          .setColor(Colors.Blue);

        await interaction.reply({ embeds: [showEmbed] });
        break;
    }
  },
};

function Capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}