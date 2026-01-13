import type { SVGProps } from 'react';

type WhatsAppIconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export default function WhatsAppIcon({ size = 24, ...props }: WhatsAppIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 11.5c0 5.2-4.3 9.5-9.6 9.5-1.6 0-3.1-.4-4.5-1.1L3 21l1.2-3.7A9.6 9.6 0 1 1 21 11.5Z" />
      <path
        d="M15.8 13.4c-.2 1-1.2 1.7-1.9 1.4-.8-.3-2.6-.9-3.7-2.8-1-1.7-1.2-3-.8-3.5.4-.5 1.1-.2 1.2 0 .1.3.8 1.9.9 2.1.1.2.1.3 0 .5l-.4.5c-.1.1-.2.3.1.7.4.4 1.3 1 1.5 1.1.2.1.3.1.5 0l.6-.7c.1-.2.3-.2.5-.1.2.1 1.2.5 1.3.6.2.1.3.2.3.3Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
