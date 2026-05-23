import React, { useState } from "react";
import { api, AdminUser } from "../../api/client";
import { useApp } from "../../context/AppContext";
import { UserRole } from "../../types";
import { Shield, RefreshCw } from "lucide-react";

const ROLES: UserRole[] = ["owner", "editor", "author", "reader"];

export default function AdminUsersPanel() {
  const { user, notify } = useApp();
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await api.listAdminUsers(user.username, password);
      setUsers(list);
      setUnlocked(true);
      notify("User directory loaded");
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : "Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id: string, role: UserRole) => {
    if (!user) return;
    try {
      const updated = await api.updateAdminUser(id, { role }, user.username, password);
      setUsers((u) => u.map((x) => (x.id === id ? updated : x)));
      notify("Role updated");
    } catch (e: unknown) {
      notify(e instanceof Error ? e.message : "Failed", "error");
    }
  };

  if (!unlocked) {
    return (
      <div className="max-w-md space-y-4">
        <p className="text-sm text-white/50 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Owner password required to view users
        </p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="studio-input w-full px-4 py-3"
          placeholder="admin password"
        />
        <button
          type="button"
          onClick={load}
          disabled={loading || !password}
          className="px-6 py-2.5 rounded-xl bg-cyan-400 text-black text-sm font-bold cursor-pointer disabled:opacity-40"
        >
          {loading ? "..." : "Unlock user management"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-xs text-white/40">{users.length} accounts</p>
        <button type="button" onClick={load} className="text-xs flex items-center gap-1 text-cyan-400 cursor-pointer">
          <RefreshCw className="w-3 h-3" /> Refresh
        </button>
      </div>
      <div className="rounded-xl border border-white/[0.08] overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.03] text-[10px] uppercase tracking-wider text-white/40">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 hidden sm:table-cell">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/[0.06]">
                <td className="px-4 py-3">
                  <p className="font-medium">{u.name}</p>
                  <p className="text-[11px] text-white/40">@{u.username}</p>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    disabled={u.id === user?.id}
                    onChange={(e) => updateRole(u.id, e.target.value as UserRole)}
                    className="studio-input px-2 py-1 text-xs"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-white/40 text-xs">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
