import { useSearchContext } from "@/context/SearchContext";
import { cn } from "@/lib/utils";
import { Character } from "@/types";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { z } from "zod";
import { schema } from ".";
import { Command, CommandEmpty, CommandGroup, CommandItem } from "../ui/command";
import { Input } from "../ui/input";
import { PopoverContent } from "../ui/popover";
import Pagination from "./Pagination";

export default function Suggestions({
  options,
  form,
  totalPages,
}: {
  options: Character[];
  form: UseFormReturn<z.infer<typeof schema>>;
  totalPages: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { selectedValues, setSelectedValues, setSelectedNames } =
    useSearchContext();

  const handleSearch = useDebouncedCallback((term: string) => {
    // Because I am using React Server Components I hold the search term in the URL also 
    // making the search results shareable
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

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
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("query")?.toString()}
          placeholder={"Search characters..."}
        />
        <CommandGroup className="overflow-y-scroll max-h-96">
          {options?.map((option, index) => {
            const isSelected = selectedValues.includes(option.id);
            return (
              <CommandItem
                key={index}
                onSelect={() => {
                  if (isSelected) {
                    setSelectedValues((prev) =>
                      prev.filter((value) => value !== option.id)
                    );
                    setSelectedNames((prevNames) =>
                      prevNames.filter(
                        (_, idx) => selectedValues[idx] !== option.id
                      )
                    );
                  } else {
                    setSelectedValues((prev) => [...prev, option.id]);
                    setSelectedNames((prevNames) => [
                      ...prevNames,
                      option.name,
                    ]);
                  }
                  const filterValues = selectedValues.includes(option.id)
                    ? selectedValues.filter((value) => value !== option.id)
                    : [...selectedValues, option.id];
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
                  <p>
                    {getHighlightedText(
                      option.name,
                      searchParams.get("query")?.toString() || ""
                    )}
                  </p>
                  <p>{option.episode.length} Episodes</p>
                </div>
              </CommandItem>
            );
          })}
        </CommandGroup>
        <Pagination totalPages={totalPages} />
      </Command>
    </PopoverContent>
  );
}
