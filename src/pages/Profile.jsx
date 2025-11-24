import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { db, storage } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp, writeBatch, collection } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile as updateAuthProfile } from 'firebase/auth';
import { Camera, Save, User, CheckCircle, Circle, Calendar, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();
    const { tasks: allTasks } = useTasks();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [about, setAbout] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [activeTab, setActiveTab] = useState('all'); // all, completed, pending

    // Calculate Stats
    const stats = useMemo(() => {
        return {
            total: allTasks.length,
            completed: allTasks.filter(t => t.completed).length,
            pending: allTasks.filter(t => !t.completed).length
        };
    }, [allTasks]);

    // Filter Tasks for Tabs
    const tabTasks = useMemo(() => {
        return allTasks.filter(task => {
            if (activeTab === 'completed') return task.completed;
            if (activeTab === 'pending') return !task.completed;
            return true;
        }).sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
            return dateB - dateA;
        });
    }, [allTasks, activeTab]);

    useEffect(() => {
        if (user) {
            getProfile();
        }
    }, [user]);

    const getProfile = async () => {
        try {
            setLoading(true);
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setName(data.name || '');
                setAbout(data.about || '');
                setAvatarUrl(data.photoURL || user.photoURL);
            } else {
                setAvatarUrl(user.photoURL);
            }
        } catch (error) {
            console.error('Error loading user data!', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async () => {
        try {
            setLoading(true);

            // 1. Update Firestore
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                name,
                about,
                photoURL: avatarUrl,
                updatedAt: serverTimestamp()
            }, { merge: true });

            // 2. Update Firebase Auth Profile (so Navbar updates immediately)
            if (user) {
                await updateAuthProfile(user, {
                    displayName: name,
                    photoURL: avatarUrl
                });
            }

            // Force reload to reflect changes
            window.location.reload();

        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const uploadAvatar = async (event) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.uid}.${fileExt}`;
            const storageRef = ref(storage, `avatars/${fileName}`);

            await uploadBytes(storageRef, file);
            const publicUrl = await getDownloadURL(storageRef);

            setAvatarUrl(publicUrl);

            // Auto save after upload
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
                photoURL: publicUrl,
                updatedAt: serverTimestamp()
            }, { merge: true });

            // Also update auth profile immediately
            if (user) {
                await updateAuthProfile(user, { photoURL: publicUrl });
            }

        } catch (error) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto pb-10">
            <button
                onClick={() => navigate('/')}
                className="mb-6 flex items-center gap-2 text-gray-500 hover:text-primary transition-colors group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold mb-8 gradient-text">Profile Settings</h1>

            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6">
                <div className="flex flex-col items-center mb-8">
                    <div className="relative group">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="Avatar"
                                className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-white dark:border-gray-700 shadow-md">
                                <User className="w-16 h-16" />
                            </div>
                        )}
                        <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-blue-600 transition-colors" title="Change photo">
                            <Camera className="w-5 h-5" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={uploadAvatar}
                                disabled={uploading}
                                className="hidden"
                            />
                        </label>
                    </div>
                    <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm">{user?.email}</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Display Name</label>
                        <input
                            type="text"
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">About</label>
                        <textarea
                            className="input min-h-[100px] py-3"
                            value={about}
                            onChange={(e) => setAbout(e.target.value)}
                            placeholder="Tell us about yourself..."
                        />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            onClick={updateProfile}
                            disabled={loading}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Task Summary & Tabs */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Task Summary</h2>
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-primary">{stats.total}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-secondary">{stats.completed}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-500">{stats.pending}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
                    <div className="flex gap-4 border-b border-gray-100 dark:border-gray-800 mb-4">
                        {['all', 'completed', 'pending'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-2 px-1 capitalize font-medium transition-colors ${activeTab === tab
                                    ? 'text-primary border-b-2 border-primary'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {tab} Tasks
                            </button>
                        ))}
                    </div>

                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {tabTasks.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">
                                No {activeTab} tasks found.
                            </div>
                        ) : (
                            tabTasks.map(task => (
                                <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800">
                                    {task.completed ? (
                                        <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${task.completed ? 'line-through text-gray-500' : ''}`}>
                                            {task.title}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                            {task.dueAt && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(task.dueAt?.toDate ? task.dueAt.toDate() : new Date(task.dueAt), 'MMM d')}
                                                </span>
                                            )}
                                            <span className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-[10px]">
                                                {task.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Backup & Restore */}
            <div className="bg-surface dark:bg-dark-surface rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                <h2 className="text-xl font-bold mb-4">Data Backup</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => {
                            try {
                                // Export current tasks from context
                                const blob = new Blob([JSON.stringify(allTasks, null, 2)], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `tasks-backup-${new Date().toISOString().slice(0, 10)}.json`;
                                a.click();
                            } catch (e) {
                                alert('Export failed: ' + e.message);
                            }
                        }}
                        className="btn bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex-1"
                    >
                        Export Tasks (JSON)
                    </button>

                    <label className="btn bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 flex-1 cursor-pointer text-center">
                        Import Tasks
                        <input
                            type="file"
                            accept=".json"
                            className="hidden"
                            onChange={async (e) => {
                                const file = e.target.files[0];
                                if (!file) return;
                                try {
                                    const text = await file.text();
                                    const tasks = JSON.parse(text);
                                    if (!Array.isArray(tasks)) throw new Error('Invalid backup file');

                                    // Batch write for import
                                    const batch = writeBatch(db);
                                    const tasksRef = collection(db, 'tasks');

                                    tasks.forEach(t => {
                                        const newDocRef = doc(tasksRef);
                                        batch.set(newDocRef, {
                                            userId: user.uid,
                                            title: t.title,
                                            description: t.description || '',
                                            category: t.category || 'Personal',
                                            categoryColor: t.categoryColor || 'bg-blue-500',
                                            priority: t.priority || 'Medium',
                                            dueAt: t.dueAt ? new Date(t.dueAt) : null,
                                            reminderAt: t.reminderAt ? new Date(t.reminderAt) : null,
                                            completed: t.completed || false,
                                            createdAt: serverTimestamp(),
                                            updatedAt: serverTimestamp()
                                        });
                                    });

                                    await batch.commit();
                                    alert('Tasks imported successfully!');
                                } catch (err) {
                                    alert('Import failed: ' + err.message);
                                }
                            }}
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default Profile;
