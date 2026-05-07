import React, { useState, useEffect } from 'react';
import { User, Shield, Key, Mail, CheckCircle2, AlertCircle, Image as ImageIcon, Upload } from 'lucide-react';
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
    const [heroImage, setHeroImage] = useState(null);
    const [heroImagePreview, setHeroImagePreview] = useState(null);
    const [heroOpacity, setHeroOpacity] = useState(0.7);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get('/settings');
                if (res.data.data.heroBackgroundImage) {
                    setHeroImagePreview(`${import.meta.env.VITE_API_URL || 'https://credvault-kyqn.onrender.com'}${res.data.data.heroBackgroundImage}`);
                }
                if (res.data.data.heroOverlayOpacity !== undefined) {
                    setHeroOpacity(res.data.data.heroOverlayOpacity);
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            }
        };
        fetchSettings();
    }, []);

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setHeroImage(file);
            setHeroImagePreview(URL.createObjectURL(file));
        }
    };

    const handleHeroImageUpload = async () => {
        if (!heroImage) return;
        setLoading(true);
        setStatus({ type: '', message: '' });
        const formData = new FormData();
        formData.append('heroImage', heroImage);

        try {
            const res = await api.put('/settings/hero-image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus({ type: 'success', message: 'Hero image updated successfully!' });
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to upload hero image' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpacityChange = async (val) => {
        setHeroOpacity(val);
        try {
            await api.put('/settings', { heroOverlayOpacity: val });
        } catch (error) {
            console.error("Failed to update opacity", error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold text-heading">Account & Site Settings</h1>
                <p className="text-body mt-1">Manage your admin profile and public website branding.</p>
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
                <div className="space-y-8">
                    <section className="space-y-4">
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
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-3 text-heading">
                            <div className="p-2 bg-accent-soft text-accent rounded-lg">
                                <ImageIcon size={20} />
                            </div>
                            <h2 className="text-xl font-bold">Site Branding</h2>
                        </div>
                        
                        <Card className="p-6">
                            <p className="text-sm text-muted mb-4">Upload a custom background image for the homepage hero section.</p>
                            
                            <div className="space-y-6">
                                <div 
                                    className="relative w-full h-40 bg-soft rounded-2xl border-2 border-dashed border-border overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors group"
                                    onClick={() => document.getElementById('hero-upload').click()}
                                >
                                    {heroImagePreview ? (
                                        <div className="relative w-full h-full">
                                            <img src={heroImagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div 
                                                className="absolute inset-0 bg-white z-10 pointer-events-none" 
                                                style={{ opacity: heroOpacity }}
                                            ></div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="mx-auto text-muted group-hover:text-primary transition-colors" size={32} />
                                            <p className="text-xs font-medium text-muted mt-2">Click to upload hero image</p>
                                        </div>
                                    )}
                                    <input 
                                        id="hero-upload"
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-semibold text-heading">Overlay Transparency</label>
                                        <span className="text-xs font-bold text-primary bg-primary-soft px-2 py-1 rounded-md">
                                            {Math.round(heroOpacity * 100)}%
                                        </span>
                                    </div>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.05" 
                                        value={heroOpacity} 
                                        onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-soft rounded-lg appearance-none cursor-pointer accent-primary"
                                    />
                                    <p className="text-[10px] text-muted italic text-center">Higher value makes the overlay more opaque (whiter), improving text readability.</p>
                                </div>

                                <Button 
                                    onClick={handleHeroImageUpload} 
                                    disabled={!heroImage || loading} 
                                    className="w-full gap-2"
                                    variant="outline"
                                >
                                    <Upload size={18} /> Upload Image
                                </Button>
                            </div>
                        </Card>
                    </section>
                </div>

                <div className="space-y-8">
                    <section className="space-y-4">
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
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Settings;
