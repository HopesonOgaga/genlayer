import React, { useEffect, useState } from "react";
import { supabase } from "../supabase-client.js";

export default function Database() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch initial data
  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);

        const { data, error } = await supabase
          .from("sales_deals")
          .select("*");

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
        {
          event: "*",
          schema: "public",
          table: "sales_deals",
        },
        (payload) => {
          console.log("Change received!", payload);

          if (payload.eventType === "INSERT") {
            setDeals((prev) => [...prev, payload.new]);
          }

          if (payload.eventType === "DELETE") {
            setDeals((prev) =>
              prev.filter((item) => item.id !== payload.old.id)
            );
          }

          if (payload.eventType === "UPDATE") {
            setDeals((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ✅ UI states
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <section>
      <p className="text-center text-green-400 font-bold">
        Welcome to the sale dashboard
      </p>

      <div>
        <h2 className="capitalize">
          Total sales this quarter gents
        </h2>

        {/* Render deals */}
        <ul>
          {deals.map((deal) => (
            <li key={deal.id}>
              {deal.name} - {deal.value}
            </li>
          ))}
        </ul>

        {/* Debug */}
        <pre>{JSON.stringify(deals, null, 2)}</pre>
      </div>
    </section>
  );
}