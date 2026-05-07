const bcrypt = require('bcryptjs');
const User = require('./models/User');

const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'superadmin' });
        if (adminExists) {
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('awanish@123', salt);

        await User.create({
            name: 'Awanish',
            email: 'awanish@credvault.com',
            password: hashedPassword,
            role: 'superadmin',
            organisation: 'CredVault Org'
        });

        console.log('--- Production Seed: Default Admin Created ---');
        console.log('Email: awanish@credvault.com');
        console.log('Password: awanish@123');
        console.log('--------------------------------------------');
    } catch (err) {
        console.error('Seed Error:', err.message);
    }
};

module.exports = seedAdmin;
