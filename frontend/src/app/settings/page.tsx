"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Check,
  Globe,
  Monitor,
  Moon,
  Palette,
  Save,
  Shield,
  Sun,
  User,
  Bell,
} from "lucide-react";

type SettingsTab = "general" | "profile" | "notifications" | "security";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] =
    useState<SettingsTab>("general");

  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("Africa/Kigali");

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);

    const savedLanguage =
      localStorage.getItem("settings_language");

    const savedTimezone =
      localStorage.getItem("settings_timezone");

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    if (savedTimezone) {
      setTimezone(savedTimezone);
    }
  }, []);

  function handleSave() {
    localStorage.setItem(
      "settings_language",
      language,
    );

    localStorage.setItem(
      "settings_timezone",
      timezone,
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  function changeTheme(value: string) {
    setTheme(value);
  }

  const tabs = [
    {
      id: "general" as SettingsTab,
      label: "General",
      icon: Palette,
    },
    {
      id: "profile" as SettingsTab,
      label: "Profile",
      icon: User,
    },
    {
      id: "notifications" as SettingsTab,
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "security" as SettingsTab,
      label: "Security",
      icon: Shield,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Settings
          </h1>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Manage your ConsolaCMS preferences and account settings.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Settings Sidebar */}
          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="px-3 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                Settings
              </p>
            </div>

            <div className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={[
                      "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                      active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
                    ].join(" ")}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {/* General */}
            {activeTab === "general" && (
              <>
                <div className="p-6">
                  <div className="mb-8 flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      <Palette className="h-6 w-6" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        General Settings
                      </h2>

                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Customize the appearance and regional preferences of your dashboard.
                      </p>
                    </div>
                  </div>

                  {/* Appearance */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                      Appearance
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Choose how ConsolaCMS should look on your device.
                    </p>

                    <div className="mt-4 grid gap-4 md:grid-cols-3">
                      {/* Light */}
                      <button
                        type="button"
                        onClick={() => changeTheme("light")}
                        className={[
                          "relative rounded-2xl border p-5 text-left transition-all",
                          theme === "light"
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-500/10"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600",
                        ].join(" ")}
                      >
                        {mounted && theme === "light" && (
                          <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                            <Check className="h-3 w-3" />
                          </div>
                        )}

                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                          <Sun className="h-5 w-5" />
                        </div>

                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          Light
                        </h4>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Bright interface
                        </p>
                      </button>

                      {/* Dark */}
                      <button
                        type="button"
                        onClick={() => changeTheme("dark")}
                        className={[
                          "relative rounded-2xl border p-5 text-left transition-all",
                          theme === "dark"
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-500/10"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600",
                        ].join(" ")}
                      >
                        {mounted && theme === "dark" && (
                          <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                            <Check className="h-3 w-3" />
                          </div>
                        )}

                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                          <Moon className="h-5 w-5" />
                        </div>

                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          Dark
                        </h4>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Dark interface
                        </p>
                      </button>

                      {/* System */}
                      <button
                        type="button"
                        onClick={() => changeTheme("system")}
                        className={[
                          "relative rounded-2xl border p-5 text-left transition-all",
                          theme === "system"
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 dark:border-blue-500 dark:bg-blue-500/10"
                            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600",
                        ].join(" ")}
                      >
                        {mounted && theme === "system" && (
                          <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                            <Check className="h-3 w-3" />
                          </div>
                        )}

                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                          <Monitor className="h-5 w-5" />
                        </div>

                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          System
                        </h4>

                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Follow device
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Language + Timezone */}
                  <div className="mt-8 grid gap-5 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="language"
                        className="mb-2 block text-sm font-medium text-slate-900 dark:text-white"
                      >
                        Language
                      </label>

                      <div className="relative">
                        <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                        <select
                          id="language"
                          value={language}
                          onChange={(e) =>
                            setLanguage(e.target.value)
                          }
                          className="h-11 w-full appearance-none rounded-xl border border-slate-300 bg-white pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                        >
                          <option value="English">
                            English
                          </option>

                          <option value="Kinyarwanda">
                            Kinyarwanda
                          </option>

                          <option value="French">
                            French
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="timezone"
                        className="mb-2 block text-sm font-medium text-slate-900 dark:text-white"
                      >
                        Timezone
                      </label>

                      <select
                        id="timezone"
                        value={timezone}
                        onChange={(e) =>
                          setTimezone(e.target.value)
                        }
                        className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      >
                        <option value="Africa/Kigali">
                          Africa/Kigali
                        </option>

                        <option value="Africa/Nairobi">
                          Africa/Nairobi
                        </option>

                        <option value="Africa/Lagos">
                          Africa/Lagos
                        </option>

                        <option value="UTC">
                          UTC
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/70 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Changes are stored locally for now.
                  </p>

                  <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    {saved ? (
                      <>
                        <Check className="h-4 w-4" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Profile */}
            {activeTab === "profile" && (
              <div className="p-6">
                <div className="mb-8 flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <User className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Profile
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Manage your profile information.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Profile settings can be managed here.
                  </p>
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div className="p-6">
                <div className="mb-8 flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Bell className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Notifications
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Manage how you receive notifications.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Notification settings can be managed here.
                  </p>
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === "security" && (
              <div className="p-6">
                <div className="mb-8 flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    <Shield className="h-6 w-6" />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                      Security
                    </h2>

                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Manage your security preferences.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Security settings can be managed here.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}