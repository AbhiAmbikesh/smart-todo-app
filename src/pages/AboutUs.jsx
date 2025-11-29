import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Facebook, Instagram, ExternalLink, Mail, ArrowLeft } from 'lucide-react';

const AboutUs = () => {
    const socialLinks = [
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: 'https://www.linkedin.com/in/ambikeshkumar11/',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/20',
            borderColor: 'hover:border-blue-500'
        },
        {
            name: 'GitHub',
            icon: Github,
            url: 'https://github.com/AbhiAmbikesh',
            color: 'text-gray-800 dark:text-white',
            bgColor: 'bg-gray-100 dark:bg-gray-800',
            borderColor: 'hover:border-gray-500'
        },
        {
            name: 'Facebook',
            icon: Facebook,
            url: 'https://www.facebook.com/Ambikesh.kumar.1803',
            color: 'text-blue-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/10',
            borderColor: 'hover:border-blue-400'
        },
        {
            name: 'Instagram',
            icon: Instagram,
            url: 'https://www.instagram.com/abhi_825262?igsh=MWpqMGN5eGRoaWFhaQ==',
            color: 'text-pink-600',
            bgColor: 'bg-pink-50 dark:bg-pink-900/10',
            borderColor: 'hover:border-pink-500'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative">
            <Link
                to="/"
                className="absolute left-0 -top-12 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors"
            >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
            </Link>

            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                    About Us
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                    Connect with us on social media to stay updated with the latest news and updates.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {socialLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative p-6 glass rounded-2xl border border-white/20 dark:border-gray-700/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${link.borderColor}`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${link.bgColor} transition-transform group-hover:scale-110 duration-300`}>
                                    <link.icon className={`w-8 h-8 ${link.color}`} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                        {link.name}
                                    </h3>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 transition-colors">
                                        Follow on {link.name}
                                    </span>
                                </div>
                            </div>
                            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                        </div>
                    </a>
                ))}
            </div>

            <div className="glass rounded-2xl p-8 text-center space-y-6 mt-12 border border-white/20 dark:border-gray-700/30">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Mail className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Get in Touch
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                        Have questions or feedback? We'd love to hear from you.
                    </p>
                </div>
                <a
                    href="mailto:abhi825262@gmail.com"
                    className="inline-block px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                    Contact Support
                </a>
            </div>
        </div>
    );
};

export default AboutUs;
