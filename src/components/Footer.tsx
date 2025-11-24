export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-8 mt-20 relative z-10">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xl">🐾</span>
          <p className="text-sm font-bold text-indigo-400">Dog Breed Identifier</p>
        </div>
        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          Powered by advanced machine learning algorithms to identify over 120 dog breeds. 
          Upload a photo or search to get started.
        </p>
        <div className="mt-6 text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} • Built with Next.js & AI
        </div>
      </div>
    </footer>
  );
}
