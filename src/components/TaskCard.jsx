import { format } from 'date-fns';
import { Calendar, Clock, Edit2, Trash2, CheckCircle, Circle, Sparkles } from 'lucide-react';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';

const TaskCard = ({ task, onEdit }) => {
    const { toggleComplete, deleteTask } = useTasks();
    const { showSuccess } = useToast();

    const priorityColors = {
        low: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
        medium: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white',
        high: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
    };

    const categoryGradients = {
        Personal: 'from-blue-400 to-blue-600',
        Work: 'from-purple-400 to-purple-600',
        Shopping: 'from-green-400 to-green-600',
        Health: 'from-red-400 to-red-600',
        Finance: 'from-yellow-400 to-yellow-600',
        Study: 'from-orange-400 to-orange-600'
    };

    const handleToggleComplete = async () => {
        await toggleComplete(task.id, !task.completed);
        if (!task.completed) {
            showSuccess('Task completed! 🎉');
        }
    };

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this task?')) {
            await deleteTask(task.id);
            showSuccess('Task deleted successfully');
        }
    };

    return (
        <div className={`relative card animate-fade-in hover:scale-[1.02] transition-all duration-300 ${task.completed ? 'opacity-75' : ''} overflow-hidden`}>
            {/* Gradient accent bar */}
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${categoryGradients[task.category] || 'from-gray-400 to-gray-600'}`} />

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 pointer-events-none" />

            <div className="flex items-start gap-4 relative z-10">
                <button
                    onClick={handleToggleComplete}
                    className={`mt-1 transform hover:scale-110 transition-all duration-300 ${task.completed ? 'text-green-500 rotate-0' : 'text-gray-400 hover:text-purple-500'}`}
                >
                    {task.completed ? (
                        <CheckCircle className="w-7 h-7 animate-pulse" />
                    ) : (
                        <Circle className="w-7 h-7 hover:rotate-180 transition-transform duration-500" />
                    )}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                        <h3 className={`font-bold text-lg ${task.completed ? 'line-through text-gray-500' : 'gradient-text'}`}>
                            {task.title}
                        </h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-bold shadow-lg ${priorityColors[task.priority] || priorityColors.low} transform hover:scale-110 transition-transform`}>
                            {task.priority.toUpperCase()}
                        </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                        {task.description || 'No description'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                            <Calendar className="w-4 h-4" />
                            {task.dueAt ? format(new Date(task.dueAt), 'MMM d, yyyy') : 'No date'}
                        </div>
                        {task.dueAt && (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/30 dark:to-rose-900/30 text-pink-700 dark:text-pink-300 text-xs font-semibold">
                                <Clock className="w-4 h-4" />
                                {format(new Date(task.dueAt), 'h:mm a')}
                            </div>
                        )}
                        <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r ${categoryGradients[task.category] || 'from-gray-400 to-gray-600'} text-white text-xs font-bold shadow-md`}>
                            <Sparkles className="w-3 h-3" />
                            {task.category}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 transition-all duration-300 transform translate-x-0">
                    <button
                        onClick={() => onEdit(task)}
                        className="p-2 text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        title="Edit Task"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={handleDelete}
                        className="p-2 text-white bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                        title="Delete Task"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskCard;
