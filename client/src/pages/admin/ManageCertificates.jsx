import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit2, Trash2, Ban, Download, ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import api from '../../api/axiosInstance';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { CertificateTemplate } from '../../components/certificate/CertificateTemplate';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ManageCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState('');
    const [dateRange, setDateRange] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [statusFilter, setStatusFilter] = useState('');


    const [viewModal, setViewModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [selectedCert, setSelectedCert] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [editForm, setEditForm] = useState({});

    const fetchCertificates = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                limit,
                search,
                dateRange,
                status: statusFilter,
                startDate: dateRange === 'custom' ? startDate : undefined,
                endDate: dateRange === 'custom' ? endDate : undefined
            };
            const res = await api.get('/certificates', { params });
            setCertificates(res.data.data);
            setTotal(res.data.pagination.total);
        } catch (error) {
            console.error("Failed to fetch certificates", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchCertificates();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [page, search, dateRange, startDate, endDate, statusFilter]);

    const handleDelete = async (certId) => {
        if (window.confirm('Are you sure you want to permanently delete this certificate? This action cannot be undone.')) {
            try {
                await api.delete(`/certificates/${certId}`);
                fetchCertificates();
            } catch (error) {
                alert('Failed to delete certificate');
            }
        }
    };

    const handleRevoke = async (certId) => {
        const reason = window.prompt('Enter reason for revocation:');
        if (reason !== null) {
            try {
                await api.patch(`/certificates/${certId}/revoke`, { reason });
                fetchCertificates();
            } catch (error) {
                alert('Failed to revoke certificate');
            }
        }
    };

    const handleEditClick = (cert) => {
        setSelectedCert(cert);
        setEditForm({
            recipientName: cert.recipientName,
            recipientEmail: cert.recipientEmail,
            role: cert.role,
            programme: cert.programme,
            certType: cert.certType,
            template: cert.template
        });
        setEditModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/certificates/${selectedCert.certId}`, editForm);
            setEditModal(false);
            fetchCertificates();
        } catch (error) {
            alert('Failed to update certificate');
        }
    };

    const downloadPDF = async (cert) => {
        const element = document.getElementById(`modal-cert-preview`);
        if (!element) return;
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [800, 600] });
            pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);
            pdf.save(`${cert.recipientName}_Certificate.pdf`);
        } catch (error) {
            console.error('PDF generation failed', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-heading">Manage Certificates</h1>
                    <p className="text-body mt-1">View, edit, and track all issued credentials.</p>
                </div>
            </header>


            <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                        <Input 
                            className="pl-10" 
                            placeholder="Search name or ID..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                            <select 
                                className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-white text-heading focus:ring-2 focus:ring-primary/20 outline-none appearance-none transition-all"
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                            >
                                <option value="">All Time</option>
                                <option value="today">Today</option>
                                <option value="weekly">This Week</option>
                                <option value="monthly">This Month</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>
                    </div>

                    <select 
                        className="w-full px-4 py-2 rounded-xl border border-border bg-white text-heading focus:ring-2 focus:ring-primary/20 outline-none appearance-none transition-all"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="revoked">Revoked</option>
                    </select>

                    {dateRange === 'custom' && (
                        <div className="flex gap-2 lg:col-span-1">
                            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    )}
                </div>
            </Card>


            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-soft border-b border-border">
                                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Recipient</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Certificate ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider">Issued Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-muted uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="6" className="px-6 py-4"><div className="h-4 bg-soft rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : certificates.length > 0 ? (
                                certificates.map((cert) => (
                                    <tr key={cert._id} className="hover:bg-soft/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-heading">{cert.recipientName}</p>
                                            <p className="text-xs text-muted">{cert.recipientEmail}</p>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">{cert.certId}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-medium text-primary bg-primary-soft px-2 py-1 rounded-md">{cert.certType}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${cert.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {cert.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-body">{new Date(cert.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => { setSelectedCert(cert); setViewModal(true); }}
                                                    className="p-2 text-primary hover:bg-primary-soft rounded-lg transition-all"
                                                    title="View"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleEditClick(cert)}
                                                    className="p-2 text-secondary hover:bg-secondary-soft rounded-lg transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                {cert.status === 'active' && (
                                                    <button 
                                                        onClick={() => handleRevoke(cert.certId)}
                                                        className="p-2 text-warning hover:bg-orange-50 rounded-lg transition-all"
                                                        title="Revoke"
                                                    >
                                                        <Ban size={18} />
                                                    </button>
                                                )}
                                                <button 
                                                    onClick={() => handleDelete(cert.certId)}
                                                    className="p-2 text-error hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-muted italic">No certificates found matching your criteria.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


                <div className="px-6 py-4 bg-soft/30 border-t border-border flex items-center justify-between">
                    <p className="text-sm text-muted">
                        Showing <span className="font-bold text-heading">{(page-1)*limit + 1}</span> to <span className="font-bold text-heading">{Math.min(page*limit, total)}</span> of <span className="font-bold text-heading">{total}</span> results
                    </p>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                        >
                            <ChevronLeft size={16} /> Previous
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm"
                            disabled={page * limit >= total}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Next <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            </Card>


            <Modal 
                isOpen={viewModal} 
                onClose={() => setViewModal(false)} 
                title="Certificate Preview"
                maxWidth="max-w-4xl"
            >
                {selectedCert && (
                    <div className="flex flex-col items-center">
                        <div className="shadow-2xl rounded-lg overflow-hidden origin-top scale-[0.6] sm:scale-[0.8] md:scale-100">
                            <div id="modal-cert-preview">
                                <CertificateTemplate data={{
                                    ...selectedCert,
                                    issueDate: selectedCert.createdAt
                                }} id="admin-view" />
                            </div>
                        </div>
                        <div className="mt-8 flex gap-4">
                            <Button onClick={() => downloadPDF(selectedCert)} disabled={isDownloading} className="gap-2">
                                <Download size={18} /> {isDownloading ? 'Generating...' : 'Download PDF'}
                            </Button>
                            <Button variant="outline" onClick={() => window.print()} className="gap-2">
                                Print Preview
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>


            <Modal 
                isOpen={editModal} 
                onClose={() => setEditModal(false)} 
                title="Edit Certificate Details"
            >
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-heading block mb-1">Recipient Name</label>
                        <Input 
                            value={editForm.recipientName}
                            onChange={(e) => setEditForm({...editForm, recipientName: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-heading block mb-1">Recipient Email</label>
                        <Input 
                            type="email"
                            value={editForm.recipientEmail}
                            onChange={(e) => setEditForm({...editForm, recipientEmail: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-heading block mb-1">Role</label>
                        <Input 
                            value={editForm.role}
                            onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-semibold text-heading block mb-1">Programme</label>
                        <Input 
                            value={editForm.programme}
                            onChange={(e) => setEditForm({...editForm, programme: e.target.value})}
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-semibold text-heading block mb-1">Type</label>
                            <select 
                                className="w-full px-4 py-2 rounded-xl border border-border bg-white text-heading focus:ring-2 focus:ring-primary/20 outline-none appearance-none transition-all"
                                value={editForm.certType}
                                onChange={(e) => setEditForm({...editForm, certType: e.target.value})}
                            >
                                <option value="Internship">Internship</option>
                                <option value="Appreciation">Appreciation</option>
                                <option value="Participation">Participation</option>
                                <option value="Achievement">Achievement</option>
                                <option value="Completion">Completion</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-heading block mb-1">Template</label>
                            <select 
                                className="w-full px-4 py-2 rounded-xl border border-border bg-white text-heading focus:ring-2 focus:ring-primary/20 outline-none appearance-none transition-all"
                                value={editForm.template}
                                onChange={(e) => setEditForm({...editForm, template: e.target.value})}
                            >
                                <option value="professional-slate">Professional Slate</option>
                                <option value="elegant-gold">Elegant Gold</option>
                                <option value="modern-corporate">Modern Corporate</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                        <Button type="submit" className="flex-1">Update Certificate</Button>
                        <Button type="button" variant="outline" className="flex-1" onClick={() => setEditModal(false)}>Cancel</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageCertificates;
