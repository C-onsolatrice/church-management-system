"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  Check,
  Globe,
  Lock,
  Moon,
  Palette,
  Save,
  Settings,
  Shield,
  Sun,
  User,
  Monitor,
} from "lucide-react";
import { useTheme } from "next-themes";

type SettingsTab =
  | "general"
  | "profile"
  | "notifications"
  | "security";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] =
    useState<SettingsTab>("general");

  const [mounted, setMounted] =
    useState(false);

  const [name, setName] =
    useState("Admin User");

  const [email, setEmail] =
    useState("admin@example.com");

  const [phone, setPhone] =
    useState("");

  const [language, setLanguage] =
    useState("English");

  const [timezone, setTimezone] =
    useState("Africa/Kigali");

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [pushNotifications, setPushNotifications] =
    useState(true);

  const [memberNotifications, setMemberNotifications] =
    useState(true);

  const [eventNotifications, setEventNotifications] =
    useState(true);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [saved, setSaved] =
    useState(false);

  useEffect(() => {
    setMounted(true);

    try {
      const savedUser =
        localStorage.getItem("user");

      if (savedUser) {
        const user = JSON.parse(savedUser);

        if (user.name) {
          setName(user.name);
        }

        if (user.email) {
          setEmail(user.email);
        }

        if (user.phone) {
          setPhone(user.phone);
        }
      }

      const savedSettings =
        localStorage.getItem(
          "consolacms-settings",
        );

      if (savedSettings) {
        const settings =
          JSON.parse(savedSettings);

        setLanguage(
          settings.language || "English",
        );

        setTimezone(
          settings.timezone || "Africa/Kigali",
        );

        setEmailNotifications(
          settings.emailNotifications ?? true,
        );

        setPushNotifications(
          settings.pushNotifications ?? true,
        );

        setMemberNotifications(
          settings.memberNotifications ?? true,
        );

        setEventNotifications(
          settings.eventNotifications ?? true,
        );
      }
    } catch (error) {
      console.error(
        "Failed to load settings:",
        error,
      );
    }
  }, []);

  function saveSettings() {
    const settings = {
      language,
      timezone,
      emailNotifications,
      pushNotifications,
      memberNotifications,
      eventNotifications,
    };

    localStorage.setItem(
      "consolacms-settings",
      JSON.stringify(settings),
    );

    const storedUser =
      localStorage.getItem("user");

    try {
      const user = storedUser
        ? JSON.parse(storedUser)
        : {};

      const updatedUser = {
        ...user,
        name,
        email,
        phone,
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser),
      );
    } catch {
      // Ignore invalid localStorage user data
    }

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  function changePassword() {
    if (!currentPassword) {
      alert("Enter your current password.");
      return;
    }

    if (!newPassword) {
      alert("Enter your new password.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert(
        "New password and confirmation do not match.",
      );
      return;
    }

    alert(
      "Password change request saved. Connect this form to your backend auth API.",
    );

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  const tabs = [
    {
      id: "general" as SettingsTab,
      label: "General",
      icon: Settings,
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-400">
          Manage your ConsolaCMS preferences
          and account settings.
        </p>
      </div>

      {/* Main settings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        {/* Settings navigation */}
        <div className="h-fit rounded-2xl border border-slate-800 bg-slate-900 p-3">
          <p className="px-3 pb-3 pt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Settings
          </p>

          <div className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active =
                activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={[
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition",
                    active
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white",
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
        <div className="rounded-2xl border border-slate-800 bg-slate-900">
          {/* General */}
          {activeTab === "general" && (
            <div className="p-6 sm:p-8">
              <SectionHeader
                icon={Palette}
                title="General Settings"
                description="Customize the appearance and regional preferences of your dashboard."
              />

              <div className="mt-8 space-y-8">
                {/* Theme */}
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Appearance
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Choose how ConsolaCMS should
                    look on your device.
                  </p>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <ThemeCard
                      title="Light"
                      description="Bright interface"
                      icon={Sun}
                      active={
                        mounted &&
                        theme === "light"
                      }
                      onClick={() =>
                        setTheme("light")
                      }
                    />

                    <ThemeCard
                      title="Dark"
                      description="Dark interface"
                      icon={Moon}
                      active={
                        mounted &&
                        theme === "dark"
                      }
                      onClick={() =>
                        setTheme("dark")
                      }
                    />

                    <ThemeCard
                      title="System"
                      description="Follow device"
                      icon={Monitor}
                      active={
                        mounted &&
                        theme === "system"
                      }
                      onClick={() =>
                        setTheme("system")
                      }
                    />
                  </div>
                </div>

                {/* Language */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Language
                    </label>

                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

                      <select
                        value={language}
                        onChange={(e) =>
                          setLanguage(
                            e.target.value,
                          )
                        }
                        className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 pl-10 pr-4 text-sm text-white outline-none focus:border-blue-500"
                      >
                        <option>
                          English
                        </option>

                        <option>
                          Kinyarwanda
                        </option>

                        <option>
                          French
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Timezone
                    </label>

                    <select
                      value={timezone}
                      onChange={(e) =>
                        setTimezone(
                          e.target.value,
                        )
                      }
                      className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm text-white outline-none focus:border-blue-500"
                    >
                      <option value="Africa/Kigali">
                        Africa/Kigali
                      </option>

                      <option value="UTC">
                        UTC
                      </option>

                      <option value="Africa/Nairobi">
                        Africa/Nairobi
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Profile */}
          {activeTab === "profile" && (
            <div className="p-6 sm:p-8">
              <SectionHeader
                icon={User}
                title="Profile"
                description="Update your personal account information."
              />

              <div className="mt-8">
                <div className="mb-8 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                    {name
                      ? name
                          .charAt(0)
                          .toUpperCase()
                      : "A"}
                  </div>

                  <div>
                    <p className="font-semibold text-white">
                      {name}
                    </p>

                    <p className="text-sm text-slate-500">
                      Super Admin
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <InputField
                    label="Full Name"
                    value={name}
                    onChange={setName}
                    placeholder="Enter your name"
                  />

                  <InputField
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="admin@example.com"
                  />

                  <InputField
                    label="Phone Number"
                    value={phone}
                    onChange={setPhone}
                    placeholder="+250..."
                  />

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Role
                    </label>

                    <input
                      value="Super Admin"
                      disabled
                      className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 text-sm text-slate-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <div className="p-6 sm:p-8">
              <SectionHeader
                icon={Bell}
                title="Notifications"
                description="Choose the notifications you would like to receive."
              />

              <div className="mt-8 divide-y divide-slate-800">
                <ToggleRow
                  title="Email Notifications"
                  description="Receive important system notifications by email."
                  enabled={
                    emailNotifications
                  }
                  onChange={
                    setEmailNotifications
                  }
                />

                <ToggleRow
                  title="Push Notifications"
                  description="Receive notifications inside the application."
                  enabled={
                    pushNotifications
                  }
                  onChange={
                    setPushNotifications
                  }
                />

                <ToggleRow
                  title="New Members"
                  description="Notify me when a new member is registered."
                  enabled={
                    memberNotifications
                  }
                  onChange={
                    setMemberNotifications
                  }
                />

                <ToggleRow
                  title="Events"
                  description="Notify me about upcoming and newly created events."
                  enabled={
                    eventNotifications
                  }
                  onChange={
                    setEventNotifications
                  }
                />
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <div className="p-6 sm:p-8">
              <SectionHeader
                icon={Lock}
                title="Security"
                description="Keep your account secure by managing your password."
              />

              <div className="mt-8 max-w-xl space-y-5">
                <PasswordField
                  label="Current Password"
                  value={currentPassword}
                  onChange={
                    setCurrentPassword
                  }
                />

                <PasswordField
                  label="New Password"
                  value={newPassword}
                  onChange={setNewPassword}
                />

                <PasswordField
                  label="Confirm New Password"
                  value={confirmPassword}
                  onChange={
                    setConfirmPassword
                  }
                />

                <button
                  type="button"
                  onClick={changePassword}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Lock className="h-4 w-4" />
                  Change Password
                </button>
              </div>
            </div>
          )}

          {/* Save footer */}
          {activeTab !== "security" && (
            <div className="flex flex-col gap-3 border-t border-slate-800 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
              <p className="text-xs text-slate-500">
                Changes are stored locally for
                now.
              </p>

              <button
                type="button"
                onClick={saveSettings}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
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
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{
    className?: string;
  }>;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
        <Icon className="h-5 w-5 text-blue-400" />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
      />
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>

      <input
        type="password"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="h-11 w-full rounded-xl border border-slate-700 bg-slate-800 px-4 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10"
      />
    </div>
  );
}

function ThemeCard({
  title,
  description,
  icon: Icon,
  active,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{
    className?: string;
  }>;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "relative rounded-2xl border p-4 text-left transition",
        active
          ? "border-blue-500 bg-blue-500/10"
          : "border-slate-700 bg-slate-800 hover:border-slate-600",
      ].join(" ")}
    >
      {active && (
        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}

      <div
        className={[
          "flex h-10 w-10 items-center justify-center rounded-xl",
          active
            ? "bg-blue-600/20"
            : "bg-slate-700",
        ].join(" ")}
      >
        <Icon
          className={[
            "h-5 w-5",
            active
              ? "text-blue-400"
              : "text-slate-400",
          ].join(" ")}
        />
      </div>

      <p className="mt-3 text-sm font-semibold text-white">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </button>
  );
}

function ToggleRow({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 py-5">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          onChange(!enabled)
        }
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition",
          enabled
            ? "bg-blue-600"
            : "bg-slate-700",
        ].join(" ")}
        aria-label={title}
      >
        <span
          className={[
            "absolute top-1 h-4 w-4 rounded-full bg-white transition",
            enabled
              ? "left-6"
              : "left-1",
          ].join(" ")}
        />
      </button>
    </div>
  );
}