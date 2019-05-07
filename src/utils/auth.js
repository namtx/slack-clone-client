import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

export const createTokens = async (user, secret, refreshSecret) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ['id']),
    },
    secret,
    {
      expiresIn: '1m',
    },
  );

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, ['id']),
    },
    refreshSecret,
    { expiresIn: '7d' },
  );
  return [createToken, createRefreshToken];
};

export const tryLogin = async (email, password, models, jwtSecret) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    return {
      ok: false,
      errors: [{ path: 'email', message: 'wrong email' }],
    };
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return {
      ok: false,
      errors: [{ path: 'password', message: 'wrong password' }],
    };
  }
  const refreshSecret = `${user.password}${jwtSecret}`;
  const [token, refreshToken] = await createTokens(user, jwtSecret, refreshSecret);
  return {
    ok: true,
    token,
    refreshToken,
  };
};

export default {};
