# Password Reset Testing Checklist

## Pre-Testing Setup

- [ ] App is running (Expo Go or built app)
- [ ] Device has network connectivity
- [ ] Email client is accessible on device
- [ ] Check console logs are visible (if testing in Expo Go)

## Step-by-Step Testing

### 1. Initiate Password Reset

```
[ ] Navigate to Login Screen
[ ] Click "Forgot Password" button
[ ] Enter valid email address
[ ] Tap "Send Reset Link"
[ ] Expected: Message says "Password reset email sent! Check your inbox."
```

### 2. Check Email

```
[ ] Open email client on device or desktop
[ ] Find email from: noreply@mail.supabase.io or your Supabase project
[ ] Subject contains: "Reset Password" or similar
[ ] Email contains a clickable link with recovery token
```

### 3. Click Deep Link

```
[ ] Click the link in the email
[ ] Expected console logs (if in Expo Go):
    - 📱 App launched from deep link: spendwise://...
    - 🔗 Deep link detected with tokens, setting session...
    - ✅ Session set successfully, user can now reset password
[ ] App should open to ResetPasswordScreen
```

### 4. Reset Password

```
[ ] ResetPasswordScreen appears with:
    - "Set Your New Password" title
    - Green info box: "Your reset link has been verified..."
    - "New Password" input field
    - "Confirm Password" input field
    - "Reset Password" button

[ ] Enter password in first field (min 6 characters)
[ ] Enter same password in second field
[ ] Tap "Reset Password" button
[ ] Button changes to "Resetting..." while processing
```

### 5. Success Verification

```
[ ] Success dialog appears with message:
    "Your password has been reset successfully!
     Please login with your new password."
[ ] Tap dialog button
[ ] Redirected to LoginScreen
[ ] Tap "OK" to dismiss
```

### 6. Login with New Password

```
[ ] Enter email address on LoginScreen
[ ] Enter new password
[ ] Tap "Login" button
[ ] Expected: Successful login to home screen
```

## Error Scenarios

### Expired Link

```
Symptom: Error on ResetPasswordScreen
Cause: Link clicked after >1 hour
Fix: Request new password reset email
```

### Network Error During Deep Link

```
Symptom: App opens but ResetPasswordScreen doesn't show
Cause: Network issue while setting session
Console shows: ❌ Failed to set session: [error]
Fix: Check network, try clicking link again
```

### Wrong Password Format

```
Symptom: Reset button shows error
Validation:
  - [ ] Password at least 6 characters
  - [ ] Both password fields match
  - [ ] No special validation on characters
Fix: Ensure passwords meet requirements
```

### Deep Link Not Intercepted (Not Recommended Case)

```
Symptom: Clicking link opens browser, app doesn't launch
Note: Only happens with Expo Go if scheme not registered
Fix: Use built app or change deep link scheme in app.json
```

## Console Log Reference

### Normal Flow

```
🎯 Deep link subscriber initialized
📱 App launched from deep link: spendwise://...
🔗 Deep link detected with tokens, setting session...
✅ Session set successfully, user can now reset password
```

### With Errors

```
❌ Failed to set session: [error details]
❌ Error parsing deep link: [error details]
```

## Device-Specific Notes

### iOS

- Links open in Safari
- Need to add URL scheme to app config
- Test with actual device (not simulator for deep links)

### Android

- Links open in default browser
- App:// or custom scheme handling is automatic
- Test with actual device recommended

## Database Verification

After successful password reset:

```
1. Open Supabase Dashboard
2. Navigate to Authentication → Users
3. Find user by email
4. Verify password_changed_at was updated
5. Session should be empty (user was signed out)
```

## Debugging Tips

### Enable Full Logging

Add to `_layout.js` in handleResetPasswordDeepLink:

```javascript
console.log("Full URL:", transformedUrl);
console.log("Parsed URL:", parsedUrl);
console.log("Access Token:", access_token?.substring(0, 20) + "...");
console.log("Refresh Token:", refresh_token?.substring(0, 20) + "...");
```

### Check Link Format

Supabase recovery link format:

```
https://[project].supabase.co/auth/v1/verify?
  type=recovery&
  token=...&
  redirect_to=spendwise://ResetPassword#
  access_token=...&
  refresh_token=...&
  expires_in=3600&
  token_type=bearer
```

### Simulate Without Email

For testing, manually construct deep link:

```
spendwise://ResetPassword#access_token=YOUR_TOKEN&refresh_token=YOUR_TOKEN
```

(Get tokens from Supabase JavaScript console)

## Common Issues & Fixes

| Issue                               | Cause                 | Fix                                                   |
| ----------------------------------- | --------------------- | ----------------------------------------------------- |
| ResetPasswordScreen not showing     | Route not mapped      | Check linking.config has ResetPassword route          |
| Session not setting                 | Tokens not in URL     | Verify link includes #access_token and #refresh_token |
| Password won't update               | Old session expired   | Request new reset email                               |
| App doesn't open from link          | Scheme not registered | Check app.json deep link scheme                       |
| Button stays "Resetting..." forever | Network error         | Check console for errors, retry                       |

## Post-Testing Checklist

After successful test:

- [ ] Old password no longer works
- [ ] New password successfully logs in
- [ ] User data is unchanged
- [ ] No account data was corrupted
- [ ] Session was properly cleared
- [ ] No stray tokens in device storage
- [ ] Console shows no warnings/errors
