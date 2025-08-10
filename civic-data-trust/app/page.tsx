// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen bg-neutral-900 flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Welcome to the Homepage
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          This is the main application page.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/data-center" // Link to a default dashboard page
            className="rounded-md bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/sign-in"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go to Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-sm font-semibold leading-6"
          >
            Go to Sign Up <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </main>
  );
}