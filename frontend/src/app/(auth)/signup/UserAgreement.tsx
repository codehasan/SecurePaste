'use client';
import classNames from 'classnames';
import React, { ForwardedRef, forwardRef } from 'react';

import styles from './page.module.css';

interface UserAgreementProps {
  onClose: () => void;
  onAgree: () => void;
}

const UserAgreementComponent = forwardRef(function UserAgreementComponent(
  { onAgree, onClose }: UserAgreementProps,
  reference: ForwardedRef<HTMLDialogElement>
) {
  return (
    <dialog ref={reference} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">User Agreement</h3>
        <div className="pt-4 pb-1">
          <span>
            By creating an account, I agree to the following terms and
            conditions:
          </span>
          <ul className={classNames(styles.userAgreement, 'pl-4 py-2')}>
            <li>
              <strong>Legal Use:</strong> I will use SecurePaste only for lawful
              purposes and in a manner that does not infringe the rights of,
              restrict, or inhibit anyone else&apos;s use and enjoyment of the
              service.
            </li>
            <li>
              <strong>Compliance with Laws:</strong> I agree to comply with all
              applicable laws and regulations when using SecurePaste.
            </li>
            <li>
              <strong>No Unauthorized Access:</strong> I will not attempt to
              gain unauthorized access to any part of SecurePaste or its related
              systems and networks.
            </li>
            <li>
              <strong>Data Responsibility:</strong> I understand that I am
              solely responsible for the content I upload and share through
              SecurePaste and that such content must not violate any copyright,
              trademark, privacy, or other personal or proprietary rights of any
              party.
            </li>
            <li>
              <strong>Account Security:</strong> I am responsible for
              maintaining the confidentiality of my account information and for
              all activities that occur under my account.
            </li>
          </ul>
          <span>
            By clicking &quot;Create Account,&quot; I acknowledge that I have
            read, understood, and agree to these terms and conditions.
          </span>
        </div>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-error mr-2" onClick={onClose}>
              Close
            </button>
            <button className="btn btn-primary" onClick={onAgree}>
              Agree
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
});

export const UserAgreement = React.memo(UserAgreementComponent);
