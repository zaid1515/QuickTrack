"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState,createContext } from "react";
import { io } from "socket.io-client";;
import {SocketContext} from '../context/socket'
// export const SocketContext = createContext(null);

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
    fetchUser();

    const token = localStorage.getItem("token");
    if (token) {
      const s = io("http://localhost:4000", {
        auth: { token },
      });
      s.on("connect_error", (err) => console.error("Socket auth error:", err));
      console.log(s)
      setSocket(s);
    }
    return () => {
      socket?.disconnect();
    };
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const { data } = await response.json();
        setName(data?.name || "User");
      } else {
        setName("User");
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setName("User");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    router.push("/login");
  };

  const customerLinks = [
    { href: "/dashboard/customer", label: "All Orders" },
    { href: "/dashboard/customer/place-order", label: "Place Order" },
    { href: "/dashboard/customer/history", label: "Past Orders" },
  ];

  const deliveryLinks = [
    { href: "/dashboard/delivery", label: "Pending Orders" },
    { href: "/dashboard/delivery/accepted", label: "Accepted Orders" },
    { href: "/dashboard/delivery/history", label: "Past Orders" },
  ];

  const navLinks = role === "delivery" ? deliveryLinks : customerLinks;

  return (
    <SocketContext.Provider value={socket}>
      <div className="min-h-screen bg-white">
        <header className="w-full border-b bg-white px-8 py-4 flex items-center justify-between">
          <div className="text-lg font-bold">QuickTrack</div>

          <nav>
            <ul className="flex gap-6 text-sm font-medium text-gray-600">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`hover:text-black ${
                      pathname === link.href
                        ? "text-black font-semibold underline"
                        : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4 text-sm text-gray-700">
            <div className="text-right">
              <div className="font-medium">{name || "User"}</div>
              <div className="text-xs capitalize text-gray-500">{role}</div>
            </div>
            <button
              onClick={logout}
              className="border-gray-400 border-2 rounded-2xl py-2 px-4 text-sm bg-white cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </SocketContext.Provider>
  );
}
