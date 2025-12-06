# 📞 Call Duration & Coin Deduction System - API Testing Guide

## 🎯 Overview
This system handles Agora audio/video call duration tracking, automatic coin deduction from male users, and coin crediting to female users based on per-second rates set by admin.

---

## 🔧 Prerequisites

### 1. Setup Required Users
You need:
- **Admin User** (to set call rates)
- **Male User** (caller - needs coins)
- **Female User** (receiver - earns coins)

### 2. Male User Must Have Coins
Before testing calls, ensure male user has sufficient coin balance.

---

## 📋 Step-by-Step API Testing

### **STEP 1: Admin Sets Female User's Call Rate**

**Endpoint:** `POST /api/admin/users/set-call-rate`

**Headers:**
```json
{
  "Authorization": "Bearer <ADMIN_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "userId": "female_user_id_here",
  "coinsPerSecond": 2
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Call rate updated successfully for Srija",
  "data": {
    "userId": "674b8c9d1234567890abcdef",
    "name": "Srija",
    "email": "srija@example.com",
    "coinsPerSecond": 2
  }
}
```

**Test Different Rates:**
- Set Srija to 2 coins/second
- Set Sruthi to 4 coins/second
- Set Priya to 1.5 coins/second

---

### **STEP 2: Check Male User's Initial Coin Balance**

**Endpoint:** `GET /api/male/me`

**Headers:**
```json
{
  "Authorization": "Bearer <MALE_USER_TOKEN>"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "_id": "674b8c9d1234567890abcdef",
    "name": "Ravi",
    "email": "ravi@example.com",
    "coinBalance": 500,
    "walletBalance": 0
  }
}
```

**Note:** If balance is 0, use admin endpoint to credit coins first.

---

### **STEP 3: Start Call in Frontend (Agora Integration)**

**Frontend Code Example:**
```javascript
// When male user presses call button
let callStartTime;

// Agora event when call connects
agoraEngine.on('joinChannelSuccess', (channel, uid, elapsed) => {
  callStartTime = Date.now();
  console.log('Call started at:', callStartTime);
});

// Agora event when call ends
agoraEngine.on('leaveChannel', (stats) => {
  const callEndTime = Date.now();
  const durationSeconds = Math.floor((callEndTime - callStartTime) / 1000);
  
  // Send to backend
  endCallAndProcessPayment(femaleUserId, durationSeconds);
});

// Function to call your backend
async function endCallAndProcessPayment(receiverId, duration) {
  const response = await fetch('/api/male/calls/end', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${maleUserToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      receiverId: receiverId,
      duration: duration,
      callType: 'video'
    })
  });
  
  const result = await response.json();
  console.log('Call ended:', result);
}
```

---

### **STEP 4: End Call and Process Payment**

**Endpoint:** `POST /api/male/calls/end`

**Headers:**
```json
{
  "Authorization": "Bearer <MALE_USER_TOKEN>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "receiverId": "female_user_id_here",
  "duration": 65,
  "callType": "video"
}
```

**Example Response (Success):**
```json
{
  "success": true,
  "message": "Call ended successfully",
  "data": {
    "callId": "674b8c9d1234567890xyz123",
    "duration": 65,
    "coinsPerSecond": 2,
    "totalCoins": 130,
    "coinsDeducted": 130,
    "coinsCredited": 130,
    "callerRemainingBalance": 370,
    "receiverNewBalance": 130
  }
}
```

**Calculation:**
- Duration: 65 seconds
- Rate: 2 coins/second
- Total: 65 × 2 = **130 coins**
- Male user: 500 - 130 = **370 coins remaining**
- Female user: 0 + 130 = **130 coins earned**

---

### **STEP 5: Test Insufficient Coins Scenario**

**Request Body:** (Same as Step 4, but with duration > available balance)
```json
{
  "receiverId": "female_user_id_here",
  "duration": 500,
  "callType": "video"
}
```

**Example Response (Insufficient Coins):**
```json
{
  "success": false,
  "message": "Insufficient coins",
  "data": {
    "required": 1000,
    "available": 370,
    "shortfall": 630,
    "callId": "674b8c9d1234567890xyz124"
  }
}
```

**Note:** Call history is still recorded with status: `insufficient_coins`

---

### **STEP 6: Verify Male User's Call History**

**Endpoint:** `GET /api/male/calls/history?limit=10&skip=0`

**Headers:**
```json
{
  "Authorization": "Bearer <MALE_USER_TOKEN>"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "674b8c9d1234567890xyz123",
      "callerId": "674b8c9d1234567890abcdef",
      "receiverId": {
        "_id": "674b8c9d1234567890fedcba",
        "name": "Srija",
        "email": "srija@example.com"
      },
      "duration": 65,
      "coinsPerSecond": 2,
      "totalCoins": 130,
      "callType": "video",
      "status": "completed",
      "createdAt": "2024-12-06T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 10,
    "skip": 0
  }
}
```

---

### **STEP 7: Get Male User's Call Statistics**

**Endpoint:** `GET /api/male/calls/stats`

**Headers:**
```json
{
  "Authorization": "Bearer <MALE_USER_TOKEN>"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalCalls": 12,
    "totalDuration": 3450,
    "totalCoinsSpent": 6900
  }
}
```

---

### **STEP 8: Verify Female User's Earnings**

**Endpoint:** `GET /api/female/calls/earnings?limit=10&skip=0`

**Headers:**
```json
{
  "Authorization": "Bearer <FEMALE_USER_TOKEN>"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "674b8c9d1234567890xyz123",
      "callerId": {
        "_id": "674b8c9d1234567890abcdef",
        "name": "Ravi",
        "email": "ravi@example.com"
      },
      "receiverId": "674b8c9d1234567890fedcba",
      "duration": 65,
      "coinsPerSecond": 2,
      "totalCoins": 130,
      "callType": "video",
      "status": "completed",
      "createdAt": "2024-12-06T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 8,
    "limit": 10,
    "skip": 0
  }
}
```

---

### **STEP 9: Get Female User's Earnings Statistics**

**Endpoint:** `GET /api/female/calls/earnings-stats`

**Headers:**
```json
{
  "Authorization": "Bearer <FEMALE_USER_TOKEN>"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "totalCalls": 8,
    "totalDuration": 2340,
    "totalEarnings": 4680
  }
}
```

---

### **STEP 10: Check Transactions**

**For Male User:**
```
GET /api/male/me/transactions?operationType=coin
```

**For Female User:**
```
GET /api/female/me/transactions?operationType=wallet
```

**Example Transaction (Male - Debit):**
```json
{
  "userType": "male",
  "userId": "674b8c9d1234567890abcdef",
  "operationType": "coin",
  "action": "debit",
  "amount": 130,
  "message": "Video/Audio call with Srija for 65 seconds",
  "balanceAfter": 370,
  "createdAt": "2024-12-06T10:30:00.000Z"
}
```

**Example Transaction (Female - Credit):**
```json
{
  "userType": "female",
  "userId": "674b8c9d1234567890fedcba",
  "operationType": "wallet",
  "action": "credit",
  "amount": 130,
  "message": "Earnings from call with Ravi for 65 seconds",
  "balanceAfter": 130,
  "createdAt": "2024-12-06T10:30:00.000Z"
}
```

---

## 🧪 Test Scenarios

### Scenario 1: Normal Call (65 seconds)
```json
{
  "receiverId": "female_user_id",
  "duration": 65,
  "callType": "video"
}
```
**Expected:** 130 coins deducted/credited (65 × 2)

---

### Scenario 2: Short Call (5 seconds)
```json
{
  "receiverId": "female_user_id",
  "duration": 5,
  "callType": "audio"
}
```
**Expected:** 10 coins deducted/credited (5 × 2)

---

### Scenario 3: Zero Duration Call
```json
{
  "receiverId": "female_user_id",
  "duration": 0,
  "callType": "video"
}
```
**Expected:** No charges, status: completed

---

### Scenario 4: Insufficient Balance
- Male user has 50 coins
- Call duration: 100 seconds
- Rate: 2 coins/second
- Required: 200 coins
**Expected:** Error with shortfall details

---

### Scenario 5: Different Female User Rates
**Test with:**
- Srija (2 coins/sec) - 60 sec = 120 coins
- Sruthi (4 coins/sec) - 60 sec = 240 coins
- Priya (1.5 coins/sec) - 60 sec = 90 coins

---

## 🔍 Postman Collection Examples

### Collection: Call System Testing

#### 1. Set Call Rate (Admin)
```
POST {{baseUrl}}/api/admin/users/set-call-rate
Headers: Authorization: Bearer {{adminToken}}
Body:
{
  "userId": "{{femaleUserId}}",
  "coinsPerSecond": 2
}
```

#### 2. End Call (Male User)
```
POST {{baseUrl}}/api/male/calls/end
Headers: Authorization: Bearer {{maleToken}}
Body:
{
  "receiverId": "{{femaleUserId}}",
  "duration": 65,
  "callType": "video"
}
```

#### 3. Get Call History (Male)
```
GET {{baseUrl}}/api/male/calls/history?limit=10
Headers: Authorization: Bearer {{maleToken}}
```

#### 4. Get Earnings (Female)
```
GET {{baseUrl}}/api/female/calls/earnings?limit=10
Headers: Authorization: Bearer {{femaleToken}}
```

---

## 📊 Expected Database Changes

### After Call Completion:

**CallHistory Collection:**
```javascript
{
  _id: ObjectId("..."),
  callerId: ObjectId("male_user_id"),
  receiverId: ObjectId("female_user_id"),
  duration: 65,
  coinsPerSecond: 2,
  totalCoins: 130,
  callType: "video",
  status: "completed",
  createdAt: ISODate("2024-12-06T10:30:00.000Z")
}
```

**Transaction Collection (2 records):**
1. Male User Debit
2. Female User Credit

**MaleUser Collection:**
```javascript
{
  coinBalance: 370 // (was 500)
}
```

**FemaleUser Collection:**
```javascript
{
  walletBalance: 130 // (was 0)
}
```

---

## ⚠️ Error Cases to Test

### 1. Missing receiverId
```json
{
  "duration": 65
}
```
**Expected:** 400 - "receiverId and duration are required"

---

### 2. Negative Duration
```json
{
  "receiverId": "female_user_id",
  "duration": -10
}
```
**Expected:** 400 - "Duration cannot be negative"

---

### 3. Invalid Female User ID
```json
{
  "receiverId": "invalid_id",
  "duration": 65
}
```
**Expected:** 404 - "Receiver not found"

---

### 4. Unauthorized Access
```
POST /api/male/calls/end
(No Authorization header)
```
**Expected:** 401 - Unauthorized

---

## 🎬 Complete Test Flow

1. **Setup:** Admin sets Srija's rate to 2 coins/sec
2. **Check:** Male user has 500 coins
3. **Call 1:** 65-second call → 130 coins (Success)
4. **Verify:** Male has 370 coins, Srija has 130 wallet
5. **Call 2:** 200-second call → 400 coins (Success)
6. **Verify:** Male has -30 coins (SHOULD FAIL - insufficient)
7. **Check History:** Both users see call records
8. **Check Stats:** View aggregated statistics
9. **Admin Change:** Set Srija to 3 coins/sec
10. **Call 3:** 50-second call → 150 coins with new rate

---

## 🚀 Quick Start Testing Script

```bash
# 1. Set call rate
curl -X POST http://localhost:3000/api/admin/users/set-call-rate \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"userId":"FEMALE_ID","coinsPerSecond":2}'

# 2. End call
curl -X POST http://localhost:3000/api/male/calls/end \
  -H "Authorization: Bearer MALE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"receiverId":"FEMALE_ID","duration":65,"callType":"video"}'

# 3. Check history
curl -X GET http://localhost:3000/api/male/calls/history \
  -H "Authorization: Bearer MALE_TOKEN"
```

---

## ✅ Success Criteria

- ✅ Admin can set per-second rate for each female user
- ✅ Call duration is accurately calculated from frontend
- ✅ Coins are correctly deducted from male user
- ✅ Coins are correctly credited to female user's wallet
- ✅ Call history is saved with all details
- ✅ Transactions are recorded for both users
- ✅ Insufficient balance is properly handled
- ✅ Statistics endpoints return accurate data
- ✅ Zero-duration calls don't charge
- ✅ Different rates work for different female users

---

## 📝 Notes

1. **Frontend Integration:** The frontend must send duration in **seconds**
2. **Rounding:** Coins are rounded UP (Math.ceil) to favor female users
3. **Wallet vs Coins:** 
   - Male users pay with **coinBalance**
   - Female users earn to **walletBalance** (for withdrawal)
4. **Call Types:** Currently supports 'audio' and 'video' (same rate)
5. **Rate Changes:** New rate applies to future calls, not historical ones

---

**Happy Testing! 🎉**
