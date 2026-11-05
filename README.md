# FileServer

A secure, private, and high-performance Java file server featuring full SSL/TLS encryption, PostgreSQL socket connectivity, **intelligent file deduplication**, account creation via email/passcode, and a multi-page vanilla HTML/CSS/JavaScript frontend.

## Description
FileServer is a self-hosted, encrypted platform designed for secure file management across multiple devices (Windows, iOS, Android, etc.). It features full end-to-end SSL/TLS hardening, database persistence via PostgreSQL, a lightweight multi-page web frontend, automated certificate generation, and **smart storage deduplication** that automatically detects identical files uploaded by different users and keeps only a single physical copy on the hard disk to optimize storage.

## Features
- **Smart Storage Deduplication:** Automatically identifies duplicate files across users, saving disk space by storing only a single physical instance while maintaining isolated references.
- **Fully SSL/TLS Proofed:** Secure communication channels backed by automated OpenSSL certificate generation.
- **PostgreSQL Socket Connection:** Robust database integration for user accounts, file metadata, and references.
- **Account Creation & Passcode Auth:** Quick registration using just an email address and a secure passcode.
- **Cross-Device Compatibility:** Responsive multi-page vanilla HTML, CSS, and JavaScript frontend accessible from Windows, iOS, Android, and more.
- **Fast, Secure & Private:** Zero-bloat design keeping your files entirely under your control.

## Prerequisites
- **Java 25** (required to compile and run the server)
- **Maven** (via the bundled wrapper `mvnw`)
- **OpenSSL** (required for running the SSL certificate generation script)
- **PostgreSQL** (running and available via socket connection)

## Download & Installation
1. Clone the repository:
   ```bash
   git clone [https://github.com/alanifotis/FileServer.git](https://github.com/alanifotis/FileServer.git)
   cd FileServer
```

## How to Run
### Step 1: Generate SSL Certificates
Run the included Bash script on Linux or WSL to generate your local Certificate Authority (CA) and PKCS#12 server keystore (server.p12) required for Spring Boot SSL configuration:

```bash
cd src/main/resources/ssl/ 
./generate-certs.sh
```

### Step 2: Start the Java Server
Build and run the Spring Boot application using the Maven wrapper configured for Java 25:
```bash
./mvnw spring-boot:run
```
### Step 3: Trust The SSL Certificate
Trust the generated Authority certificate located in src/main/resources/certs on the devices that will be connecting to the server.

### Step 4: Register & Enjoy
Register using an email and a passcode, and enjoy your storage-optimized, highly secure personal File Server!