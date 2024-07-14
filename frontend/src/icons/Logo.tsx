import React, { ReactNode, SVGAttributes } from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps & SVGAttributes<SVGElement>> = ({
  className,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="40 44 425 425"
      className={className}
      {...props}
    >
      <g fill="currentColor">
        <path d="m274 52 145 82c18 9 26 24 26 44-4 126-62 221-171 284-14 7-28 7-42 0A319 319 0 0 1 66 232c-4-19-4-39-5-58-1-17 7-30 22-38l148-84c14-7 28-8 43 0M168 229a50 50 0 0 0 11 80c5 3 10 4 16 5 4 1 7-2 8-7 1-4-2-8-6-9l-5-1c-10-3-17-10-20-20-8-22 6-44 30-45 6 0 9-3 9-9l1-6a42 42 0 0 1 82 0v22c1 7 4 10 11 10h8c15 0 26 16 22 31-3 11-11 17-24 19-5 0-8 3-8 8 0 4 3 8 8 8h8c18-4 32-20 34-37 1-18-9-36-26-43l-16-4c0-15-2-30-12-43a59 59 0 0 0-104 28 52 52 0 0 0-27 13m44 58-1 5v46c0 8 3 11 11 11h62c8 0 11-3 11-11v-43c0-7-2-12-9-14-1-26-12-40-32-41-8 0-16 2-22 8-11 9-13 21-13 32l-7 7z" />
        <path d="M 277 299 L 277 332 L 228 332 L 228 299 Z M 236 282 C 235 273 236 265 244 259 C 250 256 256 256 262 259 C 270 265 270 273 269 282 Z M 252.721 306.72 C 247.485 306.72 243.24 310.973 243.24 316.22 C 243.24 321.467 247.485 325.72 252.721 325.72 C 257.957 325.72 262.202 321.467 262.202 316.22 C 262.202 310.973 257.957 306.72 252.721 306.72 Z" />
      </g>
    </svg>
  );
};

export default Logo;
