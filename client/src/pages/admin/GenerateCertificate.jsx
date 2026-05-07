import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { Download, Printer, Save, Image as ImageIcon } from 'lucide-react';
import api from '../../api/axiosInstance';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import CertificateTemplate from '../../components/certificate/CertificateTemplate';

const GenerateCertificate = () => {
    const [formData, setFormData] = useState({
        recipientName: '',
        recipientEmail: '',
        role: 'Intern',
        programme: '',
        certType: 'Internship',
        startDate: '',
        endDate: '',
        issuedBy: 'CredVault Administrator',
        issuingOrg: 'CredVault Org',
        customMessage: '',
        template: 'professional-slate'
    });
    
    const [previewData, setPreviewData] = useState(formData);
    const [generating, setGenerating] = useState(false);
    const [generatedCert, setGeneratedCert] = useState(null);
    const certRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const newData = { ...prev, [name]: value };
            setPreviewData(newData);
            return newData;
        });
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            const res = await api.post('/certificates/generate', formData);
            setGeneratedCert(res.data.data);
            setPreviewData(res.data.data); // Update preview with actual ID and date
            toast.success(`Certificate created! ID: ${res.data.data.certId}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate certificate');
        } finally {
            setGenerating(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!generatedCert) return;
        const element = document.getElementById('cert-preview');
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        

        const pdf = new jsPDF('landscape', 'px', [800, 600]);
        pdf.addImage(imgData, 'PNG', 0, 0, 800, 600);
        pdf.save(`${generatedCert.recipientName.replace(/\s+/g, '_')}_Certificate.pdf`);
        toast.success('PDF downloaded successfully.');
    };

    const handleDownloadPNG = async () => {
        if (!generatedCert) return;
        const element = document.getElementById('cert-preview');
        const canvas = await html2canvas(element, { scale: 2 });
        const link = document.createElement('a');
        link.download = `${generatedCert.recipientName.replace(/\s+/g, '_')}_Certificate.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success('Image saved.');
    };

    return (
        <div className="flex flex-col xl:flex-row gap-8 animate-fade-in">

            <div className="w-full xl:w-1/3 flex flex-col gap-6">
                <header>
                    <h1 className="text-3xl font-bold text-heading">Generate Certificate</h1>
                    <p className="text-body mt-1 text-sm">Fill details to preview and generate.</p>
                </header>

                <Card className="flex-1 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
                    <form onSubmit={handleGenerate} className="space-y-4">
                        <Input label="Recipient Name" name="recipientName" value={formData.recipientName} onChange={handleChange} required />
                        <Input label="Recipient Email" type="email" name="recipientEmail" value={formData.recipientEmail} onChange={handleChange} required />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-heading">Role</label>
                                <select name="role" value={formData.role} onChange={handleChange} className="px-4 py-3 rounded-xl border border-border bg-white text-body focus:outline-none focus:border-primary">
                                    {['Intern', 'Volunteer', 'Mentor', 'Trainer', 'Project Lead', 'Speaker'].map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-heading">Type</label>
                                <select name="certType" value={formData.certType} onChange={handleChange} className="px-4 py-3 rounded-xl border border-border bg-white text-body focus:outline-none focus:border-primary">
                                    {['Internship', 'Appreciation', 'Participation', 'Achievement', 'Completion'].map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                        </div>

                        <Input label="Programme / Event" name="programme" value={formData.programme} onChange={handleChange} required />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Start Date" type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                            <Input label="End Date" type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-heading">Template Style</label>
                            <div className="grid grid-cols-3 gap-2 mt-1">
                                {['professional-slate', 'elegant-gold', 'modern-corporate'].map(tpl => (
                                    <div 
                                        key={tpl} 
                                        onClick={() => handleChange({ target: { name: 'template', value: tpl } })}
                                        className={`cursor-pointer p-2 border rounded-lg text-center text-xs font-medium transition-all ${formData.template === tpl ? 'border-primary bg-primary-soft text-primary' : 'border-border text-muted hover:border-primary/50'}`}
                                    >
                                        {tpl.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {!generatedCert ? (
                            <Button type="submit" className="w-full mt-6" disabled={generating}>
                                {generating ? 'Generating...' : 'Generate Certificate'}
                            </Button>
                        ) : (
                            <div className="mt-6 flex flex-col gap-3">
                                <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex flex-col gap-1">
                                    <span className="font-semibold flex items-center gap-2"><CheckCircle size={16}/> Generated Successfully</span>
                                    <span>ID: <span className="font-mono font-bold">{generatedCert.certId}</span></span>
                                </div>
                                <Button type="button" onClick={() => {
                                    setGeneratedCert(null);
                                    setFormData({ ...formData, recipientName: '', recipientEmail: '' });
                                }} variant="outline">Create Another</Button>
                            </div>
                        )}
                    </form>
                </Card>
            </div>


            <div className="w-full xl:w-2/3 flex flex-col gap-4">
                <div className="flex justify-between items-end">
                    <h2 className="text-xl font-semibold text-heading">Live Preview</h2>
                    {generatedCert && (
                        <div className="flex gap-2">
                            <Button variant="secondary" onClick={handleDownloadPNG} className="px-4 py-2 text-sm gap-2">
                                <ImageIcon size={16} /> PNG
                            </Button>
                            <Button variant="primary" onClick={handleDownloadPDF} className="px-4 py-2 text-sm gap-2">
                                <Download size={16} /> Download PDF
                            </Button>
                        </div>
                    )}
                </div>
                
                <div className="flex-1 bg-soft rounded-2xl border border-border flex items-center justify-center p-8 overflow-hidden min-h-[600px]">
                    <div className="transform scale-[0.6] sm:scale-[0.8] xl:scale-[0.9] 2xl:scale-100 transition-transform origin-center flex items-center justify-center shadow-2xl">
                        <CertificateTemplate data={previewData} id="cert-preview" />
                    </div>
                </div>
            </div>
        </div>
    );
};


import { CheckCircle } from 'lucide-react';

export default GenerateCertificate;
