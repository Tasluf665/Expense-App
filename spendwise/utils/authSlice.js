import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../lib/supabase";
import { updateUserProfile, changeUserPassword } from './authService';

// 🔹 Register User & Save to Supabase
export const signupUser = createAsyncThunk(
    "auth/signup",
    async ({ username, email, password }, { rejectWithValue }) => {
        try {
            // Sign up user
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username
                    }
                }
            });

            if (signUpError) throw signUpError;

            // Save user info in users table
            const { error: dbError } = await supabase
                .from('users')
                .insert([{
                    id: data.user.id,
                    email: data.user.email,
                    username,
                    created_at: new Date().toISOString(),
                    email_verified: false
                }]);

            if (dbError) throw dbError;

            // Sign out after signup until verification
            await supabase.auth.signOut();

            return {
                uid: data.user.id,
                email: data.user.email,
                username
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 🔹 Login User
export const loginUser = createAsyncThunk(
    "auth/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (signInError) throw signInError;

            // Check email verification
            if (!data.user.email_confirmed_at) {
                await supabase.auth.signOut();
                return rejectWithValue("Email not verified. Check your inbox.");
            }

            // Get user data from users table
            const { data: userData, error: dbError } = await supabase
                .from('users')
                .select('*')
                .eq('uid', data.user.id)
                .single();

            if (dbError) throw dbError;

            return userData;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 🔹 Forgot Password
export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email, { rejectWithValue }) => {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'com.tasluf.spendwise://'
            });

            if (error) throw error;

            return "Password reset email sent!";
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 🔹 Logout User
export const logoutUser = createAsyncThunk("auth/logout", async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
});

// 🔹 Update Profile
export const updateProfileThunk = createAsyncThunk(
    'auth/updateProfile',
    async (name, { rejectWithValue }) => {
        try {
            await updateUserProfile(name);
            return { username: name };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// 🔹 Change Password ()
export const changePasswordThunk = createAsyncThunk(
    'auth/changePassword',
    async ({ newPassword }, { rejectWithValue }) => {
        try {
            await changeUserPassword(newPassword);
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null,
        signupError: null,
        loginError: null,
        message: null,
    },
    reducers: {
        resetError: (state) => {
            state.signupError = null;
            state.loginError = null;
            state.error = null;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.signupError = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.signupError = action.payload;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.loginError = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.loginError = action.payload;
            })
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
                state.error = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(updateProfileThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateProfileThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = { ...state.user, ...action.payload };
            })
            .addCase(updateProfileThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(changePasswordThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(changePasswordThunk.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(changePasswordThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetError, setUser } = authSlice.actions;
export default authSlice.reducer;
