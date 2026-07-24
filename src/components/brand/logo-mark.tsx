export function LogoMark({
  size = 32,
  className = "",
  transparent = false,
}: {
  size?: number;
  className?: string;
  transparent?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {transparent ? (
        <>
          <rect x="9" y="20" width="5" height="12" rx="1.5" fill="#7B7FF5" fillOpacity="0.75" />
          <rect x="17" y="14" width="5" height="18" rx="1.5" fill="#5B5FEF" />
          <rect x="25" y="8" width="5" height="24" rx="1.5" fill="#4548C9" />
        </>
      ) : (
        <>
          <rect width="40" height="40" rx="10" fill="url(#digicools-badge)" />
          <rect x="9" y="20" width="5" height="12" rx="1.5" fill="white" fillOpacity="0.5" />
          <rect x="17" y="14" width="5" height="18" rx="1.5" fill="white" fillOpacity="0.8" />
          <rect x="25" y="8" width="5" height="24" rx="1.5" fill="white" />
        </>
      )}
      <path
        d="M24 3L24.8 5.2L27 6L24.8 6.8L24 9L23.2 6.8L21 6L23.2 5.2Z"
        fill="#E8B45C"
      />
      {!transparent && (
        <defs>
          <linearGradient id="digicools-badge" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5B5FEF" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      )}
    </svg>
  );
}
