"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, role }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (response.ok) {
        const token = data.data;
        const decoded = jwt.decode(token);
        const { userId, role } = decoded;

        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);

        router.push(
          role === "customer" ? "/dashboard/customer" : "/dashboard/delivery"
        );
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500">
          Sign in to access your account
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Role:
            </label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 bg-white text-gray-900"
            >
              <option value="customer">Customer</option>
              <option value="delivery">Delivery Partner</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="someone@gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-gray-900 rounded-md flex justify-center items-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
