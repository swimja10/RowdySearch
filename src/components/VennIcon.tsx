import { useId } from "react";

type VennIconProps = {
  className?: string;
};

const RIGHT_CIRCLE = { cx: 31, cy: 16, r: 12.5 };
const STRIPE_HEIGHTS = [8, 12, 16, 20, 24];

// Analytical Mode's icon: two overlapping circles, with stripes where they overlap.
// It's drawn in `currentColor`, so a Tailwind text color like text-orange-500 colors it.
export function VennIcon({ className }: VennIconProps) {
  // Every icon on the page needs its own ids, or they'd share one mask.
  const id = useId();
  const maskId = `${id}-mask`;
  const overlapId = `${id}-overlap`;

  return (
    <svg viewBox="0 0 48 32" className={className} aria-hidden="true">
      <defs>
        <clipPath id={overlapId}>
          <circle {...RIGHT_CIRCLE} />
        </clipPath>
        {/* Black parts of the mask become see-through holes in the left circle. */}
        <mask id={maskId}>
          <rect width="48" height="32" fill="white" />
          {/* A gap around the right circle's ring... */}
          <circle {...RIGHT_CIRCLE} fill="none" stroke="black" strokeWidth="5.5" />
          {/* ...and stripes, only where the two circles overlap. */}
          <g clipPath={`url(#${overlapId})`}>
            {STRIPE_HEIGHTS.map(y => (
              <rect key={y} x="0" y={y - 1} width="48" height="2" fill="black" />
            ))}
          </g>
        </mask>
      </defs>
      <circle cx="16" cy="16" r="14" fill="currentColor" mask={`url(#${maskId})`} />
      <circle {...RIGHT_CIRCLE} fill="none" stroke="currentColor" strokeWidth="2.5" />
    </svg>
  );
}
