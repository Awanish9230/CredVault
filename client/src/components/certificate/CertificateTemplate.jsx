import React from 'react';
import { format } from 'date-fns';

export const CertificateTemplate = ({ data, id="cert-preview" }) => {
    const {
        recipientName = "John Doe",
        role = "Intern",
        programme = "Summer Internship 2026",
        certType = "Internship",
        startDate = new Date(),
        endDate = new Date(),
        issuedBy = "CredVault Administrator",
        issuingOrg = "CredVault Org",
        customMessage = "",
        template = "professional-slate",
        certId = "CV-2026-INT-XXXXXX",
        issueDate = new Date()
    } = data || {};

    const formattedStartDate = format(new Date(startDate || new Date()), 'MMMM d, yyyy');
    const formattedEndDate = format(new Date(endDate || new Date()), 'MMMM d, yyyy');
    const formattedIssueDate = format(new Date(issueDate || new Date()), 'MMMM d, yyyy');

    const renderTemplate = () => {
        switch (template) {
            case 'elegant-gold':
                return (
                    <div className="w-[800px] h-[600px] bg-[#FCFBF7] relative p-12 flex flex-col items-center justify-center text-center border-[12px] border-[#D97706] shadow-xl overflow-hidden">
                        <div className="absolute top-4 left-4 right-4 bottom-4 border border-[#D97706]/30 pointer-events-none"></div>
                        <h1 className="font-heading font-bold text-5xl text-[#D97706] mb-2 uppercase tracking-widest">Certificate</h1>
                        <h2 className="font-heading font-medium text-2xl text-[#3B1F0A] mb-8">of {certType}</h2>
                        
                        <p className="font-body text-[#3B1F0A] italic mb-4">This is proudly presented to</p>
                        <h3 className="font-heading font-bold text-6xl text-[#3B1F0A] mb-6">{recipientName}</h3>
                        
                        <p className="font-body text-[#3B1F0A] max-w-[600px] mb-8 leading-relaxed">
                            For outstanding contribution as <strong>{role}</strong> during the <strong>{programme}</strong> 
                            at {issuingOrg} from {formattedStartDate} to {formattedEndDate}.
                            {customMessage && <span className="block mt-2">{customMessage}</span>}
                        </p>
                        
                        <div className="w-full flex justify-between items-end px-12 mt-auto">
                            <div className="text-center">
                                <div className="w-48 border-b border-[#3B1F0A] mb-2"></div>
                                <p className="font-heading font-bold text-[#3B1F0A]">{issuedBy}</p>
                                <p className="font-body text-sm text-[#3B1F0A]/70">Authorized Signature</p>
                            </div>
                            <div className="text-right">
                                <p className="font-body text-sm text-[#3B1F0A] mb-1">Date: {formattedIssueDate}</p>
                                <p className="font-mono text-xs text-[#3B1F0A]/60 font-bold bg-[#D97706]/10 px-2 py-1 rounded">ID: {certId}</p>
                            </div>
                        </div>
                    </div>
                );
            case 'modern-corporate':
                return (
                    <div className="w-[800px] h-[600px] bg-white relative p-12 flex flex-col justify-center border-l-[24px] border-[#0F2044] shadow-xl overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0F766E]/5 rounded-bl-full pointer-events-none"></div>
                        <div className="absolute bottom-0 right-0 w-48 h-12 bg-[#0F766E] pointer-events-none"></div>
                        
                        <div className="mb-12">
                            <h1 className="font-heading font-bold text-6xl text-[#0F2044] mb-2">CERTIFICATE</h1>
                            <div className="w-32 h-2 bg-[#0F766E]"></div>
                        </div>
                        
                        <p className="font-body text-gray-500 uppercase tracking-widest text-sm mb-2">Awarded To</p>
                        <h3 className="font-heading font-bold text-5xl text-[#0F2044] mb-8">{recipientName}</h3>
                        
                        <p className="font-body text-gray-700 max-w-[600px] mb-12 text-lg">
                            In recognition of their role as <span className="font-bold text-[#0F766E]">{role}</span> in the <span className="font-bold text-[#0F2044]">{programme}</span>. 
                            <br/><span className="text-sm mt-2 block text-gray-500">Period: {formattedStartDate} - {formattedEndDate}</span>
                        </p>
                        
                        <div className="flex gap-16 mt-auto">
                            <div>
                                <div className="w-48 border-b-2 border-gray-300 mb-2"></div>
                                <p className="font-heading font-bold text-[#0F2044]">{issuedBy}</p>
                                <p className="font-body text-sm text-gray-500">{issuingOrg}</p>
                            </div>
                            <div>
                                <div className="w-48 border-b-2 border-gray-300 mb-2"></div>
                                <p className="font-heading font-bold text-[#0F2044]">{formattedIssueDate}</p>
                                <p className="font-body text-sm text-gray-500">Date of Issue</p>
                            </div>
                        </div>
                        <div className="absolute bottom-16 right-12 text-right">
                            <p className="font-mono text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-md">ID: {certId}</p>
                        </div>
                    </div>
                );
            case 'professional-slate':
            default:
                return (
                    <div className="w-[800px] h-[600px] bg-[#F8FAFC] relative p-16 flex flex-col items-center justify-center text-center border-[1px] border-[#E2E8F0] shadow-xl overflow-hidden rounded-xl">
                        <div className="absolute top-0 w-full h-4 bg-[#0F766E]"></div>
                        <h1 className="font-heading font-bold text-4xl text-[#0F172A] uppercase tracking-[0.2em] mb-4">Certificate of {certType}</h1>
                        <p className="font-body text-sm text-[#475569] uppercase tracking-widest mb-10">Presented by {issuingOrg}</p>
                        
                        <h3 className="font-heading font-bold text-6xl text-[#0F766E] mb-6 relative">
                            {recipientName}
                        </h3>
                        
                        <div className="w-16 h-1 bg-[#E2E8F0] mb-6"></div>
                        
                        <p className="font-body text-[#475569] max-w-[550px] mb-12 text-lg">
                            Has successfully completed the <strong>{programme}</strong> acting as <strong>{role}</strong>, 
                            from {formattedStartDate} to {formattedEndDate}.
                        </p>
                        
                        <div className="w-full flex justify-between items-end mt-auto pt-8 border-t border-[#E2E8F0]">
                            <div className="text-left">
                                <p className="font-heading font-bold text-[#0F172A] text-lg">{issuedBy}</p>
                                <p className="font-body text-xs text-[#94A3B8] uppercase tracking-wider mt-1">Authorized Official</p>
                            </div>
                            <div className="text-right">
                                <p className="font-heading font-medium text-[#0F172A]">{formattedIssueDate}</p>
                                <p className="font-mono text-xs text-[#94A3B8] mt-1 bg-white px-2 py-1 rounded border border-[#E2E8F0]">ID: {certId}</p>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div id={id} className="origin-top-left" style={{ width: '800px', height: '600px' }}>
            {renderTemplate()}
        </div>
    );
};

export default CertificateTemplate;
