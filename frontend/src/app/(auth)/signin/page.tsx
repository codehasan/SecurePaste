import React from 'react';

import styles from './page.module.css';
import classNames from 'classnames';

const SignIn = () => {
  return (
    <div className={classNames(styles.container)}>
      <div id="signup-form">
        <h1>Sign in your account</h1>
      </div>
    </div>
  );
};

export default SignIn;
