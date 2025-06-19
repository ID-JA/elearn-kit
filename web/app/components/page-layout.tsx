import { ChevronRight, X } from "lucide-react";

import Confetti from "react-confetti-boom";

import { cn } from "~/lib/utils";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import MultiSelect from "./multi-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export default function PageLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      // Auto-close sidebar on mobile
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };

    // Initial check
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="relative min-h-screen flex overflow-hidden">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-[550px] transform transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={cn(
          "fixed z-30 flex items-center justify-center bg-primary text-primary-foreground rounded-r-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          "h-12 w-6 left-0 top-1/2 -translate-y-1/2",
          sidebarOpen && "left-[550px]"
        )}
        aria-expanded={sidebarOpen}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <ChevronRight
          className={cn(
            "h-4 w-4 transition-transform duration-300",
            sidebarOpen && "rotate-180"
          )}
        />
      </button>

      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          sidebarOpen ? "md:ml-[550px]" : "ml-0"
        )}
      >
        <div className="container mx-auto p-4 md:p-6">
          <Outlet context={{ sidebarOpen }} />
        </div>
      </main>
    </div>
  );
}

function Sidebar({ onClose }) {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedKnowledge, setSelectedKnowledge] = useState<any[]>([]);
  const [showProgress, setShowProgress] = useState(false);
  const [result, setResult] = useState<KnowledgeCheckResult>({
    isEligible: false,
    missingConcepts: [],
    totalRequired: 0,
    totalMastered: 0,
    matchedCount: 0,
    masteredConcepts: [],
    confidence: 0,
  });
  useEffect(() => {
    const fetchCourses = async () => {
      const res = await fetch("http://localhost:3001/api/courses/all", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch courses:", res.statusText);
        return;
      }
      const data = await res.json();
      setCourses(data);
      console.log("Fetched courses:", data);
    };
    fetchCourses();
  }, []);

  const handleSelectItem = (uri: string) => {
    const course = courses.find((course) => course.uri === uri);
    if (course) {
      setSelectedCourse(course);
    }
    // reset the result
    setShowProgress(false);
    setResult({
      isEligible: false,
      missingConcepts: [],
      totalRequired: 0,
      totalMastered: 0,
      matchedCount: 0,
      masteredConcepts: [],
      confidence: 0,
    });
  };

  function verifyPrerequisiteKnowledge() {
    const requiredConcepts = selectedCourse.requiredConcepts.map((c) =>
      c.trim().toLowerCase()
    );
    const masteredConcepts = selectedKnowledge.map((k) =>
      k.label.trim().toLowerCase()
    );

    const missingConcepts = requiredConcepts.filter(
      (concept) => !masteredConcepts.includes(concept)
    );

    const isEligible = missingConcepts.length === 0;

    return {
      isEligible,
      missingConcepts,
      totalRequired: requiredConcepts.length,
      totalMastered: masteredConcepts.length,
      masteredConcepts: masteredConcepts,
      matchedCount: requiredConcepts.length - missingConcepts.length,
      confidence:
        (requiredConcepts.length - missingConcepts.length) /
        requiredConcepts.length,
    };
  }

  return (
    <div className="flex h-full flex-col border-r bg-gray-800">
      {/* {JSON.stringify({ selectedCourse, selectedKnowledge })} */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <h2 className="text-lg font-semibold">
          Prerequisite Knowledge Verification
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="md:hidden"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </div>
      <ScrollArea className="flex-1 px-4 py-4 overflow-hidden">
        <label className="text-sm font-medium">
          Select course you want to start
        </label>
        <Select value={selectedCourse?.uri} onValueChange={handleSelectItem}>
          <SelectTrigger className="w-full data-[size=default]:h-12">
            <SelectValue placeholder="Choose a course..." />
          </SelectTrigger>
          <SelectContent>
            {courses.map((item) => (
              <SelectItem key={item.uri} value={item.uri}>
                {item.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedCourse && (
          <div className="flex items-start justify-between p-3">
            <div className="flex-1">
              <h3 className="text-sm font-medium mb-2">Course Concepts:</h3>
              <ul className="list-disc list-inside space-y-1">
                {selectedCourse.concepts.map(
                  (concept: string, index: number) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {concept}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div className="flex-1 ml-4">
              <h3 className="text-sm font-medium mb-2">
                Course Prerequisites:
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {selectedCourse.requiredConcepts.length > 0 ? (
                  selectedCourse.requiredConcepts.map(
                    (prerequisite: string, index: number) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {prerequisite}
                      </li>
                    )
                  )
                ) : (
                  <li className="text-sm text-muted-foreground list-none pl-0">
                    Nothing is required
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
        <MultiSelect
          selectedKnowledge={selectedKnowledge}
          setSelectedItems={setSelectedKnowledge}
        />
      </ScrollArea>
      <div className="border-t p-4">
        <PrerequisiteProgress result={result} />

        <Button
          className="w-full mt-4"
          disabled={!selectedCourse || selectedKnowledge.length === 0}
          onClick={() => {
            setShowProgress(true);
            const verificationResult = verifyPrerequisiteKnowledge();
            setResult(verificationResult);
          }}
        >
          {result.isEligible && <Confetti particleCount={300} spreadDeg={75} />}
          Verify Knowledge
        </Button>
      </div>
    </div>
  );
}

type KnowledgeCheckResult = {
  isEligible: boolean;
  missingConcepts: string[];
  totalRequired: number;
  totalMastered: number;
  matchedCount: number;
  masteredConcepts: string[];
  confidence: number;
};

type Props = {
  result: KnowledgeCheckResult;
};

function PrerequisiteProgress({ result }: Props) {
  const confidencePercent = Math.round(result.confidence * 100);

  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-200">
          <span>
            {result.matchedCount} of {result.totalRequired} concepts mastered
          </span>
          <span>{confidencePercent}% confidence</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
          <div
            className={`h-3 rounded-full ${
              result.confidence >= 0.8
                ? "bg-green-500"
                : result.confidence >= 0.5
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>

      {result.isEligible ? (
        <>
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg mb-4 text-sm font-medium">
            ✅ You meet all the prerequisites for this course!
          </div>
        </>
      ) : (
        result.totalRequired > 0 && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg mb-4 text-sm font-medium">
            ⚠️ You are missing some prerequisite knowledge.
          </div>
        )
      )}

      {!result.isEligible && (
        <div>
          <h3 className="text-sm font-semibold mb-1">Missing Concepts:</h3>
          <ul className="list-disc ml-6 text-sm text-gray-200">
            {result.missingConcepts.map((concept, i) => (
              <li key={i}>{concept}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
