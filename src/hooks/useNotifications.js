import { useEffect } from 'react';
import { useTasks } from '../context/TaskContext';

const useNotifications = () => {
    const { tasks } = useTasks();

    useEffect(() => {
        // Request permission on mount
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const checkReminders = () => {
            const now = new Date();
            tasks.forEach(task => {
                if (task.reminderAt && !task.completed) {
                    const reminderTime = new Date(task.reminderAt);
                    // Check if reminder is within the last minute (to avoid double notifications if interval drifts)
                    // and hasn't been shown yet (we might need a local state or flag, but for now simple check)
                    // A better way is to check if now >= reminderTime and now < reminderTime + 1min

                    const timeDiff = now.getTime() - reminderTime.getTime();
                    if (timeDiff >= 0 && timeDiff < 60000) {
                        showNotification(task);
                    }
                }
            });
        };

        const interval = setInterval(checkReminders, 60000); // Check every minute

        // Initial check
        checkReminders();

        return () => clearInterval(interval);
    }, [tasks]);

    const showNotification = (task) => {
        if (Notification.permission === 'granted') {
            new Notification('Task Reminder', {
                body: `It's time for: ${task.title}`,
                icon: '/vite.svg' // Placeholder icon
            });
        }
    };
};

export default useNotifications;
