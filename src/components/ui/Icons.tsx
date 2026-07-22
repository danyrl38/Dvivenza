// -----------------------------------------------------------------------------
// Set de iconos de línea, alusivos al oficio: pincel, marco, paleta, envío...
// Todos heredan el color con `currentColor` y el tamaño con `className`.
// -----------------------------------------------------------------------------

type IconProps = React.SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconBrush(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9.5 14.5 3 21c1.8.6 4 .3 5.4-1.1 1-1 1.2-2.3.9-3.4Z" />
      <path d="M14 4.5 19.5 10 11 18.5 5.5 13Z" />
      <path d="m17 2 5 5-2.5 3L14 4.5Z" />
    </svg>
  );
}

export function IconFrame(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="1.5" />
      <rect x="6.5" y="6.5" width="11" height="11" rx="1" />
    </svg>
  );
}

export function IconPalette(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3a9 9 0 1 0 0 18c1 0 1.6-.7 1.6-1.5 0-.5-.2-.8-.5-1.1-.3-.3-.5-.7-.5-1.2 0-.8.7-1.5 1.6-1.5H16a5 5 0 0 0 5-5c0-4.1-4-7.7-9-7.7Z" />
      <circle cx="7.5" cy="12" r="1.1" />
      <circle cx="9.8" cy="8.2" r="1.1" />
      <circle cx="14.3" cy="7.8" r="1.1" />
    </svg>
  );
}

export function IconTruck(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17" cy="18" r="1.8" />
    </svg>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 4.6-7 9-7 9Z" />
    </svg>
  );
}

export function IconSparkle(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 13.8 9 19 10.8 13.8 12.6 12 18l-1.8-5.4L5 10.8 10.2 9Z" />
      <path d="M18.5 3.5v3M20 5h-3" />
    </svg>
  );
}

export function IconHand(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M12 11V4.5a1.5 1.5 0 0 1 3 0V11" />
      <path d="M15 11V6.5a1.5 1.5 0 0 1 3 0V13a7 7 0 0 1-7 7 7 7 0 0 1-5-2l-3-3a1.6 1.6 0 0 1 2.3-2.3L9 15" />
      <path d="M9 15V8.5a1.5 1.5 0 0 0-3 0V13" />
    </svg>
  );
}

export function IconChat(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M21 12a8 8 0 0 1-8 8H8l-5 2 1.4-4.2A8 8 0 1 1 21 12Z" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg {...base} {...props} strokeWidth={2.4}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

export function IconArrowLeft(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M15 5 8 12l7 7" />
    </svg>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}
