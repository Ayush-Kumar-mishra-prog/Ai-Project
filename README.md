# 🚀 MirrorChat – AI Powered Chat Application

MirrorChat is a full-stack AI chat application that allows users to interact with intelligent AI models in real-time. It provides fast, context-aware conversations with a clean and modern UI.

---

## 🌟 Features

### 🤖 AI Chat

* Real-time AI conversations
* Fast and responsive replies
* Publish images in community
* Context-aware messaging
* Supports multiple AI models (GPT / Gemini)

### 🔐 Authentication System

* User registration & login
* JWT-based authentication
* Secure session handling

### 💬 Chat Experience

* Smooth UI/UX
* Auto-resizing input box (like ChatGPT)
* Message history support
* Clean chat interface

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* TypeScript

### Database

* MongoDB (Mongoose)

### AI Integration

* Google gemeni models
* imageKit for image generation

### Authentication

* JSON Web Tokens (JWT)

---

## 📸 Screenshots
<img width="1348" height="684" alt="image" src="https://github.com/user-attachments/assets/3a43359f-6e50-4aad-82ce-d04b92f215ce" />
<img width="1353" height="679" alt="image" src="https://github.com/user-attachments/assets/99cc1f0f-282a-4b48-982c-f1ce489cfcce" />
<img width="1354" height="677" alt="image" src="https://github.com/user-attachments/assets/32a5bed1-713c-43fb-a191-57e57ec240e3" />




---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Ayush-Kumar-mishra-prog/Ai-Project.git
cd Mirrorchat
```

---

### 2️⃣ Install dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

---

### 3️⃣ Environment Variables

Create a `.env` file in the **server** folder:

```env
PORT=your_port_number

ACCESS_TOKEN_SECRET ="your api key"
ACCESS_TOKEN_EXPIRY = "token_expiry date"
GEMINI_API_KEY="your api key"

# imagekit

IMAGEKIT_PUBLIC_KEY="your api key"
IMAGEKIT_PRIVATE_KEY="your api key"
IMAGEKIT_URL_ENDPOINT="your url endpoint"




# stripe

STRIPE_PUBLISHABLE_KEY = your api key
STRIPE_SECRET_KEY = your api key


STRIPE_WEBHOOK_SECRET = 
```

---

### 4️⃣ Run the project

#### Backend

```bash
npm run dev
```

#### Frontend

```bash
npm run dev
```

---

## 📡 API Endpoints

### 🔹 Auth

 POST '/api/user/login'
  POST '/api/user/register'


### 🔹 Chat

* `POST /api/chat`

---

## 🧠 How It Works

1. User logs in or registers
2. User sends a message
3. Backend sends request to AI model via OpenRouter
4. AI generates response
5. Response is returned and displayed in chat UI

---

## 🚀 Future Improvements

* 🧠 Memory-based chat (conversation history context)
* 🎙️ Voice input support
* 🌐 Multi-language support
* 📱 Mobile optimization
* ⚡ Streaming responses (real-time typing effect)

---

## 🧑‍💻 Author

**Ayush Kumar Mishra**

* GitHub: https://github.com/Ayush-Kumar-mishra-prog

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 🛠️ Contribute

---

## 📄 License

This project is licensed under the MIT License.