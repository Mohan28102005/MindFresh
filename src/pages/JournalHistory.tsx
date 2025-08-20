import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export default function JournalHistory() {
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    const fetchJournals = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) {
        console.error("Error fetching user:", userError);
        return;
      }
      if (!user) {
        console.warn("No user is logged in.");
        return;
      }

      const { data, error } = await supabase
        .from("journaltable")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching journals:", error);
      } else {
        setJournals(data);
      }
    };

    fetchJournals();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-5xl font-extrabold mb-12 text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
          ✨ Your Journal Entries ✨
        </h1>

        {journals.length === 0 ? (
          <p className="text-gray-500 text-center text-xl italic">
            No journal entries yet. Start writing your thoughts! 📝
          </p>
        ) : (
          <div className="space-y-8">
            {journals.map((journal, idx) => (
              <div
                key={idx}
                className="relative group p-6 rounded-3xl shadow-lg border border-white/30 
                bg-white/40 backdrop-blur-xl transition-all duration-300 
                hover:scale-[1.02] hover:shadow-2xl hover:border-purple-200"
              >
                {/* Date Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-4 py-1.5 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-md">
                    {journal.created_at
                      ? new Date(journal.created_at).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Unknown Date"}
                  </span>
                </div>

                {/* Entry Text */}
                <p className="text-gray-800 whitespace-pre-line leading-relaxed text-lg group-hover:text-gray-900 transition-colors duration-300">
                  {journal.entry_text}
                </p>

                {/* Sexy Glow Line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
