import { useState } from 'react';
import * as Linking from 'expo-linking';
import { supabase } from '../lib/supabase';

export const useSignUp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const signUp = async (email, password, name) => {
        setLoading(true);
        setError(null);

        try {
            // Create deep link redirect
            const redirectUrl = Linking.createURL('/VerificationScreen');

            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                    emailRedirectTo: redirectUrl,
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                return { success: false, error: signUpError.message };
            }

            return {
                success: true,
                data,
                message: 'Sign up successful! Please check your email to verify your account.',
            };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    };

    return { signUp, loading, error };
};
