import { motion } from "framer-motion";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white text-center p-5">
      {/* Animated 404 Text with Neon Glow */}
      <motion.h1
        className="text-6xl font-bold text-blue-400 neon-glow"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        404 - Page Not Found
      </motion.h1>

      <p className="mt-4 text-lg text-gray-300 italic">Oops! Looks like you're lost...</p>

      {/* Rick Roll Video - Big & Centered with Animation */}
      <motion.div
        className="mt-10 flex justify-center items-center w-full"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <iframe
          width="960"
          height="540"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
          title="Rick Astley - Never Gonna Give You Up"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="rounded-lg shadow-lg shadow-blue-500/50 border-4 border-blue-400"
        ></iframe>
      </motion.div>

      {/* Back to Home Button */}
      <motion.a
        href="/"
        className="mt-10 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition duration-300"
        whileHover={{ scale: 1.1 }}
      >
        Take Me Home
      </motion.a>

      {/* Custom Neon Glow Effect */}
      <style>
        {`
          .neon-glow {
            text-shadow: 0 0 5px #00bfff, 0 0 10px #00bfff, 0 0 20px #00bfff;
          }
        `}
      </style>
    </div>
  );
}
