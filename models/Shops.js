module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Shops', {
    guildId: {
      type: DataTypes.TEXT
    },
    type: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.TEXT
    },
    priceRobux: {
      type: DataTypes.TEXT
    },
    priceDollars: {
      type: DataTypes.REAL
    },
    attachment: {
      type: DataTypes.TEXT
    },
    dataSize: {
      type: DataTypes.INTEGER
    }
  }, { timestamps: false });
};