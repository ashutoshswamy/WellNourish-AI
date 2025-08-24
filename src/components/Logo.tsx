import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path
        d="M19.5 12.572c-1.876 3.66-5.263 6.428-9.5 6.428s-7.624-2.767-9.5-6.428C2.376 9.233 5.237 8 9.5 8c2.79,0 5.06,1.25,6.5,3"
        className="text-primary"
        fill="currentColor"
        fillOpacity="0.1"
        strokeWidth="0"
      />
      <path
        d="M4.5 12.572C6.376 9.233 9.763 6.428 14.5 6.428s7.624 2.767 9.5 6.428c-2.376 3.66-5.237 4.5-9.5 4.5s-7.21-1.25-10-4.428"
        className="text-primary"
        fill="currentColor"
        fillOpacity="0.2"
        strokeWidth="0"
      />
      <path d="M2 12h3l3-9 4 18 3-9h3" stroke="currentColor" />
    </svg>
  );
}
