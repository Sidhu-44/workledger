import { Download, LogOut, Moon, Sun, Upload } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { authService } from "../services/authService";
import { settingsService } from "../services/reportService";

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED", "AUD"];
const LANGUAGES = [
  { value: "en", label: "English" },
  // { value: "hi", label: "हिन्दी (Hindi)  Coming Soon..." },
  // { value: "te", label: "తెలుగు (Telugu)  Coming Soon..." },
  // { value: "ta", label: "தமிழ் (Tamil)  Coming Soon..." },
];

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef(null);
  const [saving, setSaving] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const saveField = async (field, value) => {
    setSaving(true);
    try {
      const updated = await authService.updateProfile({ [field]: value });
      updateUser(updated);
      toast.success("Settings saved.");
    } catch {
      toast.error("Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      await settingsService.backup();
      toast.success("Backup downloaded.");
    } catch {
      toast.error("Could not create backup.");
    }
  };

  const handleRestoreFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRestoring(true);
    try {
      const result = await settingsService.restore(file);
      toast.success(`Restored ${result.restored_customers} customers and ${result.restored_work_entries} work entries.`);
    } catch {
      toast.error("Could not restore backup. Please check the file.");
    } finally {
      setRestoring(false);
      e.target.value = "";
    }
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Personalize the app and manage your data." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Switch between light and dark mode.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="h-10 w-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Regional</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Currency</label>
              <select
                defaultValue={user?.currency || "INR"}
                onChange={(e) => saveField("currency", e.target.value)}
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3.5 py-2.5 text-sm bg-white dark:bg-gray-900"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Language</label>
              <select
                defaultValue={user?.language || "en"}
                onChange={(e) => saveField("language", e.target.value)}
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3.5 py-2.5 text-sm bg-white dark:bg-gray-900"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-gray-400">
                Full translations are on the roadmap; this preference is saved for when they ship.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Backup &amp; Restore</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Download a full copy of your customers, work entries, and payments, or restore from a previous backup.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={handleBackup}>
              <Download size={16} /> Download Backup
            </Button>
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()} isLoading={restoring}>
              <Upload size={16} /> Restore from File
            </Button>
            <input ref={fileInputRef} type="file" accept="application/json" hidden onChange={handleRestoreFile} />
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">Account</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Signed in as {user?.full_name} ({user?.phone_number}).
          </p>
          <Button variant="danger" onClick={logout}>
            <LogOut size={16} /> Log Out
          </Button>
        </Card>
      </div>
    </div>
  );
}
