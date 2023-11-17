const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const register = async (req, res) => {
  // const { name, email, password } = req.body;
  // if (!name || !email || !password) {
  //   res.status(StatusCodes.BAD_REQUEST);
  //   throw new BadRequestError("Must provide name,email, and password");
  // }
  const user = await User.create(req.body);
  const token = await user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new BadRequestError("Must provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    throw new UnauthenticatedError("Invalid Credentials");
  }
  const token = await user.createJWT();

  res.status(StatusCodes.OK).json({ user: { user: user.name }, token });
};

module.exports = {
  register,
  login,
};
