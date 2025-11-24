import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Link from "next/link";
import Image from "next/image";
export default function About() {
	return (
		<div className="min-h-screen flex flex-col bg-slate-50">
			<Header />
			<main className="flex-1 container mx-auto px-4 py-12 max-w-4xl mt-10">
				<div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
					<h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 text-center">
						About <span className="text-indigo-600">DogID.ai</span>
					</h1>

					<div className="space-y-8 text-lg text-slate-600 leading-relaxed">
						<p>
							Welcome to <strong className="text-slate-800">DogID.ai</strong>,
							your intelligent companion for identifying dog breeds. Our mission
							is to help dog lovers, owners, and enthusiasts instantly recognize
							and learn about different dog breeds using state-of-the-art
							artificial intelligence.
						</p>

						<div>
							<h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
								<span>🤖</span> How It Works
							</h2>
							<p>
								We utilize advanced deep learning models trained on the Stanford
								Dogs Dataset, which contains over 20,000 images across 120
								distinct dog breeds. When you upload a photo, our neural network
								analyzes unique features—such as ear shape, snout length, and
								coat pattern—to determine the breed with high accuracy.
							</p>
						</div>

						<div>
							<h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
								<span>🌍</span> Discover Origins
							</h2>
							<p>
								Beyond just identification, we provide rich context about each
								breed&apos;s history. Our interactive map feature highlights the
								country of origin for every breed, helping you understand the
								geographical heritage of your furry friend.
							</p>
						</div>

						<div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
							<h3 className="text-xl font-bold text-indigo-900 mb-2">
								Tech Stack
							</h3>
							<ul className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-medium text-indigo-700">
								<Link
									href="https://nextjs.org/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<li className="flex items-center gap-2"> ⚡ Next.js</li>
								</Link>
								<Link
									href="https://tailwindcss.com/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<li className="flex items-center gap-2">🎨 Tailwind CSS</li>
								</Link>
								<Link
									href="https://zustand-demo.pmnd.rs/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<li className="flex items-center gap-2">
										<Image
											src="/zustand.svg"
											alt="zustand logo"
											width={20}
											height={20}
										/>{" "}
										zustand
									</li>
								</Link>
								<Link
									href="https://www.tensorflow.org/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<li className="flex items-center gap-2">🧠 TensorFlow</li>
								</Link>
								<Link
									href="https://fastapi.tiangolo.com/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<li className="flex items-center gap-2">🐍 FastAPI</li>
								</Link>
								<Link
									href="https://leafletjs.com/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<li className="flex items-center gap-2">🗺️ Leaflet Maps</li>
								</Link>
								<Link
									href="https://redis.io/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<li className="flex items-center gap-2">
										<Image
											src="/redis.svg"
											alt="redis logo"
											width={20}
											height={20}
										/>
										redis
									</li>
								</Link>
								<Link
									href="https://tebi.io/"
									target="_blank"
									rel="noopener noreferrer"
								>
									<li className="flex items-center gap-2">☁️ Tebi Storage</li>
								</Link>
							</ul>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
