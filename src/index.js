import lorem from 'lorem-ipsum';
import { clipboard } from 'electron';

const LOREM_PLUGIN = 'com.robinmalfait.lorem';

export default robot => {
  const { React } = robot.dependencies
  const { Blank } = robot.cards;
  const { enhance, restorableComponent } = robot

  const Lorem = React.createClass({
    getInitialState() {
      const config = {
        count: this.props.count,
        units: 'paragraphs',
        paragraphLowerBound: 1,
        paragraphUpperBound: 5,
      };

      return {
        config,
        output: lorem(config),
      }
    },
    getDefaultProps() {
      return {
        count: 1
      }
    },
    render() {
      const { config, output } = this.state;
      const { count, ...other } = this.props;

      const title = `Lorem ipsum (${config.count} paragraph${config.count == 1 ? '' : 's'})`;

      const actions = [ {
        label: 'Copy to clipboard',
        onClick: () => {
          clipboard.writeText(output);

          robot.notify('Copied to clipboard!');
        },
      } ]

      return (
        <Blank
          {...other}
          title={title}
          actions={actions}
        >
          <pre>{output}</pre>
        </Blank>
      )
    }
  })

  robot.registerComponent(enhance(Lorem, [
    restorableComponent
  ]), LOREM_PLUGIN);

  robot.listen(/^lorem (\d*)$/, {
    description: 'Lorem ipsum generator',
    usage: 'lorem <paragraphs>',
  }, ({ matches }) => {
    robot.addCard(LOREM_PLUGIN, {
      count: matches.paragraphs
    })
  });

  robot.listen(/^lorem$/, {
    description: 'Lorem ipsum generator',
    usage: 'lorem',
  }, () => {
    robot.addCard(LOREM_PLUGIN, {
      count: 1
    })
  });
}
