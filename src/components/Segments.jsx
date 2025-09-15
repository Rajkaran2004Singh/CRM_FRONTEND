import { useState } from "react";
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
      conditions: [
        ...group.conditions,
        { logic: "AND", conditions: [] },
      ],
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
                type={
                  cond.field === "lastPurchaseDate" ? "number" : "number"
                }
                placeholder="Value"
                value={cond.value}
                onChange={(e) =>
                  updateCondition(index, "value", e.target.value)
                }
                className="border p-2 rounded w-32"
              />

              <button
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
          onClick={addCondition}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
        >
          + Condition
        </button>
        <button
          onClick={addGroup}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-500"
        >
          + Group
        </button>
      </div>
    </div>
  );
};

const Segments = () => {
  const [rules, setRules] = useState({ logic: "AND", conditions: [] });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleEvaluate = async () => {
    try {
      setError("");
      const res = await axios.post(
        "https://crm-backend-gsa9.onrender.com/segments/evaluate",
        rules,
        { withCredentials: true }
      );
      setResult(res.data);
    } catch (err) {
      console.error("Error evaluating segment:", err);
      setError("Error evaluating segment. Please check rules.");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Segment Builder</h1>

      <ConditionGroup group={rules} onChange={setRules} />

      <button
        onClick={handleEvaluate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        Evaluate Segment
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">
            Audience Size: {result.audienceSize}
          </h2>
          <table className="w-full border-collapse bg-white shadow rounded">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Total Spend</th>
                <th className="p-3 text-left">Visits</th>
                <th className="p-3 text-left">Last Purchase</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((cust) => (
                <tr key={cust._id} className="border-t">
                  <td className="p-3">{cust.name}</td>
                  <td className="p-3">{cust.email}</td>
                  <td className="p-3">₹{cust.totalSpend}</td>
                  <td className="p-3">{cust.visits}</td>
                  <td className="p-3">
                    {cust.lastPurchaseDate
                      ? new Date(cust.lastPurchaseDate).toLocaleDateString()
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <h2 className="font-semibold">Generated JSON Rules</h2>
        <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
          {JSON.stringify(rules, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Segments;