import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setMessage('');
            setError('');
            setLoading(true);
            await resetPassword(email);
            setMessage('Check your inbox for further instructions');
        } catch (err) {
            console.error(err);
            setError('Failed to reset password. Please check if the email is correct.');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background p-4">
            <div className="w-full max-w-md bg-card dark:bg-dark-card rounded-2xl shadow-xl p-8 border border-border dark:border-dark-border">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-primary dark:text-dark-primary mb-2">Reset Password</h2>
                    <p className="text-muted-foreground dark:text-dark-muted-foreground">Enter your email to receive password reset instructions</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <span className="block sm:inline">{message}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-foreground dark:text-dark-foreground mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <input
                                type="email"
                                required
                                className="block w-full pl-10 pr-3 py-2 border border-input dark:border-dark-input rounded-lg bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            'Reset Password'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
