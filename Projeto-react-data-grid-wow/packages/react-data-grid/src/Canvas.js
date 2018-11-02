import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Row from './Row';
import cellMetaDataShape from 'common/prop-shapes/CellActionShape';
import * as rowUtils from './RowUtils';
import RowGroup, { DefaultRowGroupRenderer } from './RowGroup';
import { InteractionMasks } from './masks';
import { getColumnScrollPosition } from './utils/canvasUtils';
import {isFunction} from 'common/utils';
import { EventTypes } from 'common/constants';
import * as warcraftAPI from './utils/ApiWow';
require('../../../themes/react-data-grid-core.css');

const rows = [];

class Canvas extends React.PureComponent {

  static propTypes = {
    rowRenderer: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    rowHeight: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number,
    totalWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    style: PropTypes.string,
    className: PropTypes.string,
    rowOverscanStartIdx: PropTypes.number.isRequired,
    rowOverscanEndIdx: PropTypes.number.isRequired,
    rowVisibleStartIdx: PropTypes.number.isRequired,
    rowVisibleEndIdx: PropTypes.number.isRequired,
    colVisibleStartIdx: PropTypes.number.isRequired,
    colVisibleEndIdx: PropTypes.number.isRequired,
    colOverscanStartIdx: PropTypes.number.isRequired,
    colOverscanEndIdx: PropTypes.number.isRequired,
    rowsCount: PropTypes.number.isRequired,
    rowGetter: PropTypes.oneOfType([
      PropTypes.func.isRequired,
      PropTypes.array.isRequired
    ]),
    expandedRows: PropTypes.array,
    onRows: PropTypes.func,
    onScroll: PropTypes.func,
    columns: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    cellMetaData: PropTypes.shape(cellMetaDataShape).isRequired,
    selectedRows: PropTypes.array,
    rowKey: PropTypes.string,
    rowScrollTimeout: PropTypes.number,
    scrollToRowIndex: PropTypes.number,
    contextMenu: PropTypes.element,
    getSubRowDetails: PropTypes.func,
    rowSelection: PropTypes.oneOfType([
      PropTypes.shape({
        indexes: PropTypes.arrayOf(PropTypes.number).isRequired
      }),
      PropTypes.shape({
        isSelectedKey: PropTypes.string.isRequired
      }),
      PropTypes.shape({
        keys: PropTypes.shape({
          values: PropTypes.array.isRequired,
          rowKey: PropTypes.string.isRequired
        }).isRequired
      })
    ]),
    rowGroupRenderer: PropTypes.func,
    isScrolling: PropTypes.bool,
    length: PropTypes.number,
    enableCellSelect: PropTypes.bool.isRequired,
    enableCellAutoFocus: PropTypes.bool.isRequired,
    cellNavigationMode: PropTypes.string.isRequired,
    eventBus: PropTypes.object.isRequired,
    onCheckCellIsEditable: PropTypes.func,
    onCellCopyPaste: PropTypes.func,
    onGridRowsUpdated: PropTypes.func.isRequired,
    onDragHandleDoubleClick: PropTypes.func.isRequired,
    onCellSelected: PropTypes.func,
    onCellDeSelected: PropTypes.func,
    onCellRangeSelectionStarted: PropTypes.func,
    onCellRangeSelectionUpdated: PropTypes.func,
    onCellRangeSelectionCompleted: PropTypes.func,
    onCommit: PropTypes.func.isRequired
  };

  static defaultProps = {
    onRows: () => { },
    selectedRows: [],
    rowScrollTimeout: 0,
    scrollToRowIndex: 0,
    RowsContainer: ({ children }) => children,
    rowGroupRenderer: DefaultRowGroupRenderer
  };

  state = {
    scrollingTimeout: null,
    linhas: []
  };

  rows = [];
  _currentRowsRange = { start: 0, end: 0 };
  _scroll = { scrollTop: 0, scrollLeft: 0 };

  componentDidMount() {
    this.unsubscribeScrollToColumn = this.props.eventBus.subscribe(EventTypes.SCROLL_TO_COLUMN, this.scrollToColumn);
    this.onRows();
    this.props.columns = [
      { key: 'reino', name: 'Reino' },
      { key: 'avatar', name: 'Avatar', width: 60, formatter: Formatters.ImageFormatter },
      { key: 'nome', name: 'Nome' },
      { key: 'classe', name: 'Classe' },
      { key: 'spec', name: 'Especialização', width: 150 },
      { key: 'ilvl', name: 'Item Level' },
      { key: 'item0', name: 'Cabeça' },
      { key: 'item1', name: 'Colar' },
      { key: 'item2', name: 'Peitoral' },
      { key: 'item3', name: 'Manto' },
      { key: 'item4', name: 'Peitoral' },
      { key: 'item5', name: 'Pulsos' },
      { key: 'item6', name: 'Mãos' },
      { key: 'item7', name: 'Cintura' },
      { key: 'item8', name: 'Pernas' },
      { key: 'item9', name: 'Pés' },
      { key: 'item10', name: 'Anel 1' },
      { key: 'item11', name: 'Anel 2' },
      { key: 'item12', name: 'Berloque 1', width: 100 },
      { key: 'item13', name: 'Berloque 2', width: 100 },
      { key: 'item14', name: 'Arma Principal', width: 140 },
      { key: 'item15', name: 'Arma Secundária', width: 140 }];
  }

  pegaDadosPersonagens(personagens) {
    personagens.forEach(personagem => {
      const { reino, nome, regiao } = personagem;

      warcraftAPI.getToon(regiao, reino, nome).then((resultado) => {
        if (resultado.status !== 'nok') {
          let ilvl = warcraftAPI.getToonIlvl(resultado);
          let classe = warcraftAPI.getToonClass(resultado);
          let spec = warcraftAPI.getSpecializationName(resultado);
          let ilvlItems = warcraftAPI.getToonIlvlAllItems(resultado);
          let thumbnail = resultado.thumbnail;
          this.createRows(classe, spec, ilvl, ilvlItems, nome, reino, thumbnail, regiao);
        }
      });
    });
  }

  createRows = (classe, spec, ilvl, ilvlItems, nome, reino, thumbnail, regiao) => {
    let linhas = this.state.linhas;

    // Por algum motivo o createRolls está sendo chamado sem enviar nenhum parâmetro. A condicional abaixo resolve exceções quando allIlvl é null, ou seja, não é enviado.
    let allItemIlvl = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    if (!ilvlItems) {
      allItemIlvl = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    }else {
      allItemIlvl = ilvlItems;
    }

    for (let i = 1; i < 2; i++) {
      linhas.push({
        reino: reino,
        avatar: warcraftAPI.getToonImageURL(thumbnail, regiao),
        nome: nome,
        classe: classe,
        spec: spec,
        ilvl: ilvl,
        item0: allItemIlvl[0],
        item1: allItemIlvl[1],
        item2: allItemIlvl[2],
        item3: allItemIlvl[3],
        item4: allItemIlvl[4],
        item5: allItemIlvl[5],
        item6: allItemIlvl[6],
        item7: allItemIlvl[7],
        item8: allItemIlvl[8],
        item9: allItemIlvl[9],
        item10: allItemIlvl[10],
        item11: allItemIlvl[11],
        item12: allItemIlvl[12],
        item13: allItemIlvl[13],
        item14: allItemIlvl[14],
        item15: allItemIlvl[15]
      });
    }
    this.setState({ linhas });
  };

  pegaLinha = (i) => {
    return this.state.linhas[i];
  };

  componentWillUnmount() {
    this._currentRowsRange = { start: 0, end: 0 };
    this._scroll = { scrollTop: 0, scrollLeft: 0 };
    this.rows = [];
    this.unsubscribeScrollToColumn();
  }

  componentDidUpdate(prevProps) {
    const { scrollToRowIndex } = this.props;
    if (prevProps.scrollToRowIndex !== scrollToRowIndex && scrollToRowIndex !== 0) {
      this.scrollToRow(scrollToRowIndex);
    }
    this.onRows();
  }

  onRows = () => {
    if (this._currentRowsRange !== { start: 0, end: 0 }) {
      this.props.onRows(this._currentRowsRange);
      this._currentRowsRange = { start: 0, end: 0 };
    }
  };

  scrollToRow = (scrollToRowIndex) => {
    const { rowHeight, rowsCount, height } = this.props;
    this.canvas.scrollTop = Math.min(
      scrollToRowIndex * rowHeight,
      rowsCount * rowHeight - height
    );
  };

  onFocusInteractionMask = (focus) => {
    const { scrollTop, scrollLeft } = this._scroll;
    focus();
    if (this.canvas) {
      this.canvas.scrollTop = scrollTop;
      this.canvas.scrollLeft = scrollLeft;
    }
  };

  onScroll = (e) => {
    if (this.canvas !== e.target) {
      return;
    }
    const { scrollLeft, scrollTop } = e.target;
    const scroll = { scrollTop, scrollLeft };
    this._scroll = scroll;
    this.props.onScroll(scroll);
  };

  getClientScrollTopOffset= (node) => {
    const { rowHeight } = this.props;
    const scrollVariation = node.scrollTop % rowHeight;
    return scrollVariation > 0 ? rowHeight - scrollVariation : 0;
  }

  onHitBottomCanvas = () => {
    const { rowHeight } = this.props;
    const node = this.canvas;
    node.scrollTop += rowHeight + this.getClientScrollTopOffset(node);
  }

  onHitTopCanvas = () => {
    const { rowHeight } = this.props;
    const node = this.canvas;
    node.scrollTop -= (rowHeight - this.getClientScrollTopOffset(node));
  }

  scrollToColumn = (idx) => {
    const { scrollLeft, clientWidth } = this.canvas;
    const newScrollLeft = getColumnScrollPosition(this.props.columns, idx, scrollLeft, clientWidth);

    if (newScrollLeft != null) {
      this.canvas.scrollLeft = scrollLeft + newScrollLeft;
    }
  }

  onHitLeftCanvas = ({ idx }) => {
    this.scrollToColumn(idx);
  }

  onHitRightCanvas = ({ idx }) => {
    this.scrollToColumn(idx);
  }

  getRows = (rowOverscanStartIdx, rowOverscanEndIdx) => {
    this.pegaDadosPersonagens(this.props.rowGetter);
    this._currentRowsRange = { start: rowOverscanStartIdx, end: rowOverscanEndIdx };
    if (Array.isArray(this.state.linhas)) {
      return this.state.linhas.slice(rowOverscanStartIdx, rowOverscanEndIdx);
    }
    let linhas = [];
    let i = rowOverscanStartIdx;
    while (i < rowOverscanEndIdx) {
      let row = this.pegaLinha(i);
      let subRowDetails = {};
      if (this.props.getSubRowDetails) {
        subRowDetails = this.props.getSubRowDetails(row);
      }
      linhas.push({ row, subRowDetails });
      i++;
    }
    return linhas;
  };

  getScroll = () => {
    const { scrollTop, scrollLeft } = this.canvas;
    return { scrollTop, scrollLeft };
  };

  isRowSelected = (idx, row) => {
    // Use selectedRows if set
    if (this.props.selectedRows !== null) {
      let selectedRows = this.props.selectedRows.filter(r => {
        let rowKeyValue = row.get ? row.get(this.props.rowKey) : row[this.props.rowKey];
        return r[this.props.rowKey] === rowKeyValue;
      });
      return selectedRows.length > 0 && selectedRows[0].isSelected;
    }

    // Else use new rowSelection props
    if (this.props.rowSelection) {
      let { keys, indexes, isSelectedKey } = this.props.rowSelection;
      return rowUtils.isRowSelected(keys, indexes, isSelectedKey, row, idx);
    }

    return false;
  };

  setScrollLeft = (scrollLeft) => {
    this.rows.forEach((r, idx) => {
      if (r) {
        let row = this.getRowByRef(idx);
        if (row && row.setScrollLeft) {
          row.setScrollLeft(scrollLeft);
        }
      }
    });
  };

  getRowByRef = (i) => {
    // check if wrapped with React DND drop target
    let wrappedRow = this.rows[i] && this.rows[i].getDecoratedComponentInstance ? this.rows[i].getDecoratedComponentInstance(i) : null;
    if (wrappedRow) {
      return wrappedRow.row;
    }
    return this.rows[i];
  };

  getSelectedRowTop = (rowIdx) => {
    const row = this.getRowByRef(rowIdx);
    if (row) {
      const node = ReactDOM.findDOMNode(row);
      return node && node.offsetTop;
    }
    return this.props.rowHeight * rowIdx;
  }

  getSelectedRowHeight = (rowIdx) => {
    const row = this.getRowByRef(rowIdx);
    if (row) {
      const node = ReactDOM.findDOMNode(row);
      return node && node.clientHeight > 0 ? node.clientHeight : this.props.rowHeight;
    }
    return this.props.rowHeight;
  }

  getSelectedRowColumns = (rowIdx) => {
    const row = this.getRowByRef(rowIdx);
    return row ? row.props.columns : this.props.columns;
  }

  setCanvasRef = (canvas) => {
    this.canvas = canvas;
  };

  setRowRef = idx => row => {
    this.rows[idx] = row;
  };

  renderCustomRowRenderer(props) {
    const {ref, ...otherProps} = props;
    const CustomRowRenderer = this.props.rowRenderer;
    const customRowRendererProps = {...otherProps, renderBaseRow: (p) => <Row ref={ref} {...p}/>};
    if (CustomRowRenderer.type === Row) {
      // In the case where Row is specified as the custom render, ensure the correct ref is passed
      return <Row {...props} />;
    }
    if (isFunction(CustomRowRenderer)) {
      return <CustomRowRenderer {...customRowRendererProps} />;
    }
    if (React.isValidElement(CustomRowRenderer)) {
      return React.cloneElement(CustomRowRenderer, customRowRendererProps);
    }
  }

  renderGroupRow(props) {
    const {ref, ...rowGroupProps} = props;
    return (<RowGroup
      {...rowGroupProps}
      {...props.row.__metaData}
      rowRef={props.ref}
      name={props.row.name}
      eventBus={this.props.eventBus}
      renderer={this.props.rowGroupRenderer}
      renderBaseRow= { (p) => <Row ref={ref} {...p}/>}
    />);
  }

  renderRow = (props) => {
    let row = props.row;
    if (row.__metaData && row.__metaData.getRowRenderer) {
      return row.__metaData.getRowRenderer(this.props, props.idx);
    }
    if (row.__metaData && row.__metaData.isGroup) {
      return this.renderGroupRow(props);
    }
    if (this.props.rowRenderer) {
      return this.renderCustomRowRenderer(props);
    }

    return <Row {...props}/>;
  };

  renderPlaceholder = (key, height) => {
    // just renders empty cells
    // if we wanted to show gridlines, we'd need classes and position as with renderScrollingPlaceholder
    return (<div key={key} style={{ height: height }}>
      {
        this.props.columns.map(
          (column, idx) => <div style={{ width: column.width }} key={idx} />
        )
      }
    </div >
    );
  };

  render() {
    const { rowOverscanStartIdx, rowOverscanEndIdx, cellMetaData, columns, colOverscanStartIdx, colOverscanEndIdx, colVisibleStartIdx, colVisibleEndIdx, lastFrozenColumnIndex, expandedRows, rowHeight, rowsCount, totalColumnWidth, totalWidth, height, rowGetter, RowsContainer, contextMenu } = this.props;

    const rows = this.getRows(rowOverscanStartIdx, rowOverscanEndIdx)
      .map((r, idx) => {
        const rowIdx = rowOverscanStartIdx + idx;
        const key = `row-${rowIdx}`;
        return (this.renderRow({
          key,
          ref: this.setRowRef(rowIdx),
          idx: rowIdx,
          rowVisibleStartIdx: this.props.rowVisibleStartIdx,
          rowVisibleEndIdx: this.props.rowVisibleEndIdx,
          row: r.row,
          height: rowHeight,
          onMouseOver: this.onMouseOver,
          columns,
          isSelected: this.isRowSelected(rowIdx, r.row, rowOverscanStartIdx, rowOverscanEndIdx),
          expandedRows,
          cellMetaData,
          subRowDetails: r.subRowDetails,
          colVisibleStartIdx,
          colVisibleEndIdx,
          colOverscanStartIdx,
          colOverscanEndIdx,
          lastFrozenColumnIndex,
          isScrolling: this.props.isScrolling,
          scrollLeft: this._scroll.scrollLeft
        })
      );
      });

    if (rowOverscanStartIdx > 0) {
      rows.unshift(this.renderPlaceholder('top', rowOverscanStartIdx * rowHeight));
    }

    if (rowsCount - rowOverscanEndIdx > 0) {
      rows.push(
        this.renderPlaceholder('bottom', (rowsCount - rowOverscanEndIdx) * rowHeight));
    }

    const style = {
      position: 'absolute',
      top: 0,
      left: 0,
      overflowX: 'auto',
      overflowY: 'scroll',
      width: totalWidth,
      height
    };

    return (
      <div
        ref={this.setCanvasRef}
        style={style}
        onScroll={this.onScroll}
        className="react-grid-Canvas">
        <InteractionMasks
          rowGetter={rowGetter}
          rowsCount={rowsCount}
          width={this.props.totalWidth}
          height={height}
          rowHeight={rowHeight}
          columns={columns}
          rowOverscanStartIdx={this.props.rowOverscanStartIdx}
          rowVisibleStartIdx={this.props.rowVisibleStartIdx}
          rowVisibleEndIdx={this.props.rowVisibleEndIdx}
          colVisibleStartIdx={colVisibleStartIdx}
          colVisibleEndIdx={colVisibleEndIdx}
          enableCellSelect={this.props.enableCellSelect}
          enableCellAutoFocus={this.props.enableCellAutoFocus}
          cellNavigationMode={this.props.cellNavigationMode}
          eventBus={this.props.eventBus}
          contextMenu={this.props.contextMenu}
          onHitBottomBoundary={this.onHitBottomCanvas}
          onHitTopBoundary={this.onHitTopCanvas}
          onHitLeftBoundary={this.onHitLeftCanvas}
          onHitRightBoundary={this.onHitRightCanvas}
          onCommit={this.props.onCommit}
          onCheckCellIsEditable={this.props.onCheckCellIsEditable}
          onCellCopyPaste={this.props.onCellCopyPaste}
          onGridRowsUpdated={this.props.onGridRowsUpdated}
          onDragHandleDoubleClick={this.props.onDragHandleDoubleClick}
          onBeforeFocus={this.onFocusInteractionMask}
          onCellSelected={this.props.onCellSelected}
          onCellDeSelected={this.props.onCellDeSelected}
          onCellRangeSelectionStarted={this.props.onCellRangeSelectionStarted}
          onCellRangeSelectionUpdated={this.props.onCellRangeSelectionUpdated}
          onCellRangeSelectionCompleted={this.props.onCellRangeSelectionCompleted}
          scrollLeft={this._scroll.scrollLeft}
          scrollTop={this._scroll.scrollTop}
          prevScrollLeft={this.props.prevScrollLeft}
          prevScrollTop={this.props.prevScrollTop}
          getSelectedRowHeight={this.getSelectedRowHeight}
          getSelectedRowTop={this.getSelectedRowTop}
          getSelectedRowColumns={this.getSelectedRowColumns}
        />
        <RowsContainer id={contextMenu ? contextMenu.props.id : 'rowsContainer'}>
          <div style={{ width: totalColumnWidth }}>{rows}</div>
        </RowsContainer>
      </div>
    );
  }
}

module.exports = Canvas;
