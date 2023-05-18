const { Events, EmbedBuilder, Colors } = require('discord.js');

const config = require("../config.json");

const sqlite3 = require('sqlite3').verbose();

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    const db = new sqlite3.Database('./database/users.db');

    db.get(`SELECT * FROM G${message.guildId}`, [], (err) => {
      if (err) {
        return db.run(`CREATE TABLE G${message.guildId}(userId text, messageTimestamp bigint, spamCounter tinyint)`, [], (err) => { if (err) console.error(err) });
      }
      db.get(`SELECT messageTimestamp, spamCounter FROM G${message.guildId} WHERE userId='${message.author.id}'`, [], async (err, data) => {
        if (err) return console.error(err);
        if (!data) {
          return db.run(`INSERT INTO G${message.guildId} VALUES('${message.author.id}', ${message.createdTimestamp}, 0)`, [], (err) => { if (err) console.error(err) });
        }
        db.run(`UPDATE G${message.guildId} SET messageTimestamp=${message.createdTimestamp} WHERE userId='${message.author.id}'`, [], (err) => { if (err) return console.error(err) });

        if (message.createdTimestamp - data.messageTimestamp < 1000) {
          if (data.spamCounter >= 4) {
            db.run(`UPDATE G${message.guildId} SET spamCounter=0 WHERE userId='${message.author.id}'`, [], (err) => { if (err) console.error(err) });
            try {
              await message.member.timeout(5 * 60 * 1000);
              const warnEmbed = new EmbedBuilder().setDescription(`${message.member} timed out for spamming.`).setColor(Colors.Red);
              message.channel.send({ embeds: [warnEmbed] });
            } catch { };
            return;
          }
          db.run(`UPDATE G${message.guildId} SET spamCounter=$COUNTER WHERE userId='${message.author.id}'`, { $COUNTER: data.spamCounter + 1 }, (err) => { if (err) return console.error(err) });
        }
      });
    });

    db.close();
  },
};