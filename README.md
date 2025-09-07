### Project Overview
A smart virtual assistant web app built with React (using Vite) with backend support running separately in Docker.

---

### Frontend Instructions
#### To run frontend locally
1. Clone the repository
```
git clone https://github.com/harsha-2703/virtual-assistant-frontend.git
cd virtual-assistant-frontend
```

2. Install dependencies
```
npm install
```

3. Run the application
```
npm run dev
```

---

### Testing the Website
You can also test the frontend live:
[Virtual Assistant](https://smart-virtual-assistant.netlify.app/)

---

### Backend Instructions
#### To run backend locally
1. Pull the backend image from Docker Hub
```
docker pull rharsharaj/virtual-assistant-backend:latest
```

2. Run the backend container
```
docker run -it -p 8000:8000 -v ollama-models:/root/.ollama rharsharaj/virtual-assistant-backend:latest
```

---

### Note:
* Frontend live site: https://smart-virtual-assistant.netlify.app/
* Backend runs locally at: http://localhost:8000
