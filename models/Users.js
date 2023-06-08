module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Messages',
    {
      guildId: {
        type: DataTypes.TEXT,
      },
      userId: {
        type: DataTypes.TEXT,
      },
      messageTimestamp: {
        type: DataTypes.TEXT,
      },
      spamCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    { timestamps: false }
  );
};
