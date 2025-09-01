export default function Footer(){
  return (
    <footer className="py-6 mt-12">
      <div className="container text-center text-slate-400">© 2025 CanvasCraft. All rights reserved.</div>
      {/* Add a built with ❤️ by Arhan Ansari */}
      <div className="container text-center text-slate-400 mt-2">
        Built with <span className="text-red-500">❤️</span> by <a href="https://arhanansari.vercel.app" className="underline hover:text-slate-200">Arhan Ansari</a>
      </div>
    </footer>
  );
}
