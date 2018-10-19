const ReactDataGrid = require('react-data-grid');
const exampleWrapper = require('../components/exampleWrapper');
const React = require('react');

import warcraftAPI from './WarcraftAPI';

class Example extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.createRows();
    this._columns = [
      { key: 'id', name: 'ID' },
      { key: 'title', name: 'Title' },
      { key: 'count', name: 'Count' } ];

    this.state = null;
  }

  createRows = () => {
    let rows = [];
    for (let i = 1; i < 2; i++) {
      rows.push({
        id: i,
        title: warcraftAPI.getAPI('us'),
        // title: warcraftAPI.toon('us', 'Goldrinn', 'Jayesh'),
        count: i * 1000
      });
    }

    this._rows = rows;
  };

  rowGetter = (i) => {
    return this._rows[i];
  };

  render() {
    return  (
      <ReactDataGrid
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this._rows.length}
        minHeight={500} />);
  }
}

module.exports = exampleWrapper({
  WrappedComponent: Example,
  exampleName: 'Basic Example',
  exampleDescription: 'A display only grid.',
  examplePath: './scripts/example01-basic.js',
  examplePlaygroundLink: 'https://jsfiddle.net/f6mbnb8z/1/'
});
