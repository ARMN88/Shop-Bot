const { EmbedBuilder, Colors } = require("discord.js");
const config = require('../config.json')

module.exports = {
  customId: "verification",
  async execute(interaction) {
    const capcha = interaction.message.attachments.values().next().value.description;
    const verificationInput = interaction.fields.getTextInputValue('verifyInput');

    if (capcha.toUpperCase() !== verificationInput.toUpperCase()) {
      interaction.update('Incorrect, try again!');
      return;
    }

    const verifiedRole = await interaction.guild.roles.fetch(config.guilds[interaction.guildId].roles.verified);
    const auditChannel = await interaction.guild.channels.cache.get(config.guilds[interaction.guildId].channels.logs);

    try {
      await interaction.member.roles.add(verifiedRole);
      interaction.update({
        content: "Successfully Verified!",
        components: [],
        attachments: []
      });

      const memberJoinEmbed = new EmbedBuilder()
        .setColor(Colors.Purple)
        .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setDescription(`${interaction.user} was successfully verified!`)
        .addFields(
          { name: 'Joined Server', value: `<t:${Math.floor(interaction.member.joinedTimestamp / 1000)}:F>` },
          { name: 'Account Created', value: `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:R>`, },
          { name: 'Member Count', value: `${interaction.guild.memberCount} Members`, },
        )
        .setTimestamp()

      auditChannel.send({ embeds: [memberJoinEmbed] });

      const welcomeEmbed = new EmbedBuilder()
        .setDescription(`Welcome to ${interaction.guild.name}, ${interaction.user}!`)
        .setColor(Colors.Green);

      const welcomeChannel = await interaction.guild.channels.fetch(config.guilds[interaction.guildId].channels.welcome);

      return welcomeChannel.send({ embeds: [welcomeEmbed] });
    } catch {
      interaction.update({
        content: `Missing permissions, please contact <@${interaction.guild.ownerId}>.`,
        components: [],
        attachments: []
      });

      const errorEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setDescription(`Error verifying ${interaction.user}, please make sure ${interaction.client.user}'s role is higher than ${verifiedRole}.`)

      await auditChannel.send({ embeds: [errorEmbed] });
    };
  },
};
