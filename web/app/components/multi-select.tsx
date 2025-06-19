import { useEffect, useState } from "react";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

// Sample data - you can replace this with your own items

export default function MultiSelect({selectedKnowledge, setSelectedItems}: {
  selectedKnowledge: any[];
  setSelectedItems: (items: any[] | ((prev: any[]) => any[])) => void;
}) {
  // const [selectedKnowledge, setSelectedItems] = useState<any[]>([]);
  const [concepts, setConcepts] = useState<any[]>([]);

  const handleSelectItem = (uri: string) => {
    const item = concepts.find((item) => item.uri === uri);
    if (item && !selectedKnowledge.find((selected) => selected.id === uri)) {
      setSelectedItems((prev: any[]) => [...prev, item]);
    }
  };

  const handleRemoveItem = (uri: string) => {
    setSelectedItems((prev: any[]) => prev.filter((item) => item.uri !== uri));
  };

  const availableForSelection = concepts.filter(
    (item) => !selectedKnowledge.find((selected) => selected.uri === item.uri)
  );

  useEffect(() => {
    const fetchConcepts = async () => {
      const res = await fetch("http://localhost:3001/api/courses/concepts", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        console.error("Failed to fetch topics:", res.statusText);
        return;
      }
      const data = await res.json();
      setConcepts(data);
    };
    fetchConcepts();
  }, []);

  return (
    <div className="w-full space-y-6 mt-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Select concepts you've learned
        </label>
        <Select onValueChange={handleSelectItem}>
          <SelectTrigger className="w-full data-[size=default]:h-12">
              <span className="text-muted-foreground">
                Choose a concept...
              </span>
          </SelectTrigger>
          <SelectContent>
            {availableForSelection.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground text-center">
                All items selected
              </div>
            ) : (
              availableForSelection.map((item) => (
                <SelectItem key={item.uri} value={item.uri}>
                  <div className="flex items-center justify-between w-full">
                    <span>{item.label}</span>
                    <span className="text-xs text-muted-foreground ml-2">
                      {item.topicLabel}
                    </span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {selectedKnowledge.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Selected Concepts:</h3>
          <div className="space-y-2">
            {selectedKnowledge.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-muted/50"
              >
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="text-[10px]">{item.topicLabel}</Badge>
                  <span className="font-medium">{item.label}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(item.uri)}
                  className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove {item.label}</span>
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {selectedKnowledge.length} item{selectedKnowledge.length !== 1 ? "s" : ""}{" "}
              selected
            </span>
            {selectedKnowledge.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedItems([])}
                className="h-8"
              >
                Clear all
              </Button>
            )}
          </div>
        </div>
      )}

      {selectedKnowledge.length === 0 && (
        <div className="text-center p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg">
          <p className="text-muted-foreground">No concepts selected yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Use the dropdown above to add items to your selection.
          </p>
        </div>
      )}
    </div>
  );
}
