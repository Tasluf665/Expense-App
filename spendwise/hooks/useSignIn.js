import { useState } from 'react';
import { supabase } from '../lib/supabase';

export const useSignIn = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signIn = async (email, password) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError(signInError.message);
                return { success: false, error: signInError.message };
            }

            return {
                success: true,
                data,
                message: 'Sign in successful!',
            };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { signIn, loading, error };
};