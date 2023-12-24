import { useSearchContext } from "@/context/SearchContext";
import { ChevronDown, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { FormControl } from "../ui/form";
import { PopoverTrigger } from "../ui/popover";
import { Character } from "@/types";

//This is the MultiSelect component to show selected characters and also to remove them
//I used context to not lose the selected characters when the page changes because
//I used server side rendering and I am not holding the characters in the state
export default function MultiSelect({
  options,
  selectedValues,
  setSelectedValues,
}: {
  options: Character[];
  selectedValues: Set<number>;
  setSelectedValues: (values: Set<number>) => void;
}) {
  return (
    <PopoverTrigger asChild>
      <FormControl>
        <div className="relative flex min-h-[36px] items-center justify-end rounded-md border data-[state=open]:border-ring">
          <div className="relative mr-auto flex flex-grow flex-wrap items-center overflow-hidden px-3 py-1">
            {selectedValues?.size > 0 ? (
              options &&
              options
                .filter((option) => selectedValues.has(option.id))
                .map((option) => (
                  <Badge
                    key={option.id}
                    variant="outline"
                    className="m-[2px] gap-1 pr-0.5"
                  >
                    <span className="">{option.name}</span>
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        selectedValues.delete(option.id);
                      }}
                      className="flex items-center rounded-sm px-[1px] hover:bg-accent hover:text-red-500"
                    >
                      <X size={14} />
                    </span>
                  </Badge>
                ))
            ) : (
              <span className="mr-auto text-sm">Select...</span>
            )}
          </div>
          <div className="flex flex-shrink-0 items-center self-stretch px-1 text-muted-foreground/60">
            {selectedValues?.size > 0 && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedValues(new Set());
                }}
                className="flex items-center self-stretch p-2 hover:text-red-500"
              >
                <X size={16} />
              </div>
            )}
            <span className="mx-0.5 my-2 w-[1px] self-stretch bg-border" />
            <div className="flex items-center self-stretch p-2 hover:text-muted-foreground">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </FormControl>
    </PopoverTrigger>
  );
}
