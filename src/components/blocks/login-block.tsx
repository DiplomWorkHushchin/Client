"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { loginAsync, loginViaGoogleAsync } from "@/services/auth-service";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod";
import LoginUserDTO from "@/DTOs/login-user-dto";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Loader2Icon } from "lucide-react"
import { toast } from 'sonner';

// Window interface for Google API
declare global {
    interface Window {
        google: any;
    }
}


// Login user schema
const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const loginForm = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Next router hook
    const router = useRouter()

    // Redux state dispatcher
    const dispatch = useDispatch<AppDispatch>();

    const searchParams = useSearchParams();

    const calledRef = useRef(false);

    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;

        const error = searchParams.get('error');
        if (error !== null) {
            setTimeout(() => {
                toast.error("Error occurred during Google login.");
            }, 50);
        }

        const token = searchParams.get('token');
        const getUser = async () => {
            if (token) {
                await loginViaGoogleAsync(token, dispatch, router);
            }
        };

        

        getUser();
    }, [dispatch, router, searchParams]);

    async function onSubmit(values: z.infer<typeof loginSchema>) {
        setIsSubmitting(true);
        const userLoginDto: LoginUserDTO = {
            email: values.email,
            password: values.password,
        }

        try {
            await loginAsync(userLoginDto, dispatch, router);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        window.location.href = `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/google`;
    };

    return (
        <>
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex h-16 w-16 items-center justify-center rounded-md">
                                    <svg
                                        id="Component_41_1"
                                        data-name="Component 41 – 1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 112.769 108.171"
                                        className="h-16 w-16 text-black dark:text-white"
                                        fill="currentColor"
                                    >
                                        <g id="Group_9">
                                            <g id="Group_1" data-name="Group 1" transform="translate(33.819 42.25)">
                                                <circle id="Ellipse_1" data-name="Ellipse 1" cx="13.179" cy="13.179"
                                                    r="13.179" transform="translate(2.531 2.53)" />
                                                <path id="Path_1" data-name="Path 1"
                                                    d="M181.757,205.964a15.709,15.709,0,1,1,15.71-15.709A15.727,15.727,0,0,1,181.757,205.964Zm0-26.358a10.649,10.649,0,1,0,10.649,10.649A10.661,10.661,0,0,0,181.757,179.606Z"
                                                    transform="translate(-166.047 -174.545)" />
                                            </g>
                                            <g id="Group_2" data-name="Group 2" transform="translate(0 10.782)">
                                                <path id="Path_2" data-name="Path 2"
                                                    d="M102.354,194.692c-5.521,0-10.011-1.572-12.982-4.881-10.381-11.56,2.3-39.3,28.863-63.163s55.511-33.494,65.892-21.934c5.241,5.836,4.869,15.8-1.049,28.062-5.562,11.522-15.441,23.987-27.816,35.1C136.3,184.908,116.123,194.692,102.354,194.692Zm68.664-89.573c-11.4,0-30.079,8.353-49.2,25.523-25.95,23.305-35.664,47.556-28.455,55.583s32.357.967,58.31-22.342c11.867-10.658,21.3-22.534,26.568-33.441,4.837-10.022,5.526-18.092,1.889-22.142C178.235,106.187,175.091,105.12,171.018,105.12Z"
                                                    transform="translate(-85.754 -99.833)" />
                                            </g>
                                            <g id="Group_3" data-name="Group 3" transform="translate(58.193 32.85)">
                                                <line id="Line_1" data-name="Line 1" y1="14.782" x2="19.1"
                                                    transform="translate(1.549 2.001)" fill="#f4c816" />
                                                <rect id="Rectangle_3" data-name="Rectangle 3" width="24.153"
                                                    height="5.062"
                                                    transform="translate(0 14.781) rotate(-37.734)" />
                                            </g>
                                            <g id="Group_4" data-name="Group 4" transform="translate(23.69 32.694)">
                                                <line id="Line_2" data-name="Line 2" x1="11.931" y1="14.244"
                                                    transform="translate(3.276 3.248)" fill="#f4c816" />
                                                <rect id="Rectangle_4" data-name="Rectangle 4" width="5.061"
                                                    height="20.684"
                                                    transform="translate(0 3.246) rotate(-39.894)" />
                                            </g>
                                            <g id="Group_5" data-name="Group 5" transform="translate(36.504 69.04)">
                                                <line id="Line_3" data-name="Line 3" x1="4.97" y2="14.464"
                                                    transform="translate(2.393 0.823)" fill="#f4c816" />
                                                <rect id="Rectangle_5" data-name="Rectangle 5" width="15.293"
                                                    height="5.061"
                                                    transform="translate(0 14.463) rotate(-71.034)" />
                                            </g>
                                            <g id="Group_6" data-name="Group 6" transform="translate(70.37)">
                                                <circle id="Ellipse_2" data-name="Ellipse 2" cx="18.669" cy="18.669"
                                                    r="18.669" transform="translate(2.531 2.53)" />
                                                <path id="Path_3" data-name="Path 3"
                                                    d="M274.027,116.632a21.2,21.2,0,1,1,21.2-21.2A21.223,21.223,0,0,1,274.027,116.632Zm0-37.337a16.138,16.138,0,1,0,16.139,16.139A16.157,16.157,0,0,0,274.027,79.295Z"
                                                    transform="translate(-252.828 -74.234)" />
                                            </g>
                                            <g id="Group_7" data-name="Group 7" transform="translate(8.625 16.296)">
                                                <circle id="Ellipse_3" data-name="Ellipse 3" cx="8.423" cy="8.423"
                                                    r="8.423"
                                                    transform="translate(2.53 2.53)" />
                                                <path id="Path_4" data-name="Path 4"
                                                    d="M117.185,134.831a10.953,10.953,0,1,1,10.954-10.952A10.965,10.965,0,0,1,117.185,134.831Zm0-16.845a5.892,5.892,0,1,0,5.893,5.893A5.9,5.9,0,0,0,117.185,117.986Z"
                                                    transform="translate(-106.231 -112.925)" />
                                            </g>
                                            <g id="Group_8" data-name="Group 8" transform="translate(23.552 81.598)">
                                                <circle id="Ellipse_4" data-name="Ellipse 4" cx="10.757" cy="10.757"
                                                    r="10.757" transform="translate(2.531 2.53)" />
                                                <path id="Path_5" data-name="Path 5"
                                                    d="M154.959,294.538a13.287,13.287,0,1,1,13.287-13.286A13.3,13.3,0,0,1,154.959,294.538Zm0-21.512a8.226,8.226,0,1,0,8.226,8.226A8.236,8.236,0,0,0,154.959,273.026Z"
                                                    transform="translate(-141.672 -267.965)" />
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                                <h1 className="text-xl font-bold">Welcome to IPZE Edu. sys.</h1>
                            </div>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <FormField
                                        control={loginForm.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e@example.com" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This is your email.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <FormField
                                        control={loginForm.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="password" type={"password"} {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    This is your password.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                                    Login
                                </Button>
                            </div>
                            <div
                                className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border"
                            >
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or
                                </span>
                            </div>

                        </div>
                    </form>
                </Form>
                <div className="grid gap-4 sm:grid-cols-1">
                    <Button
                        variant="outline"
                        className="w-full"
                        disabled={isSubmitting}
                        onClick={handleGoogleLogin}
                    >
                        {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path
                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                fill="currentColor"
                            />
                        </svg>
                        Continue with Google
                    </Button>
                </div>
            </div>
        </>
    )
}

