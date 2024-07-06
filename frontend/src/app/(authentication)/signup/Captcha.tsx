import React, { ForwardedRef, forwardRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const Captcha = forwardRef(function Captcha(
  { handleRecaptcha }: { handleRecaptcha: (token: string | null) => void },
  ref: ForwardedRef<ReCAPTCHA>
) {
  return (
    <ReCAPTCHA
      ref={ref}
      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY!}
      onChange={handleRecaptcha}
    />
  );
});

export const MemoizedCaptcha = React.memo(Captcha);
