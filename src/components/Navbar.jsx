import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, CheckSquare, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    // Get user display name or email
    const getUserName = () => {
        if (user?.displayName) return user.displayName;
        if (user?.email) return user.email.split('@')[0];
        return 'User';
    };

    return (
        <nav className="glass border-b border-white/20 dark:border-gray-700/20 px-4 py-3 sticky top-0 z-50 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="relative">
                        <CheckSquare className="w-8 h-8 text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text transform group-hover:rotate-12 transition-transform duration-300" />
                        <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
                    </div>
                    <span className="gradient-text text-2xl font-extrabold group-hover:scale-105 transition-transform">
                        SmartTodo
                    </span>
                </Link>

                <div className="flex items-center gap-3">
                    <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
                    >
                        {user?.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover border-2 border-gradient-to-r from-indigo-500 to-pink-500 ring-2 ring-purple-500/30 group-hover:ring-purple-500/60 transition-all"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all">
                                <User className="w-6 h-6" />
                            </div>
                        )}
                        <span className="hidden sm:block font-semibold text-sm bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-200 dark:to-white bg-clip-text text-transparent">
                            {getUserName()}
                        </span>
                    </Link>

                    <ThemeToggle />

                    <button
                        onClick={handleLogout}
                        className="p-3 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
