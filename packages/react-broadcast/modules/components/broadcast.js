/**
 * This code is shameful copy of `react-broadcast` which due to its build tooling
 * could not be integrated. Bundling it with rollup resoluted, due to the exports,
 * in including react twice within our bundle.
 *
 * A PR has been added to `react-broadcast` upstream to fix the issue.
 *
 * Other solutions such as cloning a fork failed due to jest not transpiling
 * dependencies.
 */
var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

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

var createBroadcast = function createBroadcast(initialState) {
  var listeners = [];
  var currentState = initialState;

  var getState = function getState() {
    return currentState;
  };

  var setState = function setState(state) {
    currentState = state;
    listeners.forEach(function(listener) {
      return listener(currentState);
    });
  };

  var subscribe = function subscribe(listener) {
    listeners.push(listener);

    return function() {
      return (listeners = listeners.filter(function(item) {
        return item !== listener;
      }));
    };
  };

  return {
    getState: getState,
    setState: setState,
    subscribe: subscribe,
  };
};

/**
 * A <Broadcast> provides a generic way for descendants to "subscribe"
 * to some value that changes over time, bypassing any intermediate
 * shouldComponentUpdate's in the hierarchy. It puts all subscription
 * functions on context.broadcasts, keyed by "channel".
 *
 * To use it, a subscriber must opt-in to context.broadcasts. See the
 * <Subscriber> component for a reference implementation.
 */

var Broadcast = (function(_React$Component) {
  _inherits(Broadcast, _React$Component);

  function Broadcast() {
    var _temp, _this, _ret;

    _classCallCheck(this, Broadcast);

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
      (_this.broadcast = createBroadcast(_this.props.value)),
      _temp
    )), _possibleConstructorReturn(_this, _ret);
  }

  Broadcast.prototype.getChildContext = function getChildContext() {
    var _extends2;

    return {
      broadcasts: _extends(
        {},
        this.context.broadcasts,
        (
          (_extends2 = {}),
          (_extends2[this.props.channel] = this.broadcast),
          _extends2
        )
      ),
    };
  };

  Broadcast.prototype.componentWillReceiveProps = function componentWillReceiveProps(
    nextProps
  ) {
    if (this.props.value !== nextProps.value)
      this.broadcast.setState(nextProps.value);
  };

  Broadcast.prototype.render = function render() {
    return React.Children.only(this.props.children);
  };

  return Broadcast;
})(React.Component);

Broadcast.propTypes = {
  channel: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  value: PropTypes.any,
};
Broadcast.contextTypes = {
  broadcasts: PropTypes.object,
};
Broadcast.childContextTypes = {
  broadcasts: PropTypes.object.isRequired,
};

export default Broadcast;
