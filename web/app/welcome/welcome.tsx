import { Link } from "react-router";
import splashDarkImg from "images/swiss-knife-learning-3d.png";
export function Welcome() {
  return (
    <main>
      <header className="flex justify-end px-6 py-4">
        <button className="py-1 px-3 bg-red-500 rounded text-white font-medium text-sm">
          <Link
            to={{
              pathname: "/sign-in",
            }}
          >
            Create an account
          </Link>
        </button>
      </header>
      <div className="flex flex-col xl:flex-row items-center gap-4 xl:pt-24 xl:justify-center">
        <img
          src={splashDarkImg}
          className="w-[300px] pt-8 xl:pt-0 xl:w-[400px] 2xl:w-[500px] hidden dark:block"
          alt="TanStack Logo"
        />
        <div className="flex flex-col items-center gap-6 text-center px-4 xl:text-left xl:items-start">
          <div className="flex gap-2 lg:gap-4 items-center">
            <h1
              className={`inline-block
            font-black text-5xl
            md:text-6xl
            lg:text-8xl`}
            >
              <span
                className={`
            inline-block text-black dark:text-white
            mb-2 uppercase [letter-spacing:-.04em] pr-1.5
            `}
              >
                ElearnKit
              </span>
            </h1>
          </div>
          <h2
            className="font-bold text-2xl max-w-md
            md:text-4xl md:max-w-2xl
            2xl:text-5xl lg:max-w-2xl text-balance"
          >
            Smart, personalized learning powered by{" "}
            <span className="underline decoration-dashed decoration-yellow-500 decoration-3 underline-offset-2">
              semantic technology.
            </span>
          </h2>
          <p
            className="text opacity-90 max-w-sm
            lg:text-xl lg:max-w-2xl text-balance"
          >
            AI-driven course recommendations, concept-based search, and
            prerequisite-aware guidance for a truly adaptive learning
            experience.
          </p>
        </div>
      </div>
    </main>
  );
}
