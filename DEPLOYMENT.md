# 🚀 Deployment Guide - Todo App

## 📦 Server Deployment (Render.com)

### שלב 1: הגדרות ב-Render.com

1. **התחבר ל-Render.com** והתחבר עם GitHub
2. **צור Web Service חדש:**
   - Repository: `tovi3949-ux/tovi-rozenberg-project-3`
   - Root Directory: `server`
   - Build Command: `dotnet publish -c Release -o out`
   - Start Command: `cd out && dotnet TodoApi.dll`

### שלב 2: Environment Variables ב-Render

הוסף את המשתנים הבאים בלשונית **Environment**:

```bash
# Database Connection (עדכן עם פרטי ה-DB שלך)
ConnectionStrings__ToDoDB=server=YOUR_DB_HOST;user=YOUR_DB_USER;password=YOUR_DB_PASSWORD;database=todo_db

# JWT Settings
Jwt__Key=SuperSecretKey12345678901234567890ABCDEFGH
Jwt__Issuer=https://todolist-srever.onrender.com
Jwt__Audience=https://todolist-srever.onrender.com

# Allowed Origins
AllowedOrigins__0=http://localhost:3000
AllowedOrigins__1=https://your-client-app-url.vercel.app
```

### שלב 3: Deploy!
לחץ על **Create Web Service** ו-Render יבנה וידפלוי את השרבר.

---

## 🌐 Client Deployment (Vercel/Netlify)

### אופציה 1: Vercel

1. **התקן Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd client
   vercel --prod
   ```

3. **הגדר Environment Variable:**
   בפאנל של Vercel, הוסף:
   ```
   REACT_APP_API_URL=https://todolist-srever.onrender.com
   ```

### אופציה 2: Netlify

1. **התקן Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build ו-Deploy:**
   ```bash
   cd client
   npm run build
   netlify deploy --prod --dir=build
   ```

3. **הגדר Environment Variable:**
   בפאנל של Netlify:
   ```
   REACT_APP_API_URL=https://todolist-srever.onrender.com
   ```

---

## 🔧 עדכון CORS לאחר Deploy של Client

לאחר שיש לך URL של הקליינט, עדכן ב-Render:

```bash
AllowedOrigins__2=https://your-client-app.vercel.app
AllowedOrigins__3=https://your-client-app.netlify.app
```

---

## �? בדיקת Deployment

### בדיקת השרבר:
```bash
curl https://todolist-srever.onrender.com/swagger
```

### בדיקת ה-API:
```bash
# Register
curl -X POST https://todolist-srever.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'

# Login
curl -X POST https://todolist-srever.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

---

## 🗄�? Database Setup ב-Production

### אופציה 1: Render Database
1. צור **MySQL Database** ב-Render
2. העתק את הxxxxxxction String
3. הרץ את `database_setup.sql` ב-DB החדש

### אופציה 2: External MySQL (PlanetScale, AWS RDS)
1. צור DB חדש
2. עדכן את `ConnectionStrings__ToDoDB`
3. הרץ את סקריפט ה-SQL

---

## 📝 Checklist לפני Production

- [ ] עדכן ConnectionString ל-DB של production
- [ ] עדכן JWT Key לערך חזק ויחודי
- [ ] הוסף את URL של הקליינט ל-AllowedOrigins
- [ ] בדוק ש-HTTPS עובד
- [ ] הרץ את database_setup.sql ב-production DB
- [ ] בדוק שה-CORS עובד
- [ ] בדוק authentication flow
- [ ] הוסף error logging (Sentry, Application Insights)

---

## 🔐 Security Best Practices

1. **אל תשמור secrets ב-Git:**
   - השתמש ב-Environment Variables
   - הוסף `.env` ל-`.gitignore`

2. **השתמש ב-HTTPS תמיד:**
   - Render ו-Vercel מספקים HTTPS אוטומטית

3. **הצפן סיסמאות:**
   - כרגע הסיסמאות לא מוצפנות - כדאי להוסיף BCrypt

4. **החזק JWT Key:**
   - השתמש במחרוזת אקראית ארוכה
   - החלף אותה מעת לעת

---

## 🐛 Troubleshooting

### בעיית CORS:
```
Access to fetch at 'https://todolist-srever.onrender.com' from origin 'https://your-app.vercel.app' has been blocked
```
**פתרון:** הוסף את ה-URL של הקליינט ל-AllowedOrigins ב-Render.

### JWT לא עובד:
**פתרון:** ודא ש-Issuer ו-Audience תואמים ל-URL של השרבר.

### Database Connection Failed:
**פתרון:** בדוק xxxxxxxxxxctionString ב-Environment Variables.

---

## 📱 Development vs Production

### Development:
```bash
# Server
cd server
dotnet run

# Client
cd client
npm start
```

### Production:
- **Server:** https://todolist-srever.onrender.com
- **Client:** https://your-app.vercel.app
- **API Docs:** https://todolist-srever.onrender.com/swagger

---

## 🎉 Deploy Successfully!

הפרויקט שלך עכשיו live! 🚀
