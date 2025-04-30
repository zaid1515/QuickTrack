"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token Expired");
        router.push("/login");
        return;
      }
      const response = await fetch("/api/orders/history", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log(data)
      setOrders(data.data || []);
    } catch (error) {
      console.error("Failed to fetch Orders:", error.message);
      alert("Something went wrong while fetching orders.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        orders.map((order,key) => (
          <div
            key={key}
            className="border rounded-lg overflow-hidden shadow-sm"
          >
            <div className="bg-gray-100 p-4 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900">
                  Order #{order.id}
                </h2>
                <div className="flex items-center text-xs text-gray-600 mt-1">
                  Placed {order.createdAt || "some time ago"}
                </div>
              </div>
              <span className="border px-3 py-1 text-md font-semibold rounded-full text-gray-700 border-gray-700">
                {order.status}
              </span>
            </div>
            <div className="p-4 space-y-2 text-sm text-gray-800">
              <div className="flex items-start">
                <div>
                  <p className="font-medium">{order.product.name}</p>
                  <p className="text-gray-500">Quantity: {order.quantity}</p>
                </div>
              </div>
              <div className="flex items-center">
                <p>{order.location}</p>
              </div>
              <div className="flex items-center">
                <p>
                  <strong>Customer:</strong> {order.customer.name} &nbsp;
                  <strong>Delivery:</strong> {order.delivery?.name || "Not Accepted"}
                </p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
