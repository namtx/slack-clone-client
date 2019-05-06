import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
    define: {
      underscored: true,
    },
  },
);

const models = {
  User: sequelize.import('./user'),
  Team: sequelize.import('./team'),
  Channel: sequelize.import('./channel'),
  Message: sequelize.import('./message'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };
export default models;
