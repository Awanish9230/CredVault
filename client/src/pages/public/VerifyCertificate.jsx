import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
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
        const cleanId = id.trim().toUpperCase();
        setStatus('loading');
        console.log(`[Verify] Checking Certificate ID: ${cleanId}`);
        
        try {
            const res = await api.get(`/certificates/verify/${cleanId}`);
            console.log('[Verify] Success:', res.data.data);
            setCertificate(res.data.data);
            if (res.data.data.status === 'revoked') {
                setStatus('revoked');
            } else {
                setStatus('valid');
            }
        } catch (error) {
            console.error('[Verify] Error:', error.response?.data?.message || error.message);
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

                            <div className="flex-1 w-full flex flex-col items-center">
                                <div className="w-full bg-white p-4 sm:p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-border overflow-hidden flex justify-center">
                                    <div className="scale-[0.45] sm:scale-[0.65] md:scale-[0.85] lg:scale-100 origin-center py-10 sm:py-0">
                                        <div ref={certRef}>
                                            <CertificateTemplate data={{
                                                ...certificate,
                                                issueDate: certificate.createdAt
                                            }} id="public-cert-view" />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 flex gap-4 no-print">
                                    <Button onClick={downloadPDF} disabled={isDownloading} className="gap-2 px-8 py-6 rounded-2xl shadow-lg shadow-primary/20">
                                        {isDownloading ? 'Generating...' : <><Download size={20}/> Download PDF</>}
                                    </Button>
                                    <Button variant="outline" onClick={() => window.print()} className="gap-2 px-8 py-6 rounded-2xl">
                                        <Printer size={20}/> Print
                                    </Button>
                                </div>
                            </div>

                            <div className="w-full md:w-[350px] space-y-6 no-print">
                                <Card className="overflow-hidden border-none shadow-[0_10px_40px_rgba(34,197,94,0.15)] ring-1 ring-green-500/20">
                                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 flex flex-col items-center text-center gap-3 text-white">
                                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
                                            <CheckCircle size={40} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">Verified</h2>
                                            <p className="text-white/80 text-sm font-medium">Authenticity confirmed</p>
                                        </div>
                                    </div>
                                    <div className="p-8 space-y-6 bg-white">
                                        <div className="space-y-1">
                                            <p className="text-[10px] text-muted uppercase font-bold tracking-[0.1em]">Issued To</p>
                                            <p className="text-xl font-bold text-heading">{certificate.recipientName}</p>
                                        </div>
                                        <div className="h-px bg-border/50"></div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-muted uppercase font-bold tracking-[0.1em]">Type</p>
                                                <p className="font-bold text-primary">{certificate.certType}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] text-muted uppercase font-bold tracking-[0.1em]">Date</p>
                                                <p className="font-bold text-heading">{new Date(certificate.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                                            </div>
                                        </div>
                                        <div className="h-px bg-border/50"></div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] text-muted uppercase font-bold tracking-[0.1em]">Credential ID</p>
                                            <p className="font-mono text-xs font-bold bg-soft px-3 py-2 rounded-xl border border-border text-heading break-all">{certificate.certId}</p>
                                        </div>
                                    </div>
                                </Card>

                                <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-border flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-heading">Tamper-Proof</p>
                                        <p className="text-[10px] text-body">Secured by CredVault Digital Signature</p>
                                    </div>
                                </div>
                            </div>
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

