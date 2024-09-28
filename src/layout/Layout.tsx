import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import logo from '@/assets/loding.gif';
import styles from './layout.module.scss';
import { VotingContext } from '@/context/Voter';

export function Layout(): React.JSX.Element {
  const { error } = useContext(VotingContext);
  return (
    <div>
      {error && (
        <div className={styles.message}>
          <p>{error}</p>
        </div>
      )}
      <header className={styles.nav}>
        <img className={styles.logo} src={logo} />
        <div className={styles.connect_button}>
          <ConnectButton />
        </div>

      </header>
      <Outlet />
    </div>
  );
}