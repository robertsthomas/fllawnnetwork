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
import { useState } from 'react';

const FormSchema = z.object({
    zipcode: z.string()
        .min(1, { message: "Please enter a city or ZIP code" })
        .refine((val) => {
            // Allow either a 5-digit ZIP code or a city name
            return /^\d{5}$/.test(val) || /^[a-zA-Z\s-]+$/.test(val);
        }, { message: "Please enter a valid city name or 5-digit ZIP code" }),
});

type FormValues = z.infer<typeof FormSchema>;

export default function Hero() {
    const [inputValue, setInputValue] = useState('');

    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            zipcode: "",
        },
    });

    function onSubmit(data: FormValues) {
        const location = data.zipcode.trim();
        if (/^\d{5}$/.test(location)) {
            // If it's a ZIP code, use the query parameter approach
            window.location.href = `/directory?zipcode=${encodeURIComponent(location)}`;
        } else {
            // If it's a city name, use the city-specific URL
            const formattedCity = location.toLowerCase().replace(/\s+/g, '-');
            window.location.href = `/directory/${formattedCity}`;
        }
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
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const location = formData.get('zipcode')?.toString().trim() || '';
                        
                        if (/^\d{5}$/.test(location)) {
                            window.location.href = `/directory?zipcode=${encodeURIComponent(location)}`;
                        } else {
                            const formattedCity = location.toLowerCase().replace(/\s+/g, '-');
                            window.location.href = `/directory/${formattedCity}`;
                        }
                    }} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-grow relative">
                            <input
                                name="zipcode"
                                value={inputValue}
                                placeholder="Enter city or ZIP code"
                                className="w-full pl-10 h-12 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                required
                                pattern="^(\d{5}|[a-zA-Z\s-]+)$"
                                title="Please enter a valid city name or 5-digit ZIP code"
                                maxLength={/^\d/.test(inputValue) ? 5 : undefined}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    // If the input starts with a number, limit to 5 digits
                                    if (/^\d/.test(value)) {
                                        setInputValue(value.slice(0, 5));
                                    } else {
                                        setInputValue(value);
                                    }
                                }}
                                onPaste={(e) => {
                                    const pastedText = e.clipboardData.getData('text');
                                    // If the pasted text contains numbers
                                    if (/\d/.test(pastedText)) {
                                        e.preventDefault();
                                        // Extract only numbers from the pasted text
                                        const numbersOnly = pastedText.replace(/\D/g, '');
                                        // Take only the first 5 digits
                                        setInputValue(numbersOnly.slice(0, 5));
                                    }
                                }}
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        </div>
                        <Button
                            type="submit"
                            className="bg-primary-600 hover:bg-primary-700 text-white"
                        >
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </Button>
                    </form>
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
                        <Link href="/directory" className="text-sm text-black hover:text-green-700 transition">Lawn Mowing</Link>
                        <span className="text-sm text-black/80">•</span>
                        <Link href="/directory" className="text-sm text-black hover:text-green-700 transition">Landscaping</Link>
                        <span className="text-sm text-black/80">•</span>
                        <Link href="/directory" className="text-sm text-black hover:text-green-700 transition">Garden Design</Link>
                        <span className="text-sm text-black/80">•</span>
                        <Link href="/directory" className="text-sm text-black hover:text-green-700 transition">Irrigation</Link>
                    </div>
                </div>
            </div>
        </section>
    );
} 