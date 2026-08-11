"use client";

import { useState } from "react";

export default function PassengerPage() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "male",
    phone: "",
  });

  const handleSubmit = () => {
    localStorage.setItem(
      "passenger",
      JSON.stringify(form)
    );

    window.location.href = "/payment";
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6">
        Passenger Details
      </h1>

      <div className="space-y-4 max-w-md">

        <input
          placeholder="Full Name"
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="Age"
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              age: e.target.value,
            })
          }
        />

        <select
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              gender: e.target.value,
            })
          }
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <input
          placeholder="Phone Number"
          className="border p-3 w-full"
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value,
            })
          }
        />

        <button
          onClick={handleSubmit}
          className="bg-indigo-600 text-white px-5 py-3 rounded"
        >
          Continue
        </button>
      </div>
    </div>
  );
}