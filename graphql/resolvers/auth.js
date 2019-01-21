const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');

const keys = require('../../configs/keys');

module.exports = {
  createUser: async (args) => {
    let userExisted = null;
    try {
      userExisted = await User.findOne({ email: args.userInput.email });
    } catch (err) {
      throw err;
    }
    if (userExisted) {
      throw new Error('User exists already.');
    }

    let hashedPassword = null;
    try {
      hashedPassword = await bcrypt.hash(args.userInput.password, 12);
    } catch (err) {
      throw err;
    }
    const user = new User({
      email: args.userInput.email,
      password: hashedPassword,
    });
    let userCreated = null;
    try {
      userCreated = await user.save();
    } catch (err) {
      throw err;
    }
    return {
      _id: userCreated.id,
      email: userCreated.email,
      password: 'null',
    };
  },
  login: async ({ email, password }) => {
    let user = null;
    try {
      user = await User.findOne({ email });
    } catch (err) {
      throw err;
    }
    if (!user) throw new Error('User does not exist');
    let passwordIsEqual = null;
    try {
      passwordIsEqual = await bcrypt.compare(password, user.password);
    } catch (err) {
      throw err;
    }
    if (!passwordIsEqual) throw new Error('Email or password is incorrect!');
    let token = null;
    try {
      token = await jwt.sign(
        {
          userID: user.id,
          email: user.email,
        },
        keys.secret,
        {
          expiresIn: '1h',
        },
      );
    } catch (err) {
      throw err;
    }
    return {
      userID: user.id,
      token,
      tokenExpriration: 1,
    };
  },
};
