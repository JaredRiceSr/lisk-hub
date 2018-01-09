import React from 'react';
import { translate } from 'react-i18next';

import { FontIcon } from '../fontIcon';
import Box from '../box';
import MultiStep from './../multiStep';
import ResultBox from '../resultBox';
import SendWritable from '../sendWritable';
import SendReadable from './../sendReadable';
import styles from './styles.css';

class Send extends React.Component {
  constructor() {
    super();
    this.state = {
      sendIsActive: false,
    };
  }

  setSendIsActive(sendIsActive) {
    this.setState({ sendIsActive });
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <span className={styles.mobileMenu}>
          <span className={`send-menu-item ${styles.mobileMenuItem}`}
            onClick={this.setSendIsActive.bind(this, true)}>
            {t('Send')}
          </span>
        </span>
        <div className={`${styles.send} ${this.state.sendIsActive ? styles.isActive : ''}`}>
          <Box className='send-Box'>
            <span className={`mobile-close-button ${styles.mobileClose}`}
              onClick={this.setSendIsActive.bind(this, false)}>
              {t('Close')} <FontIcon value='close' />
            </span>
            <MultiStep finalCallback={this.setSendIsActive.bind(this, false)}
              className={styles.heightHelper}>
              <SendWritable autoFocus={this.state.sendIsActive || window.innerWidth > 1024}/>
              <SendReadable />
              <ResultBox />
            </MultiStep>
          </Box>
        </div>
      </div>
    );
  }
}

export default translate()(Send);

