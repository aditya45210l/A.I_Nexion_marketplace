"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { LendTheKey } from "@/lib/actions/LenderActions";
import { redirect, useRouter } from "next/navigation";
import { useActiveAccount } from "thirdweb/react";
import StatisticCard13 from "../statistic-card-13";

export const formSchema = z.object({
  provider: z.string(),
  model: z.string(),
  key: z.string(),
  pricePerCall: z.string(),
  usageType: z.string(),
  termAndConduction: z.unknown(),
});

export default function LenderForm() {
  const [loading, setLoading] = useState(false);
  const activeAccount = useActiveAccount();
  const [progress, setProgress] = useState(0); // New state for progress bar
  const router = useRouter();

  const Models = [
    {
      label: "vercel - Demo",
      value: "demo",
    },
    {
      label: "Gpt-5",
      value: "Gpt-5",
    },
  ] as const;
  const usageType = [
    {
      label: "Text",
      value: "text",
    },
    {
      label: "Image",
      value: "image",
    },
    {
      label: "Video",
      value: "video",
    },
  ] as const;
  const pricePerCall = [
    {
      label: "0.01$ USD",
      value: "0.01",
    },
    {
      label: "0.02$ USD",
      value: "0.02",
    },
    {
      label: "0.03$ USD",
      value: "0.03",
    },
    {
      label: "0.04$ USD",
      value: "0.04",
    },
    {
      label: "0.05$ USD",
      value: "0.05",
    },
    {
      label: "0.06$ USD",
      value: "0.06",
    },
    {
      label: "0.07$ USD",
      value: "0.07",
    },
    {
      label: "0.08$ USD",
      value: "0.08",
    },
    {
      label: "0.09$ USD",
      value: "0.09",
    },
    {
      label: "0.10$ USD",
      value: "0.10",
    },
  ] as const;

  const AiProvider = [
    { label: "OpenAI", value: "openai" },
    { label: "Claude", value: "claude" },
    { label: "Gemini", value: "gemini" },
    { label: "Grok", value: "grok" },
    { label: "Perplexity", value: "perplexity" },
    { label: "Vercel", value: "vercel" },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      console.log(values);
      console.log("address", activeAccount?.address);
      const lenderAddress = activeAccount?.address;
      const data = await LendTheKey({
        ...values,
        lenderAddress: lenderAddress!,
      });
      console.log(data);

      if (!data?.success) {
        throw new Error(data?.message || "Something went wrong");
      }
      toast(
        "Your key has been successfully listed! You can now manage it in your dashboard.",
        {
          description: "Sunday, December 03, 2023 at 9:00 AM",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        }
      );

      redirect("/dashboard");
    } catch (error) {
      setLoading(false);
      console.error("Form submission error", error);
    }
  }

  useEffect(() => {
    if (loading) {
      const totalDuration = 2000; // 2 seconds
      const steps = 40;
      const intervalTime = totalDuration / steps;

      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 40) {
            clearInterval(timer);
            return 40;
          }
          return prevProgress + 1;
        });
      }, intervalTime);

      return () => clearInterval(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (progress === 40) {
      // Delay the redirect slightly to ensure the progress bar is fully rendered at 100%
      const redirectTimer = setTimeout(() => {
        router.push("/dashboard");
      }, 50); // 500ms delay

      return () => clearTimeout(redirectTimer);
    }
  }, [progress, router]);

  if (loading) {
    <StatisticCard13 />;
  }

  return (
    <div className="my-4">
      <Card className="mx-auto max-w-lg gap-0">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 max-w-3xl mx-auto "
            >
              <div className="flex justify-between sm:flex-row flex-col">
                <div className="">
                  <FormField
                    control={form.control}
                    name="provider"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>AI provider</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? AiProvider.find(
                                      (language) =>
                                        language.value === field.value
                                    )?.label
                                  : "Select Provider"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search language..." />
                              <CommandList>
                                <CommandEmpty>No provider found.</CommandEmpty>
                                <CommandGroup>
                                  {AiProvider.map((language) => (
                                    <CommandItem
                                      value={language.label}
                                      key={language.value}
                                      onSelect={() => {
                                        form.setValue(
                                          "provider",
                                          language.value
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          language.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {language.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {/* <FormDescription>
                    Enter you AI provider name which you want to Lend.
                  </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="">
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Model</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? Models.find(
                                      (language) =>
                                        language.value === field.value
                                    )?.label
                                  : "Select Model"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Search language..." />
                              <CommandList>
                                <CommandEmpty>No language found.</CommandEmpty>
                                <CommandGroup>
                                  {Models.map((language) => (
                                    <CommandItem
                                      value={language.label}
                                      key={language.value}
                                      onSelect={() => {
                                        form.setValue("model", language.value);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          language.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {language.label}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        {/* <FormDescription>
                    Enter your AI model which you want to Lend.
                  </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex justify-between sm:flex-row flex-col min-w-full">
                <FormField
                  control={form.control}
                  name="pricePerCall"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Call Price</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? pricePerCall.find(
                                    (price) => price.value === field.value
                                  )?.label
                                : "Select Price"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search language..." />
                            <CommandList>
                              <CommandEmpty>No language found.</CommandEmpty>
                              <CommandGroup>
                                {pricePerCall.map((language) => (
                                  <CommandItem
                                    value={language.label}
                                    key={language.value}
                                    onSelect={() => {
                                      form.setValue(
                                        "pricePerCall",
                                        language.value
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        language.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {language.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {/* <FormDescription>Enter per call price.</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="usageType"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Type</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? usageType.find(
                                    (price) => price.value === field.value
                                  )?.label
                                : "Select Type"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search language..." />
                            <CommandList>
                              <CommandEmpty>No language found.</CommandEmpty>
                              <CommandGroup>
                                {usageType.map((language) => (
                                  <CommandItem
                                    value={language.label}
                                    key={language.value}
                                    onSelect={() => {
                                      form.setValue(
                                        "usageType",
                                        language.value
                                      );
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        language.value === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {language.label}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {/* <FormDescription>Enter per call price.</FormDescription> */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex w-full  ">
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name="key"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="" {...field} />
                        </FormControl>
                        <FormDescription>Enter your api key.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="termAndConduction"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Terms & Conditions</FormLabel>
                      <FormDescription>
                        I agree that the platform may temporarily store and
                        manage this key encrypted to enable lending.
                      </FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
