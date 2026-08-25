interface ClaimStatusBadgeProps {
  status: string;
}

export function ClaimStatusBadge({ status }: ClaimStatusBadgeProps) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    PENDING: {
      label: 'En attente',
      className: 'bg-yellow-100 text-yellow-700',
    },
    INVESTIGATING: {
      label: 'En cours',
      className: 'bg-blue-100 text-blue-700',
    },
    RESOLVED: {
      label: 'Résolu',
      className: 'bg-green-100 text-green-700',
    },
    REJECTED: {
      label: 'Rejeté',
      className: 'bg-red-100 text-red-700',
    },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
