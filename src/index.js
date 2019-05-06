import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { importSchema } from 'graphql-import';
import resolvers from './resolvers';
import models, { sequelize } from './models';

dotenv.config();

const typeDefs = importSchema(path.join(__dirname, './schemas/schema.graphql'));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    models,
    user: {
      id: 1,
    },
  },
});

const app = express();
app.use(cors());

server.applyMiddleware({ app });

sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`);
  });
});
