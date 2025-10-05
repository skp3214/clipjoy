"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "../components/Notification";
import { trpc } from "@/lib/trpc-client";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const { showNotification } = useNotification();

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      showNotification("Registration successful! Please log in.", "success");
      router.push("/login");
    },
    onError: (error) => {
      showNotification(error.message || "Registration failed", "error");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showNotification("Passwords do not match", "error");
      return;
    }

    registerMutation.mutate({ email, password });
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            disabled={registerMutation.isPending}
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">
            Password (min 6 characters)
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border rounded"
            disabled={registerMutation.isPending}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded"
            disabled={registerMutation.isPending}
          />
        </div>
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {registerMutation.isPending ? "Registering..." : "Register"}
        </button>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}