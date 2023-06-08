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
    .setName('help')
    .setDescription('A help guide to set up this bot with your server.'),
  async execute(interaction) {
    const helpEmbed = new EmbedBuilder()
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

    return await interaction.reply({ embeds: [helpEmbed] });
  },
};
