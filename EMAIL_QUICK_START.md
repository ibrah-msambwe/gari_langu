# 📧 EMAIL SETUP - SUPER QUICK GUIDE

## ✅ STEP 1: DONE!
```
✓ Resend package installed
```

---

## 🚀 STEP 2: GET API KEY (2 mins)

1. **Go to:** https://resend.com
2. **Sign up** (free, just email + password)
3. **Go to:** https://resend.com/api-keys
4. **Click:** "Create API Key"
5. **Name:** Gari Langu
6. **Copy** the key (looks like: `re_ABC123...`)

---

## 📝 STEP 3: CREATE .env.local FILE (2 mins)

### Create file in project root:
```
C:\Users\Administrator_1\Desktop\gari_langu\.env.local
```

### Put this content (replace with your actual values):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
RESEND_API_KEY=re_your_actual_key_from_step_2
EMAIL_FROM=onboarding@resend.dev
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Get Supabase values from:
https://supabase.com/dashboard → Your Project → Settings → API

---

## 🔄 STEP 4: RESTART SERVER (30 secs)

```bash
# Press Ctrl+C to stop
# Then run:
npm run dev
```

---

## ✅ STEP 5: TEST (1 min)

1. Open: http://localhost:3000/login
2. Login
3. Create a reminder (check ✅ Email)
4. **Check your email inbox!**

---

## 🎯 THAT'S IT!

**If console shows:**
```
[Confirm Email] ✅ Email sent successfully
```

**YOU'RE DONE!** 🎉

---

## ❌ TROUBLESHOOTING

**Console shows "not configured"?**
- Check .env.local is in project ROOT (not in /app)
- Check API key has no spaces
- Restart server (Ctrl+C then npm run dev)

**Email not received?**
- Check spam folder
- Wait 1-2 minutes
- Check Resend dashboard: https://resend.com/emails

---

**NEED DETAILED STEPS? See:** `DO_THIS_NOW_EMAIL.md`

