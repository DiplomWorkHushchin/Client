import { LoginForm } from "@/components/blocks/login-block";
import { ModeToggle } from "@/components/theme-mode-toggle";

export default function Login() {
    return (
        <div className={"w-full"}>
            <div className="flex p-4 justify-between absolute items-center w-full">
                <div />
                <ModeToggle />
            </div>
            <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}
