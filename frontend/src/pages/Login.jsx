import { useSearchParams } from "react-router-dom";

export default function Login() {
  const [searchParams] = useSearchParams();
  const isVerified = searchParams.get("verified") === "true";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-md text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Sign In</h2>
        {isVerified && (
          <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 animate-pulse">
            Email verified successfully! You can now log in.
          </div>
        )}
        <p className="text-gray-600">Login Form is coming in Part 3.</p>
        <div className="text-sm">
          <a
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Need an account? Register here
          </a>
        </div>
      </div>
    </div>
  );
}
