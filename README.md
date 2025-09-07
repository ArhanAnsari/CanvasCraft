# 🌐 CanvasCraft  

A **real-time collaborative site builder** built with **Next.js 15, Tailwind CSS, Appwrite, TipTap, and ShadCN UI**.  
Easily **create, edit, collaborate, publish, and share** websites — all from one clean interface.  

---

## ✨ Features  

- 🎨 **Drag & Drop Blocks** – Build your site with modular blocks.  
- 📝 **Rich Text Editing** – Powered by TipTap (headings, bold, italic, links, etc).  
- 🎯 **Block Selection UI** – Keyboard navigation, copy, paste, duplicate, move with arrows.  
- 🎨 **Style Editing** – Change background colors, font sizes, spacing.  
- 📜 **Auto Scroll-to-Selected Block** – Keeps focus where you’re working.  
- 🌍 **Publish/Unpublish Sites** – Instantly publish to a live link.  
- 🤝 **Collaboration** – Share canvases with others in real time.  
- 📱 **Fully Responsive** – Works seamlessly on **desktop, tablet, and mobile**.  

---

## 🚀 Tech Stack  

- **Frontend**: [Next.js 15](https://nextjs.org/) + [React](https://react.dev/)  
- **UI**: [Tailwind CSS](https://tailwindcss.com/) + [ShadCN UI](https://ui.shadcn.com/) + [Framer Motion](https://www.framer.com/motion/)  
- **Editor**: [TipTap](https://tiptap.dev/) for rich-text editing  
- **Backend & Auth**: [Appwrite](https://appwrite.io/)  
- **Database**: Appwrite Databases (Documents + Relations)  
- **Icons**: [Lucide React](https://lucide.dev/)  

---

## 📂 Project Structure
. ├── app/                     # Next.js App Router │   
├── dashboard/   # Dashboard page │   ├── canvas/[id]/         # Canvas editor │   ├── api/                 # API routes (publish, share, etc.) │   └── ... ├── components/              # Reusable components │   ├── Navbar.tsx │   ├── Footer.tsx │   └── Editor/              # Block editor components ├── lib/                     # Appwrite client & hooks ├── public/                  # Static assets └── README.md

## ⚡ Getting Started  

### 1. Clone the repo  
```bash
git clone https://github.com/ArhanAnsari/canvas-craft.git
cd canvas-craft
```

2. Install dependencies

```bash
npm install
# or
yarn install
```
3. Setup environment variables

Create a .env.local file in the root:

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_db_id
NEXT_PUBLIC_APPWRITE_CANVASES_COLLECTION_ID=your_canvases_collection_id
```
4. Run the dev server

```bash
npm run dev
```

Your app will be live at http://localhost:3000 🚀


---

🌍 Deployment

You can deploy easily with Vercel:
```bash
vercel
```

Or any provider that supports Next.js 15.

Appwrite Sites is also best to deployment.


---

🛠️ Roadmap

[ ] Dark mode toggle 🌙

[ ] More block types (Gallery, Video, Forms, etc.)

[ ] Team workspaces

[ ] Templates marketplace



---

🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to open a PR or raise an issue.


---

📜 License

MIT License © 2025 Arhan Ansari


---

💡 Credits

Built with ❤️ by [Arhan Ansari](https://arhanansari.vercel.app/)
