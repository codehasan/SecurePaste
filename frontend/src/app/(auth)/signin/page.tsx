'use client';
import React, { ChangeEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import Link from 'next/link';
import axios from 'axios';
import Logo from '@/icons/Logo';
import OAuthProvider from '../form/OAuthProvider';

import styles from '../signup/page.module.css';

const SignIn = () => {
  const router = useRouter();

  const onSubmit = async (data: {}) => {
    router.push('/');
  };

  return <h1>Sign in</h1>;
};

export default SignIn;
