import React, { SVGAttributes } from 'react';

interface LogoProps {
  className?: string;
}

const TrustWallet: React.FC<LogoProps & SVGAttributes<SVGElement>> = ({
  className,
  ...props
}) => {
  return (
    <svg
      width="39"
      height="43"
      viewBox="0 0 39 43"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      exponent="92384"
      className={className}
      {...props}
    >
      <path
        d="M0.710815 6.67346L19.4317 0.606445V42.6064C6.05944 37.0059 0.710815 26.2727 0.710815 20.207V6.67346Z"
        fill="#0500FF"
      ></path>
      <path
        d="M38.1537 6.67346L19.4329 0.606445V42.6064C32.8051 37.0059 38.1537 26.2727 38.1537 20.207V6.67346Z"
        fill="url(#paint0_linear_524_7586892384)"
      ></path>
      <defs>
        <linearGradient
          id="paint0_linear_524_7586892384"
          x1="33.1809"
          y1="-2.33467"
          x2="19.115"
          y2="42.0564"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.02" stopColor="#0000FF"></stop>
          <stop offset="0.08" stopColor="#0094FF"></stop>
          <stop offset="0.16" stopColor="#48FF91"></stop>
          <stop offset="0.42" stopColor="#0094FF"></stop>
          <stop offset="0.68" stopColor="#0038FF"></stop>
          <stop offset="0.9" stopColor="#0500FF"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

export default TrustWallet;
