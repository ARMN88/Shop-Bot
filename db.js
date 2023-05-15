

// db.run('CREATE TABLE testguild(userId bigint, messageTimestamp bigint)');
// db.run('INSERT INTO testguild(userId, messageTimestamp) VALUES(?, ?)', [3, 123]);
db.all('SELECT * FROM testguild', [], (err, rows) =);

db.close();