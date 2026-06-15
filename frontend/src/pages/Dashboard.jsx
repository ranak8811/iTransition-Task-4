import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // লোকাল স্টোরেজ থেকে বর্তমান ইউজারের তথ্য লোড এবং ডেটা ফেচ করা
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users");
      setUsers(response.data.users);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  // ১. অল সিলেক্ট/ডিসিরেক্ট টগল করা
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = users.map((u) => u.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  // ২. নির্দিষ্ট রো সিলেক্ট/ডিসিরেক্ট করা
  const handleSelectRow = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((rowId) => rowId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // ৩. অ্যাকশন হ্যান্ডলার (ব্লক, আনব্লক, ডিলিট, ডিলিট আনভেরিফাইড)
  const handleAction = async (actionType) => {
    if (selectedIds.length === 0) return;

    try {
      if (actionType === "block") {
        await api.put("/api/users/block", { ids: selectedIds });
      } else if (actionType === "unblock") {
        await api.put("/api/users/unblock", { ids: selectedIds });
      } else if (actionType === "delete") {
        await api.delete("/api/users", { data: { ids: selectedIds } });
      } else if (actionType === "delete-unverified") {
        await api.delete("/api/users/unverified", {
          data: { ids: selectedIds },
        });
      }

      // যদি লগড ইন ইউজার নিজেকে ব্লক বা ডিলিট করে
      if (
        currentUser &&
        selectedIds.includes(currentUser.id) &&
        (actionType === "block" || actionType === "delete")
      ) {
        handleLogout();
        return;
      }

      // রিফ্রেশ অ্যান্ড রিসেট
      setSelectedIds([]);
      fetchUsers();
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // লগইন ইউজারের জন্য সুন্দর ডেট ফরমেট
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 text-gray-500">
        Loading admin panel...
      </div>
    );
  }

  const isSelectionEmpty = selectedIds.length === 0;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* হেডার */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              User Management Panel
            </h1>
            <p className="text-sm text-gray-500">
              Manage user accounts, block, unblock, or delete verification
              records.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Logged in as: <strong>{currentUser?.name}</strong>
            </span>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* টুলবার ও টেবিল কন্টেইনার */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* টুলবার */}
          <div className="flex flex-wrap items-center gap-3 bg-gray-50/70 p-4 border-b border-gray-100">
            <button
              onClick={() => handleAction("block")}
              disabled={isSelectionEmpty}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition disabled:bg-red-300 disabled:cursor-not-allowed"
            >
              Block
            </button>
            <button
              onClick={() => handleAction("unblock")}
              disabled={isSelectionEmpty}
              title="Unblock selected"
              className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Unblock (Unlock Icon) */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              </svg>
            </button>
            <button
              onClick={() => handleAction("delete")}
              disabled={isSelectionEmpty}
              title="Delete selected"
              className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Delete Icon */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <button
              onClick={() => handleAction("delete-unverified")}
              disabled={isSelectionEmpty}
              title="Delete selected unverified users"
              className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Delete Unverified Icon */}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </button>
            {selectedIds.length > 0 && (
              <span className="text-xs text-gray-500 font-medium ml-auto">
                {selectedIds.length} row(s) selected
              </span>
            )}
          </div>

          {/* রেসপন্সিভ টেবিল */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4 w-12 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        users.length > 0 && selectedIds.length === users.length
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Last Login</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400">
                      No users registered in the system.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const isSelected = selectedIds.includes(user.id);
                    return (
                      <tr
                        key={user.id}
                        className={`hover:bg-gray-50/50 transition ${isSelected ? "bg-blue-50/30" : ""}`}
                      >
                        <td className="p-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(user.id)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="p-4 font-semibold text-gray-900">
                          {user.name}
                        </td>
                        <td className="p-4 text-gray-600">{user.email}</td>
                        <td className="p-4 text-gray-500">
                          {formatDate(user.lastLoginTime)}
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase ${
                              user.status === "active"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : user.status === "blocked"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-gray-100 text-gray-700 border-gray-200"
                            }`}
                          >
                            {user.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
