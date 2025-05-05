import { Outlet, redirect } from "react-router";
import { SignedIn, UserButton } from "@clerk/react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import type { Route } from "./+types/portal";

export async function loader(args: Route.LoaderArgs) {
  const { userId } = await getAuth(args);

  if (!userId) {
    return redirect("/sign-in?redirect_url=" + args.request.url);
  }

  return null
}

export default function PortalLayout() {
  return (
    <>
      <header className="flex items-center justify-between py-8 px-4">
        <h2 className="font-extrabold text-lg">
          ELearning <span className="text-purple-700">Wizard</span>
        </h2>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      This is Portal Layout
      <Outlet />
      
    </>
  );
}
