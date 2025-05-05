import { SignIn } from "@clerk/react-router";

export default function SignInPage() {
  return (
    <div className="h-screen flex items-center justify-center">
      <SignIn />
    </div>
  );
}
