import { FC } from 'react';
import styles from './LoadSpinner.module.css';

/**
 * Component displaying an never-ending load spinner.
 */
const LoadSpinner: FC = () => (
  <div className={styles.overDiv}>
    <div className={styles.loadSpinner}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
);

export default LoadSpinner;
