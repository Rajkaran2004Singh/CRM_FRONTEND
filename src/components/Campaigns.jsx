import { useState, useEffect } from "react";
import axios from "axios";

const fields = [
  { label: "Total Spend", value: "totalSpend" },
  { label: "Visits", value: "visits" },
  { label: "Last Purchase Date", value: "lastPurchaseDate" },
];

const operators = {
  number: [">", "<", "=", "!="],
  date: ["daysAgo"],
};

// Reusable ConditionGroup builder
const ConditionGroup = ({ group, onChange, onRemove }) => {
  const updateCondition = (index, key, value) => {
    const updated = [...group.conditions];
    updated[index] = { ...updated[index], [key]: value };
    onChange({ ...group, conditions: updated });
  };

  const addCondition = () => {
    onChange({
      ...group,
      conditions: [
        ...group.conditions,
        { field: "totalSpend", operator: ">", value: "" },
      ],
    });
  };

  const addGroup = () => {
    onChange({
      ...group,
      conditions: [...group.conditions, { logic: "AND", conditions: [] }],
    });
  };

  const removeCondition = (index) => {
    const updated = group.conditions.filter((_, i) => i !== index);
    onChange({ ...group, conditions: updated });
  };

  return (
    <div className="border rounded p-4 my-3 bg-gray-50">
      <div className="flex items-center gap-3 mb-3">
        <span className="font-semibold">Match with:</span>
        <select
          value={group.logic}
          onChange={(e) => onChange({ ...group, logic: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-auto bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
          >
            Remove Group
          </button>
        )}
      </div>

      <div className="space-y-3">
        {group.conditions.map((cond, index) =>
          cond.conditions ? (
            <ConditionGroup
              key={index}
              group={cond}
              onChange={(updated) => {
                const newConditions = [...group.conditions];
                newConditions[index] = updated;
                onChange({ ...group, conditions: newConditions });
              }}
              onRemove={() => removeCondition(index)}
            />
          ) : (
            <div
              key={index}
              className="flex items-center gap-3 bg-white p-2 rounded border"
            >
              <select
                value={cond.field}
                onChange={(e) => updateCondition(index, "field", e.target.value)}
                className="border p-2 rounded"
              >
                {fields.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>

              <select
                value={cond.operator}
                onChange={(e) =>
                  updateCondition(index, "operator", e.target.value)
                }
                className="border p-2 rounded"
              >
                {(cond.field === "lastPurchaseDate"
                  ? operators.date
                  : operators.number
                ).map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Value"
                value={cond.value}
                onChange={(e) => updateCondition(index, "value", e.target.value)}
                className="border p-2 rounded w-32"
              />

              <button
                type="button"
                onClick={() => removeCondition(index)}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
              >
                Remove
              </button>
            </div>
          )
        )}
      </div>

      <div className="flex gap-3 mt-3">
        <button
          type="button"
          onClick={addCondition}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
        >
          + Condition
        </button>
        <button
          type="button"
          onClick={addGroup}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-500"
        >
          + Group
        </button>
      </div>
    </div>
  );
};

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    message: "",
    scheduledDate: "",
  });
  const [rules, setRules] = useState({ logic: "AND", conditions: [] });
  const [message, setMessage] = useState("");
  const [deliveryResults, setDeliveryResults] = useState({});

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get("https://crm-backend-gsa9.onrender.com/campaigns", {
        withCredentials: true,
      });
      setCampaigns(res.data.data || []);
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://crm-backend-gsa9.onrender.com/campaigns",
        {
          name: form.name,
          description: form.description,
          rules,
          message: form.message,
          scheduledDate: form.scheduledDate,
        },
        { withCredentials: true }
      );

      alert("Campaign created!");
      setForm({
        name: "",
        description: "",
        message: "",
        scheduledDate: "",
      });
      setRules({ logic: "AND", conditions: [] });
      fetchCampaigns();
    } catch (err) {
      console.error("Error creating campaign:", err);
    }
  };

  const handleDeliver = async (id) => {
    try {
      setMessage("");
      const res = await axios.post(
        `https://crm-backend-gsa9.onrender.com/campaigns/${id}/deliver`,
        {},
        { withCredentials: true }
      );

      setMessage(res.data.message || "Campaign delivered!");
      setDeliveryResults((prev) => ({
        ...prev,
        [id]: res.data.results,
      }));
      fetchCampaigns();
    } catch (err) {
      console.error("Error delivering campaign:", err);
      setMessage("Failed to deliver campaign");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Campaigns</h2>

      <form onSubmit={handleCreate} className="space-y-4 mb-6">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Campaign Name"
          className="border p-2 w-full rounded"
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="border p-2 w-full rounded"
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Message"
          className="border p-2 w-full rounded"
        />
        <input
          type="datetime-local"
          name="scheduledDate"
          value={form.scheduledDate}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        {/* Audience Rules */}
        <div>
          <h3 className="font-semibold mb-2">Audience Rules</h3>
          <ConditionGroup group={rules} onChange={setRules} />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Campaign
        </button>
      </form>

      {message && <p className="text-green-600 mb-4">{message}</p>}

      <h3 className="text-lg font-semibold mb-2">Existing Campaigns</h3>
      <ul className="space-y-4">
        {campaigns.map((c) => (
          <li key={c._id} className="border p-3 rounded shadow">
            <p className="font-bold">{c.name}</p>
            <p>{c.description}</p>
            <p>Audience Count: {c.audience?.audienceCount || 0}</p>
            <p>Message: {c.message}</p>
            <p>
              Sent: {c.messagesSent} | Failed: {c.messagesFailed}
            </p>
            <button
              onClick={() => handleDeliver(c._id)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
            >
              Deliver
            </button>

            {deliveryResults[c._id] && (
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <h4 className="font-semibold mb-2">Delivery Results:</h4>
                <ul className="space-y-1">
                  {deliveryResults[c._id].map((r, i) => (
                    <li key={i} className="text-sm">
                      - <strong>{r.customerName}</strong>: "{r.personalizedMessage}" →{" "}
                      {r.status === "SENT" ? (
                        <span className="text-green-600">SENT ✅</span>
                      ) : (
                        <span className="text-red-600">FAILED ❌</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Campaigns;