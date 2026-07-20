import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const auth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({status: 'error', message: 'Not authorized, no token'});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user) {
            return res.status(401).json({status: 'error', message: 'Not authorized, user not found'});
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export default auth;