"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "../actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<{ error: string | null }, FormData>(signIn, {
    error: null,
  });

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold">Welcome back</h1>
      <p className="mb-6 text-sm text-muted-foreground">Log in to your DigiCools workspace.</p>
      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required autoComplete="current-password" />
        </div>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending} className="w-full bg-gradient-primary shadow-glow hover:opacity-90">
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Log in
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        No account?{" "}
        <Link href="/signup" className="font-medium text-primary hover:underline">
          Start free
        </Link>
      </p>
    </div>
  );
}
