import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";

export default function About() {
  return (
    <main className=" text-white font-sans flex flex-col flex-grow">
      <section className="flex flex-col items-center justify-center text-center px-6 py-32">
        <h1 className="text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-900 to-gray-400">
          Welcome to TypeRight
        </h1>
        <p className="text-xl max-w-2xl mb-12 text-zinc-300 flex flex-col gap-3">
          <p>
            TypeRight is your personalized typing coach. Unlike generic typing
            tests, TypeRight adapts to you. It analyzes your mistakes in
            real-time - whether it's swapping letters, hesitating on certain
            keys, or typing too fast for accuracy - and then creates custom
            typing challenges focused on your weak spots.
          </p>
          <p>No fluff. Just smarter practice.</p>
        </p>
        <div className="flex gap-6">
          <a href={"/login"}>
            <Button className="text-lg px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-800/40 transition-all duration-200 cursor-pointer">
              Login / Register
            </Button>
          </a>
          <a
            href="https://github.com/DebNayak05/typeright"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="cursor-pointer text-lg bg-transparent px-8 py-4 rounded-2xl text-zinc-300 transition-all duration-200"
            >
              <FaGithub className="mr-2" /> View on GitHub
            </Button>
          </a>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-10">About TypeRight!</h2>
          <ul className="grid sm:grid-cols-2 gap-10 text-left text-zinc-300 text-lg">
            <li className="bg-zinc-900 p-6 rounded-xl shadow-md shadow-zinc-950/30 transition-all duration-500 hover:scale-110">
              <h3 className="text-xl font-semibold text-white mb-2">
                Targeted Practice
              </h3>
              <p className="text-zinc-400">
                Type smarter, not harder. Every test analyzes your weak spots -
                then generates typing content focused on exactly those letters
                and patterns.
              </p>
            </li>
            <li className="bg-zinc-900 p-6 rounded-xl shadow-md shadow-zinc-950/30 transition-all duration-500 hover:scale-110">
              <h3 className="text-xl font-semibold text-white mb-2">
                Real-Time Feedback
              </h3>
              <p className="text-zinc-400">
                Instant stats on accuracy, WPM, and mistake patterns after every
                test. Know what’s holding you back — and how to fix it.
              </p>
            </li>
            <li className="bg-zinc-900 p-6 rounded-xl shadow-md shadow-zinc-950/30 transition-all duration-500 hover:scale-110">
              <h3 className="text-xl font-semibold text-white mb-2">
                Adaptive Learning Engine
              </h3>
              <p className="text-zinc-400">
                Our system evolves with you. The more you type, the better it
                understands where you struggle and what to reinforce next.
              </p>
            </li>
            <li className="bg-zinc-900 p-6 rounded-xl shadow-md shadow-zinc-950/30 transition-all duration-500 hover:scale-110">
              <h3 className="text-xl font-semibold text-white mb-2">
                Progress You Can Feel
              </h3>
              <p className="text-zinc-400">
                Watch your typing transform with each session. From hesitation
                to flow - see measurable improvement, fast.
              </p>
            </li>
          </ul>
        </div>
      </section>
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">
            Your Typing Journey Starts Here
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            With TypeRight, every keystroke is a step toward mastery. Ready to
            level up your typing?
          </p>
          <a href="/">
            <Button className="text-lg px-8 py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-700 shadow-lg transition-all duration-200">
              Start Typing!
            </Button>
          </a>
        </div>
      </section>
    </main>
  );
}
