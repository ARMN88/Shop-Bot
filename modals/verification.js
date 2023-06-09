const { EmbedBuilder, Colors } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');

const database = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/users.db',
  logging: false,
  query: {
    raw: true,
  },
});

const Info = database.define(
  'Info',
  {
    guildId: {
      type: DataTypes.STRING,
    },
    identifier: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.TINYINT,
    },
  },
  { timestamps: false }
);

const infoTypes = ['channel', 'role', 'webhook'];

module.exports = {
  customId: 'verification',
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const capcha = interaction.message.attachments.values().next()
      .value.description;
    const verificationInput =
      interaction.fields.getTextInputValue('verifyInput');

    if (capcha.toUpperCase() !== verificationInput.toUpperCase()) {
      interaction.followUp('Incorrect, try again!');
      return;
    }

    const verifiedRoleId = await Info.findOne({
      where: {
        guildId: interaction.guildId,
        name: 'verified',
        type: infoTypes.indexOf('role'),
      },
    });
    if (!verifiedRoleId) {
      const errorEmbed = new EmbedBuilder()
        .setDescription(
          `Verification role is not setup, please contact <@${interaction.guild.ownerId}>.`
        )
        .setColor(Colors.Red);
      return await interaction.followUp({
        embeds: [errorEmbed],
        ephemeral: true,
        attachments: [],
        components: [],
      });
    }
    let verifiedRole;
    try {
      verifiedRole = await interaction.guild.roles.fetch(
        verifiedRoleId.identifier
      );
    } catch {
      const channelErrorEmbed = new EmbedBuilder()
        .setDescription(`Verified role does not exist.`)
        .setColor(Colors.Red);
      return await interaction.followUp({
        embeds: [channelErrorEmbed],
        ephemeral: true,
      });
    }

    let auditChannel;
    const auditChannelId = await Info.findOne({
      where: {
        guildId: interaction.guildId,
        name: 'logs',
        type: infoTypes.indexOf('channel'),
      },
    });
    if (auditChannelId)
      try {
        auditChannel = await interaction.guild.channels.cache.get(
          auditChannelId.identifier
        );
      } catch {}
    try {
      await interaction.member.roles.add(verifiedRole);
      await interaction.followUp({
        content: 'Successfully Verified!',
        components: [],
        attachments: [],
      });
    } catch {
      await interaction.followUp({
        content: `Missing permissions, please contact <@${interaction.guild.ownerId}>.`,
        components: [],
        attachments: [],
      });

      const errorEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setDescription(
          `Error verifying <@${interaction.user.id}>, please make sure <@${interaction.client.user.id}>'s role is higher than ${verifiedRole}.`
        );

      if (auditChannel) await auditChannel.send({ embeds: [errorEmbed] });
    }

    const memberJoinEmbed = new EmbedBuilder()
      .setColor(Colors.Purple)
      .setAuthor({
        name: `${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL(),
      })
      .setDescription(`<@${interaction.user.id}> was successfully verified!`)
      .addFields(
        {
          name: 'Joined Server',
          value: `<t:${Math.floor(
            interaction.member.joinedTimestamp / 1000
          )}:F>`,
        },
        {
          name: 'Account Created',
          value: `<t:${Math.floor(
            interaction.user.createdTimestamp / 1000
          )}:R>`,
        },
        {
          name: 'Member Count',
          value: `${interaction.guild.memberCount} Members`,
        }
      )
      .setTimestamp();

    if (auditChannel) auditChannel.send({ embeds: [memberJoinEmbed] });

    const welcomeChannelId = await Info.findOne({
      where: {
        guildId: interaction.guildId,
        name: 'welcome',
        type: infoTypes.indexOf('channel'),
      },
      attributes: ['identifier'],
    });
    if (welcomeChannelId) {
      const welcomeChannel = await interaction.guild.channels.fetch(
        welcomeChannelId.identifier
      );
      await welcomeChannel.send({
        content: `Welcome to **${interaction.guild.name}**, <@${interaction.user.id}>!`,
      });
    }
  },
};
