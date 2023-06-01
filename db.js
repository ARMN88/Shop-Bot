const { Sequelize, DataTypes } = require('sequelize');

// Login //
const database = new Sequelize({
  dialect: 'sqlite',
  storage: 'database/users.db',
  logging: false,
  query: {
    raw: true
  }
});

// Info //
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

// Messages //
const Users = database.define('Messages', {
  guildId: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.STRING,
  },
  messageTimestamp: {
    type: DataTypes.TIME
  },
  spamCount: {
    type: DataTypes.SMALLINT,
    defaultValue: 0
  }
}, { timestamps: false });

// Shops //
const Shop = database.define('Shops', {
  guildId: {
    type: DataTypes.STRING
  },
  type: {
    type: DataTypes.TINYINT
  },
  name: {
    type: DataTypes.STRING
  },
  priceRobux: {
    type: DataTypes.SMALLINT
  },
  priceDollars: {
    type: DataTypes.DOUBLE
  },
  attachment: {
    type: DataTypes.STRING
  }
}, { timestamps: false });

const shopTypes = ['gift-bases', 'bases', 'wood'];