"use client";

import { Building2, Clock, Users, Wallet } from "lucide-react";
import { useState } from "react";
import GeneralSettingsForm from "./general-settings-form";
import FinanceSettingsForm from "./finance-settings-form";
import PrayerSettingsForm from "./prayer-settings-form";
import TeamSettingsList from "./team-settings-list";
import { IMosque } from "@/types/mosque";

// 1. Updated interface to match the destructured 'mosqueData' prop
interface SettingsPageProps {
  mosqueData?: IMosque | null;
}

// 2. Destructure mosqueData cleanly
export default function SettingsPage({ mosqueData }: SettingsPageProps) {
  const [activeTab, setActiveTab] = useState("general");

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
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? "border-emerald-600 text-emerald-700 bg-emerald-50/50"
                  : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Content Panel */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        {/* 3. Pass mosqueData into initialData */}
        {activeTab === "general" && <GeneralSettingsForm initialData={mosqueData} />}
        {activeTab === "finance" && <FinanceSettingsForm />}
        {activeTab === "prayers" && <PrayerSettingsForm />}
        {activeTab === "team" && <TeamSettingsList />}
      </div>
    </div>
  );
}