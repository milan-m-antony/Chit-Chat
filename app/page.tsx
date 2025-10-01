import Link from 'next/link';
import { MessageCircle, Users, Zap, Shield, Clock, Smartphone } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-blue-600">ChitChat</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            A modern, real-time chat application built with Next.js and Supabase.
            Connect with others instantly, share ideas, and have fun!
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition text-lg shadow-lg hover:shadow-xl"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold px-8 py-4 rounded-lg transition text-lg border-2 border-gray-200 dark:border-gray-700"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Real-time Messaging
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Instant message delivery powered by Supabase Realtime. See messages appear as they're sent.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="text-purple-600 dark:text-purple-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Reactions & Replies
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              React to messages with emojis and reply to specific messages for better conversations.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Multiple Rooms
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Join different chat rooms for various topics. General, Random, and Tech channels available.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <div className="bg-yellow-100 dark:bg-yellow-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Secure Authentication
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Your data is protected with Supabase Auth and Row Level Security policies.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <div className="bg-red-100 dark:bg-red-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Clock className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Auto-Delete Messages
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Messages automatically delete after 24 hours to keep the chat fresh and optimize storage.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <div className="bg-indigo-100 dark:bg-indigo-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Smartphone className="text-indigo-600 dark:text-indigo-400" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Fully Responsive
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Works perfectly on desktop, tablet, and mobile devices. Chat anywhere, anytime.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20 bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to start chatting?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Join ChitChat today and connect with others in real-time!
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-12 py-4 rounded-lg transition text-lg shadow-lg hover:shadow-xl"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
}
