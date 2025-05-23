# 🔐 Secure File Share

Secure File Share is a web application built with **React**, **AWS Cognito**, and **Amazon S3** that enables authenticated users to upload files securely and share them using a secret key. Guest users can download shared files using a valid email and secret key.

---

## 🚀 Features

- 🔐 **User Authentication** via AWS Cognito (supports Google Sign-In)
- ☁️ **Upload Files** securely to Amazon S3
- 🔑 **Download Files** using shared secret key
- 👤 Role-based access:
  - Authenticated users: Upload & download
  - Guests: Download only
- 💬 Informative messages and upload feedback
- 🛡️ Secure identity-based access via Cognito Identity Pools

---

## 📸 Screenshots

| Authenticated Upload | Guest Download |
|----------------------|----------------|
| ![Upload Screenshot](./images/owner.png) | ![Download Screenshot](./images/guest.png) |

---

## 🧩 Tech Stack

- **Frontend**: React, JavaScript, CSS
- **Authentication**: AWS Cognito (User Pool + Identity Pool)
- **Storage**: Amazon S3
- **OIDC**: react-oidc-context

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (>= 16.x)
- AWS Account
- GitHub account
- Amazon S3 bucket
- Cognito User Pool and Identity Pool configured

### 1. Clone the Repository

```bash
git clone https://github.com/DeepikaSidda/SecureFileShare.git
cd SecureFileShare/sharemyfile

```
### 2. Install Dependencies

```bash
npm install
```
### 3. Environment Configuration

Create a `.env` file inside the `sharemyfile` directory with the following content:

```env
VITE_COGNITO_USER_POOL_ID=your_user_pool_id
VITE_COGNITO_USER_POOL_CLIENT_ID=your_user_pool_client_id
VITE_COGNITO_USER_POOL_DOMAIN=https://your-cognito-domain.auth.region.amazoncognito.com
VITE_COGNITO_IDENTITY_POOL_ID=your_identity_pool_id
VITE_REGION=your_aws_region
VITE_S3_BUCKET=your_s3_bucket_name
```
### 4. Run the App Locally 

```bash
npm run dev
```
Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Configuring Google as a Federated Identity Provider

To allow users to sign in using their Google accounts, you need to set up Google as an identity provider in your AWS Cognito User Pool. Here’s how to do it:

### Step 1: Create Google OAuth Client ID

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select or create a project.
3. Navigate to **APIs & Services > Credentials**.
4. Click **Create Credentials > OAuth client ID**.
5. Select **Web application** as the application type.
6. Under **Authorized JavaScript origins**, add your app domain (e.g., `http://localhost:5173` for local development).
7. Under **Authorized redirect URIs**, add your Cognito redirect URI, usually in this format:
`https://your-cognito-domain.auth.region.amazoncognito.com/oauth2/idpresponse`

9. Click **Create**.
10. Copy the **Client ID** (and **Client Secret** if needed).

### Step 2: Configure Google as an Identity Provider in AWS Cognito

1. Go to the [AWS Management Console](https://aws.amazon.com/console/).
2. Open the **Cognito** service.
3. Select your **User Pool**.
4. In the left navigation, **go to Authentication**.
5. Scroll to **Social identity providers** .
6. Select **Google**.
7. Enter the Google **Client ID** and **Client Secret** obtained earlier.
8. Save changes.

### Step 3: Update App Configuration

- Add the Google Client ID to your environment variables if your app requires it (depending on your implementation).

---

If you need help with any of these steps, feel free to ask!

## 🧠 Architecture Overview

### 🔐 AWS Cognito
- **User Pool**: Handles user authentication and registration.
- **Identity Pool**: Grants temporary AWS credentials to users.
- **Google Sign-In**: Configured as a federated identity provider.

### 📜 IAM Roles & Permissions
- **Authenticated Role**: Grants permissions to `PutObject` and `GetObject` in the S3 bucket.
- **Guest Role**: Grants read-only `GetObject` permission.

### 🪣 Amazon S3 Bucket

#### ✅ CORS Configuration

```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>http://localhost:5173</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>PUT</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
```
### 🔐 Bucket Policy

Make sure that the IAM roles created by Cognito have the necessary permissions to securely access the S3 objects.  
This usually includes allowing:

- `s3:GetObject` and `s3:PutObject` on the bucket for **authenticated users**  
- `s3:GetObject` for **guests**

### 📂 File Naming Convention

Uploaded files are stored using the following format:

```scss
base64(email) + secret + .extension
```
## 🙋‍♀️ Author

Built with 💙 by Deepika Sidda

