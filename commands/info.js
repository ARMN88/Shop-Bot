const {
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  Colors,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get information about this server.')
    .setDMPermission(false),
  async execute(interaction) {
    const infoEmbed = new EmbedBuilder()
      .setTitle(`${interaction.guild.name} Info`)
      .setColor(Colors.Blue)
      .setThumbnail(interaction.guild.iconURL({ size: 512 }))
      .addFields(
        { name: 'Member Count', value: `${interaction.guild.memberCount}` },
        {
          name: 'Created On',
          value: `<t:${Math.round(
            interaction.guild.createdTimestamp / 1000
          )}:D>`,
        },
        { name: 'Server Owner', value: `<@${interaction.guild.ownerId}>` }
      );

    return await interaction.reply({ embeds: [infoEmbed] });
  },
};
