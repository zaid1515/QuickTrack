"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PlaceOrder() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 0,
    location: "",
  });

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token Expired");
        router.push("/login");
        return;
      }
      const response = await fetch("/api/product", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setProducts(data.data);
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Token Expired");
        router.push("/login");
        return;
      }
      const response = await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        alert("Order placed successfully")
        router.push("/dashboard/customer");
      } else {
        alert("Failed to place the order");
      }
    } catch (error) {
      console.error(error.message);
      alert(error.message);
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
    <div className="flex items-center justify-center px-4 mt-1 py-4">
      <button
        onClick={() => router.push("/dashboard/customer")}
        className="border-gray-400 border-2 rounded-2xl py-2 px-4 text-md bg-white absolute top-20 left-10 cursor-pointer"
      >
        Back to Dashboard
      </button>

      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-center text-gray-900">
          Place New Order
        </h2>
        <p className="text-center text-gray-500">
          Fill in the details to continue
        </p>

        <form onSubmit={placeOrder} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product
            </label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300 bg-white text-gray-900"
            >
              <option value="">Select a product</option>
              {products.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 font-semibold text-white bg-gray-900 rounded-md hover:bg-gray-800"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}
