import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 20A7 7 0 0 1 4 13H2a10 10 0 0 0 10 10z" className="text-primary" fill="currentColor" fillOpacity="0.2" />
      <path d="M12 2a10 10 0 0 0-10 10h2A7 7 0 0 1 11 4v1a2 2 0 0 0-2 2H8a4 4 0 0 1 4-4z" className="text-primary" fill="currentColor" fillOpacity="0.2" />
      <path d="M12 22a10 10 0 0 0 10-10h-2a7 7 0 0 1-7 7v-1a2 2 0 0 0 2-2h1a4 4 0 0 1-4 4z" className="text-primary" fill="currentColor" fillOpacity="0.8" />
      <path d="M2 12a10 10 0 0 0 10 10V12H2z" className="text-primary" fill="currentColor" fillOpacity="0.8" />
    </svg>
  );
}
