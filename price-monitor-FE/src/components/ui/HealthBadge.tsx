import React from 'react';

export function HealthBadge({ ok, latency }: { ok: boolean; latency?: number }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
        ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
      title={ok ? `API healthy${latency ? ` (${latency}ms)` : ''}` : 'API unreachable'}
    >
      <span className={`h-2 w-2 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`}></span>
      {ok ? 'API Online' : 'API Down'}
      {latency != null && ok && <span className="ml-1 text-gray-500">{latency}ms</span>}
    </span>
  );
}
