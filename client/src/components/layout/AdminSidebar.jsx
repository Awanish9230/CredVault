import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileBadge2, LogOut, Table2, Settings as SettingsIcon, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const links = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/generate', icon: <FileBadge2 size={20} />, label: 'Generate' },
        { path: '/admin/manage', icon: <Table2 size={20} />, label: 'Manage' },
        { path: '/admin/settings', icon: <SettingsIcon size={20} />, label: 'Settings' }
    ];

    return (
        <aside className="w-64 bg-white border-r border-border flex flex-col h-full shadow-[4px_0_24px_rgba(15,23,42,0.02)]">
            <div className="h-16 flex items-center px-6 border-b border-border">
                <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileBadge2 className="text-primary" size={20} />
                    </div>
                    CredVault
                </h1>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
                {links.map((link) => (
                    <NavLink
                        key={link.path}
                        to={link.path}
                        end={link.path === '/admin'}
                        className={({ isActive }) => 
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                            ${isActive ? 'bg-primary-soft text-primary' : 'text-body hover:bg-soft hover:text-heading'}`
                        }
                    >
                        {link.icon}
                        {link.label}
                    </NavLink>
                ))}
                
                <a 
                    href="/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-body hover:bg-soft hover:text-heading mt-4 border-t border-border/50 pt-6"
                >
                    <ExternalLink size={20} />
                    Visit Site
                </a>
            </nav>

            <div className="p-4 border-t border-border">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-error hover:bg-red-50 rounded-xl transition-all font-medium"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
