import classNames from 'classnames';
import Image from 'next/image';
import React from 'react';
import styles from '@/app/(client)/client.module.css';

const UserNotifications = () => {
  return (
    <div className="size-full">
      <div className={classNames(styles.container)}>
        <div className="h-fill flex flex-col items-center justify-center gap-4">
          <Image
            width="200"
            height="200"
            src="/img/content-unavailable.png"
            alt="Unavailable"
            className="size-28"
          />
          <span className="text-gray-700">No notifications found</span>
        </div>
      </div>
    </div>
  );
};

export default UserNotifications;
