'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from 'next/link';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "~/components/ui/form";
import { resend } from "~/lib/resend";

const FormSchema = z.object({
    zipcode: z.string()
        .min(5, { message: "ZIP code must be 5 digits" })
        .max(5, { message: "ZIP code must be 5 digits" })
        .regex(/^\d+$/, { message: "ZIP code must contain only numbers" }),
});

export default function Hero() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            zipcode: "",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        window.location.href = `/directory?zipcode=${encodeURIComponent(data.zipcode)}`;
    }

    return (
        <section className="relative">
            <div className="absolute inset-0 bg-primary-900/90 overflow-hidden">
                <Image
                    src="https://images.pexels.com/photos/1546166/pexels-photo-1546166.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                    alt="Beautiful lawn"
                    fill
                    className="object-cover opacity-50"
                    priority
                />
            </div>

            <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl animate-fade-in">
                    Find the Perfect<br />
                    <span className="text-accent-400">Lawn Care Professional</span>
                </h1>
                <p className="mt-6 text-xl text-gray-100 max-w-3xl animate-slide-up">
                    Connect with top-rated lawn care providers in your area. From regular mowing to complete landscape transformations, find the right expert for your outdoor space.
                </p>

                <div className="mt-10 max-w-xl animate-slide-up bg-white/95 backdrop-blur-sm rounded-lg p-4" style={{ animationDelay: '200ms' }}>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
                            <FormField
                                control={form.control}
                                name="zipcode"
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    placeholder="Enter ZIP code"
                                                    className="pl-10"
                                                    maxLength={5}
                                                    inputMode="numeric"
                                                    data-1p-ignore="true"
                                                    data-lpignore="true"
                                                />
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="bg-primary-600 hover:bg-primary-700 text-white"
                            >
                                <Search className="mr-2 h-4 w-4" />
                                Search
                            </Button>
                        </form>
                    </Form>
                    {/* <button onClick={async () => {
                        await fetch('/api/send', {
                            method: 'POST',
                            body: JSON.stringify({
                                email: 'robertsthomasdev@gmail.com',
                            }),
                        });
                    }}>Click me</button> */}
                    <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                        <span className="text-sm text-black/80">Popular:</span>
                        <Link href="/directory?service=lawn-mowing" className="text-sm text-black hover:text-green-700 transition">Lawn Mowing</Link>
                        <span className="text-sm text-black/80">•</span>
                        <Link href="/directory?service=landscaping" className="text-sm text-black hover:text-green-700 transition">Landscaping</Link>
                        <span className="text-sm text-black/80">•</span>
                        <Link href="/directory?service=garden-design" className="text-sm text-black hover:text-green-700 transition">Garden Design</Link>
                        <span className="text-sm text-black/80">•</span>
                        <Link href="/directory?service=irrigation" className="text-sm text-black hover:text-green-700 transition">Irrigation</Link>
                    </div>
                </div>
            </div>
        </section>
    );
} 