import userModel from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (user) {
      return res
        .status(409)
        .json({ message: "Email Already Existed! Please Login" });
    }
    const hashPassword = bcrypt.hashSync(password, 12);
    const newUser = new userModel({ userName, email, password: hashPassword });
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.SECRETE_KEY
    );
    await newUser.save();
    res.cookie("token", token, { httpOnly: true });
    const userResponse = {
      _id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
    };

    return res
      .status(201)
      .json({ message: "User Created Successfully", newUser: userResponse });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Sign Up Failure, Internal Server Error" });
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.SECRETE_KEY
    );
    res.cookie("token", token, { httpOnly: true });
    const userResponse = {
      _id: user._id,
      email: user.email,
      password: user.password,
    };
    return res
      .status(200)
      .json({ message: "User Login Successfully", user: userResponse });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Sign In Failure, Internal Server Error" });
  }
};
