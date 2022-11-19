const bcrypt = require('bcrypt');
const { connect } = require('getstream');
const streamChat = require('stream-chat');
const crypto = require('crypto');
const { StreamChat } = require('stream-chat');

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const login = async (req, res) => {
  try {
    // get everthing from req.body
    const { fullName, username, password, phoneNumber } = req.body; // to save it the data base

    // Create user
    const userID = crypto.randomBytes(16).toString('hex');

    const serverClient = connect(api_key, api_secret, app_id);
    // when creating user we actually the hased person password
    const hashedPassword = await bcrypt.hash(password, 10);

    const token = serverClient.createUserToken(userID);

    res
      .status(200)
      .json({ token, fullName, username, userID, hashedPassword, phoneNumber });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error });
  }
};
const signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    const serverClient = connect(api_key, api_secret, app_id);
    // creat new instance of a stream chat
    const client = StreamChat.getInstance(api_key, api_secret);

    // querry all of the user from the data base
    const { users } = await client.queryUsers({ name: username }); // to see anyone matches

    if (!users.length)
      return res.status(400).json({ message: 'User not found' }); // if user does exist

    // decrpyt the password and see if it matches one the user has created acount with
    const success = await bcrypt.compare(password, users[0].hashedPassword);

    // create new user token the same existing id
    const token = serverClient.createUserToken(users[0].id);

    // send all the data pack
    if (success) {
      res
        .status(200)
        .json({ token, fullName: users[0].fullName, username: users[0].id });
    } else {
      res.status(500).json({ message: 'Incorrect password' });
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: error });
  }
};

module.exports = { signup, login };
