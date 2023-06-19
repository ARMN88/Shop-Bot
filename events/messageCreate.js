const { Events, EmbedBuilder, Colors } = require('discord.js');
const { Sequelize, DataTypes } = require('sequelize');
const verifiedGuilds = require('../guilds.json');
require('dotenv').config();

const database = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/users.db',
  logging: false,
});

const Users = require('../models/Users.js')(database, DataTypes);

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (
      message.author.bot ||
      !Object.keys(verifiedGuilds).includes(message.guild.id)
    )
      return;

    if (message.mentions.has(process.env.CLIENTID)) {
      message.react('👋');
    }

    const user = await Users.findOne({
      where: { userId: `${message.author.id}`, guildId: `${message.guildId}` },
      raw: true,
    });

    if (!user) {
      return await Users.create({
        guildId: `${message.guildId}`,
        userId: `${message.author.id}`,
        messageTimestamp: `${message.createdTimestamp}`,
      });
    }

    await Users.update(
      { messageTimestamp: `${message.createdTimestamp}` },
      { where: { id: user.id } }
    );

    if (message.createdTimestamp - user.messageTimestamp < 10000) {
      if (user.spamCount >= 9) {
        await Users.update({ spamCount: 0 }, { where: { id: user.id } });
        try {
          let warnEmbed = new EmbedBuilder().setColor(Colors.Red);

          if (message.mentions.has(message.guild.ownerId)) {
            await message.member.kick();
            warnEmbed.setDescription(
              `${message.author} was kicked for spamming.`
            );
          } else {
            await message.member.timeout(5 * 60 * 1000);
            warnEmbed.setDescription(
              `${message.author} was timed out for spamming.`
            );
          }
          message.channel.send({ embeds: [warnEmbed] });
        } catch (e) {}
        return;
      }
      await Users.update(
        { spamCount: user.spamCount + 1 },
        { where: { id: user.id } }
      );
    }
  },
};
