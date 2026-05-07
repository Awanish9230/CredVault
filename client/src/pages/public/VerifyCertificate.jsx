import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Search, CheckCircle, XCircle, AlertCircle, Calendar, User, Briefcase, Award, Download, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { CertificateTemplate } from '../../components/certificate/CertificateTemplate';

const VerifyCertificate = () => {
    const { certId } = useParams();
    const navigate = useNavigate();
    const certRef = useRef(null);
    const [searchId, setSearchId] = useState(certId || '');
    const [status, setStatus] = useState('idle');
    const [certificate, setCertificate] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        if (certId) {
            handleVerify(certId);
        }
    }, [certId]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchId.trim()) {
            navigate(`/verify/${searchId.trim()}`);
        }
    };

    const handleVerify = async (id) => {
        setStatus('loading');
        try {
            const res = await axios.get(`http://localhost:5000/api/certificates/verify/${id}`);
            setCertificate(res.data.data);
            if (res.data.data.status === 'revoked') {
                setStatus('revoked');
            } else {
                setStatus('valid');
            }
        } catch (error) {
            setStatus('not-found');
            setCertificate(null);
        }
    };

    const downloadPDF = async () => {
        if (!certRef.current) return;
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(certRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: null
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [800, 600]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);
            pdf.save(`${certificate.recipientName.replace(/\s+/g, '_')}_Certificate.pdf`);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-soft flex flex-col">
            <nav className="glass-effect sticky top-0 z-50 flex items-center justify-between px-8 py-4">
                <Link to="/" className="flex items-center gap-2 text-primary font-bold text-2xl">
                    <ShieldCheck size={32} />
                    <span>CredVault</span>
                </Link>
                <div className="flex gap-4">
                    <Link to="/login">
                        <Button variant="outline">Admin Login</Button>
                    </Link>
                </div>
            </nav>

            <main className="flex-1 flex flex-col items-center py-16 px-4">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-heading mb-4">Verify a Certificate</h1>
                    <p className="text-body max-w-xl mx-auto">
                        Enter the unique certificate ID found at the bottom of the document to instantly verify its authenticity and status.
                    </p>
                </div>

                <Card className="w-full max-w-2xl mb-12 border-none shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                    <form onSubmit={handleSearchSubmit} className="flex gap-3">
                        <Input 
                            className="flex-1"
                            placeholder="e.g. CV-2026-INT-A1B2C3"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                        />
                        <Button type="submit" disabled={status === 'loading'} className="gap-2 px-8">
                            <Search size={18} /> Verify
                        </Button>
                    </form>
                </Card>

                {status === 'loading' && (
                    <div className="flex flex-col items-center text-muted animate-pulse">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                        <p>Verifying with blockchain-grade security...</p>
                    </div>
                )}

                {status === 'valid' && certificate && (
                    <div className="w-full max-w-5xl space-y-8 animate-slide-up">
                        <div className="flex flex-col md:flex-row gap-8 items-start justify-center">

                            <div className="flex-1 flex flex-col items-center">
                                <div className="bg-white p-4 rounded-2xl shadow-2xl border border-border overflow-hidden scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 origin-top">
                                    <div ref={certRef}>
                                        <CertificateTemplate data={{
                                            ...certificate,
                                            issueDate: certificate.createdAt
                                        }} id="public-cert-view" />
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-4">
                                    <Button onClick={downloadPDF} disabled={isDownloading} className="gap-2">
                                        {isDownloading ? 'Generating...' : <><Download size={18}/> Download PDF</>}
                                    </Button>
                                    <Button variant="outline" onClick={() => window.print()} className="gap-2">
                                        <Printer size={18}/> Print
                                    </Button>
                                </div>
                            </div>


                            <Card className="w-full max-w-sm overflow-hidden border border-green-200">
                                <div className="bg-green-50 border-b border-green-100 p-6 flex flex-col items-center text-center gap-2 text-green-700">
                                    <CheckCircle size={48} className="mb-2" />
                                    <h2 className="text-xl font-bold">Certificate Verified</h2>
                                    <p className="text-green-600 text-sm font-medium">Authenticity confirmed by CredVault</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="pb-4 border-b border-border">
                                        <p className="text-xs text-muted uppercase tracking-wider mb-1">Issued To</p>
                                        <p className="text-lg font-bold text-heading">{certificate.recipientName}</p>
                                    </div>
                                    <div className="pb-4 border-b border-border">
                                        <p className="text-xs text-muted uppercase tracking-wider mb-1">Credential Type</p>
                                        <p className="font-semibold text-primary">{certificate.certType}</p>
                                    </div>
                                    <div className="pb-4 border-b border-border">
                                        <p className="text-xs text-muted uppercase tracking-wider mb-1">Issue Date</p>
                                        <p className="font-medium text-heading">{new Date(certificate.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted uppercase tracking-wider mb-1">Certificate ID</p>
                                        <p className="font-mono text-xs font-bold bg-soft p-2 rounded border border-border text-heading">{certificate.certId}</p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                )}

                {status === 'revoked' && certificate && (
                    <Card className="w-full max-w-2xl text-center border-red-200 bg-red-50 animate-slide-up">
                        <XCircle className="text-error mx-auto mb-4" size={48} />
                        <h2 className="text-2xl font-bold text-error mb-2">Certificate Revoked</h2>
                        <p className="text-red-700 mb-6 max-w-md mx-auto">
                            This certificate (ID: <span className="font-mono">{certificate.certId}</span>) has been revoked by the issuing organization and is no longer valid.
                        </p>
                        {certificate.revokedReason && (
                            <div className="bg-white p-4 rounded-xl border border-red-100 text-left">
                                <p className="text-sm font-semibold text-red-800 mb-1">Reason for Revocation:</p>
                                <p className="text-red-600">{certificate.revokedReason}</p>
                            </div>
                        )}
                    </Card>
                )}

                {status === 'not-found' && (
                    <Card className="w-full max-w-lg text-center animate-slide-up">
                        <AlertCircle className="text-warning mx-auto mb-4" size={48} />
                        <h2 className="text-2xl font-bold text-heading mb-2">Certificate Not Found</h2>
                        <p className="text-body">
                            We couldn't find a certificate matching the ID <span className="font-mono font-bold">{certId}</span>. Please check the ID and try again.
                        </p>
                        <Button variant="outline" className="mt-6 mx-auto" onClick={() => navigate('/verify')}>Search Again</Button>
                    </Card>
                )}
            </main>
        </div>
    );
};

export default VerifyCertificate;

