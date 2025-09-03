// src/login/LoginPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { useShinyStore } from "../store/shinyStore";
import pikachu from "../../assets/pikachu.gif";
import { BackButton } from "../components";

export function LoginPage() {
  const navigate = useNavigate();
  const { user, signIn, signUp, signOut, loading } = useAuthStore();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const resetShinyPokemons = useShinyStore((state) => state.resetShinyPokemons);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      if (mode === "signIn") {
        await signIn(email, password);
      } else {
        await signUp(email, password); // pass displayName if you want
      }
      // user is now automatically in the store, can redirect if needed
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };
  const handleSignOut = async () => {
    setSubmitting(true);
    try {
      await signOut();
      resetShinyPokemons();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to sign out");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-40 h-40 rounded-xl border-2 border-emerald-600/80 overflow-hidden flex items-center justify-center shadow-2xl transition-all duration-100 hover:-translate-y-2">
          <img src={pikachu} alt="pikachu happy to see you back here" className="h-52 object-cover" />
        </div>
        <p className="text-sm text-gray-500">You are logged in! 🎉</p>
        <p className="text-lg text-emerald-600 font-semibold">Welcome, {user.email}</p>

        <div className="flex gap-4">
          <BackButton text="Back to Home" />

          <button
            onClick={handleSignOut}
            disabled={submitting}
            className="px-6 py-2 border-2 border-rose-600 text-rose-600 font-semibold rounded-full hover:bg-gradient-to-r hover:from-rose-600 hover:to-red-600 hover:text-white focus:outline-none transition-all duration-200 disabled:opacity-50"
          >
            {submitting ? "Signing out..." : "Sign Out"}
          </button>
        </div>

        {errorMsg && <p className="text-rose-500 text-sm">{errorMsg}</p>}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => navigate("/")}
        className="m-2 p-2 rounded-full hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors duration-200 flex items-center"
        title="Go back"
      >
        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Home
      </button>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {/* Switch buttons */}

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode("signIn")}
            className={`px-6 py-2 rounded-full font-semibold border-2 transition-all duration-200 hover:-translate-y-2 ${
              mode === "signIn"
                ? "border-sky-600 text-white bg-gradient-to-r from-sky-600 to-blue-600"
                : "border-emerald-600 text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-emerald-600 hover:text-white"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode("signUp")}
            className={`px-6 py-2 rounded-full font-semibold border-2 transition-all duration-200 hover:-translate-y-2 ${
              mode === "signUp"
                ? "border-sky-600 text-white bg-gradient-to-r from-sky-600 to-blue-600"
                : "border-emerald-600 text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-400 hover:to-emerald-600 hover:text-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-sm bg-white/10 border-2 border-white/20 p-8 rounded-2xl shadow-md"
        >
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full bg-gray-600 px-5 py-3 text-gray-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
            disabled={submitting}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-full bg-gray-600 px-5 py-3 text-gray-400 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
            disabled={submitting}
          />

          {errorMsg && <p className="text-rose-500 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 px-6 py-3 border-2 border-sky-600 text-sky-600 font-semibold rounded-full hover:bg-gradient-to-r hover:from-sky-600 hover:to-blue-600 hover:text-white focus:outline-none transition-all duration-200 disabled:opacity-50"
          >
            {submitting
              ? mode === "signIn"
                ? "Signing in..."
                : "Signing up..."
              : mode === "signIn"
              ? "Sign In"
              : "Sign Up"}
          </button>
        </form>
      </div>
    </>
  );
}
