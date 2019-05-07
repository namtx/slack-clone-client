import bcrypt from 'bcrypt';
import _ from 'lodash';
import { tryLogin } from './utils/auth';

const formatErrors = (e) => {
  if (e.errors instanceof Array) {
    return e.errors.map(x => _.pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'something went wrong' }];
};

export default {
  Query: {
    hi: () => 'hi',
    getUser: (parent, { userId }, { models }) => models.User.findOne({ where: { id: userId } }),
    allUsers: (parent, _args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (parent, { password, ...otherArgs }, { models }) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await models.User.create({ password: hashedPassword, ...otherArgs });
        return {
          ok: true,
          user,
        };
      } catch (error) {
        return {
          ok: false,
          errors: formatErrors(error),
        };
      }
    },
    login: async (
      parent,
      {
        email,
        password,
      },
      {
        models,
        jwtSecret,
      },
    ) => tryLogin(email, password, models, jwtSecret),
    createTeam: async (parent, args, { models, user }) => {
      try {
        const team = await models.Team.create({ ...args, owner: user.id });
        if (team) {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },

    createChannel: async (parent, args, { models }) => {
      try {
        const channel = await models.Channel.create(args);
        if (channel) {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },

    createMessage: async (parent, args, { models, user }) => {
      try {
        const message = await models.Message.create({
          ...args,
          userId: user.id,
        });
        if (message) {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },
  },
};
