# Female User Authentication Flow Diagram

## Complete User Journey

```mermaid
graph TB
    Start([User Opens App]) --> HasAccount{Has Account?}
    
    HasAccount -->|No| Signup[Sign Up]
    HasAccount -->|Yes| Login[Login]
    
    Signup --> EnterDetails[Enter Email & Mobile]
    EnterDetails --> CheckDuplicate{User Exists?}
    
    CheckDuplicate -->|Yes| ShowLoginMsg[Show: User exists, please login]
    ShowLoginMsg --> Login
    
    CheckDuplicate -->|No| SendOTP1[Send OTP]
    SendOTP1 --> VerifyOTP1[Verify OTP]
    VerifyOTP1 --> SetVerified[Set isVerified=true, isActive=true, reviewStatus=completeProfile]
    SetVerified --> ProfileFlow
    
    Login --> SendOTP2[Send Login OTP]
    SendOTP2 --> VerifyOTP2[Verify Login OTP]
    VerifyOTP2 --> CheckStatus{Check reviewStatus}
    
    CheckStatus -->|completeProfile| ProfileFlow[Complete Profile Flow]
    CheckStatus -->|pending| UnderReview[Show Under Review Screen]
    CheckStatus -->|accepted| Dashboard[Show Dashboard]
    CheckStatus -->|rejected| Rejected[Show Rejection Screen]
    
    ProfileFlow --> UploadImages[Upload Images 1-5]
    UploadImages --> UploadVideo[Upload Video]
    UploadVideo --> FillProfile[Fill Profile Details]
    FillProfile --> SubmitProfile[Submit Profile]
    
    SubmitProfile --> ValidateMedia{Images & Video Uploaded?}
    ValidateMedia -->|No| ShowError[Show Error]
    ShowError --> ProfileFlow
    
    ValidateMedia -->|Yes| SetPending[Set profileCompleted=true, reviewStatus=pending]
    SetPending --> UnderReview
    
    UnderReview --> CanLogin1[User Can Login]
    CanLogin1 --> UnderReview
    
    UnderReview -.Admin Reviews.-> AdminReview{Admin Decision}
    
    AdminReview -->|Approve| SetAccepted[Set reviewStatus=accepted]
    AdminReview -->|Reject| SetRejected[Set reviewStatus=rejected]
    
    SetAccepted --> NotifyApproved[Notify User]
    SetRejected --> NotifyRejected[Notify User]
    
    NotifyApproved --> NextLogin1[User Logs In]
    NotifyRejected --> NextLogin2[User Logs In]
    
    NextLogin1 --> Dashboard
    NextLogin2 --> Rejected
    
    Dashboard --> FullAccess[Full Platform Access]
    Rejected --> ContactSupport[Contact Support]
    
    style Signup fill:#e1f5e1
    style Login fill:#e1f5e1
    style Dashboard fill:#c8e6c9
    style UnderReview fill:#fff9c4
    style Rejected fill:#ffcdd2
    style FullAccess fill:#4caf50,color:#fff
```

## State Transition Diagram

```mermaid
stateDiagram-v2
    [*] --> NotRegistered
    
    NotRegistered --> OTPSent: Sign Up
    OTPSent --> Verified: Verify OTP
    
    Verified --> CompleteProfile: isVerified=true, reviewStatus=completeProfile
    
    CompleteProfile --> Pending: Submit Profile with Images/Video
    
    Pending --> Accepted: Admin Approves
    Pending --> Rejected: Admin Rejects
    
    Accepted --> [*]: Full Access
    Rejected --> [*]: No Access
    
    note right of CompleteProfile
        User can:
        - Upload images
        - Upload video
        - Fill profile form
        - Login (redirects back)
    end note
    
    note right of Pending
        User can:
        - Login only
        - See "under review" message
        - Cannot access platform
    end note
    
    note right of Accepted
        User can:
        - Login
        - Access all features
        - Browse, chat, call, etc.
    end note
    
    note right of Rejected
        User can:
        - Login only
        - See rejection message
        - Contact support
    end note
```

## Access Control Flow

```mermaid
graph LR
    Request[API Request] --> HasToken{Has JWT Token?}
    
    HasToken -->|No| Return401[Return 401 Unauthorized]
    HasToken -->|Yes| ValidateToken{Valid Token?}
    
    ValidateToken -->|No| Return401
    ValidateToken -->|Yes| LoadUser[Load User]
    
    LoadUser --> IsProtected{Protected Route?}
    
    IsProtected -->|No| AllowAccess[Allow Access]
    IsProtected -->|Yes| CheckReviewStatus{Check reviewStatus}
    
    CheckReviewStatus -->|completeProfile| Return403Complete[Return 403: Complete Profile]
    CheckReviewStatus -->|pending| Return403Pending[Return 403: Under Review]
    CheckReviewStatus -->|rejected| Return403Rejected[Return 403: Rejected]
    CheckReviewStatus -->|accepted| AllowAccess
    
    Return403Complete --> ReturnRedirect1[redirectTo: COMPLETE_PROFILE]
    Return403Pending --> ReturnRedirect2[redirectTo: UNDER_REVIEW]
    Return403Rejected --> ReturnRedirect3[redirectTo: REJECTED]
    
    style AllowAccess fill:#4caf50,color:#fff
    style Return401 fill:#f44336,color:#fff
    style Return403Complete fill:#ff9800,color:#fff
    style Return403Pending fill:#ff9800,color:#fff
    style Return403Rejected fill:#ff9800,color:#fff
```

## Profile Completion Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Cloudinary
    participant MongoDB
    
    User->>Frontend: Complete Profile
    Frontend->>Backend: Upload Images (multipart)
    Backend->>Cloudinary: Store Images
    Cloudinary-->>Backend: Image URLs
    Backend->>MongoDB: Save Image References
    Backend-->>Frontend: Images Uploaded
    
    Frontend->>Backend: Upload Video (multipart)
    Backend->>Cloudinary: Store Video
    Cloudinary-->>Backend: Video URL
    Backend->>MongoDB: Save Video URL
    Backend-->>Frontend: Video Uploaded
    
    Frontend->>Backend: Submit Profile (JSON)
    Backend->>Backend: Validate: Images & Video Exist
    
    alt Validation Failed
        Backend-->>Frontend: 400 Error: Missing Media
    else Validation Passed
        Backend->>MongoDB: Update User
        Note over MongoDB: profileCompleted=true<br/>reviewStatus=pending
        Backend->>MongoDB: Award Referral Bonus
        Backend-->>Frontend: Success: redirectTo=UNDER_REVIEW
    end
    
    Frontend->>User: Show "Under Review" Screen
```

## Admin Review Workflow

```mermaid
sequenceDiagram
    participant Admin
    participant AdminPanel
    participant Backend
    participant MongoDB
    participant EmailService
    
    Admin->>AdminPanel: View Pending Users
    AdminPanel->>Backend: GET /admin/users?reviewStatus=pending
    Backend->>MongoDB: Find Pending Users
    MongoDB-->>Backend: User List
    Backend-->>AdminPanel: Display List
    
    Admin->>AdminPanel: Review User Profile
    AdminPanel->>Backend: GET /admin/users/:userId
    Backend->>MongoDB: Find User with Details
    MongoDB-->>Backend: User Data
    Backend-->>AdminPanel: Display Profile
    
    alt Approve
        Admin->>AdminPanel: Click Approve
        AdminPanel->>Backend: POST /admin/users/review-registration
        Note over Backend: userType=female<br/>reviewStatus=accepted
        Backend->>MongoDB: Update reviewStatus=accepted
        Backend->>EmailService: Send Approval Email
        Backend-->>AdminPanel: Success
    else Reject
        Admin->>AdminPanel: Click Reject
        AdminPanel->>Backend: POST /admin/users/review-registration
        Note over Backend: userType=female<br/>reviewStatus=rejected
        Backend->>MongoDB: Update reviewStatus=rejected
        Backend->>EmailService: Send Rejection Email
        Backend-->>AdminPanel: Success
    end
    
    AdminPanel->>Admin: Show Success Message
```

## Login Response Decision Tree

```mermaid
graph TD
    Login[User Logs In] --> VerifyOTP[Verify Login OTP]
    VerifyOTP --> CheckStatus{reviewStatus?}
    
    CheckStatus -->|completeProfile| Response1[Return: redirectTo=COMPLETE_PROFILE]
    CheckStatus -->|pending| Response2[Return: redirectTo=UNDER_REVIEW]
    CheckStatus -->|accepted| Response3[Return: redirectTo=DASHBOARD]
    CheckStatus -->|rejected| Response4[Return: redirectTo=REJECTED]
    
    Response1 --> Frontend1[Frontend: Navigate to Profile Form]
    Response2 --> Frontend2[Frontend: Navigate to Under Review Page]
    Response3 --> Frontend3[Frontend: Navigate to Dashboard]
    Response4 --> Frontend4[Frontend: Navigate to Rejection Page]
    
    Frontend1 --> UI1[Show: Upload Images/Video + Form]
    Frontend2 --> UI2[Show: Your profile is under review]
    Frontend3 --> UI3[Show: Full App Features]
    Frontend4 --> UI4[Show: Profile rejected + Support info]
    
    style Response3 fill:#4caf50,color:#fff
    style Response4 fill:#f44336,color:#fff
    style Response1 fill:#ff9800,color:#fff
    style Response2 fill:#ff9800,color:#fff
```

---

## Legend

- **Green** = Success / Allowed
- **Red** = Error / Blocked
- **Yellow/Orange** = Warning / Pending Action
- **Blue** = Information / Process
- **Dotted Line** = Async / Background Process
- **Solid Line** = Synchronous Flow

---

**Note:** These diagrams provide a visual representation of the complete authentication flow. Use them as reference when implementing the frontend or explaining the system to stakeholders.
