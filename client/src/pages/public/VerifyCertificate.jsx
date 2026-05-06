import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldCheck, Search, CheckCircle, XCircle, AlertCircle, Calendar, User, Briefcase, Award } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const VerifyCertificate = () => {
    const { certId } = useParams();
    const navigate = useNavigate();
    const [searchId, setSearchId] = useState(certId || '');
    const [status, setStatus] = useState('idle'); // idle, loading, valid, revoked, not-found
    const [certificate, setCertificate] = useState(null);

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
                    <Card className="w-full max-w-3xl overflow-hidden animate-slide-up border border-green-200">
                        <div className="bg-green-50 border-b border-green-100 p-6 flex items-center justify-center gap-3 text-green-700">
                            <CheckCircle size={32} />
                            <div>
                                <h2 className="text-2xl font-bold">Certificate is Valid</h2>
                                <p className="text-green-600 font-medium">Authenticity verified on {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="p-8 grid md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm text-muted flex items-center gap-2 mb-1"><User size={16}/> Recipient Name</p>
                                    <p className="text-xl font-bold text-heading">{certificate.recipientName}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted flex items-center gap-2 mb-1"><Briefcase size={16}/> Role & Programme</p>
                                    <p className="font-medium text-heading">{certificate.role}</p>
                                    <p className="text-body">{certificate.programme}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted flex items-center gap-2 mb-1"><Calendar size={16}/> Issued Date</p>
                                    <p className="font-medium text-heading">{new Date(certificate.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="space-y-6 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-8">
                                <div>
                                    <p className="text-sm text-muted flex items-center gap-2 mb-1"><Award size={16}/> Certificate Type</p>
                                    <p className="font-medium text-primary bg-primary-soft px-3 py-1 rounded-md inline-block">{certificate.certType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted mb-1">Issuing Authority</p>
                                    <p className="font-medium text-heading">{certificate.issuedBy}</p>
                                    <p className="text-body">{certificate.issuingOrg}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted mb-1">Certificate ID</p>
                                    <p className="font-mono text-sm font-bold bg-soft px-3 py-2 rounded border border-border inline-block text-heading">{certificate.certId}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
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
