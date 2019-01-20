const bcrypt = require('bcryptjs');

const User = require('../../models/user');

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
};
