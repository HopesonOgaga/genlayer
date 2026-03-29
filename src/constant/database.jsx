import React, { useEffect, useState } from "react";
import { supabase } from "../supabase-client.js";
import { useAuth } from "../context/authcontext"; 
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

export default function Database() {
  // 1. Destructure 'signOut' (matching your context)
  const { signOut } = useAuth(); 
  const navigate = useNavigate();
  
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut();
      // 2. Explicitly move to login so you don't land on "/"
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Error signing out:", err.message);
    }
  };

  // ✅ Fetch initial data
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("sales_deals")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;
        setDeals(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  // ✅ Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("sales_deals_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sales_deals" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setDeals((prev) => [...prev, payload.new]);
          }
          if (payload.eventType === "DELETE") {
            setDeals((prev) => prev.filter((item) => item.id !== payload.old.id));
          }
          if (payload.eventType === "UPDATE") {
            setDeals((prev) =>
              prev.map((item) => (item.id === payload.new.id ? payload.new : item))
            );
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0b0f14] flex items-center justify-center text-white">
        <p className="animate-pulse">Loading dashboard...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white p-6">
      {/* --- HEADER --- */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Sales Dashboard</h1>
          <p className="text-sm text-green-400 font-medium">Live Database Connection Active</p>
        </div>
        
        {/* 3. Button calls the new handler */}
        <button
          onClick={handleSignOut}
          className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg transition text-sm font-semibold"
        >
          Sign Out
        </button>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#121a22] p-6 rounded-2xl border border-white/5 shadow-xl">
          <h2 className="text-lg font-semibold mb-6">Revenue Overview</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a222c" vertical={false} />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#6b7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a222c", border: "none", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ color: "#818cf8" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {deals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.value > 5000 ? "#818cf8" : "#4f46e5"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#121a22] p-6 rounded-2xl border border-white/5 shadow-xl overflow-hidden">
          <h2 className="text-lg font-semibold mb-4">Recent Deals</h2>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {deals.map((deal) => (
              <div key={deal.id} className="flex justify-between items-center p-3 bg-[#1a222c] rounded-xl border border-white/5">
                <div>
                  <p className="font-medium text-sm">{deal.name}</p>
                  <p className="text-xs text-gray-500">ID: #{deal.id.toString().slice(0, 5)}</p>
                </div>
                <span className="text-indigo-400 font-bold">${deal.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}