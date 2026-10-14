'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  HelpCircle,
  ShieldCheck,
  Key,
  Laptop,
  Database,
  Lock,
  Search,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Server,
  Cloud,
  Terminal,
  Settings,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';

interface DocSection {
  id: string;
  category: string;
  title: string;
  summary: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export default function DocumentationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const sections: DocSection[] = [
    {
      id: 'getting-started',
      category: 'basics',
      title: '1. What is TrustFabric Customer Portal?',
      summary: 'Learn what this portal is for and how it protects your company data without compromising employee privacy.',
      icon: ShieldCheck,
      content: (
        <div className="space-y-4 text-sm text-zinc-700 leading-relaxed">
          <p>
            The <strong>TrustFabric Customer Portal</strong> is your central dashboard for managing and monitoring company-wide data security. It allows IT administrators and security officers to oversee endpoint DLP (Data Loss Prevention) scanners, manage software license seats, and view discoveries of sensitive company information across all enrolled computers.
          </p>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-emerald-900">
              <Lock className="h-4 w-4 text-emerald-700" />
              The Zero-Raw-PII Privacy Guarantee (Air-Gap Protection)
            </div>
            <p className="text-emerald-800 text-xs leading-normal">
              Unlike cloud services that copy files off employee computers, the <strong>clAIssify Desktop Agent scans 100% locally on each device</strong>. 
              <strong>No employee files, documents, or raw sensitive numbers (like Aadhaar, PAN, SSN, or passwords) are ever transmitted to this portal or external servers.</strong> 
              Only anonymous metadata, salted security hashes, and safely masked examples (e.g. <code className="bg-emerald-100 px-1 py-0.5 rounded text-[11px]">41********44</code>) are recorded.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg border border-zinc-200 bg-white">
              <div className="font-medium text-zinc-900 mb-1 flex items-center gap-1.5">
                <Laptop className="h-4 w-4 text-blue-600" />
                Endpoints & Devices
              </div>
              <p className="text-xs text-zinc-500">Monitor active laptops, desktops, and sensors across all branches.</p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-200 bg-white">
              <div className="font-medium text-zinc-900 mb-1 flex items-center gap-1.5">
                <Database className="h-4 w-4 text-purple-600" />
                Data Inventory
              </div>
              <p className="text-xs text-zinc-500">Search and audit sensitive file locations and database tables in one catalog.</p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-200 bg-white">
              <div className="font-medium text-zinc-900 mb-1 flex items-center gap-1.5">
                <Key className="h-4 w-4 text-amber-600" />
                License Control
              </div>
              <p className="text-xs text-zinc-500">Issue enrollment tokens, assign company seat quotas, and revoke lost devices.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'enrolling-devices',
      category: 'setup',
      title: '2. How to Connect & Enroll New Computers',
      summary: 'Step-by-step instructions for installing and linking the clAIssify desktop app to this portal.',
      icon: Laptop,
      content: (
        <div className="space-y-4 text-sm text-zinc-700 leading-relaxed">
          <p>
            Connecting an employee computer to your company fleet takes three simple steps:
          </p>
          
          <div className="space-y-3">
            <div className="flex gap-3 items-start p-3 rounded-lg border border-zinc-200 bg-zinc-50/50">
              <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
              <div className="space-y-1">
                <div className="font-semibold text-zinc-900">Generate an Enrollment Token</div>
                <p className="text-xs text-zinc-600">
                  Navigate to <strong>Licenses</strong> &rarr; <strong>Enrollment Tokens</strong> in the sidebar. Click <strong>Generate Token</strong>, choose the target company allocation (e.g. Acme India), set how many activations are allowed, and copy the secret token string.
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 rounded-lg border border-zinc-200 bg-zinc-50/50">
              <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
              <div className="space-y-2 w-full">
                <div className="font-semibold text-zinc-900">Run the Agent on the Employee Computer</div>
                <p className="text-xs text-zinc-600">
                  On the target Windows machine, install <strong>clAIssify</strong> using the installer (<code className="bg-zinc-200 px-1 py-0.5 rounded text-[11px]">clAIssify_Setup_v1.1.exe</code>).
                </p>
                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-zinc-600">Option A: Via Desktop GUI Dialog</div>
                  <p className="text-xs text-zinc-500">Launch the app, click the <strong>Activation Key / Enroll</strong> banner, and paste your Enrollment Token.</p>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-medium text-zinc-600">Option B: Automated Headless Command (Mass Deployment)</div>
                  <div className="relative rounded bg-zinc-900 p-2.5 font-mono text-xs text-zinc-100 flex items-center justify-between">
                    <code>clAIssify.exe --enroll &lt;YOUR_TOKEN&gt;</code>
                    <button
                      onClick={() => copyToClipboard('clAIssify.exe --enroll <YOUR_TOKEN>', 'enroll-cmd')}
                      className="text-zinc-400 hover:text-white transition-colors"
                      title="Copy command"
                    >
                      {copiedSnippet === 'enroll-cmd' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 items-start p-3 rounded-lg border border-zinc-200 bg-zinc-50/50">
              <div className="h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
              <div className="space-y-1">
                <div className="font-semibold text-zinc-900">Automatic Activation & Heartbeat</div>
                <p className="text-xs text-zinc-600">
                  Once registered, the device automatically contacts the portal, sets up a secure local encrypted certificate, and begins background health reporting. The computer will now appear in your <strong>Fleet Protection</strong> tab.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'fleet-telemetry',
      category: 'fleet',
      title: '3. Fleet Protection & Remote Management',
      summary: 'Understand device health statuses, live heartbeats, and remote administrative actions.',
      icon: Server,
      content: (
        <div className="space-y-4 text-sm text-zinc-700 leading-relaxed">
          <p>
            Under <strong>Fleet Protection</strong> (<Link href="/telemetry" className="text-blue-600 underline font-medium">/telemetry</Link>), you can view all enrolled computers and verify their security posture in real time.
          </p>

          <div className="space-y-2">
            <div className="font-semibold text-zinc-900 text-xs uppercase tracking-wider">Device Health Status Badges</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 flex items-start gap-2">
                <Badge className="bg-emerald-600 text-white shrink-0 mt-0.5">LIVE</Badge>
                <div>
                  <div className="font-semibold text-emerald-950">Active & Protecting</div>
                  <div className="text-zinc-600">The laptop is pinging normally, real-time protection is running, and policy is in sync.</div>
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-amber-200 bg-amber-50/50 flex items-start gap-2">
                <Badge className="bg-amber-600 text-white shrink-0 mt-0.5">DEGRADED</Badge>
                <div>
                  <div className="font-semibold text-amber-950">Needs Attention</div>
                  <div className="text-zinc-600">The agent is communicating, but real-time watcher is temporarily paused or outbox is backlogged.</div>
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-zinc-200 bg-zinc-50 flex items-start gap-2">
                <Badge className="bg-zinc-500 text-white shrink-0 mt-0.5">OFFLINE</Badge>
                <div>
                  <div className="font-semibold text-zinc-900">Computer Turned Off</div>
                  <div className="text-zinc-600">No heartbeat received recently (laptop is asleep, offline, or disconnected from the network).</div>
                </div>
              </div>
              <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/50 flex items-start gap-2">
                <Badge className="bg-rose-600 text-white shrink-0 mt-0.5">DISABLED</Badge>
                <div>
                  <div className="font-semibold text-rose-950">Seat Suspended or Revoked</div>
                  <div className="text-zinc-600">An administrator suspended or revoked this seat; scans and enforcement are locked out.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <div className="font-semibold text-zinc-900 text-xs uppercase tracking-wider">Remote Administrator Commands</div>
            <p className="text-xs text-zinc-600">
              When viewing an active installation, administrators can queue remote commands executed automatically on the agent's next periodic check-in:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-600">
              <li><strong>Force Policy Refresh:</strong> Immediately commands the agent to reload company sensitivity rules.</li>
              <li><strong>Request Service Restart:</strong> Gracefully restarts the background file watcher and interception engine without user disruption.</li>
              <li><strong>Diagnostic Snapshot:</strong> Gathers agent diagnostic metrics (CPU, outbox queue depth, memory) to troubleshoot issues without inspecting files.</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'unified-inventory',
      category: 'dspm',
      title: '4. Unified Data Inventory (DSPM 1-34)',
      summary: 'Understanding sensitivity classification tiers, masked samples, and file findings.',
      icon: Database,
      content: (
        <div className="space-y-4 text-sm text-zinc-700 leading-relaxed">
          <p>
            The <strong>Unified Data Inventory</strong> tab under Fleet Protection brings together sensitive data discoveries made by local folder scans and database sensors across every machine in your company.
          </p>

          <div className="space-y-2">
            <div className="font-semibold text-zinc-900 text-xs uppercase tracking-wider">The 5 Sensitivity Classification Tiers</div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-3 p-2 rounded border border-zinc-200 bg-white">
                <Badge variant="outline" className="w-32 justify-center text-zinc-600 border-zinc-300">Public</Badge>
                <span className="text-zinc-600">General business data, public marketing materials, non-sensitive documents.</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded border border-blue-200 bg-blue-50/30">
                <Badge className="w-32 justify-center bg-blue-600 text-white">Internal</Badge>
                <span className="text-zinc-700">Internal company communications, employee notices, project roadmaps.</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded border border-amber-200 bg-amber-50/30">
                <Badge className="w-32 justify-center bg-amber-600 text-white">Confidential</Badge>
                <span className="text-zinc-700">Customer email addresses, phone numbers, employee names, basic personal data.</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded border border-orange-200 bg-orange-50/30">
                <Badge className="w-32 justify-center bg-orange-600 text-white">Highly Confidential</Badge>
                <span className="text-zinc-700">Financial records, Indian PAN cards, Aadhaar numbers, tax IDs, banking information.</span>
              </div>
              <div className="flex items-center gap-3 p-2 rounded border border-rose-200 bg-rose-50/30">
                <Badge className="w-32 justify-center bg-rose-600 text-white">Restricted</Badge>
                <span className="text-zinc-700 font-medium">System passwords, private cryptographic keys, OpenAI/AWS API tokens, US SSNs.</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 space-y-1.5">
            <div className="font-semibold text-blue-950 text-xs flex items-center gap-1.5">
              <EyeOff className="h-4 w-4 text-blue-700" />
              What is Masked Sample Evidence?
            </div>
            <p className="text-xs text-blue-900 leading-normal">
              For high-risk files (Confidential, Highly Confidential, or Restricted), the scanner extracts a short verification sample with all middle characters replaced by asterisks (e.g. <code className="bg-blue-100 px-1 py-0.5 rounded text-[11px]">jo****om</code> or <code className="bg-blue-100 px-1 py-0.5 rounded text-[11px]">36********52</code>). This gives compliance auditors proof of what was found while making it impossible to read the raw identity.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'licenses-allocations',
      category: 'licensing',
      title: '5. Licenses, Entitlements & Allocations',
      summary: 'How software seats are purchased, split between company entities, and assigned to computers.',
      icon: Key,
      content: (
        <div className="space-y-4 text-sm text-zinc-700 leading-relaxed">
          <p>
            TrustFabric organizes software licenses in a clear three-tier hierarchy:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/60 space-y-1">
              <div className="text-xs font-semibold text-zinc-900 uppercase tracking-wide">1. Master Entitlement</div>
              <p className="text-xs text-zinc-600">The total pool of seats purchased by your organization from TrustFabric (e.g., 500 total seats across the whole company).</p>
            </div>
            <div className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/60 space-y-1">
              <div className="text-xs font-semibold text-zinc-900 uppercase tracking-wide">2. Company Allocation</div>
              <p className="text-xs text-zinc-600">A quota of seats carved out from the master pool for a specific subsidiary or branch (e.g., 200 seats assigned to Acme India).</p>
            </div>
            <div className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/60 space-y-1">
              <div className="text-xs font-semibold text-zinc-900 uppercase tracking-wide">3. Device Consumption</div>
              <p className="text-xs text-zinc-600">An individual laptop or desktop currently holding an active activated seat.</p>
            </div>
          </div>
          <div className="space-y-2 pt-1 text-xs">
            <div className="font-semibold text-zinc-900 uppercase tracking-wider">Requesting Additional Seats</div>
            <p className="text-zinc-600">
              If your team is running low on available seats, company managers can submit a <strong>License Request</strong> (<Link href="/license-requests" className="text-blue-600 underline font-medium">/license-requests</Link>). Enterprise Administrators can review, approve, or adjust the requested capacity directly from the portal.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'settings-privacy',
      category: 'settings',
      title: '6. Settings & Organizational Privacy Controls',
      summary: 'Managing company-wide privacy rules, path masking, and Microsoft 365 cloud connections.',
      icon: Settings,
      content: (
        <div className="space-y-4 text-sm text-zinc-700 leading-relaxed">
          <p>
            In the <strong>Settings</strong> page (<Link href="/settings" className="text-blue-600 underline font-medium">/settings</Link>), administrators can customize how agent reporting behaves across their organization:
          </p>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-zinc-200 bg-white space-y-1">
              <div className="font-semibold text-zinc-900 text-xs">Path Reference Masking (Default: Enabled)</div>
              <p className="text-xs text-zinc-600">
                Because folder paths (like <code className="bg-zinc-100 px-1 py-0.5 rounded text-[11px]">C:\Projects\Merger-Acme\confidential.xlsx</code>) can reveal secret project names, paths are transformed into secure salted hashes by default (<code className="bg-zinc-100 px-1 py-0.5 rounded text-[11px]">sha256:670a6c...</code>). 
                If your company policy allows transmitting literal directory names, you can toggle <strong>Enable Literal Paths</strong> in Settings.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-200 bg-white space-y-1">
              <div className="font-semibold text-zinc-900 text-xs">Fleet Telemetry Master Switch</div>
              <p className="text-xs text-zinc-600">
                Turn fleet reporting on or off globally. When disabled, all endpoint agents immediately stop sending heartbeats and inventory findings, operating in 100% local air-gapped mode.
              </p>
            </div>
            <div className="p-3 rounded-lg border border-zinc-200 bg-white space-y-1">
              <div className="font-semibold text-zinc-900 text-xs">Microsoft 365 (O365) Cloud Connector</div>
              <p className="text-xs text-zinc-600">
                Connect your corporate Microsoft Entra tenant to scan files uploaded to SharePoint and OneDrive on a detect-and-remediate model.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      category: 'troubleshooting',
      title: '7. Troubleshooting Common Questions',
      summary: 'Quick fixes for common issues like Startup Error, offline agents, or expired tokens.',
      icon: AlertTriangle,
      content: (
        <div className="space-y-4 text-sm text-zinc-700 leading-relaxed">
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-zinc-200 bg-white space-y-1.5">
              <div className="font-semibold text-zinc-900 text-xs flex items-center gap-1.5 text-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                Desktop App: "Startup Error — Could not start background protection service"
              </div>
              <p className="text-xs text-zinc-600">
                <strong>Cause:</strong> The desktop app checks whether the machine has an active, valid license before starting background file interception. If the seat was previously revoked or suspended in the portal, the service refuses to run.
              </p>
              <p className="text-xs text-zinc-600">
                <strong>Fix:</strong> Enroll the computer using a fresh Enrollment Token from <em>Licenses &rarr; Enrollment Tokens</em>, or run the app in standalone mode by setting environment variable <code className="bg-zinc-100 px-1 py-0.5 rounded text-[11px]">CLAISSIFY_STANDALONE=1</code>.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-zinc-200 bg-white space-y-1.5">
              <div className="font-semibold text-zinc-900 text-xs flex items-center gap-1.5 text-blue-800">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                "Device already holds an active installation" error when activating
              </div>
              <p className="text-xs text-zinc-600">
                <strong>Cause:</strong> Each computer fingerprint can only hold one active seat at a time.
              </p>
              <p className="text-xs text-zinc-600">
                <strong>Fix:</strong> Go to <strong>Installations</strong> in the Customer Portal, locate the old entry for that hostname, and click <strong>Revoke</strong> or <strong>Release</strong>. Then activate with your new token.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-zinc-200 bg-white space-y-1.5">
              <div className="font-semibold text-zinc-900 text-xs flex items-center gap-1.5 text-zinc-800">
                <AlertTriangle className="h-4 w-4 text-zinc-600" />
                Agent shows as "Offline" in the portal
              </div>
              <p className="text-xs text-zinc-600">
                <strong>Cause:</strong> The laptop has not sent a ping in the last 15 minutes.
              </p>
              <p className="text-xs text-zinc-600">
                <strong>Fix:</strong> Ensure the employee computer is powered on, connected to the corporate network, and that port 3001 (API) is reachable. If needed, restart the desktop app or click <em>Start Service</em> in the agent sidebar.
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const categories = [
    { id: 'all', label: 'All Topics' },
    { id: 'basics', label: 'Core Basics' },
    { id: 'setup', label: 'Device Setup' },
    { id: 'fleet', label: 'Fleet Protection' },
    { id: 'dspm', label: 'Data Inventory' },
    { id: 'licensing', label: 'Licensing & Seats' },
    { id: 'settings', label: 'Settings & Privacy' },
    { id: 'troubleshooting', label: 'Troubleshooting' },
  ];

  const filteredSections = sections.filter((sec) => {
    const matchesCategory = selectedCategory === 'all' || sec.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <PageHeader
        title="Help & Documentation"
        description="Comprehensive guides explaining portal features, device setup, privacy guarantees, and fleet monitoring in plain English."
      />

      {/* Search & Topic Filters */}
      <Card className="border-zinc-200 shadow-sm bg-gradient-to-br from-white to-zinc-50/50">
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input
              placeholder="Search documentation (e.g., enrollment token, masked sample, sensitivity tiers, startup error)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation Sections */}
      <div className="space-y-4">
        {filteredSections.length === 0 ? (
          <Card className="p-12 text-center text-zinc-500 border-dashed">
            <BookOpen className="h-8 w-8 mx-auto text-zinc-300 mb-2" />
            <p className="font-medium text-zinc-700">No documentation topics match your search.</p>
            <p className="text-xs text-zinc-400 mt-1">Try searching for keywords like "token", "scan", "privacy", or "license".</p>
            <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="mt-4">
              Clear Filters
            </Button>
          </Card>
        ) : (
          filteredSections.map((sec) => {
            const Icon = sec.icon;
            return (
              <Card key={sec.id} id={sec.id} className="border-zinc-200 shadow-sm scroll-mt-20">
                <CardHeader className="pb-3 border-b border-zinc-100 bg-zinc-50/40">
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base text-zinc-900 font-semibold">{sec.title}</CardTitle>
                      <CardDescription className="text-xs text-zinc-500 mt-0.5">{sec.summary}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {sec.content}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Footer Support Card */}
      <Card className="border-blue-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="h-5 w-5 text-blue-600 shrink-0" />
            <div>
              <span className="font-semibold text-zinc-900">Need direct technical support?</span>
              <p className="text-zinc-500">Contact your designated enterprise administrator or reach out to the TrustFabric engineering team.</p>
            </div>
          </div>
          <Link href="/telemetry">
            <Button size="sm" variant="outline" className="bg-white hover:bg-zinc-50 text-xs shrink-0">
              Go to Fleet Protection &rarr;
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
