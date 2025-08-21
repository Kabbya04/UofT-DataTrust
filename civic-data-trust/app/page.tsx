'use client'; // <-- Add this to make it a client component

import { useState } from 'react';
import Link from 'next/link';
import RoleSelectorDialog from './components/RoleSelectorDialog'; // <-- Import the new component

export default function HomePage() {
  const [isRoleSelectorOpen, setIsRoleSelectorOpen] = useState(false);

  return (
    <>
      <main className="flex min-h-screen bg-neutral-900 flex-col items-center justify-center p-24 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Welcome to the Civic Data Trust
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            A platform for secure and collaborative data sharing.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <button // <-- Changed from Link to button
              onClick={() => setIsRoleSelectorOpen(true)} // <-- Open the dialog
              className="rounded-md bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              Go to Dashboard
            </button>
            <Link
              href="/sign-in"
              className="text-sm font-semibold leading-6"
            >
              Sign In <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Place the dialog component here */}
      <RoleSelectorDialog
        isOpen={isRoleSelectorOpen}
        onOpenChange={setIsRoleSelectorOpen}
      />
    </>
  );
}