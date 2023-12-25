"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover } from "@/components/ui/popover";
import { Character } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "../ui/use-toast";
import MultiSelect from "./MultiSelect";
import Suggestions from "./Suggestions";

export const schema = z.object({
  api_characters: z.array(z.number()).optional(),
});

// This is the wrapper component for the MultiSelect and Suggestions components
export default function SSR({
  options,
  totalPages,
}: {
  options: Character[];
  totalPages: number;
}) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    toast({
      title: "You submitted the following id's of characters:",
      description: (
        <pre className="mt-2 w-full max-w-[50%] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form className="mx-auto" onSubmit={form.handleSubmit(onSubmit)}>
        <h1 className="text-center font-medium">
          This page uses React Server Components and fetches data on the server
          side, and URL Search Params for search and pagination.
        </h1>
        <Card>
          <CardContent className="grid p-2 sm:p-4 gap-4 pt-4 text-center">
            <FormField
              control={form.control}
              name="api_characters"
              render={() => (
                <FormItem>
                  <FormLabel>
                    Search and Select Rick And Morty Characters
                  </FormLabel>
                  <Popover>
                    <MultiSelect />
                    <Suggestions
                      options={options}
                      form={form}
                      totalPages={totalPages}
                    />
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
      </form>
    </Form>
  );
}
