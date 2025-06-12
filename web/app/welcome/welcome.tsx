import { Link, useFetcher, useOutletContext } from "react-router";
import splashDarkImg from "images/swiss-knife-learning-3d.png";
import placeHolderImg from "images/placeholder.svg";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Clock, SearchIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { useEffect, useState } from "react";

export function Welcome() {
  let fetcher = useFetcher();
  const { sidebarOpen } = useOutletContext() as {sidebarOpen: boolean};
  const resources = fetcher.data?.resources || [];

  const [topics, setTopics] = useState([]);

  // fetch topics on initial load
  useEffect(() => {
    const fetchTopics = async () => {
      const res = await fetch("http://localhost:3001/api/courses/topics", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch topics:", res.statusText);
        return;
      }
      const data = await res.json();
      setTopics(data);
    };
    fetchTopics();
  }, []);
  return (
    <>
      {/* <header className="flex justify-end px-6 py-4 pb-0">
        <Button>
          <Link
            to={{
              pathname: "/sign-in",
            }}
          >
            Create an account
          </Link>
        </Button>
      </header> */}
      <div className="flex flex-col xl:flex-row items-center gap-4 xl:pt-24 xl:justify-center">
        <img
          src={splashDarkImg}
          className={`${
        sidebarOpen
          ? "w-[250px] xl:w-[350px] 2xl:w-[400px]"
          : "w-[300px] xl:w-[400px] 2xl:w-[500px]"
          } pt-8 xl:pt-0 hidden dark:block`}
          alt="TanStack Logo"
        />
        <div className="flex flex-col items-center gap-6 text-center px-4 xl:text-left xl:items-start">
          <div className="flex gap-2 lg:gap-4 items-center">
        <h1
          className={`inline-block
        font-black 
        ${
          sidebarOpen
            ? "text-4xl md:text-5xl lg:text-7xl"
            : "text-5xl md:text-6xl lg:text-8xl"
        }
        `}
        >
          <span
            className={`
        inline-block text-black dark:text-white
        mb-2 uppercase [letter-spacing:-.04em] pr-1.5
        `}
          >
            <span className="text-[#77b4e1]">Elearn</span>
            <span className="text-[#fab538]">Kit</span>
          </span>
        </h1>
          </div>
        <h2 className={`font-bold ${
        sidebarOpen
          ? "text-xl md:text-3xl"
          : "text-2xl md:text-4xl"
        } md:max-w-2xl text-balance`}>
        Smart, personalized learning powered by{" "}
        <span className="underline decoration-dashed decoration-yellow-500 decoration-3 underline-offset-2">
          semantic technology.
        </span>
        </h2>
        <p className={`text opacity-90 ${
        sidebarOpen
          ? "text-base lg:text-md"
          : "text-lg lg:text-xl"
        } lg:max-w-2xl text-balance`}>
        AI-driven course recommendations, concept-based search, and
        prerequisite-aware guidance for a truly adaptive learning
        experience.
        </p>
        </div>
      </div>
      <div className="container mx-auto mt-8 flex flex-col items-center gap-4">
        <div className="w-full max-w-3xl">
          <fetcher.Form method="get" className="flex items-center gap-2" autoComplete="off">
            <Input
              className="h-12"
              name="q"
              startIcon={SearchIcon}
              placeholder="search for resources"
            />
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]  data-[size=default]:h-12">
                <SelectValue placeholder="Topics " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {topics.map((topic: any) => (
                  <SelectItem key={topic.uri} value={topic.uri}>
                    {topic.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </fetcher.Form>
        </div>
        <p className="text-muted-foreground text-sm text-center">
          Search for courses, concepts, or skills. Use{" "}
          <span className="font-bold">keywords</span> or{" "}
          <span className="font-bold">concepts</span> to find relevant content.
        </p>
        {fetcher.state === "loading" && (
          <p style={{ marginTop: "10px" }}>Loading...</p>
        )}
        {resources.length === 0 && fetcher.data?.q && (
          <p className="text-muted-foreground">
            No results found for "{fetcher.data.q}". Try a different search.
          </p>
        )}
        {/* <pre>{JSON.stringify(courses, null, 2)}</pre> */}
      </div>

      <div className="px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.length > 0 &&
            resources.map((resource: any) => (
              <Card
                key={resource.uri}
                className="overflow-hidden hover:shadow-lg transition-shadow py-0"
              >
                <div className="relative">
                  <img
                    src={placeHolderImg}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="bg-blue-500 text-white absolute top-2 right-4">
                    {resource.difficultyLevel || "N/A"}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">
                      {resource.title || "Course Title"}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {resource.description ||
                      "It provides an overview of the course content and objectives."}
                  </p>

                  <div className="flex items-center justify-between pb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Badge className="bg-blue-500 text-white mx-2">
                          {resource.type || "Course"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{resource.duration || "N/A"}</span>
                      </div>
                    </div>
                    <Button size="sm">View Now</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
}
