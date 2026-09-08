/**
 * Date & Time Utilities: Timezone-safe local calendar calculations for Seneca CTY Dashboard.
 * Resolves UTC-midnight off-by-one errors in America/Toronto (EDT = UTC-4, EST = UTC-5).
 */

/**
 * Returns today's local date as 'YYYY-MM-DD' without UTC rollover issues
 */
export function getLocalDateStr(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Safely parses a 'YYYY-MM-DD' string into a local Date object set to local midnight
 */
export function parseLocalDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.trim().replace(/\//g, '-').split('-');
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10) - 1;
  const d = parseInt(parts[2], 10);
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
  return new Date(y, m, d);
}

/**
 * Calculates calendar days until deadline relative to today (local midnight comparison)
 * Returns negative if overdue, 0 if due today, positive if future, or null if no due date
 */
export function getDaysUntil(dueDateStr, referenceDate = new Date()) {
  const target = parseLocalDate(dueDateStr);
  if (!target) return null;

  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const diffMs = target.getTime() - today.getTime();
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Formats a deadline into a clear urgency badge with color and label
 */
export function getDueUrgency(dueDateStr, referenceDate = new Date()) {
  const days = getDaysUntil(dueDateStr, referenceDate);
  if (days === null) {
    return {
      type: 'none',
      days: null,
      label: 'No Due Date',
      badgeClass: 'bg-slate-800 text-slate-400 border-slate-700',
      textClass: 'text-slate-400'
    };
  }

  if (days < 0) {
    const absDays = Math.abs(days);
    return {
      type: 'overdue',
      days,
      label: absDays === 1 ? 'Overdue (1 day)' : `Overdue (${absDays}d)`,
      badgeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold animate-pulse',
      textClass: 'text-rose-400'
    };
  }

  if (days === 0) {
    return {
      type: 'today',
      days: 0,
      label: 'Due Today!',
      badgeClass: 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-extrabold ring-1 ring-amber-500/40',
      textClass: 'text-amber-400'
    };
  }

  if (days === 1) {
    return {
      type: 'urgent',
      days: 1,
      label: 'Due Tomorrow',
      badgeClass: 'bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold',
      textClass: 'text-amber-400'
    };
  }

  if (days <= 3) {
    return {
      type: 'urgent',
      days,
      label: `In ${days} days`,
      badgeClass: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium',
      textClass: 'text-amber-400'
    };
  }

  if (days <= 7) {
    return {
      type: 'soon',
      days,
      label: `In ${days} days`,
      badgeClass: 'bg-blue-500/10 text-blue-300 border border-blue-500/20',
      textClass: 'text-blue-400'
    };
  }

  if (days <= 14) {
    return {
      type: 'upcoming',
      days,
      label: `In ${days} days`,
      badgeClass: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20',
      textClass: 'text-slate-300'
    };
  }

  return {
    type: 'future',
    days,
    label: `In ${days} days`,
    badgeClass: 'bg-slate-800 text-slate-400 border border-slate-700',
    textClass: 'text-slate-400'
  };
}

/**
 * Parses time string like "9:50 AM" or "1:30 PM" into minutes from midnight
 */
export function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const meridian = match[3].toUpperCase();
  if (meridian === 'PM' && hours < 12) hours += 12;
  if (meridian === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
}

/**
 * Safely sorts tasks by dueDate ascending or descending, guaranteeing tasks without
 * a dueDate are placed at the end of the list rather than the top.
 */
export function sortTasksByDueDate(tasks, ascending = true) {
  return [...tasks].sort((a, b) => {
    const hasA = Boolean(a.dueDate && a.dueDate.trim());
    const hasB = Boolean(b.dueDate && b.dueDate.trim());
    if (!hasA && !hasB) return 0;
    if (!hasA) return 1; // Put empty dates at the bottom
    if (!hasB) return -1;
    const comp = a.dueDate.localeCompare(b.dueDate);
    return ascending ? comp : -comp;
  });
}
