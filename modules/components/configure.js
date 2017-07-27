import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { initialize, listen } from './../utils/ld-wrapper';
import { updateStatus, updateFlags } from './../ducks';

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

  componentDidMount() {
    listen({
      client: initialize({
        clientSideId: this.props.clientSideId,
        user: this.props.user,
      }),
      updateFlags: this.props.updateFlags,
      updateStatus: this.props.updateStatus,
    });
  }

  render() {
    return this.props.children
      ? React.Children.only(this.props.children)
      : null;
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators({ updateStatus, updateFlags }, dispatch);

export default connect(null, mapDispatchToProps)(Configure);
