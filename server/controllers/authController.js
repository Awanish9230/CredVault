const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Your account has been disabled.' });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                organisation: user.organisation
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// Only for local testing/setup to easily create an admin
exports.seedAdmin = async (req, res, next) => {
    try {
        const adminExists = await User.findOne({ email: 'admin@credvault.app' });
        if (adminExists) {
            return res.status(400).json({ success: false, message: 'Admin already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@credvault.app',
            password: hashedPassword,
            role: 'superadmin',
            organisation: 'CredVault Org'
        });

        res.status(201).json({ success: true, message: 'Admin created successfully', user: admin });
    } catch (error) {
        next(error);
    }
};
