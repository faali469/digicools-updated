"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "../actions";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<{ error: string | null }, FormData>(signUp, {
    error: null,
  });

  return (
    <div>
      <h1 className="mb-1 font-display text-2xl font-semibold">Create your workspace</h1>
      <p className="mb-6 text-sm text-muted-foreground">Start planning with DigiCools, free.</p>
      <form action={formAction} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" required autoComplete="name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="orgName">Company</Label>
          <Input id="orgName" name="orgName" required placeholder="Acme Construction" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
        </div>
        {state.error && <p className="text-sm text-destructive">{state.error}</p>}
        <Button type="submit" disabled={pending} className="w-full bg-gradient-primary shadow-glow hover:opacity-90">
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
