import jwt from "jsonwebtoken";
import User from "../models/user.js";

// export const protect = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     console.log("Token:", token);

//     if (!token) {
//       return res.status(401).json({
//         sucess: false,
//         error: "Token not provided",
//       });
//     }

//     const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

//     const user = await User.findOne({ _id: decode._id });
//     console.log("User:", user);

//     if (!user) {
//       return res.status(401).json({
//         sucess: false,
//         error: "Unauthorized access user not found",
//       });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     return res.status(401).json({
//       sucess: false,
//       error: "Invalid or expired token",
//     });
//   }
// };

export const getUserData = async (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        sucess: false,
        error: "Token not provided",
      });
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findOne({ _id: decode._id });

    if (!user) {
      return res.status(401).json({
        sucess: false,
        error: "Unauthorized access user not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      sucess: false,
      error: "Invalid or expired token",
    });
  }
};
