# 📝 Todo App - ASP.NET Core + React

## 📋 תיאור הפרויקט
אפליקציית Todo List מלאה עם authentication, בנויה עם ASP.NET Core (Backend) ו-React (Frontend).

---

## 🗄️ הגדרת מסד הנתונים

### שלב 1: יצירת המסד נתונים
הרץ את הקובץ `server/database_setup.sql` ב-MySQL:

```bash
mysql -u Tovi -p < server/database_setup.sql
```

או בתוך MySQL CLI:
```sql
source server/database_setup.sql;
```

### שלב 2: בדיקת החיבור
ודא שהגדרות החיבור ב-`server/appsettings.json` תואמות:
```json
"ConnectionStrings": {
  "ToDoDB": "server=localhost;user=Tovi;password=tovi1234;database=todo_db"
}
```

---

## 🚀 הרצת הפרויקט

### Server (ASP.NET Core)

```powershell
cd server
dotnet restore
dotnet build
dotnet run
```

השרת ירוץ על: `http://localhost:5006`  
Swagger UI: `http://localhost:5006/swagger`

### Client (React)

בטרמינל נפרד:

```powershell
cd client
npm install
npm start
```

הקליינט ירוץ על: `http://localhost:3000`

---

## 🔐 Authentication

### רישום משתמש חדש
```http
POST http://localhost:5006/api/auth/register
Content-Type: application/json

{
  "username": "myuser",
  "password": "mypassword"
}
```

### התחברות
```http
POST http://localhost:5006/api/auth/login
Content-Type: application/json

{
  "username": "myuser",
  "password": "mypassword"
}
```

תקבל בחזרה:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "myuser"
}
```

---

## 📊 מבנה מסד הנתונים

### טבלת `users`
| שדה | טיפוס | תיאור |
|------|--------|-------|
| Id | INT (PK) | מזהה ייחודי |
| Username | VARCHAR(100) | שם משתמש (ייחודי) |
| Password | VARCHAR(255) | סיסמה |
| CreatedAt | TIMESTAMP | תאריך יצירה |

### טבלת `items`
| שדה | טיפוס | תיאור |
|------|--------|-------|
| Id | INT (PK) | מזהה ייחודי |
| Name | VARCHAR(100) | שם המשימה |
| IsComplete | BOOLEAN | האם הושלמה |
| UserId | INT (FK) | מזהה משתמש |
| CreatedAt | TIMESTAMP | תאריך יצירה |
| UpdatedAt | TIMESTAMP | תאריך עדכון |

**קשר:** `items.UserId` → `users.Id` (CASCADE DELETE)

---

## 🔧 API Endpoints

כל הנקודות הבאות דורשות JWT Token ב-Header:
```
Authorization: Bearer <token>
```

### משימות (Items)

| Method | URL | תיאור |
|--------|-----|-------|
| GET | `/items` | שליפת כל המשימות של המשתמש |
| GET | `/items/{id}` | שליפת משימה בודדת |
| POST | `/items` | יצירת משימה חדשה |
| PUT | `/items/{id}` | עדכון משימה |
| DELETE | `/items/{id}` | מחיקת משימה |

### דוגמה - יצירת משימה
```http
POST http://localhost:5006/items
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "ללמוד React",
  "isComplete": false
}
```

---

## 📁 מבנה הפרויקט

```
TodoApi/
├── server/                 # ASP.NET Core Backend
│   ├── Controllers/       # API Controllers
│   ├── DTOs/             # Data Transfer Objects
│   ├── Migrations/       # EF Core Migrations
│   ├── Item.cs           # Item Model
│   ├── User.cs           # User Model
│   ├── ToDoDbContext.cs  # Database Context
│   ├── Program.cs        # Entry Point
│   └── database_setup.sql # SQL Setup Script
│
└── client/               # React Frontend
    ├── src/
    │   ├── App.js       # Main Component
    │   ├── Login.js     # Login Component
    │   ├── Register.js  # Register Component
    │   ├── service.js   # API Service
    │   └── index.css    # Styles
    └── public/
```

---

## 🛠️ טכנולוגיות

**Backend:**
- ASP.NET Core 9.0
- Entity Framework Core
- MySQL
- JWT Authentication

**Frontend:**
- React 18
- Axios
- CSS3 (Gradient Design)

---

## 📝 הערות

1. **הצפנת סיסמאות:** כרגע הסיסמאות לא מוצפנות. מומלץ להוסיף BCrypt או PBKDF2.
2. **HTTPS:** בפרודקשן יש להשתמש ב-HTTPS.
3. **Environment Variables:** כדאי להעביר את הגדרות JWT ו-DB ל-Environment Variables.
4. **Error Handling:** ניתן לשפר את טיפול השגיאות.

---

## 👨‍💻 פיתוח

### הרצת הפרויקט במצב פיתוח
```powershell
# Terminal 1 - Server
cd server
dotnet watch run

# Terminal 2 - Client  
cd client
npm start
```

### בניית הפרויקט לפרודקשן
```powershell
# Server
cd server
dotnet publish -c Release

# Client
cd client
npm run build
```

---

## 📄 License
MIT
