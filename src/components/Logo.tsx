import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M50 95C74.8528 95 95 74.8528 95 50C95 25.1472 74.8528 5 50 5C25.1472 5 5 25.1472 5 50C5 74.8528 25.1472 95 50 95Z"
        className="text-primary"
        fill="currentColor"
        fillOpacity="0.1"
      />
      <path
        d="M62.5 37.5C62.5 40.8152 61.183 43.9946 58.8388 46.3388C56.4946 48.683 53.3152 50 50 50C46.6848 50 43.5054 48.683 41.1612 46.3388C38.817 43.9946 37.5 40.8152 37.5 37.5C37.5 29.2222 43.0556 25 50 25C56.9444 25 62.5 29.2222 62.5 37.5Z"
        className="text-primary"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M27.7778 75C31.5647 64.8611 40.0518 58.0556 50 58.0556C59.9482 58.0556 68.4353 64.8611 72.2222 75"
        className="text-primary"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
