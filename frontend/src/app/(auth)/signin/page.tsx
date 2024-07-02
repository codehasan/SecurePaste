'use client';
import React, { ChangeEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from '../signup/page.module.css';

const SignIn = () => {
  const router = useRouter();

  const onSubmit = async (data: {}) => {
    router.push('/');
  };

  return <h1>Sign in</h1>;
};

export default SignIn;
