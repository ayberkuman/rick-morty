import { schema } from "@/app/client/page";
import { cn } from "@/lib/utils";
import { Character } from "@/types";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import { Input } from "../ui/input";
import { PopoverContent } from "../ui/popover";
import Pagination from "./Pagination";

export default function Suggestions({
  options,
  form,
  totalPages,
  setCurrentPage,
  currentPage,
  searchQuery,
  setSearchQuery,
  selectedValues,
  setSelectedValues,
  isLoading,
}: {
  options: Character[];
  form: UseFormReturn<z.infer<typeof schema>>;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  currentPage: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedValues: Set<number>;
  setSelectedValues: (values: Set<number>) => void;
  isLoading: boolean;
}) {
  /*  const handleSearch = useDebouncedCallback((term: string) => {
    setSearchQuery(term);
    setCurrentPage(1);
  }, 300); */

  const getHighlightedText = useCallback((text: string, highlight: string) => {
    // Split text on highlight term, include term itself into parts, ignore case
    // used math random to generate unique key for each part
    const parts = text.split(RegExp(`(${highlight})`, "gi"));
    return (
      <span>
        {parts.map((part) => (
          <span
            key={text + Math.random()}
            className={
              part.toLowerCase() === highlight.toLowerCase() ? "font-bold" : ""
            }
          >
            {part}
          </span>
        ))}
      </span>
    );
  }, []);
  return (
    <PopoverContent
      className="w-[var(--radix-popover-trigger-width)] p-0"
      align="start"
    >
      <Command>
        <CommandEmpty>No result found.</CommandEmpty>
        <Input
          onChange={(e) => setSearchQuery(e.target.value)}
          value={searchQuery}
          placeholder={"Search"}
        />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <CommandGroup className="overflow-y-scroll max-h-96">
            {options?.map((option, index) => {
              const isSelected = selectedValues.has(option.id);
              return (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    if (isSelected) {
                      selectedValues.delete(option.id);
                    } else {
                      selectedValues.add(option.id);
                    }
                    const filterValues = Array.from(selectedValues);
                    form.setValue("api_characters", filterValues);
                  }}
                  className="flex gap-2"
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <CheckIcon className={cn("h-4 w-4")} />
                  </div>
                  <Image
                    className="border-[1px] border-gray-700 rounded-md"
                    src={option.image}
                    width={32}
                    height={32}
                    alt="image of the character"
                  />
                  <div>
                    <p>{getHighlightedText(option.name, searchQuery)}</p>
                    <p>{option.episode.length} Episodes</p>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </Command>
    </PopoverContent>
  );
}
