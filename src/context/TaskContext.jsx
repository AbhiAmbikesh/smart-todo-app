import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    onSnapshot,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { useAuth } from './AuthContext';

const TaskContext = createContext({});

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        // Simplified query to avoid index issues initially
        // We can sort on the client side for now
        const q = query(
            collection(db, 'tasks'),
            where('userId', '==', user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userTasks = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Client-side sorting
            userTasks.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
                return dateB - dateA;
            });

            setTasks(userTasks);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching tasks:", error);
            // If it's a permission error, it might be rules
            if (error.code === 'permission-denied') {
                console.error("Check Firestore security rules!");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addTask = async (task) => {
        if (!user) return;
        try {
            await addDoc(collection(db, 'tasks'), {
                ...task,
                userId: user.uid,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error adding task:", error);
            throw error;
        }
    };

    const updateTask = async (id, updates) => {
        try {
            const taskRef = doc(db, 'tasks', id);
            await updateDoc(taskRef, {
                ...updates,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating task:", error);
            throw error;
        }
    };

    const deleteTask = async (id) => {
        try {
            const taskRef = doc(db, 'tasks', id);
            await deleteDoc(taskRef);
        } catch (error) {
            console.error("Error deleting task:", error);
            throw error;
        }
    };

    const toggleComplete = async (id, completed) => {
        try {
            const taskRef = doc(db, 'tasks', id);
            await updateDoc(taskRef, {
                completed,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error toggling task completion:", error);
            throw error;
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask, toggleComplete }}>
            {children}
        </TaskContext.Provider>
    );
};
