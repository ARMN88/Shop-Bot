module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'Infos',
    {
      guildId: {
        type: DataTypes.TEXT,
      },
      identifier: {
        type: DataTypes.TEXT,
      },
      name: {
        type: DataTypes.TEXT,
      },
      type: {
        type: DataTypes.INTEGER,
      },
    },
    { timestamps: false }
  );
};
