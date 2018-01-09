import React from 'react';
import grid from 'flexboxgrid/dist/flexboxgrid.css';
import { fromRawLsk, toRawLsk } from '../../utils/lsk';
import AccountVisual from '../accountVisual';
import AuthInputs from '../authInputs';
import { Button, PrimaryButton } from './../toolbox/buttons/button';
import { authStatePrefill, authStateIsValid } from '../../utils/form';
import Input from '../toolbox/inputs/input';
import fees from './../../constants/fees';
import styles from './send.css';
import inputStyles from './input.css';

class SendReadable extends React.Component {
  constructor() {
    super();
    this.state = {
      recipient: {
        value: '',
      },
      amount: {
        value: '',
      },
      loading: false,
      ...authStatePrefill(),
    };
    this.fee = fees.send;
    this.inputValidationRegexps = {
      recipient: /^\d{1,21}[L|l]$/,
      amount: /^\d+(\.\d{1,8})?$/,
    };
  }

  componentDidMount() {
    const newState = {
      recipient: {
        value: this.props.recipient || '',
      },
      amount: {
        value: this.props.amount || '',
      },
      ...authStatePrefill(this.props.account),
    };
    this.setState(newState);
  }

  componentDidUpdate() {
    if (this.state.loading &&
      (this.props.pendingTransactions.length > 0 || this.props.failedTransactions)) {
      const data = this.getTransactionState();
      this.props.nextStep(data);
      this.setState({ loading: false });
    }
  }

  getTransactionState() {
    const success = this.props.pendingTransactions.length > 0 && !this.props.failedTransactions;
    const successMessage = this.props.t('Transaction is being processed and will be confirmed. It may take up to 15 minutes to be secured in the blockchain.');
    const failureMessage = this.props.failedTransactions ? this.props.failedTransactions.errorMessage : '';
    const copy = success ? {
      title: this.props.t('Copy Transaction-ID to clipboard'),
      value: this.props.pendingTransactions[0].id,
    } : null;
    return {
      title: success ? this.props.t('Thank you') : this.props.t('Sorry'),
      body: success ? successMessage : failureMessage,
      callback: this.props.prevStep.bind(null, { reset: true }),
      copy,
      success,
    };
  }

  handleChange(name, value, error) {
    this.setState({
      [name]: {
        value,
        error: typeof error === 'string' ? error : this.validateInput(name, value),
      },
    });
  }

  validateInput(name, value) {
    if (!value) {
      return this.props.t('Required');
    } else if (!value.match(this.inputValidationRegexps[name])) {
      return this.props.t('Invalid');
    } else if (name === 'amount' && value > parseFloat(this.getMaxAmount())) {
      return this.props.t('Insufficient funds');
    } else if (name === 'amount' && value === '0') {
      return this.props.t('Zero not allowed');
    }
    return undefined;
  }

  send(event) {
    event.preventDefault();
    this.setState({ loading: true });
    this.props.sent({
      activePeer: this.props.activePeer,
      account: this.props.account,
      recipientId: this.state.recipient.value,
      amount: this.state.amount.value,
      passphrase: this.state.passphrase.value,
      secondPassphrase: this.state.secondPassphrase.value,
    });
  }

  getMaxAmount() {
    return fromRawLsk(Math.max(0, this.props.account.balance - this.fee));
  }

  addAmountAndFee() {
    return fromRawLsk(toRawLsk(this.props.amount) + this.fee);
  }

  render() {
    return (
      <div className='boxPadding send' style={{ height: '100%' }}>
        <div className={styles.header}>
          <header className={styles.headerWrapper}>
            <h2>{this.props.t('Confirm transfer')}</h2>
          </header>
          <figure className={`${styles.accountVisual} ${styles.mobileHidden}`}>
            <AccountVisual address={this.state.recipient.value} size={150} />
          </figure>
          <figure className={`${styles.accountVisual} ${styles.mobileVisible}`}>
            <AccountVisual address={this.state.recipient.value} size={60} />
          </figure>
        </div>
        <form className={styles.form} onSubmit={this.send.bind(this)}>
          <section>
            <Input label={this.props.t('Send to Address')}
              className={`recipient ${styles.disabledInput}`}
              value={this.props.recipient}
              onChange={this.handleChange.bind(this, 'recipient')}
              disabled={true}
            />
            <Input label={this.props.t('Total incl. 0.1 LSK Fee')}
              className={`amount ${styles.disabledInput}`}
              error={this.state.amount.error}
              value={this.addAmountAndFee()}
              disabled={true}
              theme={styles}
              onChange={this.handleChange.bind(this, 'amount')} />
            <AuthInputs
              passphrase={this.state.passphrase}
              secondPassphrase={this.state.secondPassphrase}
              onChange={this.handleChange.bind(this)}
              theme={inputStyles}
              columns={{ xs: 6, sm: 4, md: 4 }}
            />
          </section>
          <footer>
            <section className={grid.row} >
              <div className={`${grid['col-sm-4']} ${grid['col-xs-6']}`}>
                <Button
                  label={this.props.t('Back')}
                  onClick={() => this.props.prevStep()}
                  type='button'
                  theme={styles}
                />
              </div>
              <div className={`${grid['col-sm-8']} ${grid['col-xs-6']}`}>
                <PrimaryButton
                  className='send-button'
                  label={this.props.t('Send')}
                  type='submit'
                  theme={styles}
                  disabled={!authStateIsValid(this.state) || this.state.loading}
                />
              </div>
            </section>
            <div className='subTitle'>{this.props.t('Transactions can’t be reversed')}</div>
          </footer>
        </form>
      </div>
    );
  }
}

export default SendReadable;
