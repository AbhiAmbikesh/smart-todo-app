import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import useNotifications from '../hooks/useNotifications';

const Layout = () => {
    useNotifications();

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
