import classNames from 'classnames';
import styles from './client.module.css';

const Loading = () => {
  return (
    <div
      className={classNames(
        styles.container,
        'h-fill flex justify-center items-center !mb-0'
      )}
    >
      <span className="loading loading-spinner loading-lg" />
    </div>
  );
};

export default Loading;
