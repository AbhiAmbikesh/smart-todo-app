import { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useCategories } from '../context/CategoryContext';
import { useToast } from '../context/ToastContext';
import { X, Calendar, Clock, Flag, Tag } from 'lucide-react';

const TaskForm = ({ onClose, initialData = null }) => {
    const { addTask, updateTask } = useTasks();
    const { categories, defaultCategories } = useCategories();
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState(false);

    const allCategories = [...defaultCategories, ...categories];

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Work',
        categoryColor: '#3b82f6',
        priority: 'medium',
        dueAt: '',
        reminderAt: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                dueAt: initialData.dueAt ? new Date(initialData.dueAt).toISOString().slice(0, 16) : '',
                reminderAt: initialData.reminderAt ? new Date(initialData.reminderAt).toISOString().slice(0, 16) : '',
            });
        }
    }, [initialData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const taskData = {
                ...formData,
                dueAt: formData.dueAt ? new Date(formData.dueAt).toISOString() : null,
                reminderAt: formData.reminderAt ? new Date(formData.reminderAt).toISOString() : null,
                categoryColor: allCategories.find(c => c.name === formData.category)?.color || '#ccc',
            };

            if (initialData) {
                await updateTask(initialData.id, taskData);
                showSuccess('Task updated successfully! ✨');
            } else {
                await addTask({ ...taskData, completed: false });
                showSuccess('Task created successfully! 🎉');
            }
            onClose();
        } catch (error) {
            showError(error.message || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-surface dark:bg-dark-surface w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-bold">{initialData ? 'Edit Task' : 'New Task'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <input
                        type="text"
                        required
                        placeholder="What needs to be done?"
                        className="text-lg font-medium bg-transparent border-none focus:ring-0 p-0 w-full placeholder:text-gray-400"
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />

                    <textarea
                        placeholder="Add a description..."
                        className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-600 dark:text-gray-400 min-h-[80px] resize-none"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                <Calendar className="w-4 h-4" /> Due Date
                            </label>
                            <input
                                type="datetime-local"
                                className="input text-sm"
                                value={formData.dueAt}
                                onChange={e => setFormData({ ...formData, dueAt: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                <Clock className="w-4 h-4" /> Reminder
                            </label>
                            <input
                                type="datetime-local"
                                className="input text-sm"
                                value={formData.reminderAt}
                                onChange={e => setFormData({ ...formData, reminderAt: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                <Tag className="w-4 h-4" /> Category
                            </label>
                            <select
                                className="input text-sm"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            >
                                {allCategories.map(cat => (
                                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                <Flag className="w-4 h-4" /> Priority
                            </label>
                            <select
                                className="input text-sm"
                                value={formData.priority}
                                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? 'Saving...' : (initialData ? 'Update Task' : 'Create Task')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;
