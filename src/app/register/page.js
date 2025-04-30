"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-type": "application/json" },
      });

      const data = await response.json();
      console.log("Registered User", data);

      if (response.ok) {
        router.push("/login");
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Create an account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name:
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 bg-white text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              placeholder="someone@gmail.com"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 bg-white text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium">
              Password:
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 bg-white text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium">
              Role:
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 bg-white text-gray-900"
            >
              <option value="customer">Customer</option>
              <option value="delivery">Delivery Partner</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 font-semibold text-white bg-gray-900 rounded-md flex items-center justify-center"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Register"
            )}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
