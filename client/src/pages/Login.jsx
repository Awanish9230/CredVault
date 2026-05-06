import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Login successful. Welcome back!');
            navigate('/admin');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-soft flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-8 shadow-[0_8px_30px_rgba(15,23,42,0.08)] border-none">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                        <ShieldCheck className="text-primary" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-heading">Welcome to CredVault</h2>
                    <p className="text-body text-sm mt-2">Sign in to your admin account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <Input 
                        label="Email Address" 
                        type="email" 
                        placeholder="admin@credvault.app"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    <div className="relative">
                        <Input 
                            label="Password" 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button 
                            type="button"
                            className="absolute right-4 top-9 text-muted hover:text-body transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                            <span className="text-body">Remember me</span>
                        </label>
                        <a href="#" className="text-primary font-medium hover:underline">Forgot password?</a>
                    </div>

                    <Button type="submit" className="w-full py-3" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Login;
