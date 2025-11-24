import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'light';
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="relative p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 dark:from-indigo-600 dark:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group overflow-hidden"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
            <div className="relative z-10">
                {theme === 'light' ? (
                    <Moon className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300" />
                ) : (
                    <Sun className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-300" />
                )}
            </div>
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </button>
    );
};

export default ThemeToggle;
