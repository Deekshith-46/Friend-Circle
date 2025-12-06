# Cleanup Orphaned Follow Requests

## Overview
This document explains how to clean up orphaned follow request records in the database. Orphaned records are follow requests with 'accepted' status that don't have corresponding following relationships in the database.

This situation can occur when:
1. Database records are manually deleted
2. There were bugs in previous versions of the code
3. Database inconsistencies occurred due to system errors

## Running the Cleanup Script

### Prerequisites
- Node.js installed
- Database connection configured in `.env` file
- Application dependencies installed (`npm install`)

### Execution
Run the cleanup script using Node.js:

```bash
node cleanup_orphaned_follow_requests.js
```

### What the Script Does
1. Connects to the MongoDB database
2. Finds all follow request records with 'accepted' status
3. For each record, checks if the corresponding following relationship exists
4. Deletes any follow request records that don't have actual relationships
5. Reports the number of cleaned up records
6. Closes the database connection

### Expected Output
```
Connected to database
Found X accepted follow requests
Deleted orphaned follow request: [request_id]
...
Cleaned up Y orphaned follow request records
Cleanup completed successfully
Database connection closed
```

## Manual Cleanup (Alternative Method)

If you prefer to manually clean up the database, you can use MongoDB commands:

### Check for orphaned records:
```javascript
// Find accepted follow requests
db.followrequests.find({ status: "accepted" })

// Check if corresponding relationships exist
db.malefollowings.find({ maleUserId: "[male_user_id]", femaleUserId: "[female_user_id]" })
```

### Delete orphaned records:
```javascript
// Delete specific orphaned record
db.followrequests.deleteOne({ _id: ObjectId("[orphaned_request_id]") })

// Or delete all with a specific condition
db.followrequests.deleteMany({ status: "accepted", /* additional conditions */ })
```

## Prevention
The updated code now includes safeguards to prevent orphaned records:
1. When sending follow requests, the system verifies actual relationships exist
2. When unfollowing, related follow request records are automatically cleaned up
3. When accepting follow requests, orphaned records are cleaned up automatically