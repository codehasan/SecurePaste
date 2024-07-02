import { useState, useRef, useCallback, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

const useRecaptcha = () => {
  const [captchaToken, setCapchaToken] = useState<string>('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleRecaptcha = useCallback((token: string | null) => {
    setCapchaToken(token ?? '');
  }, []);

  useEffect(() => {
    const refreshCaptcha = () => {
      if (recaptchaRef.current && captchaToken) {
        recaptchaRef.current.reset();
        setCapchaToken('');
      }
    };

    let tokenRefreshTimeout: NodeJS.Timeout | null = null;

    if (captchaToken) {
      tokenRefreshTimeout = setTimeout(refreshCaptcha, 110000); // 110 seconds
    }

    return () => {
      if (tokenRefreshTimeout) {
        clearTimeout(tokenRefreshTimeout);
      }
    };
  }, [captchaToken]);

  return { captchaToken, recaptchaRef, handleRecaptcha };
};

export default useRecaptcha;
