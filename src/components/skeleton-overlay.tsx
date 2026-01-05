export function SkeletonOverlay() {
  const strokeColor = "hsl(var(--accent))";
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 360 640"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke={strokeColor} strokeWidth="4" strokeLinecap="round" opacity="0.6">
          {/* Head */}
          <circle cx="180" cy="160" r="20" />
          {/* Spine */}
          <line x1="180" y1="180" x2="180" y2="320" />
          {/* Shoulders */}
          <line x1="140" y1="200" x2="220" y2="200" />
          {/* Left Arm */}
          <line x1="140" y1="200" x2="120" y2="280" />
          <line x1="120" y1="280" x2="100" y2="360" />
          {/* Right Arm */}
          <line x1="220" y1="200" x2="240" y2="280" />
          <line x1="240" y1="280" x2="260" y2="360" />
          {/* Pelvis */}
          <line x1="160" y1="320" x2="200" y2="320" />
          {/* Left Leg */}
          <line x1="160" y1="320" x2="150" y2="420" />
          <line x1="150" y1="420" x2="140" y2="520" />
          {/* Right Leg */}
          <line x1="200" y1="320" x2="210" y2="420" />
          <line x1="210" y1="420" x2="220" y2="520" />

          {/* Joints */}
          <circle cx="180" cy="180" r="5" fill={strokeColor} />
          <circle cx="140" cy="200" r="5" fill={strokeColor} />
          <circle cx="220" cy="200" r="5" fill={strokeColor} />
          <circle cx="120" cy="280" r="5" fill={strokeColor} />
          <circle cx="240" cy="280" r="5" fill={strokeColor} />
          <circle cx="180" cy="320" r="5" fill={strokeColor} />
          <circle cx="160" cy="320" r="5" fill={strokeColor} />
          <circle cx="200" cy="320" r="5" fill={strokeColor} />
          <circle cx="150" cy="420" r="5" fill={strokeColor} />
          <circle cx="210" cy="420" r="5" fill={strokeColor} />
        </g>
      </svg>
    </div>
  );
}
