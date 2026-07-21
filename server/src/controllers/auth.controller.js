import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({status: 'error', message: 'Please provide all required fields'});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const existingUser = await User.findOne({ email });
        if(existingUser) {
            return res.status(400).json({status: 'error', message: 'User already exists'});
        }
        const user = await User.create({ name, email, password: hashedPassword });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true });
        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.password;
        res.status(201).json({ status: 'success', message: 'User registered successfully', user: userWithoutPassword, token });
    } catch (error) {
        res.status(500).json({ status: 'errorr', message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({status: 'error', message: 'Please provide all required fields'});
        }
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({status: 'error', message: 'User not found'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({status: 'error', message: 'Invalid credentials'});
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ status: 'success', message: 'User logged in successfully', user, token });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if(!user) {
            return res.status(404).json({status: 'error', message: 'User not found'});
        }
        res.status(200).json({ status: 'success', message: 'User found successfully', user });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ status: 'success', message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export { register, login, me, logout };