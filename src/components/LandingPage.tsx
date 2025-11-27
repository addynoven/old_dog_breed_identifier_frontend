import { signIn } from "@/auth"
import Image from "next/image"
import Link from "next/link"
import { FaGithub, FaDog, FaSearch, FaBrain, FaMapMarkerAlt, FaChartLine, FaShieldAlt, FaGamepad, FaClinicMedical } from "react-icons/fa"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-50 px-6 py-6">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3 font-bold text-xl tracking-tight">
              <Image 
                src="/logo.png" 
                alt="DogID Logo" 
                width={40} 
                height={40} 
                className="w-10 h-10 object-contain"
              />
              <span>DogID<span className="text-indigo-400">.ai</span></span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/breeds" className="hover:text-white transition-colors">Breeds</Link>
              <Link href="/games" className="hover:text-white transition-colors">Games</Link>
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
            </div>

            <form
              action={async () => {
                "use server"
                await signIn("github", { redirectTo: "/dashboard" })
              }}
            >
              <button 
                type="submit"
                className="px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 rounded-full text-sm font-semibold transition-all"
              >
                Sign In
              </button>
            </form>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-32 pb-20 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                  AI-Powered • 120+ Breeds • Instant Results
                </div>
                
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                  <span className="block bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                    Discover
                  </span>
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mt-2">
                    Every Breed
                  </span>
                </h1>
                
                <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
                  Upload a photo and unlock instant breed identification powered by advanced neural networks. 
                  Explore origins, traits, and detailed breed information in seconds.
                </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/dashboard" className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]">
                      <FaSearch className="text-xl" />
                      <span>Start Identifying</span>
                      <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
                    </Link>
                    
                    <Link href="/games" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 hover:bg-slate-800 backdrop-blur-sm border border-slate-700 text-white rounded-full font-semibold text-lg transition-all duration-300">
                      <FaGamepad />
                      <span>Play Quiz</span>
                    </Link>
                  </div>

                {/* Stats */}
                <div className="flex gap-8 pt-8 border-t border-slate-800">
                  <div>
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">120+</div>
                    <div className="text-sm text-slate-500">Dog Breeds</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">99%</div>
                    <div className="text-sm text-slate-500">Accuracy</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">&lt;1s</div>
                    <div className="text-sm text-slate-500">Response Time</div>
                  </div>
                </div>
              </div>

              {/* Right Column - Live Scan Demo */}
              <div className="relative hidden lg:block perspective-1000">
                <div className="relative w-full h-[600px] bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700">
                  {/* Image Container */}
                  <div className="absolute inset-0">
                    <Image 
                      src="/hero-dog.png" 
                      alt="Golden Retriever"
                      fill
                      className="object-cover opacity-80"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                  </div>

                  {/* Scanning Line */}
                  <div className="absolute inset-x-0 h-1 bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,1)] z-20 animate-scan">
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-indigo-500/20 to-transparent" />
                  </div>

                  {/* HUD Elements */}
                  <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-30">
                    <div className="bg-slate-950/80 backdrop-blur-md border border-indigo-500/30 rounded-lg px-4 py-2 text-xs font-mono text-indigo-400">
                      SCANNING_MODE: ACTIVE
                    </div>
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse delay-75" />
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150" />
                    </div>
                  </div>

                  {/* Detection Box */}
                  <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border-2 border-indigo-500/50 rounded-lg z-20">
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-indigo-500" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-indigo-500" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-indigo-500" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-indigo-500" />
                  </div>

                  {/* Result Card */}
                  <div className="absolute bottom-8 left-8 right-8 bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 z-30 transform transition-all duration-500 hover:scale-105">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white">Golden Retriever</h3>
                        <p className="text-sm text-slate-400">Sporting Group</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-400">99.8%</div>
                        <p className="text-xs text-slate-500">CONFIDENCE</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Coat Density</span>
                        <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full w-[95%] bg-indigo-500 rounded-full" />
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Size Match</span>
                        <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full w-[88%] bg-purple-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -right-12 top-1/3 p-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl shadow-xl animate-float delay-1000 z-40">
                  <FaBrain className="text-indigo-400 text-2xl mb-2" />
                  <div className="text-xs font-mono text-slate-300">
                    Neural Net<br/>Processing...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                More Than Just Identification
              </span>
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Unlock a suite of powerful features designed for every dog lover
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: FaBrain,
                title: "Advanced AI",
                desc: "Powered by a fine-tuned ConvNeXt model for 99% accuracy across 120+ breeds.",
                gradient: "from-indigo-500 to-purple-500"
              },
              {
                icon: FaChartLine,
                title: "Smart History",
                desc: "Time travel through your past scans. Every dog you identify is saved to your personal timeline.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: FaClinicMedical,
                title: "Emergency Vet",
                desc: "Instant access to nearby emergency veterinary hospitals when you need help fast.",
                gradient: "from-red-500 to-rose-500"
              },
              {
                icon: FaMapMarkerAlt,
                title: "Origin Mapping",
                desc: "Explore the roots of your favorite breeds with interactive global maps.",
                gradient: "from-rose-500 to-orange-500"
              },
              {
                icon: FaGamepad,
                title: "DogID Arcade",
                desc: "Test your knowledge with our 'Who is this dog breed?' quiz game.",
                gradient: "from-orange-500 to-yellow-500"
              },
              {
                icon: FaSearch,
                title: "Instant Results",
                desc: "Lightning-fast processing delivers detailed breed information in under a second.",
                gradient: "from-yellow-500 to-green-500"
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group p-8 rounded-3xl bg-slate-900/30 backdrop-blur-sm border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:scale-105"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-200">{feature.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-6 py-24">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
                Ready to Identify Your Dog?
              </span>
            </h2>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Join dog lovers worldwide using AI-powered breed identification
            </p>
            <Link href="/dashboard" className="group relative inline-flex items-center gap-3 px-10 py-5 bg-white text-slate-950 rounded-full font-bold text-lg hover:bg-slate-100 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)]">
              <FaSearch className="text-2xl" />
              <span>Try It Now</span>
              <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/60 transition-all" />
            </Link>
            <p className="text-sm text-slate-500 mt-6">Free to use • No credit card required</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-12 border-t border-slate-800">
          <div className="text-center text-slate-500 text-sm">
            <p>© 2025 DogID.ai • Powered by Advanced Machine Learning</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
