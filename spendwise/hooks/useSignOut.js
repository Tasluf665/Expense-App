import { useState } from 'react';
import { router } from 'expo-router';
import { supabase } from '../lib/supabase';

export const useSignOut = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signOut = async () => {
        setLoading(true);
        setError(null);

        try {
            const { error: signOutError } = await supabase.auth.signOut();

            if (signOutError) {
                setError(signOutError.message);
                return { success: false, error: signOutError.message };
            }

            router.replace('/(Authentication)/LoginScreen');
            return { success: true };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { signOut, loading, error };
};