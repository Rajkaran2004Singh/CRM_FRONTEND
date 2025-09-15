import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios
      .get("https://crm-backend-gsa9.onrender.com/dashboard/summary", {
        withCredentials: true,
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Error fetching dashboard stats:", err));
  }, []);

  if (!stats) return <p className="text-gray-500">Loading dashboard...</p>;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="bg-gray-100 p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold">
          Welcome back, {stats.user?.name}
        </h1>
        <p className="text-gray-600">Here's your business snapshot:</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">Customers</h2>
          <p className="text-2xl font-bold">{stats.totalCustomers}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500 text-sm">Campaigns</h2>
          <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
        </div>
        {/* Only show Revenue if backend provides it */}
        {stats.totalRevenue !== undefined && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-gray-500 text-sm">Revenue</h2>
            <p className="text-2xl font-bold">₹{stats.totalRevenue}</p>
          </div>
        )}
      </div>

      {/* Recent Campaigns */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Campaigns</h2>
        <ul className="bg-white rounded-xl shadow divide-y">
          {stats.recentCampaigns.map((c) => (
            <li key={c._id} className="p-3">
              {c.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Customers */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Customers</h2>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Total Spend</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentCustomers.map((cust) => (
                <tr key={cust._id} className="border-t">
                  <td className="p-3">{cust.name}</td>
                  <td className="p-3">{cust.email}</td>
                  <td className="p-3">₹{cust.totalSpend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
