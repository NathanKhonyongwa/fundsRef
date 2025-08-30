"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { db } from "./lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function FundsPage() {
  const goal = 2_000_000; // 2 Million Kwacha
  const [amount, setAmount] = useState(0); // ✅ always a number
  const [inputValue, setInputValue] = useState("");
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // ✅ Load from Firestore when page loads
  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const docRef = doc(db, "funds", "progress");
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          // default to 0 if amount is missing
          setAmount(snapshot.data().amount ?? 0);
        }
      } catch (error) {
        console.error("Error fetching funds:", error);
      }
    };
    fetchFunds();
  }, []);

  // Track window size for confetti
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () =>
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  // Chart data
  const data = [
    { name: "Goal", kwacha: goal },
    { name: "Raised", kwacha: amount },
  ];

  // ✅ Save to Firestore when new funds are added
  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = Number(inputValue);
    if (!isNaN(value) && value >= 0) {
      const newAmount = amount + value;

      await setDoc(doc(db, "funds", "progress"), {
        amount: newAmount,
      });

      setAmount(newAmount);
      setInputValue("");
    }
  };

  const remaining = Math.max(goal - amount, 0);
  const surplus = amount > goal ? amount - goal : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 p-6 relative overflow-hidden">
      {/* 🎆 Fireworks when goal reached or exceeded */}
      {amount >= goal && (
        <Confetti width={windowSize.width} height={windowSize.height} />
      )}

      <h1 className="text-3xl font-bold text-center mb-6">
        Area 49 SDA Youth Choir FundsReflect 🎯
      </h1>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="number"
          placeholder="Enter amount"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          type="submit"
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Add
        </button>
      </form>

      {/* Animated current amount */}
      <motion.div
        key={amount}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-xl font-semibold mb-2"
      >
        Current Amount: {Number(amount).toLocaleString()} Kwacha
      </motion.div>

      {/* Remaining / Surplus */}
      {amount < goal ? (
        <p className="text-lg text-gray-700 mb-4">
          Remaining: {remaining.toLocaleString()} Kwacha
        </p>
      ) : surplus > 0 ? (
        <p className="text-lg text-blue-700 font-bold mb-4">
          🎉 Goal Reached! Surplus: {surplus.toLocaleString()} Kwacha
        </p>
      ) : (
        <p className="text-lg text-green-700 font-bold mb-4">
          🎉 Goal Reached!
        </p>
      )}

      {/* Bar Chart */}
      <div className="w-full max-w-2xl h-96 bg-white rounded-2xl shadow-xl p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={80}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            {/* ✅ Dynamic Y-axis (supports surplus) */}
            <YAxis domain={[0, Math.max(goal, amount)]} />
            <Tooltip
              formatter={(value) => `${Number(value).toLocaleString()} Kwacha`}
            />
            <Bar
              dataKey="kwacha"
              fill="#22c55e"
              radius={[10, 10, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Goal display */}
      <p className="mt-4 text-lg font-medium text-gray-700">
        Goal: {goal.toLocaleString()} Kwacha
      </p>
    </div>
  );
}