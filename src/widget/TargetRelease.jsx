{/* Target Release — quick publish widget */}
        <div className="mt-6 pt-4 border-t border-line">
          <p className="px-3 text-[11px] font-medium text-slate-500 mb-2 tracking-wide">Target Release</p>
          <form onSubmit={handlePublish} className="px-3 space-y-2.5">
            <input
              type="text"
              value={releaseName}
              onChange={(e) => setReleaseName(e.target.value)}
              placeholder="Release name (e.g. v1.0.6)"
              className="w-full bg-base border border-line rounded-md px-2.5 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
            />
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-base border border-line rounded-md px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {companyOptions.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full bg-base border border-line rounded-md px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {branchOptions.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none px-0.5">
              <input
                type="checkbox"
                checked={mandatory}
                onChange={(e) => setMandatory(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-base border-line text-accent focus:ring-0"
              />
              Mandatory update
            </label>
            <button type="submit" className="w-full py-2 bg-accent hover:bg-accentdeep text-white text-xs font-medium rounded-md transition-colors">
              Publish
            </button>
          </form>
        </div>
     