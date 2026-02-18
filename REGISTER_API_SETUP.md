# Registration API Setup

## Backend Changes

### 1. Auth Controller (`src/api/controllers/auth.controller.ts`)
Added `registerController` function that:
- Validates email and password (min 6 characters)
- Checks if email already exists
- Hashes password with bcrypt
- Creates new user in database
- Returns JWT token for automatic login

### 2. Auth Routes (`src/api/routes/auth.routes.ts`)
Added new route:
```
POST /api/v1/auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "status": "success",
  "message": "Registration successful",
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "john@example.com"
  }
}
```

**Response (Error):**
```json
{
  "status": "error",
  "message": "Email already registered"
}
```

## Frontend Changes

### Register Page (`frontend/src/pages/Register.jsx`)
- Connected to `/api/v1/auth/register` endpoint
- Shows loading state during registration
- Displays API error messages
- Automatically logs in user after successful registration
- Redirects to `/fetch-influencers` dashboard

## How to Test

### 1. Start Backend
```bash
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Registration
1. Go to `http://localhost:5173/register`
2. Fill in the form:
   - First Name: Test
   - Last Name: User
   - Email: newuser@test.com
   - Password: test123
   - Confirm Password: test123
3. Click "Create Account"
4. Should automatically login and redirect to dashboard

## Notes

- **firstName and lastName**: Currently collected in the form but not stored in the database (User schema only has email and password). These fields can be added to the schema later if needed.
- **Password Requirements**: Minimum 6 characters
- **Email Validation**: Must be valid email format
- **Duplicate Check**: Returns error if email already exists
- **Auto Login**: User is automatically logged in after registration with JWT token

## Future Enhancements

If you want to store firstName and lastName in the database:

1. Update Prisma schema:
```prisma
model User {
  id               String            @id @default(uuid()) @db.Uuid
  firstName        String?
  lastName         String?
  email            String            @unique
  password         String
  createdAt        DateTime?         @default(now()) @db.Timestamp(6)
  savedInfluencers SavedInfluencer[]
  savedSearches    SavedSearch[]
}
```

2. Run migration:
```bash
npx prisma migrate dev --name add_user_names
```

3. Update controller to save names:
```typescript
const user = await prisma.user.create({
    data: {
        firstName,
        lastName,
        email,
        password: hashedPassword
    }
});
```
