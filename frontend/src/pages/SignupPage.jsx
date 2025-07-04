import { SignUp, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";

const SignupPage = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    const assignRole = async () => {
      try {
        if (isLoaded && user && !user.privateMetadata?.role) {
          await user.update({
            privateMetadata: { role: "user" }, // Default role as "user"
          });
        }
      } catch (error) {
        console.error("Error assigning role:", error);
      }
    };

    assignRole();
  }, [user, isLoaded]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-lg">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              formFieldInput: "bg-gray-800 text-white border-gray-700 rounded-md",
              formButtonPrimary: "bg-green-600 hover:bg-green-700 text-white font-semibold",
              formButtonSecondary: "bg-gray-700 hover:bg-gray-600 text-white",
              card: "bg-gray-900 text-white",
              headerTitle: "text-lg font-bold text-white",
            },
          }}
        />
      </div>
    </div>
  );
};

export default SignupPage;
