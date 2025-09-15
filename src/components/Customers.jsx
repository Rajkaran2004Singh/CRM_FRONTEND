import { useState, useEffect } from "react";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    totalSpend: "",
    visits: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("https://crm-backend-gsa9.onrender.com/customers", {
        withCredentials: true,
      });
      setCustomers(res.data.data || []);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://crm-backend-gsa9.onrender.com/customers",
        {
          ...newCustomer,
          totalSpend: Number(newCustomer.totalSpend) || 0,
          visits: Number(newCustomer.visits) || 0,
        },
        { withCredentials: true }
      );

      setNewCustomer({ name: "", email: "", totalSpend: "", visits: "" });
      fetchCustomers();
    } catch (err) {
      console.error("Error adding customer:", err);
      setError("Failed to add customer");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://crm-backend-gsa9.onrender.com/customers/${id}`, {
        withCredentials: true,
      });
      fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer:", err);
      setError("Failed to delete customer");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customers</h1>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading && <p className="text-gray-600 mb-4">Loading customers...</p>}

      <form
        onSubmit={handleAddCustomer}
        className="mb-6 flex gap-2 flex-wrap items-end"
      >
        <input
          type="text"
          placeholder="Name"
          value={newCustomer.name}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, name: e.target.value })
          }
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newCustomer.email}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, email: e.target.value })
          }
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Total Spend"
          value={newCustomer.totalSpend}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, totalSpend: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Visits"
          value={newCustomer.visits}
          onChange={(e) =>
            setNewCustomer({ ...newCustomer, visits: e.target.value })
          }
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
        >
          Add
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Total Spend</th>
              <th className="p-3 text-left">Visits</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(customers) &&
              customers.map((cust) => (
                <tr key={cust._id} className="border-t">
                  <td className="p-3">{cust.name}</td>
                  <td className="p-3">{cust.email}</td>
                  <td className="p-3">₹{cust.totalSpend}</td>
                  <td className="p-3">{cust.visits}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(cust._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
