"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { useSearchContext } from "@/context/SearchContext";
import { useResetPagination } from "@/hooks/useResetPagination";
import { cn } from "@/lib/utils";
import { APIResponse } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronDown, Loader2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useDebounce } from "use-debounce";
import { z } from "zod";

const schema = z.object({
  api_characters: z.array(z.number()).optional(),
});

//Sorry this page got very big and messy, I didn't want to divide it into multiple components
//just wanted to show I can do both the other page shows better code quality and structure
//and that's the one I am more proud of
export default function Client() {
  //States for the search query and current page
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  //Storing the selected characters in context to not lose them when the page changes
  const { selectedValues, setSelectedValues, selectedNames, setSelectedNames } =
    useSearchContext();

  //This is the debounced search query
  const [debouncedQuery] = useDebounce(searchQuery, 500);

  //Custom hook to reset the page when the search query changes
  useResetPagination(debouncedQuery, setCurrentPage);

  // This is the fetcher function for React Query
  const fetcher = (
    debouncedQuery: string,
    currentPage: number
  ): Promise<APIResponse> =>
    fetch(
      `https://rickandmortyapi.com/api/character?name=${debouncedQuery}&page=${currentPage}`
    ).then((res) => res.json());

  //React Query hook
  const { data, isError, isLoading, isPreviousData, isFetching } = useQuery({
    queryKey: ["characters", currentPage, debouncedQuery],
    queryFn: () => fetcher(debouncedQuery, currentPage),
    onError: (error) => {
      if (error instanceof Error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unknown error occurred",
          variant: "destructive",
        });
      }
    },
    // This will keep the previous data until the new data is fetched
    keepPreviousData: true,
  });

  // This is a the function to highlight the search query in the results
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

  //Form initialization
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  //Mock Submit Function
  function onSubmit(data: z.infer<typeof schema>) {
    toast({
      title: "You submitted the following id's of characters:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        className="max-w-3xl mx-auto"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h1 className="text-center font-medium p-4">
          This page uses React Query and fetches data on the client side, for
          selected characters to be consistent between page changes I used
          context again.
        </h1>
        {!isError && isLoading ? (
          <div>
            <div className="min-h-24 grid place-items-center">
              <Loader2 className="animate-spin h-5 w-5 text-primary" />
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="grid gap-4 pt-4">
              <FormField
                control={form.control}
                name="api_characters"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Search and Select Rick And Morty Characters
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <div className="relative flex min-h-[36px] items-center justify-end rounded-md border data-[state=open]:border-ring">
                            <div className="relative mr-auto flex flex-grow flex-wrap items-center overflow-hidden px-3 py-1">
                              {selectedNames.length > 0 ? (
                                selectedNames.map((name, index) => (
                                  <Badge
                                    key={selectedValues[index]}
                                    variant="outline"
                                    className="m-[2px] gap-1 pr-0.5"
                                  >
                                    <span>{name}</span>
                                    <span
                                      onClick={(e) => {
                                        e.preventDefault();
                                        const valueToRemove =
                                          selectedValues[index];
                                        setSelectedValues((prev) =>
                                          prev.filter(
                                            (value) => value !== valueToRemove
                                          )
                                        );
                                        setSelectedNames((prevNames) =>
                                          prevNames.filter(
                                            (_, idx) => idx !== index
                                          )
                                        );
                                      }}
                                      className="flex items-center rounded-sm px-[1px] hover:bg-accent hover:text-red-500"
                                    >
                                      <X size={14} />
                                    </span>
                                  </Badge>
                                ))
                              ) : (
                                <span className="mr-auto text-sm">
                                  Select...
                                </span>
                              )}
                            </div>
                            <div className="flex flex-shrink-0 items-center self-stretch px-1 text-muted-foreground/60">
                              {selectedValues?.length > 0 && (
                                <div
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedValues([]);
                                    setSelectedNames([]);
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
                      <PopoverContent
                        className="w-[var(--radix-popover-trigger-width)] p-0"
                        align="start"
                      >
                        <Command>
                          <Input
                            placeholder="Search characters..."
                            className="h-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <CommandEmpty>No result found.</CommandEmpty>
                          <CommandGroup className="overflow-y-scroll max-h-96">
                            {isFetching ? (
                              <div className="min-h-96 grid place-items-center">
                                <Loader2 className="animate-spin h-5 w-5 text-primary" />
                              </div>
                            ) : (
                              data?.results?.map((option, index) => {
                                const isSelected = selectedValues.includes(
                                  option.id
                                );
                                return (
                                  <CommandItem
                                    className="space-x-2"
                                    key={index}
                                    onSelect={() => {
                                      if (isSelected) {
                                        setSelectedValues((prev) =>
                                          prev.filter(
                                            (value) => value !== option.id
                                          )
                                        );
                                        setSelectedNames((prevNames) =>
                                          prevNames.filter(
                                            (_, idx) =>
                                              selectedValues[idx] !== option.id
                                          )
                                        );
                                      } else {
                                        setSelectedValues((prev) => [
                                          ...prev,
                                          option.id,
                                        ]);
                                        setSelectedNames((prevNames) => [
                                          ...prevNames,
                                          option.name,
                                        ]);
                                      }
                                      const filterValues =
                                        selectedValues.includes(option.id)
                                          ? selectedValues.filter(
                                              (value) => value !== option.id
                                            )
                                          : [...selectedValues, option.id];
                                      form.setValue(
                                        "api_characters",
                                        filterValues
                                      );
                                    }}
                                  >
                                    <div
                                      className={cn(
                                        "mr-2 flex h-4 w-4 gap-3 items-center justify-center rounded-sm border border-primary",
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
                                          searchQuery
                                        )}
                                      </p>
                                      <p>{option.episode.length} Episodes</p>
                                    </div>
                                  </CommandItem>
                                );
                              })
                            )}
                          </CommandGroup>
                          <div className="flex justify-between p-2">
                            <Button
                              variant="outline"
                              onClick={() =>
                                setCurrentPage((old) => Math.max(old - 1, 0))
                              }
                              disabled={currentPage === 1}
                            >
                              Previous Page
                            </Button>
                            <Badge variant="outline">
                              Current Page: {currentPage}
                            </Badge>
                            <Button
                              variant="outline"
                              onClick={() => {
                                if (!isPreviousData && data?.info?.next) {
                                  setCurrentPage((old) => old + 1);
                                }
                              }}
                              disabled={isPreviousData || !data?.info?.next}
                            >
                              Next Page
                            </Button>
                          </div>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button className="w-min mx-auto" type="submit">
                Submit
              </Button>
            </CardContent>
          </Card>
        )}
      </form>
    </Form>
  );
}
