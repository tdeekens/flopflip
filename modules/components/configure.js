import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { initialize, listen } from './../utils/ld-wrapper';
import { updateStatus, updateFlags } from './../actions/ducks';

export class Configure extends React.Component {
  static propTypes = {
    children: PropTypes.element,
    clientSideId: PropTypes.string.isRequired,
    user: PropTypes.shape({
      key: PropTypes.string,
    }),

    // Connected
    updateStatus: PropTypes.func.isRequired,
    updateFlags: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: null,
    user: {},
  };

  render() {
    const client = initialize({
      clientSideId: this.props.clientSideId,
      user: this.props.user,
    });

    listen({ client, dispatch: store.dispatch });

    return React.Children.only(this.props.children);
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ updateStatus, updateFlags }, dispatch);

export default connect(null, mapDispatchToProps)(Configure);
