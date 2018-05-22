import React from 'react';
import MultiStep from './../../multiStep';
import styles from './../transactions.css';
import TransactionOverview from './../transactionOverview';
import TransactionDetailView from './../transactionDetailView';
import Box from './../../box';

import routes from './../../../constants/routes';

class ExplorerTransactions extends React.Component {
  render() {
    const onInit = () => {
      if (!this.props.isSearchInStore) {
        this.props.searchAccount({
          activePeer: this.props.activePeer,
          address: this.props.address,
        });
        this.props.searchTransactions({
          activePeer: this.props.activePeer,
          address: this.props.address,
          limit: 25,
          filter: this.props.activeFitler,
        });
      } else {
        this.props.searchUpdateLast({
          address: this.props.address,
        });
      }
    };
    const onLoadMore = () => {
      this.props.searchMoreTransactions({
        activePeer: this.props.activePeer,
        address: this.props.address,
        limit: 25,
        offset: this.props.offset,
        filter: this.props.activeFilter,
      });
    };
    const onFilterSet = (filter) => {
      this.props.searchTransactions({
        activePeer: this.props.activePeer,
        address: this.props.address,
        limit: 25,
        filter,
        showLoading: false,
      });
    };

    const onTransactionRowClick = (props) => {
      const explorerBasePath = `${routes.accounts.pathPrefix}${routes.accounts.path}`;
      const accountPath = `${explorerBasePath}/${this.props.address}`;
      const transactionDetailPath = `${accountPath}?id=${props.value.id}`;
      this.props.history.push(transactionDetailPath);
    };

    const overviewProps = {
      ...this.props,
      onInit,
      onLoadMore,
      onFilterSet,
      onTransactionRowClick,
    };

    return (
      <Box>
        <MultiStep className={styles.transactions}>
          <TransactionOverview {...overviewProps} />
          <TransactionDetailView {...this.props} />
        </MultiStep>
      </Box>
    );
  }
}

export default ExplorerTransactions;
