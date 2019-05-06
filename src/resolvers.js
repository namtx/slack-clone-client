import bcrypt from 'bcrypt';

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
        if (user) {
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },

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
