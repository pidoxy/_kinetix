export function SkeletonOverlay() {
  const strokeColor = "#00FFFF"; // Cyan
  const jointColor = "#FFFFFF"; // White
  
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none" style={{ filter: 'drop-shadow(0 0 5px rgba(0, 255, 255, 0.7))' }}>
      <svg
        className="w-full h-full"
        viewBox="0 0 360 640"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke={strokeColor} strokeWidth="2" strokeLinecap="round" opacity="0.8">
          {/* Head */}
          <circle cx="180" cy="160" r="15" fill="none" />
          {/* Spine */}
          <line x1="180" y1="175" x2="180" y2="320" />
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
          <circle cx="180" cy="175" r="3" fill={jointColor} /> {/* Neck */}
          <circle cx="140" cy="200" r="3" fill={jointColor} /> {/* L Shoulder */}
          <circle cx="220" cy="200" r="3" fill={jointColor} /> {/* R Shoulder */}
          <circle cx="120" cy="280" r="3" fill={jointColor} /> {/* L Elbow */}
          <circle cx="240" cy="280" r="3" fill={jointColor} /> {/* R Elbow */}
          <circle cx="100" cy="360" r="3" fill={jointColor} /> {/* L Wrist */}
          <circle cx="260" cy="360" r="3" fill={jointColor} /> {/* R Wrist */}
          <circle cx="160" cy="320" r="3" fill={jointColor} /> {/* L Hip */}
          <circle cx="200" cy="320" r="3" fill={jointColor} /> {/* R Hip */}
          <circle cx="150" cy="420" r="3" fill={jointColor} /> {/* L Knee */}
          <circle cx="210" cy="420" r="3" fill={jointColor} /> {/* R Knee */}
          <circle cx="140" cy="520" r="3" fill={jointColor} /> {/* L Ankle */}
          <circle cx="220" y2="520" r="3" fill={jointColor} /> {/* R Ankle */}
        </g>
      </svg>
    </div>
  );
}
