import { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { useCategories } from '../context/CategoryContext';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { Plus, Search, Filter, SortAsc } from 'lucide-react';

const Dashboard = () => {
    const { tasks, loading, deleteTask } = useTasks();
    const { categories, defaultCategories } = useCategories();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    // Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('all'); // all, pending, completed
    const [sortBy, setSortBy] = useState('dueAt'); // dueAt, priority

    const allCategories = [...defaultCategories, ...categories];

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filterCategory === 'All' || task.category === filterCategory;
            const matchesStatus = filterStatus === 'all'
                ? true
                : filterStatus === 'completed' ? task.completed : !task.completed;

            return matchesSearch && matchesCategory && matchesStatus;
        }).sort((a, b) => {
            // Primary Sort: Completed tasks go to the bottom
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }

            // Secondary Sort: Based on user selection
            if (sortBy === 'dueAt') {
                if (!a.dueAt) return 1;
                if (!b.dueAt) return -1;
                return new Date(a.dueAt) - new Date(b.dueAt);
            } else if (sortBy === 'priority') {
                const priorityOrder = { high: 1, medium: 2, low: 3 };
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            return 0;
        });
    }, [tasks, searchQuery, filterCategory, filterStatus, sortBy]);

    const handleEdit = (task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingTask(null);
    };

    return (
        <div className="pb-20 md:pb-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">My Tasks</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                <button
                    onClick={() => setIsFormOpen(true)}
                    className="hidden md:flex btn btn-primary items-center gap-2"
                >
                    <Plus className="w-5 h-5" /> Add Task
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-surface dark:bg-dark-surface p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="input pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
                            className="input w-auto min-w-[140px]"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            {allCategories.map(cat => (
                                <option key={cat.name} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>

                        <select
                            className="input w-auto min-w-[140px]"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="dueAt">Sort by Date</option>
                            <option value="priority">Sort by Priority</option>
                        </select>
                    </div>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800">
                    {[
                        { id: 'all', label: 'All Tasks' },
                        { id: 'pending', label: 'Pending' },
                        { id: 'completed', label: 'Completed' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setFilterStatus(tab.id)}
                            className={`pb-2 px-4 font-medium transition-all relative ${filterStatus === tab.id
                                    ? 'text-primary'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                        >
                            {tab.label}
                            {filterStatus === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full animate-fade-in" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Task List */}
            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading tasks...</div>
            ) : filteredTasks.length === 0 ? (
                <div className="text-center py-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                        <Filter className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No tasks found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Try adjusting your filters or add a new task.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredTasks.map(task => (
                        <TaskCard key={task.id} task={task} onEdit={handleEdit} />
                    ))}
                </div>
            )}

            {/* Floating Action Button (Mobile) */}
            <button
                onClick={() => setIsFormOpen(true)}
                className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 transition-colors z-40"
            >
                <Plus className="w-8 h-8" />
            </button>

            {/* Task Form Modal */}
            {isFormOpen && (
                <TaskForm onClose={handleCloseForm} initialData={editingTask} />
            )}
        </div>
    );
};

export default Dashboard;
