const express = require('express');
const { 
    generateCertificate, 
    verifyCertificate, 
    getCertificates, 
    getStats,
    revokeCertificate
} = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/verify/:certId', verifyCertificate);

router.use(protect); // All routes below require auth

router.post('/generate', generateCertificate);
router.get('/', getCertificates);
router.get('/stats', getStats);
router.patch('/:certId/revoke', revokeCertificate);

module.exports = router;
