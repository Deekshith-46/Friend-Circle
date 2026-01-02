# MALE USER API TESTING GUIDE

This document provides comprehensive step-by-step testing instructions for all male user functionality, covering registration, profile management, preference updates, and image handling.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Profile Management Endpoints](#profile-management-endpoints)
4. [Preference Management Endpoints](#preference-management-endpoints)
5. [Image Management Endpoints](#image-management-endpoints)
6. [Testing Scenarios](#testing-scenarios)
7. [Postman Collection](#postman-collection)

## Prerequisites

### Required Tools
- Postman or similar API testing tool
- MongoDB running with populated data
- Server running on configured port

### Test Data Setup
```javascript
// Sample interest IDs (from admin/Interest collection)
const sampleInterests = [
  "68d4f9dfdd3c0ef9b8ebbf19",
  "68d4fac1dd3c0ef9b8ebbf20"
];

// Sample language IDs (from admin/Language collection)
const sampleLanguages = [
  "68d4fc53dd3c0ef9b8ebbf35"
];

// Sample relationship goal IDs (from admin/RelationGoal collection)
const sampleRelationshipGoals = [
  "68d509d84e1ff23011f7c636"
];

// Sample religion ID
const sampleReligion = "68d5092b4e1ff23011f7c631";
```

## Authentication Endpoints

### 1. Register Male User
```
POST /api/male-user/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "referralCode": "REF123"  // Optional
}
```
- **Expected Response**: 201 Created with OTP
- **Verify**: User created with `isVerified: false`, `isActive: false`

### 2. Login (Send OTP)
```
POST /api/male-user/login
Content-Type: application/json

{
  "email": "john.doe@example.com"
}
```
- **Expected Response**: 200 OK with OTP
- **Verify**: OTP sent to email, user exists and is verified

### 3. Verify OTP (Complete Registration)
```
POST /api/male-user/verify-otp
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "otp": "1234"
}
```
- **Expected Response**: 200 OK with JWT token
- **Verify**: User has `isVerified: true`, `isActive: true`

### 4. Verify Login OTP
```
POST /api/male-user/verify-login-otp
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "otp": "1234"
}
```
- **Expected Response**: 200 OK with JWT token
- **Verify**: Valid token returned for authenticated requests

## Profile Management Endpoints

### 5. Update Profile with All Information (formData)
```
POST /api/male-user/profile-and-image
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

// Form Data Fields:
- firstName: "John"
- lastName: "Doe"
- mobileNumber: "9999999999"
- dateOfBirth: "1995-01-01"
- gender: "male"
- bio: "Hello I am interested"
- interests: ["68d4f9dfdd3c0ef9b8ebbf19", "68d4fac1dd3c0ef9b8ebbf20"]
- languages: ["68d4fc53dd3c0ef9b8ebbf35"]
- religion: "68d5092b4e1ff23011f7c631"
- relationshipGoals: ["68d509d84e1ff23011f7c636"]
- height: "180"
- searchPreferences: "both"
- hobbies: ["Watching Series", "Movies"]
- sports: ["Cricket", "Football"]
- film: ["Baahubali"]
- music: ["2020s"]
- travel: ["Hyderabad"]
- images: [file1.jpg, file2.jpg]  // Optional image files
```
- **Expected Response**: 200 OK
- **Verify Response**:
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    // Updated user object with all fields
  }
}
```

### 6. Get User Profile
```
GET /api/male-user/me
Authorization: Bearer <jwt_token>
```
- **Expected Response**: 200 OK
- **Verify**: Returns complete user profile with populated interests and languages

## Preference Management Endpoints

### 7. Update Interests Only
```
PATCH /api/male-user/interests
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

interests: ["68d4f9dfdd3c0ef9b8ebbf19", "68d4fac1dd3c0ef9b8ebbf20"]  // as JSON string
```
- **Expected Response**: 200 OK
- **Verify**: Interests updated in user profile

### 8. Update Languages Only
```
PATCH /api/male-user/languages
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

languages: ["68d4fc53dd3c0ef9b8ebbf35"]  // as JSON string
```
- **Expected Response**: 200 OK
- **Verify**: Languages updated in user profile

### 9. Update Hobbies
```
PATCH /api/male-user/hobbies
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

hobbies: ["Reading", "Gaming"]  // as JSON string
```
- **Expected Response**: 200 OK
- **Verify**: Hobbies updated in user profile

**Alternative with form data:**
```
PATCH /api/male-user/hobbies
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

hobbies: ["Reading", "Gaming"]  // as JSON string
```
- **Expected Response**: 200 OK

### 10. Update Sports
```
PATCH /api/male-user/sports
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

sports: ["Cricket", "Football"]  // as JSON string
```
- **Expected Response**: 200 OK
- **Verify**: Sports updated in user profile

**Alternative with form data:**
```
PATCH /api/male-user/sports
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

sports: ["Cricket", "Football"]  // as JSON string
```
- **Expected Response**: 200 OK

### 11. Update Film Preferences
```
PATCH /api/male-user/film
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

film: ["Action", "Comedy"]  // as JSON string
```
- **Expected Response**: 200 OK
- **Verify**: Film preferences updated in user profile

**Alternative with form data:**
```
PATCH /api/male-user/film
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

film: ["Action", "Comedy"]  // as JSON string
```
- **Expected Response**: 200 OK

### 12. Update Music Preferences
```
PATCH /api/male-user/music
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

music: ["Rock", "Pop"]  // as JSON string
```
- **Expected Response**: 200 OK
- **Verify**: Music preferences updated in user profile

**Alternative with form data:**
```
PATCH /api/male-user/music
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

music: ["Rock", "Pop"]  // as JSON string
```
- **Expected Response**: 200 OK

### 13. Update Travel Preferences
```
PATCH /api/male-user/travel
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

travel: ["Paris", "Tokyo"]  // as JSON string
```
- **Expected Response**: 200 OK
- **Verify**: Travel preferences updated in user profile

**Alternative with form data:**
```
PATCH /api/male-user/travel
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

travel: ["Paris", "Tokyo"]  // as JSON string
```
- **Expected Response**: 200 OK

### 14. Delete Specific Preference Item
```
DELETE /api/male-user/preferences/:type/:itemId
Authorization: Bearer <jwt_token>

// Example:
DELETE /api/male-user/preferences/hobbies/6956377f36f9caa55666e661  // MongoDB _id
```
- **Available Types**: `hobbies`, `sports`, `film`, `music`, `travel`
- **Expected Response**: 200 OK
- **Verify Response**:
```json
{
  "success": true,
  "message": "hobbies item deleted successfully",
  "data": {
    "type": "hobbies",
    "deletedItemValue": "6956377f36f9caa55666e661",
    "remainingCount": 1
  }
}
```

### 15. Delete Specific Interest
```
DELETE /api/male-user/interests/:interestId
Authorization: Bearer <jwt_token>

// Example:
DELETE /api/male-user/interests/68d4f9dfdd3c0ef9b8ebbf19
```
- **Expected Response**: 200 OK
- **Verify Response**:
```json
{
  "success": true,
  "message": "Interest removed successfully",
  "data": {
    "removedInterestId": "68d4f9dfdd3c0ef9b8ebbf19"
  }
}
```

### 16. Delete Specific Language
```
DELETE /api/male-user/languages/:languageId
Authorization: Bearer <jwt_token>

// Example:
DELETE /api/male-user/languages/68d4fc53dd3c0ef9b8ebbf35
```
- **Expected Response**: 200 OK
- **Verify Response**:
```json
{
  "success": true,
  "message": "Language removed successfully",
  "data": {
    "removedLanguageId": "68d4fc53dd3c0ef9b8ebbf35"
  }
}
```

### 17. Update Basic Profile Details
```
PATCH /api/male-user/profile-details
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "searchPreferences": "female",
  "bio": "Updated bio here",
  "dateOfBirth": "2000-01-01",
  "height": "182",
  "religion": "68d5092b4e1ff23011f7c631"
}
```
- **Expected Response**: 200 OK
- **Note**: You can send any combination of the above fields (single field, multiple fields, or all fields)
- **Verify Response**:
```json
{
  "success": true,
  "message": "Profile details updated successfully",
  "data": {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Smith",
    "email": "user@example.com",
    // ... other user data
  }
}
```

**Alternative with form data:**
```
PATCH /api/male-user/profile-details
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

firstName: John
lastName: Smith
searchPreferences: female
bio: Updated bio here
dateOfBirth: 2000-01-01
height: 182
religion: 68d5092b4e1ff23011f7c631
```
- **Expected Response**: 200 OK

## Image Management Endpoints

### 15. Upload Images
```
POST /api/male-user/upload-image
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

// Form Data:
- images: [file1.jpg, file2.jpg, file3.jpg]  // Up to 5 files
```
- **Expected Response**: 200 OK
- **Verify Response**:
```json
{
  "success": true,
  "message": "Image upload success",
  "urls": ["path/to/image1.jpg", "path/to/image2.jpg"]
}
```

### 16. Delete Specific Image
```
DELETE /api/male-user/images/:imageId
Authorization: Bearer <jwt_token>
```
- **Expected Response**: 200 OK
- **Verify**: Image removed from user profile and database

## Testing Scenarios

### Important Notes for Form Data
When sending form data, the system can handle various formats and will properly parse them:

**Option 1: Direct Values**
- Set key as the field name (e.g., `firstName`, `gender`, `religion`, etc.)
- Set value directly: `John`, `male`, `68d5092b4e1ff23011f7c631`
- Content-Type should be `multipart/form-data`

**Option 2: JSON Array String (For Arrays)**
- Set key as the field name (e.g., `hobbies`, `sports`, etc.)
- Set value as a JSON array string: `"[\"Watching Series\", \"Movies\"]"`
- Content-Type should be `multipart/form-data`

**Option 3: Direct Array Values**
- Set key as the field name (e.g., `hobbies`, `sports`, etc.)
- For multiple values with same key, add multiple entries:
  - hobbies: "Watching Series"
  - hobbies: "Movies"
- This will be received as an array in the backend

**Option 4: Using JavaScript/Postman Tests**
```javascript
// In Postman pre-request script or JavaScript:
const hobbiesArray = ["Watching Series", "Movies"];
pm.environment.set("hobbies_json", JSON.stringify(hobbiesArray));
```

**Important for Reference Fields (interests, languages, relationshipGoals):**
- These fields expect valid ObjectId strings from the respective collections
- When using form-data, send as JSON string: `interests: ["68d4f9dfdd3c0ef9b8ebbf19", "68d4fac1dd3c0ef9b8ebbf20"]`
- Make sure the IDs exist in the Interest, Language, and RelationGoal collections
- For form-data format, send as **Text** field (not file) with JSON array format
- Example format in Postman: `interests` field with value `"[\"68d4f9dfdd3c0ef9b8ebbf19\",\"68d4fac1dd3c0ef9b8ebbf20\"]"` (as text, not file)

**Note**: The system is robust and handles values with extra quotes automatically (e.g., `"male"`, `"68d5092b4e1ff23011f7c631"` will be properly parsed).

### Scenario 1: Complete Profile Setup
1. Register new male user
2. Verify OTP to activate account
3. Update complete profile with all information
4. Verify profile contains all updated information

### Scenario 2: Preference Management
1. Add initial preferences (hobbies, sports, etc.)
2. Add more preferences (should append to existing)
3. Delete specific preference item
4. Verify remaining preferences are intact

### Scenario 3: Image Management
1. Upload initial images
2. Upload more images (should append to existing)
3. Delete specific image
4. Verify remaining images are intact

### Scenario 4: Combined Profile Update
1. Update profile with formData including images
2. Verify all fields updated correctly
3. Verify images uploaded and linked properly

## Detailed Testing Steps

### Test 1: Upload All Information
**Objective**: Verify complete profile setup with all fields
```
// Step 1: Register user
POST /api/male-user/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}

// Step 2: Verify OTP
POST /api/male-user/verify-otp
{
  "email": "john@example.com",
  "otp": "1234"
}

// Step 3: Update complete profile
POST /api/male-user/profile-and-image
Authorization: Bearer <token>
// Form data with all fields as shown in endpoint #5
```

**Expected Result**: Complete profile with all fields updated

### Test 2: Update Specific Details
**Objective**: Verify individual field updates work
```
// Update only hobbies
PUT /api/male-user/hobbies
Authorization: Bearer <token>
{
  "hobbies": [{"id": "hobby1", "name": "Reading"}]
}

// Verify with GET /api/male-user/me
```

**Expected Result**: Only hobbies updated, other fields unchanged

### Test 3: Add and Remove Preferences
**Objective**: Verify preferences can be added and removed
```
// Step 1: Add initial hobbies
PUT /api/male-user/hobbies
{
  "hobbies": [
    {"id": "hobby1", "name": "Reading"},
    {"id": "hobby2", "name": "Gaming"}
  ]
}

// Step 2: Add more hobbies (should append)
PUT /api/male-user/hobbies
{
  "hobbies": [
    {"id": "hobby3", "name": "Cooking"}
  ]
}

// Step 3: Delete specific hobby
DELETE /api/male-user/preferences/hobbies/hobby1

// Step 4: Verify remaining hobbies
GET /api/male-user/me
```

**Expected Result**: 
- Initial hobbies: 2 items
- After adding: 3 items (appended)
- After deletion: 2 items (specific one removed)

### Test 4: Image Management
**Objective**: Verify image upload and deletion
```
// Step 1: Upload images
POST /api/male-user/upload-image
// With 3 image files

// Step 2: Upload more images
POST /api/male-user/upload-image
// With 2 more image files

// Step 3: Delete specific image
DELETE /api/male-user/images/image_id_to_delete

// Step 4: Verify remaining images
GET /api/male-user/me
```

**Expected Result**: 
- Initial upload: 3 images
- After second upload: 5 images total
- After deletion: 4 images remaining

## Validation Checks

### Required Validations
- [ ] All endpoints require valid JWT token
- [ ] Invalid data returns appropriate error messages
- [ ] Required fields validation
- [ ] File size/type validation for images
- [ ] Unique constraint validation

### Business Logic Validations
- [ ] Preferences append to existing arrays (not replace)
- [ ] Specific preference items can be deleted
- [ ] Images append to existing collection
- [ ] Specific images can be deleted
- [ ] Profile updates preserve existing data

## Expected Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development)"
}
```

## Postman Collection Structure

```
Male User API Tests
├── Authentication
│   ├── Register User
│   ├── Login (Send OTP)
│   ├── Verify OTP
│   └── Verify Login OTP
├── Profile Management
│   ├── Update Complete Profile (formData)
│   └── Get User Profile
├── Preference Management
│   ├── Update Interests
│   ├── Update Languages
│   ├── Update Hobbies
│   ├── Update Sports
│   ├── Update Film Preferences
│   ├── Update Music Preferences
│   ├── Update Travel Preferences
│   └── Delete Specific Preference
└── Image Management
    ├── Upload Images
    └── Delete Specific Image
```

## Environment Variables
```
{
  "baseUrl": "http://localhost:3000/api",
  "maleUserToken": "",
  "maleUserId": "",
  "imageId": "",
  "preferenceId": ""
}
```

## Test Execution Checklist

### Before Testing
- [ ] Server is running
- [ ] Database is connected
- [ ] Required IDs are available (interests, languages, etc.)
- [ ] Test user account is ready

### During Testing
- [ ] Each endpoint returns expected status code
- [ ] Response format is consistent
- [ ] Data is correctly updated in database
- [ ] Error handling works properly

### After Testing
- [ ] All preferences are correctly managed
- [ ] Images are properly uploaded and deletable
- [ ] Profile data is complete and accurate
- [ ] No orphaned records exist