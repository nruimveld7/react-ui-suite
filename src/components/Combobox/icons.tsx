import * as React from "react";

export function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.172l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.704 5.29a1 1 0 0 1 0 1.415l-7.2 7.2a1 1 0 0 1-1.415 0l-3.2-3.2a1 1 0 1 1 1.414-1.414l2.493 2.493 6.493-6.493a1 1 0 0 1 1.415 0z" />
    </svg>
  );
}

export function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" strokeWidth="1.5" />
      <path d="M8 4v3M16 4v3" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3.5 9h17" strokeWidth="1.5" />
      <rect x="7.75" y="12.25" width="4.5" height="4.5" rx="1" strokeWidth="1.5" />
    </svg>
  );
}

export function Clock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true" {...props}>
      <circle cx="12" cy="12" r="8.5" strokeWidth="1.5" />
      <path
        d="M12 7.5v4.25l3 1.75"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
