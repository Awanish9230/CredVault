const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        const adminExists = await User.findOne({ email: 'admin@credvault.app' });
        if (adminExists) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        await User.create({
            name: 'Admin',
            email: 'admin@credvault.com',
            password: hashedPassword,
            role: 'superadmin',
            organisation: 'CredVault Org'
        });

        console.log('Admin user created: admin@credvault.app / password123');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedAdmin();
