import React, { useEffect, useState } from 'react';
import { Award, CheckCircle, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/axiosInstance';
import Card from '../../components/ui/Card';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/certificates/stats');
                setStats(res.data.data);
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Mock data for chart since we don't have time series endpoint yet
    const chartData = [
        { name: 'Jan', certs: 12 }, { name: 'Feb', certs: 28 },
        { name: 'Mar', certs: 45 }, { name: 'Apr', certs: 60 },
        { name: 'May', certs: stats?.thisMonthCount || 0 },
    ];

    if (loading) return <div>Loading dashboard...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-heading">Overview</h1>
                <p className="text-body mt-1">Welcome back, here's what's happening today.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-primary-soft rounded-2xl flex items-center justify-center">
                        <Award className="text-primary" size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted">Total Certificates</p>
                        <h3 className="text-3xl font-bold text-heading mt-1">{stats?.totalCertificates || 0}</h3>
                    </div>
                </Card>
                <Card className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-secondary-soft rounded-2xl flex items-center justify-center">
                        <Clock className="text-secondary" size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted">Issued This Month</p>
                        <h3 className="text-3xl font-bold text-heading mt-1">{stats?.thisMonthCount || 0}</h3>
                    </div>
                </Card>
                <Card className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-accent-soft rounded-2xl flex items-center justify-center">
                        <CheckCircle className="text-accent" size={28} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted">Total Verifications</p>
                        <h3 className="text-3xl font-bold text-heading mt-1">{stats?.totalVerifications || 0}</h3>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2">
                    <h3 className="text-xl font-semibold mb-6">Generation Activity</h3>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8' }} dx={-10} />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(15,23,42,0.08)' }}
                                />
                                <Area type="monotone" dataKey="certs" stroke="#0F766E" strokeWidth={3} fill="#CCFBF1" fillOpacity={0.5} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-xl font-semibold mb-6">Recent Certificates</h3>
                    <div className="space-y-4">
                        {stats?.recentCertificates?.length > 0 ? (
                            stats.recentCertificates.map((cert) => (
                                <div key={cert._id} className="flex items-center justify-between p-3 hover:bg-soft rounded-xl transition-colors border border-transparent hover:border-border cursor-pointer">
                                    <div>
                                        <p className="font-medium text-heading text-sm">{cert.recipientName}</p>
                                        <p className="text-xs text-muted">{cert.certId}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-primary bg-primary-soft px-2 py-1 rounded-md inline-block mb-1">{cert.certType}</p>
                                        <p className="text-xs text-muted block">{new Date(cert.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted">No recent certificates.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
