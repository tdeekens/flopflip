function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function');
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return call && (typeof call === 'object' || typeof call === 'function')
    ? call
    : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== 'function' && superClass !== null) {
    throw new TypeError(
      'Super expression must either be null or a function, not ' +
        typeof superClass
    );
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  });
  if (superClass)
    Object.setPrototypeOf
      ? Object.setPrototypeOf(subClass, superClass)
      : (subClass.__proto__ = superClass);
}

import React from 'react';
import PropTypes from 'prop-types';

/**
 * A <Subscriber> pulls the value for a channel off of context.broadcasts
 * and passes it to its children function.
 */

var Subscriber = (function(_React$Component) {
  _inherits(Subscriber, _React$Component);

  function Subscriber() {
    var _temp, _this, _ret;

    _classCallCheck(this, Subscriber);

    for (
      var _len = arguments.length, args = Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      args[_key] = arguments[_key];
    }

    return (_ret = (
      (_temp = (
        (_this = _possibleConstructorReturn(
          this,
          _React$Component.call.apply(_React$Component, [this].concat(args))
        )),
        _this
      )),
      (_this.state = {
        value: null,
      }),
      _temp
    )), _possibleConstructorReturn(_this, _ret);
  }

  Subscriber.prototype.getBroadcast = function getBroadcast() {
    var broadcast = this.context.broadcasts[this.props.channel];

    return broadcast;
  };

  Subscriber.prototype.componentWillMount = function componentWillMount() {
    var broadcast = this.getBroadcast();

    this.setState({
      value: broadcast.getState(),
    });
  };

  Subscriber.prototype.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var broadcast = this.getBroadcast();

    this.unsubscribe = broadcast.subscribe(function(value) {
      _this2.setState({ value: value });
    });
  };

  Subscriber.prototype.componentWillUnmount = function componentWillUnmount() {
    this.unsubscribe();
  };

  Subscriber.prototype.render = function render() {
    return this.props.children(this.state.value);
  };

  return Subscriber;
})(React.Component);

Subscriber.propTypes = {
  channel: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};
Subscriber.contextTypes = {
  broadcasts: PropTypes.object,
};

export default Subscriber;
