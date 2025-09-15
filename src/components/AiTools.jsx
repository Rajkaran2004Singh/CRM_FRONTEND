import { useState } from "react";
import axios from "axios";

const AiTools = () => {
  const [campaignObjective, setCampaignObjective] = useState("");
  const [audienceType, setAudienceType] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuggestions([]);

    try {
      const res = await axios.post(
        "https://crm-backend-gsa9.onrender.com/ai/messages",
        { campaignObjective, audienceType },
        { withCredentials: true }
      );

      setSuggestions(res.data.suggestions || []);
    } catch (err) {
      console.error("Error generating suggestions:", err);
      setError("Failed to generate AI suggestions. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Insights</h1>

      <form
        onSubmit={handleGenerate}
        className="mb-6 flex flex-col gap-4 max-w-lg"
      >
        <input
          type="text"
          placeholder="Campaign Objective (e.g. Increase signups)"
          value={campaignObjective}
          onChange={(e) => setCampaignObjective(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Audience Type (e.g. new users, premium customers)"
          value={audienceType}
          onChange={(e) => setAudienceType(e.target.value)}
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Suggestions"}
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {suggestions.length > 0 && (
        <div className="bg-white shadow rounded p-4">
          <h2 className="text-lg font-semibold mb-2">AI Suggestions:</h2>
          <ul className="list-disc list-inside space-y-2">
            {suggestions.map((msg, idx) => (
              <li key={idx} className="text-gray-800">
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AiTools;
