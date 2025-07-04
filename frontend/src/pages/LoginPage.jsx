import { useSignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  const { signIn } = useSignIn();

  const handleSignInRedirect = () => {
    window.location.href = "https://closing-shad-44.accounts.dev/sign-in?redirect_url=http://localhost:5173/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <button 
        onClick={handleSignInRedirect} 
        className="bg-blue-600 text-white px-6 py-3 rounded-md shadow-md hover:bg-blue-700 transition"
      >
        Sign In with Clerk
      </button>
    </div>
  );
};

export default LoginPage;
