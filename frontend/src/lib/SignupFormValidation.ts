export const validateForm = (
  formValues: {
    name: string;
    email: string;
    password: string;
    terms: boolean;
    captchaToken: string;
  },
  passwordStatus: {
    lowercase: boolean;
    uppercase: boolean;
    number: boolean;
    symbols: boolean;
    minimumChars: boolean;
    noTrailingSpace: boolean;
  }
) => {
  const result = {
    filled: true,
    error: '',
  };
  const checks = [
    {
      condition: !formValues.name.trim(),
      error: 'Please enter your full name.',
    },
    {
      condition: !formValues.email.trim(),
      error: 'Please enter your email address.',
    },
    {
      condition: !formValues.password.trim(),
      error: 'Please enter a password for your account.',
    },
    {
      condition: !formValues.terms,
      error: 'Please accept the terms of service.',
    },
    {
      condition: !formValues.captchaToken.trim(),
      error: 'Please complete the captcha.',
    },
    {
      condition:
        !passwordStatus.lowercase ||
        !passwordStatus.uppercase ||
        !passwordStatus.number ||
        !passwordStatus.symbols ||
        !passwordStatus.minimumChars ||
        !passwordStatus.noTrailingSpace,
      error:
        'Please create a strong password that satisfies all the requirements.',
    },
  ];

  for (let check of checks) {
    if (check.condition) {
      result.filled = false;
      result.error = check.error;
      break;
    }
  }

  return result;
};
