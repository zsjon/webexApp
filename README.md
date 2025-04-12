# 🚴‍♂️ Webex Embedded App Client

An embedded Webex app that helps manage PM (Personal Mobility) return confirmations and illegal parking notifications using Webex messaging APIs.

---

## 📌 Overview

This app streamlines communication between users and administrators when a PM is returned or parked illegally. The administrator receives notifications and images via Webex, and users are guided to take corrective action.

---

## 🧠 Logic Flow Diagram

<p align="center">
  <img src="https://github.com/user-attachments/assets/21a84532-412a-4d3d-8f57-c43f98aab7fc" width="250"/>
</p>

---

## 🔌 Webex API Used

- [📨 Create a Message API](https://developer.webex.com/docs/api/v1/messages/create-a-message)

---

## 🧭 Workflow

### 1️⃣ User Returns PM
<p align="center">
  <img src="https://github.com/user-attachments/assets/1ee4fae0-4e05-4a94-8948-3fda0e5d85a2" width="300"/>
</p>

### 1️⃣-1️⃣ Administrator Receives Return Notification
<p align="center">
  <img src="https://github.com/user-attachments/assets/be6119c2-2da4-4f81-931a-8eefca454046" width="550"/>
</p>

---

### 2️⃣ User Adjusts Illegally Parked PM
<p align="center">
  <img src="https://github.com/user-attachments/assets/a6a8bd52-6a9e-4a6d-a8e5-3ba0f2a51f2d" width="300"/>
</p>

### 2️⃣-1️⃣ Administrator Receives Image of Properly Parked PM
<p align="center">
  <img src="https://github.com/user-attachments/assets/7c86e422-3eb8-4cd2-9261-56a44ca393c8" width="500"/>
</p>

---

## ✅ Features

- Real-time messaging using Webex APIs  
- PM location verification and communication loop  
- Simple & intuitive visual feedback using images and messages

---

## 🛠️ Used Techniques

- React
- Node.js
- Webex API

