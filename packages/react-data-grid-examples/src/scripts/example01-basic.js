const ReactDataGrid = require('react-data-grid');
const exampleWrapper = require('../components/exampleWrapper');
const React = require('react');

import * as warcraftAPI from './WarcraftAPI';

class Example extends React.Component {
  constructor(props, context) {
    super(props, context);
    warcraftAPI.getToon('us', 'Goldrinn', 'Jayesh').then((resultado) => {
      let level = resultado.level;
      console.log(resultado);
      this.createRows(level);
    });
    this.createRows();
    this._columns = [
      { key: 'count', name: 'Reino' },
      { key: 'id', name: 'Nome' },
      { key: 'title', name: 'Level' }];

    this.state = null;
  }

  returnLevel = () => {
    let level = 10;
    warcraftAPI.getToon('us', 'Goldrinn', 'Jayesh').then((resultado) => {
      level = resultado.level;
      return level;
    });
  }

  createRows = (level) => {
    let rows = [];
    for (let i = 1; i < 2; i++) {
      rows.push({
        count: 'Goldrinn',
        id: 'Jayesh',
        // title: warcraftAPI.getAPI('us'),
        //title: warcraftAPI.getToon('us', 'Goldrinn', 'Jayesh'),
        title: level
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
