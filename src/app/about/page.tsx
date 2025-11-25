import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Header />
      <main className="container mx-auto px-4 py-12 mt-20">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">DogID.ai</span>
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-8">
              A state-of-the-art dog breed identifier powered by advanced machine learning and modern web technologies.
            </p>
            
            {/* GitHub Link */}
            <Link 
              href="https://github.com" 
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              View on GitHub
            </Link>
          </div>

          <div className="space-y-16">
            {/* Project Overview */}
            <section className="animate-fade-in-up animation-delay-200">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3">
                <span className="text-4xl">🚀</span> Project Overview
              </h2>
              <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg mb-6">
                  DogID.ai is a comprehensive web application designed to help users identify over 120 different dog breeds from images. 
                  Whether you upload a photo or use your camera, our system provides instant predictions, detailed breed information, 
                  and interactive maps showing the breed&apos;s origin.
                </p>
                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                    <div className="text-3xl mb-3">🧠</div>
                    <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">AI Powered</h3>
                    <p className="text-sm text-indigo-700 dark:text-indigo-400">Utilizes a fine-tuned ConvNeXt model for high-accuracy classification.</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-800/50">
                    <div className="text-3xl mb-3">⚡</div>
                    <h3 className="font-bold text-purple-900 dark:text-purple-300 mb-2">Real-time</h3>
                    <p className="text-sm text-purple-700 dark:text-purple-400">Instant inference via a high-performance FastAPI backend on Google Colab GPUs.</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                    <div className="text-3xl mb-3">🌍</div>
                    <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Interactive</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">Explore breed origins with dynamic, interactive maps.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tech Stack */}
            <section className="animate-fade-in-up animation-delay-400">
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center gap-3">
                <span className="text-4xl">💻</span> Technology Stack
              </h2>
              
              <div className="space-y-8">
                {/* Frontend */}
                <TechSection title="Frontend" emoji="🎨">
                  <TechLink href="https://nextjs.org/" github="https://github.com/vercel/next.js" emoji="⚡" name="Next.js 15" desc="React framework for production" />
                  <TechLink href="https://www.typescriptlang.org/" github="https://github.com/microsoft/TypeScript" emoji="📘" name="TypeScript" desc="Static typing for JavaScript" />
                  <TechLink href="https://tailwindcss.com/" github="https://github.com/tailwindlabs/tailwindcss" emoji="🎨" name="Tailwind CSS 4" desc="Utility-first CSS framework" />
                  <TechLink href="https://react-icons.github.io/react-icons/" github="https://github.com/react-icons/react-icons" emoji="⚛️" name="React Icons" desc="Comprehensive icon library" />
                  <TechLink href="https://zustand-demo.pmnd.rs/" github="https://github.com/pmndrs/zustand" emoji="🐻" name="Zustand" desc="Global state management store" />
                  <TechLink href="https://axios-http.com/" github="https://github.com/axios/axios" emoji="📡" name="Axios" desc="Promise-based HTTP client" />
                  <TechLink href="https://leafletjs.com/" github="https://github.com/Leaflet/Leaflet" emoji="🗺️" name="Leaflet Maps" desc="Interactive maps library" />
                  <TechLink href="https://aws.amazon.com/sdk-for-javascript/" github="https://github.com/aws/aws-sdk-js-v3" emoji="📦" name="AWS SDK (Tebi)" desc="Cloud storage interface" />
                </TechSection>

                {/* Backend */}
                <TechSection title="Backend" emoji="⚙️">
                  <TechLink href="https://www.python.org/" github="https://github.com/python/cpython" emoji="🐍" name="Python 3.10+" desc="Core language for AI/ML" />
                  <TechLink href="https://fastapi.tiangolo.com/" github="https://github.com/fastapi/fastapi" emoji="⚡" name="FastAPI" desc="High-performance API framework" />
                  <TechLink href="https://www.uvicorn.org/" github="https://github.com/encode/uvicorn" emoji="🦄" name="Uvicorn" desc="Lightning-fast ASGI server" />
                  <TechLink href="https://colab.research.google.com/" emoji="📓" name="Google Colab" desc="GPU execution environment" />
                  <TechLink href="https://ngrok.com/" github="https://github.com/inconshreveable/ngrok" emoji="🚇" name="Ngrok" desc="Secure tunneling for localhost" />
                  <TechLink href="https://supabase.com/" github="https://github.com/supabase/supabase" emoji="🔥" name="Supabase" desc="Open source Firebase alternative" />
                  <TechLink href="https://python-pillow.org/" github="https://github.com/python-pillow/Pillow" emoji="🖼️" name="Pillow (PIL)" desc="Python Imaging Library" />
                  <TechLink href="https://github.com/Kludex/python-multipart" github="https://github.com/Kludex/python-multipart" emoji="📨" name="python-multipart" desc="Multipart form data parser" />
                  <TechLink href="https://redis.io/" github="https://github.com/redis/redis" emoji="⚡" name="Redis" desc="In-memory data structure store" />
                  <TechLink href="https://pypi.org/project/python-dotenv/" github="https://github.com/theskumar/python-dotenv" emoji="🔐" name="python-dotenv" desc="Environment variable management" />
                </TechSection>

                {/* Machine Learning */}
                <TechSection title="Machine Learning" emoji="🧠">
                  <TechLink href="https://www.tensorflow.org/" github="https://github.com/tensorflow/tensorflow" emoji="🧠" name="TensorFlow 2.x" desc="End-to-end ML platform" />
                  <TechLink href="https://keras.io/" github="https://github.com/keras-team/keras" emoji="🤖" name="Keras" desc="Deep learning API" />
                  <TechLink href="https://github.com/facebookresearch/ConvNeXt" github="https://github.com/facebookresearch/ConvNeXt" emoji="🕸️" name="ConvNeXt" desc="Modern ConvNet architecture" />
                  <TechLink href="https://numpy.org/" github="https://github.com/numpy/numpy" emoji="🔢" name="NumPy" desc="Scientific computing package" />
                  <TechLink href="https://matplotlib.org/" github="https://github.com/matplotlib/matplotlib" emoji="📊" name="Matplotlib" desc="Visualization library" />
                </TechSection>
              </div>
            </section>

            {/* Credits */}
            <section className="animate-fade-in-up animation-delay-600 pb-20">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-lg">
                <h2 className="text-3xl font-bold mb-4">Built with Passion</h2>
                <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
                  This project represents a convergence of modern web development and cutting-edge artificial intelligence, 
                  created to demonstrate the power of full-stack AI applications.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function TechSection({ title, emoji, children }: { title: string, emoji: string, children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900/50 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <span>{emoji}</span> {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}

function TechLink({ href, github, emoji, name, desc }: { href: string, github?: string, emoji: string, name: string, desc: string }) {
  return (
    <div className="group relative bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all hover:shadow-md">
      <div className="flex items-start justify-between mb-2">
        <div className="text-3xl">{emoji}</div>
        <div className="flex gap-2">
          {github && (
            <Link 
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="View Source on GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </Link>
          )}
          <Link 
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Visit Website"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        </div>
      </div>
      <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
        {name}
      </div>
      <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        {desc}
      </div>
    </div>
  );
}
