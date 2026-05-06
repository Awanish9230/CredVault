import React, { useState } from 'react';
import { User, Shield, Key, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axiosInstance';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const Settings = () => {
    const { user, setUser } = useAuth();
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            const res = await api.put('/auth/profile', profileData);
            setUser(res.data.user);
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return setStatus({ type: 'error', message: 'Passwords do not match' });
        }
        setLoading(true);
        setStatus({ type: '', message: '' });
        try {
            await api.put('/auth/password', passwordData);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setStatus({ type: 'success', message: 'Password updated successfully!' });
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Failed to update password' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold text-heading">Account Settings</h1>
                <p className="text-body mt-1">Manage your admin profile and security preferences.</p>
            </header>

            {status.message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-slide-up ${
                    status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
                }`}>
                    {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                    <p className="font-medium">{status.message}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-heading">
                        <div className="p-2 bg-primary-soft text-primary rounded-lg">
                            <User size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Profile Information</h2>
                    </div>
                    
                    <Card className="p-6">
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-muted block mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                    <Input 
                                        className="pl-10"
                                        value={profileData.name}
                                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-muted block mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                    <Input 
                                        type="email"
                                        className="pl-10"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" disabled={loading} className="w-full mt-4">
                                Save Profile Changes
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Security Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-heading">
                        <div className="p-2 bg-secondary-soft text-secondary rounded-lg">
                            <Shield size={20} />
                        </div>
                        <h2 className="text-xl font-bold">Security & Password</h2>
                    </div>

                    <Card className="p-6">
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-muted block mb-1">Current Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                    <Input 
                                        type="password"
                                        className="pl-10"
                                        placeholder="••••••••"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="w-full h-px bg-border my-2"></div>
                            <div>
                                <label className="text-sm font-semibold text-muted block mb-1">New Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                    <Input 
                                        type="password"
                                        className="pl-10"
                                        placeholder="Minimum 6 characters"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-muted block mb-1">Confirm New Password</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
                                    <Input 
                                        type="password"
                                        className="pl-10"
                                        placeholder="Confirm new password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" variant="outline" disabled={loading} className="w-full mt-4">
                                Update Password
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Settings;
