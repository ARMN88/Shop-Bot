const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/users.db',
  logging: false
});

async function Init() {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  const User = sequelize.define('User', {
    userId: {
      type: Sequelize.STRING,
    },
    messageTimestamp: {
      type: Sequelize.TIME
    },
    spamCount: {
      type: Sequelize.SMALLINT,
      defaultValue: 0
    }
  }, { timestamps: false });

  await User.sync({ force: true });

  await User.create({ userId: '8281', messageTimestamp: 1684458607 })

  const table = await User.findAll({ raw: true, where: { userId: '8282' } });
  console.log(table);
}

Init();