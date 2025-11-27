import Header from '../../components/Header';
import Footer from '../../components/Footer';
import BreedQuizGame from '../../components/games/BreedQuizGame';

export default function GamesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 mt-16">
        <div className="text-center mb-6 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Dog Lab <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Arcade</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-light">
            Test your knowledge and challenge yourself with our breed identification games.
          </p>
        </div>

        <div className="animate-fade-in-up animation-delay-200">
          <BreedQuizGame />
        </div>
      </main>

      <Footer />
    </div>
  );
}
