import type { User } from '@/types';

export function Avatar({
  user,
  size = 'md',
  ring = false,
}: {
  user: Pick<User, 'initials' | 'avatarColor' | 'collegeEmailVerified'>;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  ring?: boolean;
}) {
  const dims: Record<string, string> = {
    xs: 'h-7 w-7 text-[10px]',
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-16 w-16 text-lg',
    xl: 'h-24 w-24 text-2xl',
  };
  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${dims[size]} ${
        ring ? 'ring-4 ring-white' : ''
      }`}
      style={{ backgroundColor: user.avatarColor }}
    >
      {user.initials}
      {user.collegeEmailVerified && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-brand-500 text-white ring-2 ring-white ${
            size === 'xl' ? 'h-6 w-6' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
          }`}
          title="College email verified"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-3 w-3">
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.42 0l-3.5-3.5a1 1 0 111.42-1.42l2.79 2.79 6.79-6.79a1 1 0 011.42 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </div>
  );
}

export function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? '#2d8b63' : score >= 70 ? '#2aa399' : '#636d88';
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eceef2" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className="absolute text-xs font-bold text-ink-900">{score}</span>
    </div>
  );
}

export function SkillLevelPill({ level }: { level: string }) {
  const styles: Record<string, string> = {
    Beginner: 'bg-ink-100 text-ink-600',
    Intermediate: 'bg-mint-50 text-mint-700 ring-1 ring-mint-200',
    Advanced: 'bg-mint-100 text-mint-800 ring-1 ring-mint-300',
    Expert: 'bg-brand-50 text-brand-700 ring-1 ring-brand-200',
  };
  return <span className={`badge ${styles[level] ?? styles.Beginner}`}>{level}</span>;
}

export function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Recruiting: 'bg-brand-50 text-brand-700 ring-1 ring-brand-200',
    'In Progress': 'bg-accent-50 text-accent-700 ring-1 ring-accent-200',
    Completed: 'bg-ink-100 text-ink-600',
  };
  return <span className={`badge ${styles[status] ?? styles.Recruiting}`}>{status}</span>;
}

export function AvailabilityPill({ value }: { value: string }) {
  return <span className="badge bg-ink-100 text-ink-700">{value}</span>;
}
