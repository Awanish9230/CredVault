const Certificate = require('../models/Certificate');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// Generate unique cert ID
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

// @desc    Generate a new certificate
// @route   POST /api/certificates/generate
// @access  Private
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

        // Send email with the certificate link
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
                // We still return 201 as the cert was generated, even if email failed
            }
        }

        res.status(201).json({ success: true, data: certificate });
    } catch (error) {
        next(error);
    }
};

// @desc    Verify a certificate by ID
// @route   GET /api/certificates/verify/:certId
// @access  Public
exports.verifyCertificate = async (req, res, next) => {
    try {
        const certificate = await Certificate.findOne({ certId: req.params.certId });

        if (!certificate) {
            return res.status(404).json({ success: false, message: 'Certificate not found' });
        }

        // Increment verify count
        certificate.verifyCount += 1;
        await certificate.save();

        res.status(200).json({ success: true, data: certificate });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all certificates (with pagination/filtering)
// @route   GET /api/certificates
// @access  Private
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

// @desc    Get Dashboard Stats
// @route   GET /api/certificates/stats
// @access  Private
exports.getStats = async (req, res, next) => {
    try {
        const totalCertificates = await Certificate.countDocuments();
        
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const thisMonthCount = await Certificate.countDocuments({ createdAt: { $gte: startOfMonth } });
        
        // Count all verifications sum
        const verifyAggregate = await Certificate.aggregate([
            { $group: { _id: null, totalVerifications: { $sum: '$verifyCount' } } }
        ]);
        const totalVerifications = verifyAggregate.length > 0 ? verifyAggregate[0].totalVerifications : 0;

        // Get recent certificates
        const recentCertificates = await Certificate.find()
            .sort({ createdAt: -1 })
            .limit(5);

        // Group by type for charts
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

// @desc    Revoke a certificate
// @route   PATCH /api/certificates/:certId/revoke
// @access  Private (Admin)
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
