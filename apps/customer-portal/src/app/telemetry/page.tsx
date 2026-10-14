'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { LoadingState, ErrorState, EmptyState } from '@/components/ui/state';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/components/providers/auth-provider';
import {
  FleetInstallationRow,
  FleetInstallationsResponse,
  TelemetryDerivedStatus,
  Installation,
  FleetInventoryItem,
  FleetInventoryResponse,
} from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Monitor,
  Cloud,
  ChevronRight,
  RotateCw,
  Search,
  ShieldCheck,
  Activity,
  ChevronLeft,
  Layers,
  FileCheck,
  Lock,
} from 'lucide-react';
import { TELEMETRY_STATUS_CONFIG } from '../installations/telemetry-status';
import { InstallationDetailsDialog } from '../installations/installation-details-dialog';

const STATUS_OPTIONS: Array<{ value: 'ALL' | TelemetryDerivedStatus; label: string }> = [
  { value: 'ALL', label: 'All Telemetry Statuses' },
  { value: 'LIVE', label: 'Live' },
  { value: 'STALE', label: 'Stale' },
  { value: 'STOPPED', label: 'Stopped' },
  { value: 'OFFLINE', label: 'Offline' },
  { value: 'NO_DATA', label: 'No Data' },
  { value: 'DISABLED', label: 'Disabled' },
];

const TIER_OPTIONS = [
  { value: 'ALL', label: 'All Sensitivity Tiers' },
  { value: 'Restricted', label: 'Restricted' },
  { value: 'Highly Confidential', label: 'Highly Confidential' },
  { value: 'Confidential', label: 'Confidential' },
  { value: 'General', label: 'General' },
  { value: 'Public', label: 'Public' },
];

const TIER_BADGES: Record<string, string> = {
  Restricted: 'bg-purple-50 text-purple-700 ring-1 ring-purple-200',
  'Highly Confidential': 'bg-red-50 text-red-700 ring-1 ring-red-200',
  Confidential: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  General: 'bg-slate-50 text-slate-700 ring-1 ring-slate-200',
  Public: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
};

export default function FleetTelemetryPage() {
  const { selectedCompanyId, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [activeTab, setActiveTab] = useState<'devices' | 'inventory'>('devices');

  const [rows, setRows] = useState<FleetInstallationRow[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pageSize: 20, totalPages: 1 });

  // Unified Inventory state (DSPM 1-34)
  const [inventoryRows, setInventoryRows] = useState<FleetInventoryItem[]>([]);
  const [inventoryMeta, setInventoryMeta] = useState({ total: 0, page: 1, pageSize: 25, totalPages: 1 });
  const [inventoryPage, setInventoryPage] = useState(1);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'ALL' | TelemetryDerivedStatus>('ALL');
  const [tierFilter, setTierFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // Selected installation for opening details dialog
  const [selectedInstallation, setSelectedInstallation] = useState<Installation | null>(null);
  const [loadingInstallation, setLoadingInstallation] = useState(false);

  const canManage = user.roles.includes('EnterpriseAdmin') || user.roles.includes('CompanyAdmin');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedCompanyId !== '*') {
        params.append('companyId', selectedCompanyId);
      }
      if (statusFilter !== 'ALL') {
        params.append('status', statusFilter);
      }
      if (tierFilter !== 'ALL') {
        params.append('tier', tierFilter);
      }
      if (search.trim()) {
        params.append('search', search.trim());
      }
      params.append('page', String(page));
      params.append('pageSize', '20');

      const res = await apiClient<FleetInstallationsResponse>(
        `/customer/telemetry/installations?${params.toString()}`
      );
      setRows(res.data);
      setMeta(res.meta);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCompanyId, statusFilter, tierFilter, search, page]);

  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedCompanyId !== '*') {
        params.append('companyId', selectedCompanyId);
      }
      if (tierFilter !== 'ALL') {
        params.append('tier', tierFilter);
      }
      if (search.trim()) {
        params.append('search', search.trim());
      }
      params.append('page', String(inventoryPage));
      params.append('pageSize', '25');

      const res = await apiClient<FleetInventoryResponse>(
        `/customer/telemetry/inventory?${params.toString()}`
      );
      setInventoryRows(res.data);
      setInventoryMeta(res.meta);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCompanyId, tierFilter, search, inventoryPage]);

  useEffect(() => {
    if (activeTab === 'inventory') {
      loadInventory();
    } else {
      loadData();
    }
  }, [activeTab, loadData, loadInventory]);

  const handleRowClick = async (row: FleetInstallationRow) => {
    try {
      setLoadingInstallation(true);
      const inst = await apiClient<Installation>(`/installations/${row.id}`);
      setSelectedInstallation(inst);
    } catch {
      // Fallback
    } finally {
      setLoadingInstallation(false);
    }
  };

  if (loading && rows.length === 0) {
    return <LoadingState message="Loading fleet protection telemetry..." />;
  }

  if (error && rows.length === 0) {
    return <ErrorState error={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Fleet Protection"
        description="Monitor endpoint telemetry, sensitivity classification findings, and issue administrative commands"
        actions={
          <Button variant="outline" size="sm" onClick={loadData}>
            <RotateCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
        }
      />

      {/* View Switcher: Protected Devices vs Unified Data Inventory (DSPM 1-34) */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
        <Button
          variant={activeTab === 'devices' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            setActiveTab('devices');
            setPage(1);
          }}
          className="text-xs h-8"
        >
          <Monitor className="h-3.5 w-3.5 mr-1.5" />
          Protected Devices
          <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
            {meta.total}
          </Badge>
        </Button>

        <Button
          variant={activeTab === 'inventory' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => {
            setActiveTab('inventory');
            setInventoryPage(1);
          }}
          className="text-xs h-8"
        >
          <Layers className="h-3.5 w-3.5 mr-1.5" />
          Unified Data Inventory (DSPM 1-34)
          <Badge variant="secondary" className="ml-2 text-[10px] px-1.5 py-0">
            {inventoryMeta.total}
          </Badge>
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-lg border border-zinc-200">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="h-3.5 w-3.5 text-zinc-400 absolute left-2.5 top-3" />
          <Input
            placeholder={
              activeTab === 'devices'
                ? "Search hostname, employee name, or email..."
                : "Search asset path reference, hostname, or owner..."
            }
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
              setInventoryPage(1);
            }}
            className="pl-8 text-xs h-9"
          />
        </div>

        {activeTab === 'devices' && (
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter((v ?? 'ALL') as typeof statusFilter);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] text-xs h-9">
              <SelectValue placeholder="Telemetry Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select
          value={tierFilter}
          onValueChange={(v) => {
            setTierFilter(v ?? 'ALL');
            setPage(1);
            setInventoryPage(1);
          }}
        >
          <SelectTrigger className="w-[180px] text-xs h-9">
            <SelectValue placeholder="Sensitivity Tier" />
          </SelectTrigger>
          <SelectContent>
            {TIER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tab Content: Devices View */}
      {activeTab === 'devices' && (
        rows.length === 0 ? (
          <EmptyState
            title="No Fleet Telemetry Found"
            description="There are currently no endpoint installations matching your filters."
            action={
              <Button variant="outline" size="sm" onClick={loadData}>
                Clear Filters & Refresh
              </Button>
            }
          />
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-white overflow-x-auto shadow-sm">
            <Table>
              <TableHeader className="bg-zinc-50/75">
                <TableRow className="text-[11px] text-zinc-500 uppercase tracking-wider">
                  <TableHead>Status</TableHead>
                  <TableHead>Endpoint Device</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Protection State</TableHead>
                  <TableHead>Last Ping</TableHead>
                  <TableHead>Last Scan</TableHead>
                  <TableHead>Highest Tier</TableHead>
                  <TableHead>Findings Summary</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => {
                  const statusCfg = TELEMETRY_STATUS_CONFIG[row.telemetryStatus] || TELEMETRY_STATUS_CONFIG.NO_DATA;
                  return (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer hover:bg-zinc-50/70 text-xs transition-colors"
                      onClick={() => handleRowClick(row)}
                    >
                      <TableCell>
                        <Badge variant="outline" className={statusCfg.classes}>
                          <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${statusCfg.dotClass}`} />
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium text-zinc-900">
                        <div className="flex items-center gap-2">
                          {row.hostname === 'cloud-connector' || row.id?.includes('o365-connector') ? (
                            <Cloud className="h-4 w-4 text-sky-500 shrink-0" />
                          ) : (
                            <Monitor className="h-4 w-4 text-zinc-400 shrink-0" />
                          )}
                          <div>
                            <div>
                              {row.hostname || <span className="italic text-zinc-400">Unnamed device</span>}
                              {(row.hostname === 'cloud-connector' || row.id?.includes('o365-connector')) && (
                                <Badge variant="outline" className="ml-2 text-[10px] border-sky-300 text-sky-700 bg-sky-50 py-0 px-1 font-normal">
                                  O365 Cloud
                                </Badge>
                              )}
                            </div>
                            {(row.employeeName || row.employeeEmail) && (
                              <div className="text-[11px] text-zinc-400 font-normal">
                                {row.employeeName} {row.employeeEmail ? `(${row.employeeEmail})` : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-600">{row.companyName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              row.serviceRunning
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            Service: {row.serviceRunning ? 'Running' : 'Stopped'}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                              row.watcherActive
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            Watcher: {row.watcherActive ? 'Active' : 'Off'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-zinc-500 whitespace-nowrap">
                        {row.lastPingAt ? new Date(row.lastPingAt).toLocaleString() : '—'}
                      </TableCell>
                      <TableCell className="text-zinc-500 whitespace-nowrap">
                        {row.lastScanAt ? new Date(row.lastScanAt).toLocaleString() : '—'}
                      </TableCell>
                      <TableCell>
                        {row.highestTier ? (
                          <Badge
                            variant="outline"
                            className={TIER_BADGES[row.highestTier] || 'bg-zinc-100 text-zinc-700'}
                          >
                            {row.highestTier}
                          </Badge>
                        ) : (
                          <span className="text-zinc-400">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {row.findingsByTier && Object.keys(row.findingsByTier).length > 0 ? (
                            Object.entries(row.findingsByTier).map(([t, count]) => (
                              <span
                                key={t}
                                className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                  TIER_BADGES[t] || 'bg-zinc-100 text-zinc-700'
                                }`}
                                title={`${t}: ${count}`}
                              >
                                {count}
                              </span>
                            ))
                          ) : (
                            <span className="text-zinc-400">0</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <ChevronRight className="h-4 w-4 text-zinc-300 inline-block" />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 text-xs text-zinc-500">
                <div>
                  Page {meta.page} of {meta.totalPages} ({meta.total} total devices)
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-8 px-2"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= meta.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="h-8 px-2"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* Tab Content: Unified Data Inventory View (DSPM 1-34) */}
      {activeTab === 'inventory' && (
        inventoryRows.length === 0 ? (
          <EmptyState
            title="No Ingested Inventory Findings"
            description="Endpoint scanner findings (metadata and masked samples) will appear here once scans complete."
            action={
              <Button variant="outline" size="sm" onClick={loadInventory}>
                Refresh Inventory
              </Button>
            }
          />
        ) : (
          <div className="rounded-xl border border-zinc-200 bg-white overflow-x-auto shadow-sm">
            <Table>
              <TableHeader className="bg-zinc-50/75">
                <TableRow className="text-[11px] text-zinc-500 uppercase tracking-wider">
                  <TableHead>Sensitivity Tier</TableHead>
                  <TableHead>Data Asset / Reference</TableHead>
                  <TableHead>Source Device & Owner</TableHead>
                  <TableHead>Entities Detected</TableHead>
                  <TableHead>Masked Sample Evidence</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Ingested</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryRows.map((item) => (
                  <TableRow key={item.id} className="text-xs hover:bg-zinc-50/70">
                    <TableCell>
                      <Badge variant="outline" className={TIER_BADGES[item.tier] || 'bg-zinc-100 text-zinc-700'}>
                        {item.tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-[11px] max-w-[220px] truncate" title={item.pathRef}>
                      <div className="flex items-center gap-1.5">
                        {item.pathRef.startsWith('sha256:') ? (
                          <Lock className="h-3 w-3 text-zinc-400 shrink-0" title="Salted SHA256 path reference" />
                        ) : (
                          <FileCheck className="h-3 w-3 text-blue-500 shrink-0" />
                        )}
                        <span className="truncate">{item.pathRef}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-zinc-900">{item.hostname || 'Unnamed Device'}</div>
                      <div className="text-[11px] text-zinc-400">
                        {item.employeeName ? `${item.employeeName} • ` : ''}{item.companyName}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {Object.entries(item.entityTypeCounts || {}).map(([ent, count]) => (
                          <span key={ent} className="bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded text-[10px]">
                            {ent}: {count}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {item.sampleEvidence ? (
                        <code className="bg-zinc-100 text-zinc-800 px-1.5 py-0.5 rounded text-[10px] font-mono">
                          {item.sampleEvidence}
                        </code>
                      ) : (
                        <span className="text-zinc-400 italic text-[10px]">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-[11px] text-zinc-600 font-medium">
                        {item.scanSource === 'database_scan' ? 'Database Sensor' : 'Endpoint Scanner'}
                      </span>
                    </TableCell>
                    <TableCell className="text-zinc-500 whitespace-nowrap text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Inventory Pagination */}
            {inventoryMeta.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200 text-xs text-zinc-500">
                <div>
                  Page {inventoryMeta.page} of {inventoryMeta.totalPages} ({inventoryMeta.total} sensitive assets cataloged)
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={inventoryPage <= 1}
                    onClick={() => setInventoryPage((p) => Math.max(1, p - 1))}
                    className="h-8 px-2"
                  >
                    <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={inventoryPage >= inventoryMeta.totalPages}
                    onClick={() => setInventoryPage((p) => p + 1)}
                    className="h-8 px-2"
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )
      )}

      {/* Detail Dialog with Protection tab open by default */}
      {selectedInstallation && (
        <InstallationDetailsDialog
          installation={selectedInstallation}
          canManage={canManage}
          defaultTab="protection"
          onClose={() => setSelectedInstallation(null)}
          onChanged={loadData}
        />
      )}
    </div>
  );
}
