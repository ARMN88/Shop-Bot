const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database/users.db');

const guildId = '1106412040471457903';

// db.run(`CREATE TABLE ${'G'+guildId}(userId text, messageTimestamp bigint, spamCounter tinyint)`, [], (err) => {
//   if(err) return console.error(err);
// });

// db.run(`DROP TABLE G${guildId}`);

// db.all(`SELECT * FROM G${guildId}`, [], (err, data) => {
//   if (err) return console.error(err);
//   console.table(data);
// });
db.all(`SELECT name FROM sqlite_master WHERE type = "table"`, [], (err, data) => {
  if (err) return console.error(err);
  console.table(data);
});

db.close();