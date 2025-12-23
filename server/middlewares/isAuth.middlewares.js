import jwt from 'jsonwebtoken';
import { User } from '../models/user.models.js';

export const isAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch full user from DB to get the role
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Attach full user document
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
};

export const isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                message: "You are not an admin, access denied"
            });
        }
        next();
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// export const isSupervisor = (req, res, next) => {
//     try {
//         if (req.user.role !== 'supervisor') {
//             return res.status(403).json({
//                 message: "You are not a supervisor, access denied"
//             });
//         }
//         next();
//     } catch (error) {
//         res.status(400).json({
//             message: error.message
//         });
//     }
// };

export const isSupervisor = (req, res, next) => {
  try {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Unauthorized, no user data" });
    }

    const role = req.user.role;
    const isSupervisor = Array.isArray(role)
      ? role.includes("supervisor")
      : role.toLowerCase() === "supervisor";

    if (!isSupervisor) {
      return res.status(403).json({ message: "You are not a supervisor, access denied" });
    }

    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// NEW: Handles both string and array role formats for operators
export const isOperator = (req, res, next) => {
    try {
        const role = req.user.role;

        const hasOperatorRole = Array.isArray(role)
            ? role.includes('operator')
            : role === 'operator';

        if (!hasOperatorRole) {
            return res.status(403).json({
                message: "You are not an operator, access denied"
            });
        }
        next();
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};
