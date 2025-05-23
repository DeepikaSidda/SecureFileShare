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
- 🌈 Responsive, colorful UI using custom CSS

---

## 📸 Screenshots

| Authenticated Upload | Guest Download |
|----------------------|----------------|
| ![Upload Screenshot](./screenshots/upload.png) | ![Download Screenshot](./screenshots/download.png) |

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
cd SecureFileShare/sharemyfile '''
