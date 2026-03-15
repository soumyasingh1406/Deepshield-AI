# DeepShield

DeepShield is a cybersecurity platform designed to detect potential digital media manipulation and securely preserve evidence for cases of online harassment, impersonation, or identity misuse.

Built during the **Code4Her Hackathon for International Women's Day**, the platform focuses on protecting digital identity and helping users maintain credible evidence when dealing with manipulated media.

---

## Problem

With the rise of AI-generated and digitally manipulated content, victims of online harassment often struggle to prove that media has been altered. There is a need for a system that can analyze suspicious media and securely preserve evidence that can later be verified.

---

## Solution

DeepShield provides a platform where users can upload suspicious media and store it securely while maintaining its integrity through cryptographic hashing.

The system generates a **SHA-256 hash** for every uploaded file, creating a unique digital fingerprint. If the file is modified later, the hash changes, allowing the system to detect tampering.

---

## Features

- **Digital Manipulation Risk Analysis** for uploaded media
- **Immutable Evidence Locker** for secure evidence storage
- **SHA-256 Hash Generation** to maintain evidence integrity
- **Evidence Integrity Verification**
- **Threat Intelligence Dashboard**
- **Media Spread Tracker** with live visualization
- **Emergency Support module** with cybercrime resources
- **Exportable Evidence Ledger (CSV)**

---

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Chart.js
- Tailwind CSS
- Crypto-JS

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- PostgreSQL

---

---

## How It Works

1. User uploads suspicious media.
2. System performs Digital Manipulation Risk Analysis.
3. A SHA-256 cryptographic hash is generated.
4. Evidence and metadata are stored in the Evidence Locker.
5. Users can verify evidence integrity by comparing hashes.
6. Evidence records can be exported as a report for cybercrime reporting.

---

## Future Scope

- Integration with real deepfake detection models
- Blockchain-based evidence storage
- Automated social media takedown requests
- Real-time monitoring of manipulated media

---

## Project Status

Prototype built during the **Code4Her Hackathon**.  
Future improvements and features are planned.

---

## Authors

Built by our team during the Code4Her Hackathon.
