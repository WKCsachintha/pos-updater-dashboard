import { useState } from "react";

const TITLES = {
  overview: ["Dashboard Overview", "Live status across all company deployments"],
  release: ["Release Manager", "Publish a new build and target companies or branches"],
  publish: ["Target Release", "Upload build file and assign target deployment parameters"], // 1. publish key එක එකතු කළා
  monitor: ["Deployment Monitor", "Real-time status of every registered client"],
  logs: ["Update Logs", "Full audit trail from ClientUpdateLogs"],
};

export default function Header({ view }) {
  // 2. key එක නැති වුවහොත් blank page නොවී සිටීමට safe fallback එකක් යෙදුවා
  const [title, subtitle] = TITLES[view] || ["Console", "POS Deployment System"];

  return (
    <header className="h-16 border-b border-line bg-base/95 backdrop-blur sticky top-0 z-30 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="font-display font-semibold text-white text-lg leading-none">{title}</h1>
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <svg className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />
          </svg>
          <input
            type="text"
            placeholder="Search company, branch, machine ID…"
            className="w-72 bg-card border border-line rounded-md pl-9 pr-3 py-2 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
          />
        </div>
        <button className="relative w-9 h-9 rounded-md bg-card border border-line flex items-center justify-center text-slate-400 hover:text-white transition-colors">
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-bad" />
        </button>
        <div className="flex items-center gap-2.5 pl-4 border-l border-line">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-blue-800 flex items-center justify-center text-sm font-semibold text-white">CS</div>
          <div className="hidden lg:block leading-tight">
            <p className="text-sm text-slate-200 font-medium">Chavindu Sachintha</p>
            <p className="text-[11px] text-slate-500">Release Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}