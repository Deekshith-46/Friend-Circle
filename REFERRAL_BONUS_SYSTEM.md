# Referral Bonus System

## Overview
The referral bonus system rewards users for inviting others to join the platform. When a new user signs up using a referral code, both the referrer and the new user receive a bonus, but the destination balance depends on user type:

- **Male users**: Bonuses go to `coinBalance` (spending coins)
- **Female users**: Bonuses go to `walletBalance` (withdrawable coins)

## Key Features
- Admin-configurable referral bonus amount
- Bonus destination based on user type
- Automatic validation to prevent duplicate bonuses
- Support for both male and female users

## Admin Configuration

### Referral Bonus Setting
- **Setting Name**: `referralBonus`
- **Default Value**: 100 coins
- **Location**: Stored in `AdminConfig` collection in MongoDB

### API Endpoints
Admins can manage the referral bonus amount using the following endpoints:

```
GET /admin/config/referral-bonus
```
Retrieve the current referral bonus configuration.

```
POST /admin/config/referral-bonus
{
  "bonus": 100
}
```
Create or update the referral bonus amount.

```
PUT /admin/config/referral-bonus
{
  "bonus": 150
}
```
Update the referral bonus amount (alternative to POST).

```
DELETE /admin/config/referral-bonus
```
Reset the referral bonus to the default value (100 coins).

### Request Headers
All requests require authentication:
```
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

### Response Format
Successful responses follow this format:
```json
{
  "success": true,
  "message": "Description of the action performed",
  "data": {
    "referralBonus": 100
  }
}
```

## Referral Flow Implementation

### 1. Male User Registration with Referral
When a male user registers with a referral code:

1. System validates the referral code
2. Links the new user to the referrer
3. Upon OTP verification and profile completion:
   - Both referrer and new user receive the configured bonus amount
   - Bonus is added to `coinBalance` (not `walletBalance`)
   - Transactions are recorded for both users

### 2. Female User Registration with Referral
When a female user registers with a referral code:

1. System validates the referral code
2. Links the new user to the referrer (can be male or agency)
3. Upon profile completion and admin approval:
   - Both referrer and new user receive the configured bonus amount
   - Bonus is added to `walletBalance` (not `coinBalance`)
   - Transactions are recorded for both users

## Wallet Balance vs Coin Balance

### Wallet Balance
- Stores withdrawable coins (real money)
- Used for withdrawals
- Receives referral bonuses (female users only)
- Earned from calls, gifts, and rewards (female users)

### Coin Balance
- Stores spending coins (virtual coins, non-withdrawable)
- Used for making calls and sending gifts
- Receives referral bonuses (male users only)
- Purchased by male users

## Transaction Recording

All referral bonuses are recorded as transactions with the following details:
- **Operation Type**: `coin` for male users, `wallet` for female users
- **Action**: `credit`
- **Message**: Descriptive message indicating referral bonus
- **Balance After**: Updated balance after bonus

## Security & Validation

1. **Duplicate Prevention**: The `referralBonusAwarded` flag ensures users receive the bonus only once
2. **Referral Code Validation**: System validates referral codes before linking users
3. **Admin Authentication**: Only authenticated admins can modify referral bonus settings
4. **Transaction Logging**: All bonus awards are logged for audit purposes