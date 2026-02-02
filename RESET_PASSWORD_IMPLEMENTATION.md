# Password Reset Implementation Guide

## Overview

This document describes the complete password reset flow implemented for the SpendWise app using Supabase authentication and React Native deep linking.

## Architecture

### 1. **User Requests Password Reset**

- User opens app and clicks "Forgot Password" on login screen
- `forgotPassword` thunk in `authSlice.js` is triggered with user's email
- `Linking.createURL("/ResetPassword")` generates a platform-specific redirect URL
- Supabase `resetPasswordForEmail()` sends recovery email with link containing tokens

### 2. **User Receives Email**

- Supabase sends email with recovery link containing:
  - `access_token` - Temporary auth token
  - `refresh_token` - Refresh token
  - URL format: `https://supabase-project.supabase.co/auth/v1/verify?type=recovery&token=...#access_token=...&refresh_token=...`

### 3. **User Clicks Link**

- Opens in mail client → redirects to deep link handler
- Deep link is captured by `app/_layout.js`
- Root navigator's `getInitialURL()` or `subscribe()` function handles it

### 4. **Deep Link Processing**

**Key Steps:**

1. URL comes with tokens in fragment (`#`) instead of query params (`?`)
2. `parseSupabaseUrl()` converts fragment to query params
3. `handleResetPasswordDeepLink()` extracts `access_token` and `refresh_token`
4. `supabase.auth.setSession()` authenticates user with these tokens
5. User is routed to `ResetPasswordScreen`

### 5. **User Updates Password**

- `ResetPasswordScreen` displays password input fields
- User enters new password and confirmation
- `supabase.auth.updateUser({ password })` updates password
- User is signed out and redirected to login screen

## File Changes

### 1. `utils/authSlice.js`

**Change:** Updated `forgotPassword` thunk to use `Linking.createURL()`

```javascript
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const { Linking } = await import("expo-linking");
      const resetPasswordURL = Linking.createURL("/ResetPassword");

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetPasswordURL,
      });

      if (error) throw error;
      return "Password reset email sent! Check your inbox.";
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
```

**Why:** Generates the correct deep link for the platform being used.

### 2. `app/_layout.js`

**New:** Complete deep linking configuration with token extraction

**Key Functions:**

#### `parseSupabaseUrl(url)`

Converts URL fragment to query params:

```
Before: https://app.com#access_token=abc&refresh_token=xyz
After:  https://app.com?access_token=abc&refresh_token=xyz
```

#### `handleResetPasswordDeepLink(transformedUrl)`

- Parses tokens from URL
- Calls `supabase.auth.setSession()` to authenticate user
- Session is now valid - user can update password

#### `linking` Object

Configures URL scheme handlers:

- `spendwise://` - Custom scheme
- `exp+spendwise://` - Expo development
- Maps `/ResetPassword` route to `ResetPasswordScreen`

#### `getInitialURL()`

- Called when app launches from deep link
- Handles tokens and routes to correct screen

#### `subscribe(listener)`

- Listens for deep links while app is in foreground
- Handles tokens even if app is already running

**Why Buffer Shimming?**

```javascript
global.Buffer = require("buffer").Buffer;
```

The URL parsing needs Buffer for certain operations. This ensures it's available in React Native.

### 3. `app/(Authentication)/ResetPasswordScreen.js`

**New:** Simple password reset screen

**Key Features:**

- Two password input fields (password + confirmation)
- Validates passwords match and meet minimum length
- Calls `supabase.auth.updateUser({ password })`
- Signs out user after successful reset
- Redirects to login screen

**Important:** Session is already authenticated by root navigator, so user doesn't need to log in again to change password.

## Dependencies

**Required Packages:**

- `expo-linking` (already included with Expo)
- `buffer` - Installed via npm

```bash
npm install buffer
```

## Testing Flow

### Local Testing (Expo Go)

1. Run app in Expo Go
2. Go to login screen → click "Forgot Password"
3. Enter email and submit
4. Check email for Supabase recovery link
5. Copy link and open in browser or device browser
6. App should intercept deep link and navigate to ResetPasswordScreen
7. Update password and verify success message

### Production Testing (Built App)

1. Build APK or IPA
2. Install on device
3. Request password reset
4. Click link in email
5. App should launch and navigate to ResetPasswordScreen
6. Update password

## Console Logs for Debugging

The implementation includes detailed console logs with emojis:

```
📱 App launched from deep link: spendwise://...
🔗 Deep link detected with tokens, setting session...
✅ Session set successfully, user can now reset password
🔗 Deep link received in foreground: spendwise://...
❌ Failed to set session: [error message]
❌ Error parsing deep link: [error message]
```

## Error Handling

### Session Expired

- If deep link is clicked after session expires (>1 hour):
  - `ResetPasswordScreen` will show: "No active session. Your reset link may have expired."
  - User should request a new password reset

### Network Error

- If tokens can't be set due to network issues:
  - Error logged to console
  - User should manually navigate back and try again

### Password Validation

- Password must be at least 6 characters
- Passwords must match
- Both fields are required

## URL Flow Diagram

```
1. Email Click
   └─> https://supabase.../verify?type=recovery&token=...#access_token=xxx&refresh_token=yyy

2. Deep Link Intercepted
   └─> app/_layout.js (getInitialURL or subscribe)

3. URL Transform
   └─> parseSupabaseUrl() converts # to ?

4. Token Extraction
   └─> Parsing queryParams for access_token & refresh_token

5. Session Setting
   └─> supabase.auth.setSession({ access_token, refresh_token })

6. Route Navigation
   └─> ResetPasswordScreen (with authenticated session)

7. Password Update
   └─> supabase.auth.updateUser({ password })

8. Success
   └─> Sign out and redirect to LoginScreen
```

## Supabase Configuration

**Ensure these settings in Supabase Console:**

1. **Email Templates** → Recovery Email

   - Should include a recovery link
   - Default format is correct

2. **Auth Providers**

   - Email/Password provider enabled

3. **Redirect URLs** (if not using Expo)
   - Add your app's deep link scheme
   - Example: `spendwise://`

## Security Notes

1. **Tokens are temporary** - Access token expires after ~1 hour
2. **Single use** - Recovery link can only be used once
3. **HTTPS required** - Production apps must use HTTPS
4. **No token storage** - Tokens are passed in URL, not stored in app
5. **Session isolation** - Each device gets independent session

## Troubleshooting

### Deep Link Not Intercepted

- Check `linking.config` has correct screen mappings
- Verify app scheme matches email link
- Ensure `getInitialURL` and `subscribe` are properly configured

### Session Not Setting

- Check tokens are present in URL (`console.log` will show)
- Verify Supabase project is correctly configured
- Check network connectivity

### ResetPasswordScreen Not Showing

- Verify screen is in navigation tree (not conditionally rendered)
- Check route mapping in `linking.config`
- Verify no errors in console

### Password Update Fails

- Ensure session is valid (check error message)
- Verify password meets requirements (6+ chars)
- Check network connectivity

## References

- [Supabase Password Recovery Docs](https://supabase.com/docs/guides/auth/auth-password-recovery)
- [Expo Linking Documentation](https://docs.expo.dev/guides/linking/)
- [React Navigation Deep Linking](https://reactnavigation.org/docs/deep-linking-to-notification-containing-expo-notification/)

## Next Steps (If Needed)

1. **Add Success Animation** - Celebrate password reset with animation
2. **Auto-login** - Automatically log user in after password reset
3. **Email Verification** - Verify email before allowing password reset
4. **Rate Limiting** - Limit password reset requests per email
5. **Admin Dashboard** - Add admin view for password reset requests
