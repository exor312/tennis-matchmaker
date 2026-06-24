import React from 'react';

interface StatusBadgeProps {
  status: 'live' | 'pending' | 'completed';
  label?: string;
}

const variantClasses: Record<StatusBadgeProps['status'], string> = {
  live: 'bg-green-500/15 text-green-400 border border-green-500/20 rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest',
  pending: 'bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest',
  completed: 'bg-white/5 text-white/40 border border-white/10 rounded-full px-2.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const displayLabel = label ?? status.replace(/_/g, ' ').toUpperCase();

  return (
    <span className={variantClasses[status]}>
      {displayLabel}
    </span>
  );
};

export { StatusBadge };
