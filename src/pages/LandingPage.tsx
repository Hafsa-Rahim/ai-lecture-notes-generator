import { BookOpen } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <nav className="flex items-center justify-between px-10 py-6">
        {/* Left: Logo + Text */}
        <div className="flex items-center space-x-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">AI Lecture Notes Generator</span>
        </div>

        {/* Middle: Menu */}
        <div className="flex space-x-8">
          <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Home</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Features</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">About</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 font-medium">Contact Us</a>
        </div>

        {/* Right: Socials + Auth */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
            <a href="/signin" className="px-5 py-2 text-blue-600 font-semibold hover:text-blue-700">Sign In</a>
            <a href="/signup" className="px-5 py-2 text-white bg-blue-600 rounded-full font-semibold hover:bg-blue-700 transition">Sign Up</a>
          </div>
        </div>
      </nav>

      <header className="px-10 py-20 text-center">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6">Create Smart AI Lecture Notes in Seconds</h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Generate professional lecture notes, summaries, explanations, revision material, and study guides instantly with Artificial Intelligence.</p>
        <div className="flex justify-center space-x-4">
          <a href="/signup" className="px-8 py-3 text-white bg-blue-600 rounded-full text-lg hover:bg-blue-700">Get Started</a>
          <a href="#" className="px-8 py-3 text-blue-600 border border-blue-600 rounded-full text-lg hover:bg-blue-50">Learn More</a>
        </div>
      </header>
    </div>
  );
}
