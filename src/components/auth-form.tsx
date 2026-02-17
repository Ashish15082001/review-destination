"use client";

import signInUser from "@/actions/sign-in";
import signUpUser from "@/actions/sign-up";
import { useActionState, useEffect } from "react";
import { AuthMode } from "@/lib/auth-mode";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const [state, formAction, isPending] = useActionState(
    mode === AuthMode.SIGN_IN ? signInUser : signUpUser,
    {},
  );

  useEffect(() => {
    if (state.type === "success") redirect("/");
  }, [state.type]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <form className="space-y-4" action={formAction}>
          {/* user name */}
          <div>
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              User Name
            </label>
            <input
              id="userName"
              name="userName"
              type="text"
              defaultValue={
                state.fields && state.fields.userName
                  ? (state.fields.userName.value as string)
                  : ""
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your userName"
            />

            {/* error message */}
            {state.fields && state.fields.userName?.error && (
              <p className="mt-2 text-sm text-red-600">
                {state.fields.userName.error}
              </p>
            )}
          </div>

          {/* password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              defaultValue={
                state.fields && state.fields.password
                  ? (state.fields.password.value as string)
                  : ""
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />

            {/* error message */}
            {state.fields && state.fields.password?.error && (
              <p className="mt-2 text-sm text-red-600">
                {state.fields.password.error}
              </p>
            )}
          </div>

          {state.message && (
            <div
              className={`rounded-md bg-${state.type === "success" ? "green" : "red"}-50 p-4`}
            >
              <p
                className={`mt-2 text-sm text-${state.type === "success" ? "green" : "red"}-600`}
              >
                {state.message}
              </p>
            </div>
          )}

          {/* action button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-500 text-white font-medium py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            {isPending
              ? mode === AuthMode.SIGN_IN
                ? "Signing in..."
                : "Signing up..."
              : mode === AuthMode.SIGN_IN
                ? "Sign In"
                : "Sign Up"}
          </button>

          {/* already have an account? */}
          {mode === AuthMode.SIGN_UP && (
            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account?
              <Link
                href="/auth?mode=sign-in"
                className="text-blue-500 hover:underline"
              >
                Sign in
              </Link>
            </p>
          )}

          {/* new user */}
          {mode === AuthMode.SIGN_IN && (
            <p className="mt-4 text-center text-sm text-gray-600">
              New user?
              <Link
                href="/auth?mode=sign-up"
                className="text-blue-500 hover:underline"
              >
                Sign up
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
