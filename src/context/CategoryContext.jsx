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

const CategoryContext = createContext({});

export const useCategories = () => useContext(CategoryContext);

const defaultCategories = [
    { name: 'Personal', color: 'bg-blue-500' },
    { name: 'Work', color: 'bg-purple-500' },
    { name: 'Shopping', color: 'bg-green-500' },
    { name: 'Health', color: 'bg-red-500' },
    { name: 'Finance', color: 'bg-yellow-500' },
    { name: 'Study', color: 'bg-orange-500' }
];

export const CategoryProvider = ({ children }) => {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setCategories([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'categories'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const userCategories = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCategories([...defaultCategories, ...userCategories]);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching categories:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const addCategory = async (category) => {
        if (!user) return;
        try {
            await addDoc(collection(db, 'categories'), {
                ...category,
                userId: user.uid,
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error adding category:", error);
            throw error;
        }
    };

    const updateCategory = async (id, updates) => {
        try {
            const categoryRef = doc(db, 'categories', id);
            await updateDoc(categoryRef, updates);
        } catch (error) {
            console.error("Error updating category:", error);
            throw error;
        }
    };

    const deleteCategory = async (id) => {
        try {
            const categoryRef = doc(db, 'categories', id);
            await deleteDoc(categoryRef);
        } catch (error) {
            console.error("Error deleting category:", error);
            throw error;
        }
    };

    return (
        <CategoryContext.Provider value={{ categories, loading, addCategory, updateCategory, deleteCategory, defaultCategories }}>
            {children}
        </CategoryContext.Provider>
    );
};
