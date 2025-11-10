import { supabase } from '../lib/supabase';

export const updateUserProfile = async (name) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        // Update user metadata in Supabase Auth
        const { error: authError } = await supabase.auth.updateUser({
            data: { username: name }
        });

        if (authError) throw authError;

        // Update username in users table
        const { error: dbError } = await supabase
            .from('users')
            .update({ username: name })
            .eq('uid', user.id);

        if (dbError) throw dbError;
    } catch (error) {
        throw new Error('Error updating profile: ' + error.message);
    }
};

export const changeUserPassword = async (newPassword) => {
    try {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;
    } catch (error) {
        throw new Error('Error changing password: ' + error.message);
    }
};
