'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { EmptyState, LoadingState, ErrorState } from '@/components/ui/state';
import { useAuth } from '@/components/providers/auth-provider';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';

interface AuditEvent {
  id: string;
  action: string;
  actorId: string;
  targetType: string;
  result: string;
  companyId?: string;
  company?: { name: string };
  createdAt: string;
}

export default function AuditPage() {
  const { user, selectedCompanyId } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [events, setEvents] = useState<AuditEvent[]>([]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams();
      if (selectedCompanyId !== '*') {
        queryParams.append('companyId', selectedCompanyId);
      }
      
      const res = await apiClient<{data: AuditEvent[]}>(`/audit?${queryParams.toString()}`);
      setEvents(res.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCompanyId, user]);
  
  if (!user.roles.includes('EnterpriseAdmin') && !user.roles.includes('CompanyAdmin')) {
    return <EmptyState title="Unauthorized" description="You do not have permission to view audit logs." />;
  }

  if (loading) return <LoadingState message="Loading audit logs..." />;
  if (error) return <ErrorState error={error} onRetry={loadData} />;

  return (
    <div>
      <PageHeader title="Audit Logs" description="Review operational history and security events" />
      
      {events.length === 0 ? (
        <EmptyState 
          title="No Audit Logs Found" 
          description="There are currently no events matching your context."
          action={<button onClick={loadData} className="px-4 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800">Refresh</button>}
        />
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b uppercase">
                <tr>
                  <th className="px-6 py-3 font-medium">Timestamp</th>
                  <th className="px-6 py-3 font-medium">Action</th>
                  <th className="px-6 py-3 font-medium">Actor</th>
                  <th className="px-6 py-3 font-medium">Target</th>
                  <th className="px-6 py-3 font-medium">Company</th>
                  <th className="px-6 py-3 font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                {events.map((evt) => (
                  <tr key={evt.id} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{new Date(evt.createdAt).toLocaleString()}</td>
                    <td className="px-6 py-4 font-medium">{evt.action}</td>
                    <td className="px-6 py-4">{evt.actorId}</td>
                    <td className="px-6 py-4">{evt.targetType}</td>
                    <td className="px-6 py-4">{evt.company?.name || evt.companyId || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${evt.result === 'SUCCESS' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {evt.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
