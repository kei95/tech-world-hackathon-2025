import { colors } from '../../lib/colors';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export function Skeleton({
  width = '100%',
  height = '16px',
  borderRadius = '4px',
  className = '',
}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: colors.border,
      }}
    />
  );
}

// Patient card skeleton
export function PatientCardSkeleton() {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: 'white',
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <Skeleton width="48px" height="48px" borderRadius="12px" />
        <div className="flex-1">
          <Skeleton width="120px" height="18px" className="mb-2" />
          <Skeleton width="80px" height="14px" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton width="100%" height="12px" />
        <Skeleton width="85%" height="12px" />
      </div>
    </div>
  );
}

// Log card skeleton
export function LogCardSkeleton() {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: 'white',
        border: `1px solid ${colors.border}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <Skeleton width="100px" height="14px" />
        <Skeleton width="60px" height="14px" />
      </div>
      <div className="space-y-2">
        <Skeleton width="100%" height="14px" />
        <Skeleton width="95%" height="14px" />
        <Skeleton width="80%" height="14px" />
      </div>
    </div>
  );
}

// Care plan section skeleton
export function CarePlanSkeleton() {
  return (
    <div className="space-y-3">
      <div
        className="rounded-xl p-4"
        style={{
          backgroundColor: colors.primaryLight,
          border: `1px solid ${colors.primary}`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Skeleton width="16px" height="16px" borderRadius="8px" />
          <Skeleton width="100px" height="14px" />
        </div>
        <Skeleton width="100%" height="14px" className="mb-2" />
        <Skeleton width="90%" height="14px" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl p-4"
            style={{
              backgroundColor: 'white',
              border: `1px solid ${colors.border}`,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <Skeleton width="80px" height="20px" borderRadius="12px" />
              <Skeleton width="24px" height="24px" borderRadius="12px" />
            </div>
            <Skeleton width="100%" height="14px" className="mb-2" />
            <Skeleton width="85%" height="14px" />
          </div>
        ))}
      </div>
    </div>
  );
}
