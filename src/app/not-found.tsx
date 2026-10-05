import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#04120A] text-white flex flex-col items-center justify-center p-6 text-center">
      <h2 className="font-headline font-bold text-3xl text-emerald-400 mb-2">404 - Page Not Found</h2>
      <p className="text-sm text-emerald-300/80 mb-6 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-sm px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20"
      >
        Return to Home / Task
      </Link>
    </div>
  );
}
