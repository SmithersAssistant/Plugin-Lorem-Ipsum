'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _loremIpsum = require('lorem-ipsum');

var _loremIpsum2 = _interopRequireDefault(_loremIpsum);

var _electron = require('electron');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var LOREM_PLUGIN = 'com.robinmalfait.lorem';

exports.default = function (robot) {
  var React = robot.dependencies.React;
  var Blank = robot.cards.Blank;
  var enhance = robot.enhance;
  var restorableComponent = robot.restorableComponent;


  var Lorem = React.createClass({
    displayName: 'Lorem',
    getInitialState: function getInitialState() {
      var config = {
        count: this.props.count,
        units: 'paragraphs',
        paragraphLowerBound: 1,
        paragraphUpperBound: 5
      };

      return {
        config: config,
        output: (0, _loremIpsum2.default)(config)
      };
    },
    getDefaultProps: function getDefaultProps() {
      return {
        count: 1
      };
    },
    render: function render() {
      var _state = this.state;
      var config = _state.config;
      var output = _state.output;
      var _props = this.props;
      var count = _props.count;

      var other = _objectWithoutProperties(_props, ['count']);

      var title = 'Lorem ipsum (' + config.count + ' paragraph' + (config.count == 1 ? '' : 's') + ')';

      var actions = [{
        label: 'Copy to clipboard',
        onClick: function onClick() {
          _electron.clipboard.writeText(output);

          robot.notify('Copied to clipboard!');
        }
      }];

      return React.createElement(
        Blank,
        _extends({}, other, {
          title: title,
          actions: actions
        }),
        React.createElement(
          'pre',
          null,
          output
        )
      );
    }
  });

  robot.registerComponent(enhance(Lorem, [restorableComponent]), LOREM_PLUGIN);

  robot.listen(/^lorem (\d*)$/, {
    description: 'Lorem ipsum generator',
    usage: 'lorem <paragraphs>'
  }, function (_ref) {
    var matches = _ref.matches;

    robot.addCard(LOREM_PLUGIN, {
      count: matches.paragraphs
    });
  });

  robot.listen(/^lorem$/, {
    description: 'Lorem ipsum generator',
    usage: 'lorem'
  }, function () {
    robot.addCard(LOREM_PLUGIN, {
      count: 1
    });
  });
};