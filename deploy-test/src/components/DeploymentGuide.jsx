import React from 'react';
import { Cloud, Server, Database, ShieldCheck, Terminal, ArrowRight } from 'lucide-react';

export default function DeploymentGuide() {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-indigo-400" />
          Full-Stack Deployment Architecture & Guide
        </h2>
        <p className="text-sm text-slate-400">
          Here is how this React + Node.js + SQL project transitions from local development to production.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1: Database */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-indigo-400 font-semibold text-sm">
            <Database className="w-4 h-4" />
            <span>1. SQL Database Hosting</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            In production, your SQL database is hosted on cloud services with a secure connection string.
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs font-mono text-slate-300 space-y-1">
            <p className="text-slate-500">// Options for SQL Server:</p>
            <p>• Azure SQL Database (Microsoft Native)</p>
            <p>• AWS RDS for SQL Server</p>
            <p>• Docker Container on VPS / Railway</p>
          </div>
        </div>

        {/* Step 2: Backend */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-emerald-400 font-semibold text-sm">
            <Server className="w-4 h-4" />
            <span>2. Backend Web Service (Node/Express)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deploy the <code className="text-indigo-300">backend/</code> folder to a Node host (e.g. Render, Railway, Azure App Service).
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs font-mono text-slate-300 space-y-1">
            <p><span className="text-slate-500">Root Directory:</span> backend</p>
            <p><span className="text-slate-500">Build Command:</span> npm install</p>
            <p><span className="text-slate-500">Start Command:</span> node server.js</p>
            <p><span className="text-slate-500">Health Check Path:</span> /api/health</p>
          </div>
        </div>

        {/* Step 3: Frontend */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-sky-400 font-semibold text-sm">
            <Cloud className="w-4 h-4" />
            <span>3. Frontend Static Hosting (Vite React)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deploy the <code className="text-indigo-300">deploy-test/</code> folder to Vercel, Netlify, or Cloudflare Pages.
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs font-mono text-slate-300 space-y-1">
            <p><span className="text-slate-500">Framework:</span> Vite</p>
            <p><span className="text-slate-500">Build Command:</span> npm run build</p>
            <p><span className="text-slate-500">Output Directory:</span> dist</p>
            <p><span className="text-slate-500">Env Var:</span> VITE_API_BASE_URL=https://your-api.onrender.com/api</p>
          </div>
        </div>

        {/* Step 4: Environment Variables & Security */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>4. Environment Variables Checklist</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Never commit <code className="text-rose-300">.env</code> to GitHub. Set these in your hosting dashboard:
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 text-xs font-mono text-slate-300 space-y-1">
            <p><span className="text-indigo-300">DB_SERVER</span>=your-sql-host</p>
            <p><span className="text-indigo-300">DB_USER</span>=your-sql-user</p>
            <p><span className="text-indigo-300">DB_PASSWORD</span>=your-sql-password</p>
            <p><span className="text-indigo-300">DB_DATABASE</span>=taskflow_db</p>
            <p><span className="text-indigo-300">PORT</span>=5000</p>
          </div>
        </div>
      </div>
    </div>
  );
}
