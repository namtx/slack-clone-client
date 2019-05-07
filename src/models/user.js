export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: true,
        len: [3, 255],
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: DataTypes.STRING,
  });

  User.associate = (models) => {
    User.belongsToMany(
      models.Team,
      {
        through: 'member',
        foreignKey: {
          name: 'userId',
          field: 'user_id',
        },
      },
    );

    User.belongsToMany(
      models.Channel,
      {
        through: 'channel_member',
        foreignKey: {
          name: 'userId',
          field: 'user_id',
        },
      },
    );
  };
  return User;
};
