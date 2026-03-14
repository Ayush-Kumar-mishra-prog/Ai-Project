import bcrypt from "bcryptjs";
import User from "../models/user.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validate the request body
    if ([email, password].some((field) => field.trim() === "")) {
      return res.status(400).json({
        sucess: false,
        message: "name, email, password is requried",
        data: {},
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        sucess: false,
        message: "Invalid creditionals",
        data: {},
      });
    }
    const passwordMathchd = await user.isPasswordMatched(password);

    if (!passwordMathchd) {
      return res.status(400).json({
        sucess: false,
        message: "Invalid creditionals",
        data: {},
      });
    }
    const token = await user.generateAccessToken();
    console.log("Access Token:", token);
    return res.status(200).json({
      sucess: true,
      message: "You have logged in sucessfully",
      data: {
        token: token,
      },
    });
  } catch (e) {
    return res.status(500).json({
      sucess: false,
      message: e.message || "Something went wrong",
      data: {},
    });
  }
};
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if ([name, email, password].some((field) => field.trim() === "")) {
      return res.status(400).json({
        sucess: false,
        message: "name, email, password is requried",
        data: {},
      });
    }
    // check user email is already exist or not
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        sucess: false,
        message: "email already exist",
        data: {},
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashPassword,
    });
    return res.status(200).json({
      sucess: true,
      message: "You have sucessfully registerd.",
      data: {},
    });
  } catch (e) {
    return res.status(500).json({
      sucess: false,
      message: e.message || "Something went wrong",
      data: {},
    });
  }
};

// Function to get all the users

const getUser = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    return res.status(200).json({
      sucess: true,
      message: "All users fetched sucessfully",
      data: users,
    });
  } catch (e) {
    return res.status(500).json({
      sucess: false,
      message: e.message || "Something went wrong",
      data: {},
    });
  }
};

export { register, login, getUser };
