const Certificate = require('../models/Certificate');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

const generateCertId = (type) => {
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars
    
    let typeCode = 'GEN';
    switch (type) {
        case 'Internship': typeCode = 'INT'; break;
        case 'Appreciation': typeCode = 'APR'; break;
        case 'Participation': typeCode = 'PRT'; break;
        case 'Achievement': typeCode = 'ACH'; break;
        case 'Completion': typeCode = 'CMP'; break;
    }
    
    return `CV-${year}-${typeCode}-${randomHex}`;
};

exports.generateCertificate = async (req, res, next) => {
    try {
        const {
            recipientName, recipientEmail, role, programme, certType,
            startDate, endDate, issuedBy, issuingOrg, customMessage, template
        } = req.body;

        const certId = generateCertId(certType);

        const certificate = await Certificate.create({
            certId,
            recipientName,
            recipientEmail,
            role,
            programme,
            certType,
            startDate,
            endDate,
            issuedBy,
            issuingOrg,
            customMessage,
            template,
            generatedBy: req.user.id
        });

        if (recipientEmail) {
            try {
                const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                const verifyUrl = `${frontendUrl}/verify/${certId}`;
                
                const message = `
                    <h2>Congratulations ${recipientName}!</h2>
                    <p>Your <strong>${certType}</strong> certificate for <strong>${role}</strong> at ${issuingOrg} has been successfully generated.</p>
                    <p>You can view and verify your official digital certificate by clicking the link below:</p>
                    <a href="${verifyUrl}" style="display: inline-block; padding: 10px 20px; margin-top: 10px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 5px;">View Certificate</a>
                    <p>Alternatively, you can verify it using this Certificate ID: <strong>${certId}</strong> on our portal.</p>
                `;

                await sendEmail({
                    email: recipientEmail,
                    subject: 'Your Certificate has been Generated - CredVault',
                    message
                });
            } catch (emailError) {
                console.error('Email could not be sent', emailError);

            }
        }

        res.status(201).json({ success: true, data: certificate });
    } catch (error) {
        next(error);
    }
};

exports.verifyCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findOne({ certId: req.params.certId });

        if (!certificate) {
            return res.status(404).json({ success: false, message: 'Certificate not found' });
        }

        certificate.verifyCount += 1;
        await certificate.save();

        res.status(200).json({ success: true, data: certificate });
    } catch (error) {
        next(error);
    }
};

exports.getCertificates = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        const filter = {};
        
        if (req.query.search) {
            filter.$or = [
                { recipientName: { $regex: req.query.search, $options: 'i' } },
                { certId: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        
        if (req.query.status) {
            filter.status = req.query.status;
        }

        const now = new Date();
        if (req.query.dateRange === 'today') {
            const startOfToday = new Date(now.setHours(0,0,0,0));
            filter.createdAt = { $gte: startOfToday };
        } else if (req.query.dateRange === 'weekly') {
            const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
            startOfWeek.setHours(0,0,0,0);
            filter.createdAt = { $gte: startOfWeek };
        } else if (req.query.dateRange === 'monthly') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            filter.createdAt = { $gte: startOfMonth };
        } else if (req.query.startDate && req.query.endDate) {
            filter.createdAt = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

        const total = await Certificate.countDocuments(filter);
        const certificates = await Certificate.find(filter)
            .populate('generatedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: certificates.length,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
            data: certificates
        });
    } catch (error) {
        next(error);
    }
};

exports.getStats = async (req, res, next) => {
    try {
        const totalCertificates = await Certificate.countDocuments();
        
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const thisMonthCount = await Certificate.countDocuments({ createdAt: { $gte: startOfMonth } });
        
        const verifyAggregate = await Certificate.aggregate([
            { $group: { _id: null, totalVerifications: { $sum: '$verifyCount' } } }
        ]);
        const totalVerifications = verifyAggregate.length > 0 ? verifyAggregate[0].totalVerifications : 0;

        const recentCertificates = await Certificate.find()
            .sort({ createdAt: -1 })
            .limit(5);

        const typeStats = await Certificate.aggregate([
            { $group: { _id: '$certType', count: { $sum: 1 } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalCertificates,
                thisMonthCount,
                totalVerifications,
                recentCertificates,
                typeStats
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.revokeCertificate = async (req, res, next) => {
    try {
        const { reason } = req.body;
        
        const certificate = await Certificate.findOne({ certId: req.params.certId });
        if (!certificate) {
            return res.status(404).json({ success: false, message: 'Certificate not found' });
        }

        certificate.status = 'revoked';
        certificate.revokedReason = reason || 'No reason provided';
        certificate.revokedAt = new Date();
        await certificate.save();

        res.status(200).json({ success: true, data: certificate });
    } catch (error) {
        next(error);
    }
};

exports.updateCertificate = async (req, res, next) => {
    try {
        let certificate = await Certificate.findOne({ certId: req.params.certId });
        if (!certificate) {
            return res.status(404).json({ success: false, message: 'Certificate not found' });
        }

        certificate = await Certificate.findOneAndUpdate(
            { certId: req.params.certId },
            req.body,
            { returnDocument: 'after', runValidators: true }
        );

        res.status(200).json({ success: true, data: certificate });
    } catch (error) {
        next(error);
    }
};

exports.deleteCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findOne({ certId: req.params.certId });
        if (!certificate) {
            return res.status(404).json({ success: false, message: 'Certificate not found' });
        }

        await certificate.deleteOne();

        res.status(200).json({ success: true, message: 'Certificate deleted successfully' });
    } catch (error) {
        next(error);
    }
};
