# Withdrawal API Testing Guide

This document provides comprehensive step-by-step instructions for testing the enhanced withdrawal system with payout method selection by ID.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Test Environment Setup](#test-environment-setup)
3. [Step-by-Step Testing Guide](#step-by-step-testing-guide)
4. [API Endpoints](#api-endpoints)
5. [Test Scenarios](#test-scenarios)
6. [Expected Responses](#expected-responses)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before testing the withdrawal APIs, ensure you have:

- Running backend server
- Female user account with verified KYC (both bank and UPI)
- Valid authentication token for the test user
- Sufficient wallet balance for withdrawal testing
- Admin account for approval/rejection testing

## Test Environment Setup

1. **Start the server**:
   ```bash
   npm start
   # or
   npm run dev
   ```

2. **Verify server status**:
   - Check server logs for successful startup
   - Verify database connection
   - Ensure all required configurations are set (min withdrawal amount, coin-to-rupee rate)

3. **Prepare test data**:
   - Create a female user account
   - Complete KYC verification with both bank and UPI details
   - Add sufficient balance to wallet for testing

## API Endpoints

### 1. Get Available Payout Methods
- **Endpoint**: `GET /female-user/withdrawals/payout-methods`
- **Authorization**: Required (Bearer token)
- **Purpose**: Retrieve verified payout methods for the user

### 2. Create Withdrawal Request
- **Endpoint**: `POST /female-user/withdrawals`
- **Authorization**: Required (Bearer token)
- **Purpose**: Create a withdrawal request using a specific payout method ID

### 3. List User Withdrawal Requests
- **Endpoint**: `GET /female-user/withdrawals`
- **Authorization**: Required (Bearer token)
- **Purpose**: Get all withdrawal requests for the user

## Step-by-Step Testing Guide

### Step 1: Verify KYC Status

1. **Check that the test user has verified KYC**:
   - Log in as the test female user
   - Verify KYC status is 'accepted' for at least one payout method
   - Ensure both bank and UPI details are verified if testing both

2. **Example verification**:
   ```bash
   GET /female-user/profile
   Authorization: Bearer <user_token>
   ```

### Step 2: Test Get Available Payout Methods

1. **Make the API request**:
   ```bash
   GET /female-user/withdrawals/payout-methods
   Authorization: Bearer <user_token>
   ```

2. **Verify the response structure**:
   ```json
   {
     "success": true,
     "data": {
       "bank": {
         "id": "6954d312eb163b2d78ebd94c",
         "accountNumber": "123456789012",
         "ifsc": "IFSC0000",
         "status": "accepted"
       },
       "upi": {
         "id": "6954d38aeb163b2d78ebd9aa",
         "upiId": "user@ybl",
         "status": "accepted"
       }
     }
   }
   ```

3. **Test scenarios**:
   - User with both bank and UPI verified
   - User with only bank verified
   - User with only UPI verified
   - User with no verified methods
   - User with rejected methods

### Step 3: Test Withdrawal Creation

1. **Prepare withdrawal request**:
   - Select a verified payout method ID from Step 2
   - Ensure sufficient wallet balance
   - Know the minimum withdrawal amount

2. **Make the API request for bank withdrawal**:
   ```bash
   POST /female-user/withdrawals
   Content-Type: application/json
   Authorization: Bearer <user_token>
   
   {
     "coins": 500,
     "payoutMethod": "bank",
     "payoutMethodId": "6954d312eb163b2d78ebd94c"
   }
   ```

3. **Make the API request for UPI withdrawal**:
   ```bash
   POST /female-user/withdrawals
   Content-Type: application/json
   Authorization: Bearer <user_token>
   
   {
     "coins": 300,
     "payoutMethod": "upi",
     "payoutMethodId": "6954d38aeb163b2d78ebd9aa"
   }
   ```

4. **Verify response structure**:
   ```json
   {
     "success": true,
     "message": "Withdrawal request created successfully",
     "data": {
       "_id": "withdrawal_request_id",
       "userType": "female",
       "userId": "user_id",
       "coinsRequested": 500,
       "amountInRupees": 100,
       "payoutMethod": "bank",
       "status": "pending",
       "createdAt": "2023-01-01T00:00:00.000Z"
     },
     "countdownTimer": 86400
   }
   ```

### Step 4: Verify Transaction Recording

1. **Check that coins were deducted from wallet**:
   ```bash
   GET /female-user/profile
   Authorization: Bearer <user_token>
   ```

2. **Verify transaction was created**:
   - Check transaction history for debit entry
   - Confirm amount matches withdrawal request

### Step 5: Test Error Scenarios

1. **Test with invalid payoutMethodId**:
   ```bash
   POST /female-user/withdrawals
   Content-Type: application/json
   Authorization: Bearer <user_token>
   
   {
     "coins": 500,
     "payoutMethod": "bank",
     "payoutMethodId": "invalid_id"
   }
   ```

2. **Test without payoutMethodId**:
   ```bash
   POST /female-user/withdrawals
   Content-Type: application/json
   Authorization: Bearer <user_token>
   
   {
     "coins": 500,
     "payoutMethod": "bank"
   }
   ```

3. **Test with insufficient balance**:
   ```bash
   POST /female-user/withdrawals
   Content-Type: application/json
   Authorization: Bearer <user_token>
   
   {
     "coins": 999999,
     "payoutMethod": "bank",
     "payoutMethodId": "valid_bank_id"
   }
   ```

4. **Test with below minimum amount**:
   ```bash
   POST /female-user/withdrawals
   Content-Type: application/json
   Authorization: Bearer <user_token>
   
   {
     "coins": 50,
     "payoutMethod": "bank",
     "payoutMethodId": "valid_bank_id"
   }
   ```

### Step 6: Test Admin Approval/Rejection

1. **Admin list pending withdrawals**:
   ```bash
   GET /admin/withdrawals?status=pending
   Authorization: Bearer <admin_token>
   ```

2. **Admin approve withdrawal**:
   ```bash
   POST /admin/withdrawals/{withdrawalId}/approve
   Authorization: Bearer <admin_token>
   ```

3. **Admin reject withdrawal**:
   ```bash
   POST /admin/withdrawals/{withdrawalId}/reject
   Content-Type: application/json
   Authorization: Bearer <admin_token>
   
   {
     "reason": "Invalid bank details"
   }
   ```

## Test Scenarios

### Happy Path Scenarios
1. **Valid bank withdrawal**: User selects verified bank method and withdraws successfully
2. **Valid UPI withdrawal**: User selects verified UPI method and withdraws successfully
3. **Multiple payout methods**: User with both bank and UPI can choose either
4. **Minimum withdrawal**: User withdraws exactly the minimum amount
5. **Large withdrawal**: User withdraws a large amount with sufficient balance

### Error Scenarios
1. **No payoutMethodId**: Request fails with appropriate error message
2. **Invalid payoutMethodId**: Request fails when ID doesn't match verified methods
3. **Rejected KYC**: Request fails for rejected payout methods
4. **Insufficient balance**: Request fails when wallet balance is too low
5. **Below minimum**: Request fails when amount is below configured minimum
6. **Invalid payout method**: Request fails with invalid method type
7. **No KYC**: Request fails when user has no verified KYC

### Edge Cases
1. **Coin to rupee conversion**: Verify accurate conversion calculations
2. **Full data display**: Verify account numbers and UPI IDs are returned in full
3. **Concurrent requests**: Test multiple simultaneous withdrawal requests
4. **Expired KYC**: Test behavior when KYC status changes after payout method selection

## Expected Responses

### Success Responses

**Get Payout Methods (Success)**:
```json
{
  "success": true,
  "data": {
    "bank": {
      "id": "ObjectId",
      "accountNumber": "XXXXXX9012",
      "ifsc": "IFSC_CODE",
      "status": "accepted"
    },
    "upi": {
      "id": "ObjectId",
      "upiId": "u***i@provider",
      "status": "accepted"
    }
  }
}
```

**Create Withdrawal (Success)**:
```json
{
  "success": true,
  "message": "Withdrawal request created successfully",
  "data": {
    "_id": "withdrawal_id",
    "userType": "female",
    "userId": "user_id",
    "coinsRequested": 500,
    "amountInRupees": 100,
    "payoutMethod": "bank",
    "status": "pending",
    "createdAt": "timestamp"
  },
  "countdownTimer": 86400
}
```

### Error Responses

**Missing payoutMethodId**:
```json
{
  "success": false,
  "message": "payoutMethodId is required for female users"
}
```

**Invalid payoutMethodId**:
```json
{
  "success": false,
  "message": "Bank details not verified or invalid method ID"
}
```

**Insufficient Balance**:
```json
{
  "success": false,
  "message": "Insufficient wallet balance",
  "data": {
    "available": 200,
    "required": 500,
    "shortfall": 300
  }
}
```

## Troubleshooting

### Common Issues and Solutions

1. **"payoutMethodId is required" error**
   - **Cause**: Missing payoutMethodId in request
   - **Solution**: Include the correct payout method ID from the payout methods API

2. **"Bank/UPI details not verified" error**
   - **Cause**: Payout method ID doesn't match verified KYC or status is not 'accepted'
   - **Solution**: Verify the correct ID is used and KYC status is 'accepted'

3. **"Insufficient balance" error**
   - **Cause**: Wallet balance is lower than requested amount
   - **Solution**: Check wallet balance and request appropriate amount

4. **"Below minimum withdrawal" error**
   - **Cause**: Requested amount is less than configured minimum
   - **Solution**: Request amount equal to or greater than minimum withdrawal amount

### Debugging Tips

1. **Check server logs** for detailed error information
2. **Verify user KYC status** in the database
3. **Confirm admin configuration** values are set (min withdrawal, conversion rate)
4. **Validate authentication tokens** are valid and not expired
5. **Check database transactions** to verify proper recording of operations

### Testing Checklist

- [ ] Get payout methods API returns correctly formatted response
- [ ] Sensitive data is properly masked in responses
- [ ] Withdrawal creation works with valid bank method ID
- [ ] Withdrawal creation works with valid UPI method ID
- [ ] Appropriate error returned for missing payoutMethodId
- [ ] Appropriate error returned for invalid payoutMethodId
- [ ] Coins are properly deducted from user wallet
- [ ] Transaction records are created for withdrawals
- [ ] Withdrawal requests are stored in database
- [ ] Admin approval/rejection works correctly
- [ ] Rejected withdrawals refund coins to user
- [ ] Minimum withdrawal amount validation works
- [ ] Insufficient balance validation works
- [ ] Edge cases are handled appropriately

## Postman Collection Example

Create a Postman collection with the following requests:

### Environment Variables
- `BASE_URL`: Your API base URL
- `FEMALE_USER_TOKEN`: Valid female user token
- `ADMIN_TOKEN`: Valid admin token
- `BANK_METHOD_ID`: Valid bank method ID from payout methods API
- `UPI_METHOD_ID`: Valid UPI method ID from payout methods API

### Requests

1. **Get Payout Methods**
   - Method: GET
   - URL: `{{BASE_URL}}/female-user/withdrawals/payout-methods`
   - Header: `Authorization: Bearer {{FEMALE_USER_TOKEN}}`

2. **Create Bank Withdrawal**
   - Method: POST
   - URL: `{{BASE_URL}}/female-user/withdrawals`
   - Headers: 
     - `Authorization: Bearer {{FEMALE_USER_TOKEN}}`
     - `Content-Type: application/json`
   - Body: `{"coins": 500, "payoutMethod": "bank", "payoutMethodId": "{{BANK_METHOD_ID}}"}`

3. **Create UPI Withdrawal**
   - Method: POST
   - URL: `{{BASE_URL}}/female-user/withdrawals`
   - Headers:
     - `Authorization: Bearer {{FEMALE_USER_TOKEN}}`
     - `Content-Type: application/json`
   - Body: `{"coins": 300, "payoutMethod": "upi", "payoutMethodId": "{{UPI_METHOD_ID}}"}`

4. **List Withdrawal Requests**
   - Method: GET
   - URL: `{{BASE_URL}}/female-user/withdrawals`
   - Header: `Authorization: Bearer {{FEMALE_USER_TOKEN}}`

This testing guide provides comprehensive coverage of the new withdrawal system functionality, ensuring all aspects of the payout method selection by ID feature are properly tested.