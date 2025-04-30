"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SocketContext } from "@/app/context/socket";

export default function AcceptedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const socket = useContext(SocketContext);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token Expired");
        router.push("/login");
        return;
      }
      const response = await fetch("/api/orders/accepted", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setOrders(data.data || []);
    } catch (error) {
      console.error("Failed to fetch Orders:", error.message);
      alert("Something went wrong while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getNextStatus = (status) => {
    const statusFlow = ["Pending", "Accepted", "Out for Delivery", "Delivered"];
    const currentIndex = statusFlow.indexOf(status);
    return statusFlow[currentIndex + 1] || null;
  };

  const getButtonLabel = (status) => {
    const next = getNextStatus(status);
    if (!next) return null;
    return `Mark as ${next}`;
  };

  const handleStatusUpdate = async (order) => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    if (!socket) console.error("socket connection not found");
    socket.emit("order:update", {
      orderId: order._id,
      status: nextStatus,
    });

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/orders/${order._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (response.ok) {
        alert("Order status updated successfully");
        fetchOrders();
      } else {
        alert("Failed to update order status.");
      }
    } catch (error) {
      console.error("Error updating order status:", error.message);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        orders.map((order, key) => {
          const buttonLabel = getButtonLabel(order.status);
          return (
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
                    <strong>Delivery:</strong>{" "}
                    {order.delivery?.name || "Not Accepted"}
                  </p>
                </div>

                {buttonLabel && (
                  <button
                    onClick={() => handleStatusUpdate(order)}
                    className="mt-2 px-4 py-2 font-semibold text-white bg-gray-900 rounded-md hover:bg-gray-800"
                  >
                    {buttonLabel}
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
