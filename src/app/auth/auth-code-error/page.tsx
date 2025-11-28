import Link from 'next/link';

interface AuthCodeErrorPageProps {
  searchParams: Promise<{
    error?: string;
    error_description?: string;
  }>;
}

export default async function AuthCodeErrorPage({ searchParams }: AuthCodeErrorPageProps) {
  const params = await searchParams;
  const error = params.error;
  const errorDescription = params.error_description;

  // Provide user-friendly error messages
  const getErrorMessage = () => {
    if (errorDescription) {
      return errorDescription;
    }
    
    switch (error) {
      case 'access_denied':
        return 'Access was denied. Please try signing in again.';
      case 'code_exchange_failed':
        return 'Failed to complete the authentication. The link may have expired or already been used.';
      case 'no_code':
        return 'No authorization code was provided. Please try signing in again.';
      default:
        return 'There was a problem authenticating your account. This could be due to an expired or invalid link, or an issue with your authentication provider.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
          <svg
            className="h-6 w-6 text-red-600 dark:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Authentication Error</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {getErrorMessage()}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            Try again
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
