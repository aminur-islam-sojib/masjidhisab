"use client";
import * as React from "react";
import { Building2, Wallet, Clock, Users } from "lucide-react";
import GeneralSettingsForm from "@/components/dashboard/settings/general-settings-form";
import FinanceSettingsForm from "@/components/dashboard/settings/finance-settings-form";
import PrayerSettingsForm from "@/components/dashboard/settings/prayer-settings-form";
import TeamSettingsList from "@/components/dashboard/settings/team-settings-list";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState("general");

  const tabs = [
    { id: "general", label: "Mosque Profile", icon: Building2 },
    { id: "finance", label: "Finance & Accounts", icon: Wallet },
    { id: "prayers", label: "Prayer & Iqamah", icon: Clock },
    { id: "team", label: "Committee & Team", icon: Users },
  ];

  return (
    <div className="space-y-6 mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Workspace Settings
        </h1>
        <p className="text-sm text-slate-500">
          Manage your mosque information, accounting rules, and administrator
          permissions.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Content Panel */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        {activeTab === "general" && <GeneralSettingsForm />}
        {activeTab === "finance" && <FinanceSettingsForm />}
        {activeTab === "prayers" && <PrayerSettingsForm />}
        {activeTab === "team" && <TeamSettingsList />}
      </div>
    </div>
  );
}
