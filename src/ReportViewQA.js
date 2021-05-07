import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { AgGridReact } from 'ag-grid-react';
import { connect } from 'react-redux';
import $ from 'jquery';
import * as actions from '../../redux/reporting/actions';
import '../ag_grid_style.css';
import 'ag-grid-community/dist/styles/ag-grid.scss';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import CustomizedSnackbar from '../../components/CustomizedSnackbar';
import Styled from './report.style';
import CustomToolPanelFilter from './CustomToolPanelFilter';

let keyDecimalNo = 2;
let mappedColDef = [];
let arrgroupLevel = [];
let gridviewstructure = [];
let sum1 = 0;
let sum2 = 0;
let sum3 = 0;
let count1 = 0;
let prevsum = 0;
let roundvalue = 0;
let checkflag = 0;
let CalcType = '';
let pivotkey = [];
const avoidKeyFigureValueFormatterFunction = ['count', 'max', 'min', 'avg'];
const avoidAggValueFormatterFunction = ['count', 'max', 'min', 'avg'];
const EVR_Level_Order = [
  'Spend Rates',
  'OI',
  'VR',
  'FX',
  'FXC Rates',
  'Volumes',
  'P&L KPIs',
  'Customer KPIs',
  'Hurdle KPIs',
];
const EVR_KPI_Order = [
  'OI %',
  'OI RPC',
  'VR %',
  'VR RPC',
  'FX',
  'Total Volume',
  'Baseline Volume',
  'Uplift Volume',
  'Overlap Uplift Volume',
  'Gross Sales',
  'Gross Price',
  'Adj. Customer List Price',
  'Invoice Sales Inc Overlaps',
  'Invoice Price Inc Overlaps',
  'ECC / S4 GTN',
  'BSP GTN',
  'Promotional GTN',
  'Total Event GTN',
  'Total GTN',
  'GTN Addl. (Impact of Overlaps)',
  'Total GTN Inc Overlaps',
  'Special Pack / Fg',
  'Coupons-Sales',
  'Permanent Price Red. - Ol',
  'Permanent Price Red. - Deferred',
  'TPR - OI',
  'TPR - Deferred',
  'TPR W / Wdrwl, Exfact',
  'Every Day Low Price',
  'Closeouts - Ol',
  'Closeouts - Deferred',
  'Inventory Price Pro',
  'Prompt Payment - OI',
  'Prompt Payment - Deferred',
  'Efficient Logistics - OI',
  'Efficient Logistics - Deferred',
  'Efficient Management - OI',
  'Efficient Management - Deferred',
  'Customer Promotions - OI',
  'Customer Promotions - Deferred',
  'Customer Promo / Coop Adv',
  'Customer Promo / In Store',
  'Free Goods To Trade',
  'Other Trade Payment',
  'Incentive Payment Var',
  'Cust Promo - Fixed, Over&Above',
  'Coop Adv Fixed',
  'Coop Adv Variable',
  'In Store Promo - Trade',
  'Assortment',
  'New Product Incent',
  'Shopper Marketing',
  'Middleman Perform',
  'Middleman Infrastruc',
  'Indir. Retailer Inv',
  'In Store Support - Indirect',
  'Ind Retailer Investments - OI',
  'Ind Retailer Investments - Deferred',
  'Listing Allowances',
  'Continuity Discounts',
  'All Oth. Cust. Disc',
  'Non-Performance Trade Payments - OI',
  'Non-Performance Trade Payments - Deferred',
  'Cust Promo - Terms',
  'GTN %',
  'Net Sales',
  'ASP/Suom',
  'Margin $',
  'Margin %',
  'GTN % Inc Overlaps',
  'Net Sales Inc Overlaps',
  'Baseline Net Sales Inc Overlaps',
  'Uplift Net Sales Inc Overlaps',
  'Margin $ Inc Overlaps',
  'Margin % Inc Overlaps',
  'Customer Sales Total',
  'Customer Margin',
  'Customer Margin %',
  'Promoted Retail Selling Price',
  'Non-Promo Retail Selling Price',
  'Scan Volume',
  'Warehouse Volume',
  'Scan_Volume',
  'Warehouse_Volume',
  'GTN Hurdle Rate',
  'GTN Flag',
  'Margin Hurdle Rate',
  'Margin Flag',
  'ASP Hurdle Rate',
  'ASP Flag',
];
const coloredVarianceKeyFigureValues = [
  'Var CY Actuals YTD v PY Actuals YTD',
  'Var CY SLE v PY Actuals %',
  'Var CY SLE v PY Actuals',
  'Var CY Actuals YTD v PY Actuals YTD %',
  'Var CY SLE v NY SLE',
  'Var CY SLE v NY SLE %',
];
let minusPercentageCalculationFormulatedFields = [
  { 'Var CY Actuals YTD v PY Actuals YTD': [{ 'Actuals (Monthly YTD)': [], 'Actuals YTD (Monthly)': [] }] },
  { 'Var CY SLE v PY Actuals': [{ SLE: [], Actuals: [] }] },
  { 'Var CY Actuals YTD v PY Actuals YTD %': [{ 'Actuals (Monthly YTD)': [], 'Actuals YTD (Monthly)': [] }] },
  { 'Var CY SLE v PY Actuals %': [{ SLE: [], Actuals: [] }] },
];

const minusPercentageCalculationFields = [
  'Var CY Actuals YTD v PY Actuals YTD',
  'Var CY SLE v PY Actuals',
  'Var CY Actuals YTD v PY Actuals YTD %',
  'Var CY SLE v PY Actuals %',
  'Var CY SLE v NY SLE',
  'Var CY SLE v NY SLE %',
];

const coloredVarianceKeyFigureValues_percent = ['Var CY SLE v PY Act %', 'Var CYTD Act v PYTD Act %'];
const minusCalculatedVarianceFields = ['Var CY Actuals YTD v PY Actuals YTD', 'Var CY SLE v PY Actuals'];
const percentageCalculatedVarianceFields = ['Var CYTD Act v PYTD Act %', 'Var CY SLE v PY Act %'];
let minusPercentageDependentCalculationFields = [];
let dependentVarianceFieldsWithReportingPeriod = [];
let minusPercantageInvolvedVarianceFields = [];
let currentSLEActualLEVarainceValue = '';
let keyFigureValue = '';
const keyFigureValueForPercentage = [
  '% Consumer Investment',
  '% Customer Investment',
  '% Consumer Investment excl PPR',
  'Gross To Net %',
  'Gross To Net excl PPR %',
  '% Standard Margin',
  '% Financial Margin',
];
const keyFigureValuesArray = [];
const reverseColoredKeyFigureValues = [
  'Consumer Investment',
  '% Consumer Investment',
  '% Consumer Investment excl PPR',
  'Consumer Allowance',
  'Special Pack / Fg',
  'Coupons',
  'Coupons-Trade',
  'Coupons-Sales',
  'C&O - Reb / Pay',
  'Permanent Price Red',
  'Permanent Price Red. - Ol',
  'Permanent Price Red. - Deferred',
  'Temporary Price Red',
  'TPR - OI',
  'TPR - Deferred',
  'TPR - Scan',
  'TPR W / Wdrwl, Exfact',
  'Every Day Low Price',
  'Closeouts',
  'Closeouts - Ol',
  'Closeouts - Deferred',
  'Inventory Price Pro',
  'Customer Investment',
  '% Customer Investment',
  'Prompt Payment',
  'Prompt Payment - OI',
  'Prompt Payment - Deferred',
  'Efficiency Drivers',
  'Efficient Logistics',
  'Efficient Logistics - OI',
  'Efficient Logistics - Deferred',
  'Efficient Management',
  'Efficient Management - OI',
  'Efficient Management - Deferred',
  'Business Builders Direct',
  'Customer Promotions',
  'Customer Promotions - OI',
  'Customer Promotions - Deferred',
  'Customer Promo / Coop Adv',
  'Customer Promo / In Store',
  'Customer Promo / Coop Adv %',
  'Free Goods To Trade',
  'Other Trade Payment',
  'Incentive Payment Var',
  'Cust Promo - Fixed, Over&Above',
  'Coop Adv Fixed',
  'Coop Adv Variable',
  'In Store Promo - Trade',
  'Cust Promo - Terms',
  'Assortment',
  'Growth (Direct)',
  'New Product Incent',
  'Shopper Marketing',
  'Middleman Perform',
  'Middleman Infrastruc',
  'Growth (Indirect)',
  'Indir. Retailer Inv. Total',
  'Indir. Retailer Inv',
  'In Store Support - Indirect',
  'Trade Loads',
  'Ind Retailer Investments - OI',
  'Ind Retailer Investments - Deferred',
  'Free Goods (Indirect)',
  'Listing Allowances',
  'Non-Perf. Trade Pay',
  'Continuity Discounts',
  'All Oth. Cust. Disc',
  'Non-Performance Trade Payments - OI',
  'Non-Performance Trade Payments - Deferred',
  'Fixed Accruals',
  'Variable Accruals',
  'Total Accruals',
  'Trade Spend',
  'KAM Controlled',
  'Gross To Net',
  'Gross To Net %',
  'Gross To Net excl PPR %',
  '% Deal Depth Exclude Air',
  'Total GTN - TH',
  'Total RPC',
  'Customer RPC',
  'Consumer RPC',
  'Total RPC - Tons',
  'Consumer RPC - Tons',
  'Customer RPC - Tons',
  'Total RPC - Pieces (Selling Units)',
  'Consumer RPC - Pieces (Selling Units)',
  'Customer RPC - Pieces (Selling Units)',
  'Total RPC - Eaches',
  'Consumer RPC - Eaches',
  'Nvo',
  'Advertising',
  'Co - Packing',
  'Customer RPC - Eaches',
];
let nodeId = '';
let arrAvoidKeyFigureValueFormatter = [];
let arrAvoidAggValueFormatter = [];
const arrPivotKeyValues = [];
let pivotKeysValue = '';
const gridOptions = {
  defaultColDef: {
    sortable: true,
    resizable: true,
    hide: true,
    floatCell: true,
    editable: false,
    enablePivot: true,
    filter: true,
  },
  autoGroupColumnDef: {
    enableValue: false,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    // cellRenderer: 'agGroupCellRenderer',
    cellClass: 'grouprow',
    rowStyle: { color: '#3c8dbc' },
    cellStyle: function(params) {
      if (params.node.id.indexOf('Footer') >= 0) {
        return { color: '#3c8dbc', 'font-weight': 'bold' };
      }
      return { color: '#3c8dbc' };
    },
    cellRendererParams: {
      suppressCount: true,
      checkbox: false,
      footerValueGetter: '"Total (" + x + ")"', // '"Total"',
    },
    filterValueGetter: function(params) {
      const colGettingGrouped = params.colDef.showRowGroup;
      const valueForOtherCol = params.api.getValue(colGettingGrouped.toString(), params.node);
      return valueForOtherCol;
    },
  },
  sideBar: {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Dimensions',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
        toolPanelParams: {
          suppressPivotMode: true,
          suppressValues: true,
          suppressColumnSelectAll: true,
          suppressColumnExpandAll: false,
        },
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
      },
      {
        id: 'customfilter',
        labelDefault: 'Background Filters',
        labelKey: 'customfilter',
        iconKey: 'filter',
        toolPanel: 'CustomToolPanelFilter',
        width: '100%',
      },
    ],
    defaultToolPanel: 'columns',
  },
  frameworkComponents: { CustomToolPanelFilter: CustomToolPanelFilter },
  pivotMode: false,
  suppressContextMenu: false,
  enableBrowserTooltips: false,
  groupIncludeTotalFooter: false,
  groupSuppressBlankHeader: true,
  rowDragManaged: true,
  accentedSort: true,
  suppressSetColumnStateEvents: true,
  floatingFilter: false,
  rowGroupPanelShow: 'always',
  pivotPanelShow: 'always',
  singleClickEdit: true,
  enterMovesDownAfterEdit: true,
  enterMovesDown: true,
  groupDefaultExpanded: '999',
  multiSortKey: 'ctrl',
  animateRows: true,
  enableRangeSelection: true,
  rowSelection: 'multiple',
  rowDeselection: true,
  quickFilterText: null,
  groupSelectsChildren: false,
  pagination: true,
  suppressRowClickSelection: true,
  groupMultiAutoColumn: true,
  groupHideOpenParents: true, // show total on collapse on top
  groupUseEntireRow: false,
  groupIncludeFooter: true,
  suppressMakeColumnVisibleAfterUnGroup: true,
  paginationPageSize: 1000,
};

class ReportView extends Component {
  constructor(props) {
    super(props);

    this.isResetFilterState = false;
    this.indicator = 0;
    this.cleared = false;
    this.fields = '';
    this.aggregate = '';
    this.state = {
      aggFuncs: {
        sum: this.customSumFunction.bind(this),
        agg: this.customAggFunction,
      },
      backgroundFilters: [],
      columnDefs: [],
      rowData: [],
      selectedViewId: 0,
      selectedStateID: 0,
      selectedViewName: '',
      currentFilterState: {},
      currentReportFilter: {
        sales_org: [],
        category: [],
        customer_level_2_text: [],
        customer_level_3_text: [],
        customer_level_4_text: [],
        key_figure: [],
      },
    };

    if (props.location.state !== undefined) {
      this.props.history.push({
        pathname: `/reporting/view/${props.location.state.id}`,
        state: {
          id: props.location.state.id,
          viewid: props.location.state.viewid,
        },
      });
    } else {
      console.log('state undefined');
    }
  }

  async componentDidMount() {
    try {
      this.props.onRef(this);
    } catch (error) {
      console.log(error);
    }
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.props !== nextProps || this.state !== nextState;
  }

  // TODO - need help testing as well for this and the refactor removal of UNSAFE method in sidebar which reporting may? need?
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.gridviewstate !== this.props.gridviewstate) {
      this.setState(
        {
          selectedViewName: this.props.gridviewstate.filter(x => x.id === this.props.location.state.id)[0].view_name,
          selectedStateID: this.props.location.state.id,
          selectedViewId: this.props.location.state.viewid,
        },
        () => {
          gridOptions.groupIncludeFooter = this.state.selectedViewName !== 'Atlas Event Report';
        },
      );
      this.addToggleOption();
    }
    if (
      prevProps.gridviewstructure !== this.props.gridviewstructure ||
      prevProps.selectedLevel !== this.props.selectedLevel ||
      prevState.backgroundFilters !== this.state.backgroundFilters
    ) {
      this.defColumns(
        this.props.gridviewstructure.filter(x => x.level_type === 0 || x.level_type === this.props.selectedLevel),
      ).then(result => this.setState({ columnDefs: result }));
    }
    if (prevProps.subtotalsOn !== this.props.subtotalsOn) {
      gridOptions.groupIncludeFooter = this.props.subtotalsOn;
    }
  }

  getfilterColDatavalues(colData, uniqueAttCategoryId) {
    return colData.filter(item => item.attribute_category_id === uniqueAttCategoryId);
  }

  processHeaderForClipboard(event) {
    let returnValue = '';
    const { valueColumns } = event.columnApi.columnController;
    if (event.column.colDef.pivotKeys) {
      const { pivotKeys } = event.column.colDef;
      pivotKeys.forEach(element => {
        returnValue += `${element}` + `"&char(10)&"`;
      });
      valueColumns.forEach(element => {
        if (element.colId === event.column.getColDef().headerName) {
          const { aggFunc } = element;
          returnValue += `${aggFunc}(${event.column.getColDef().headerName})`;
        }
      });
    } else if (valueColumns.length > 0) {
      returnValue = event.column.getColDef().headerName;
      valueColumns.forEach(element => {
        if (element.colId === event.column.getColDef().headerName) {
          const { aggFunc } = element;
          returnValue = `${aggFunc}(${event.column.getColDef().headerName})`;
        }
      });
    } else {
      returnValue = event.column.getColDef().headerName;
    }
    returnValue = `="${returnValue}"`;
    return returnValue;
  }

  processCellForClipboard(event) {
    let value = '';
    if (event.column.colDef.id === 'KeyFigureValue') {
      value = this.keyfigureValueCopyPasteFormatter(event);
    } else if (event.column.colDef.id === 'Value') {
      value = this.AggValueCopyPasteFormatter(event);
    } else {
      value = event.value;
    }
    if (event.node.id.indexOf('Footer') >= 0 && value !== null && event.column.colDef.id !== 'keyfigurevalue') {
      value = `total (${value})`;
    }
    return value;
  }

  customSumFunction(values) {
    let result = 0;
    let indicator = 0;
    let csum = 0;
    let csum1 = 0;
    let csum2 = 0;
    const splitValue1 = [];
    const splitValue2 = [];
    const splitValue = [];
    let sumValue = 0;
    let sumValue1 = 0;
    let sumValue2 = 0;
    values.forEach(value => {
      if (value) {
        if (typeof value !== 'object') {
          const arrsplit = value.toString().split('|');
          indicator = parseInt(arrsplit[3], 10);
          if (indicator === 1 || indicator === 2) {
            splitValue.push(arrsplit[0]);
            splitValue1.push(arrsplit[1]);
            splitValue2.push(arrsplit[2]);
          } else {
            splitValue.push(arrsplit[0]);
          }
        }
      }
    });
    splitValue.forEach(value => {
      if (value) {
        if (Number(value)) {
          csum += Number(value);
          sumValue = csum;
        }
      } else {
        sumValue = value;
      }
    });

    if (indicator === 1) {
      splitValue1.forEach(value => {
        if (value) {
          if (Number(value)) {
            csum1 += Number(value);
            sumValue1 = csum1;
          }
        } else {
          sumValue1 = value;
        }
      });
      splitValue2.forEach(value => {
        if (value) {
          if (Number(value)) {
            csum2 += Number(value);
            sumValue2 = csum2;
          }
        } else {
          sumValue2 = value;
        }
      });
      result = this.indicatorCalculation(indicator, sumValue, sumValue1, sumValue2);
    } else if (indicator === 2) {
      splitValue1.forEach(value => {
        if (value) {
          if (Number(value)) {
            csum1 += Number(value);
            sumValue1 = csum1;
          }
        } else {
          sumValue1 = value;
        }
      });
      splitValue2.forEach(value => {
        if (value) {
          if (Number(value)) {
            csum2 += Number(value);
            sumValue2 = csum2;
          }
        } else {
          sumValue2 = value;
        }
      });
      result = this.indicatorCalculation(indicator, sumValue, sumValue1, sumValue2);
    } else {
      result = sumValue;
    }
    return result;
  }

  customAggFunction(values) {
    let result = '0';
    const splitAggValue = [];
    const splitAggValue1 = [];
    let cval = 0;
    let cval1 = 0;
    let csum = 0;
    let sumAggValue = 0;
    let sumAggValue1 = 0;
    let countAggValue = 0;
    let countAggValue1 = 0;
    let CalcType = '';

    values.forEach(function(value) {
      if (value) {
        if (typeof value !== 'object') {
          const arrsplit = value.toString().split('|');

          if (arrsplit[1] === 'SUM') {
            CalcType = arrsplit[1];
          } else {
            CalcType = arrsplit[2];
          }

          if (CalcType === 'AVGE' || CalcType === 'AVG' || CalcType === 'PERC' || CalcType === 'HFlag') {
            splitAggValue.push(arrsplit[0]);
            splitAggValue1.push(arrsplit[1]);
          } else {
            splitAggValue.push(arrsplit[0]);
          }
        }
      }
    });

    splitAggValue.forEach(function(value) {
      if (value) {
        csum += Number(value);
        sumAggValue = csum;
      } else {
        sumAggValue = value;
      }
    });

    if (CalcType == 'AVGE' || CalcType === 'PERC') {
      splitAggValue.forEach(function(value) {
        if (value) {
          cval += Number(value);
          sumAggValue = cval;
          countAggValue += 1;
        } else {
          sumAggValue = value;
        }
      });
      splitAggValue1.forEach(function(value) {
        if (value) {
          cval1 += Number(value);
          sumAggValue1 = cval1;
          countAggValue1 += 1;
        } else {
          sumAggValue1 = value;
        }
      });

      if (sumAggValue == 0) {
        result = '';
      } else {
        result = sumAggValue / countAggValue;
      }
    } else if (CalcType == 'PERC' || CalcType == 'AVG') {
      splitAggValue.forEach(function(value) {
        if (value) {
          cval += Number(value);
          sumAggValue = cval;
          // countAggValue += 1;
        } else {
          sumAggValue = value;
        }
      });
      splitAggValue1.forEach(function(value) {
        if (value) {
          cval1 += Number(value);
          sumAggValue1 = cval1;
          // countAggValue1 += 1;
        } else {
          sumAggValue1 = value;
        }
      });
      if (sumAggValue1 == 0) {
        result = ' ';
      } else {
        result = CalcType == 'AVG' ? sumAggValue / sumAggValue1 : (sumAggValue / sumAggValue1) * 100;
      }
    } else {
      result = sumAggValue;
    }
    result = result || '';
    return result;
  }

  // create coldef for ag-grid
  generateDefColumns = objData => {
    try {
      mappedColDef = [];
      const invisibleColumns = new Map();
      invisibleColumns.set('value2', true);
      invisibleColumns.set('value3', true);
      invisibleColumns.set('indicator', true);
      const { backgroundFilters } = this.state;
      let childOfHeader = []; // Header child
      let categoryChild = []; // Category Child
      const coldef = []; // Column Definition
      let attributeCategory = []; // Final Column with header
      let headername;
      let headerDataType;
      let attributeCategoryName;
      let fileldName;
      let attributeCategoryId;
      let IsSuppressFilter;
      let agfilter = 'agSetColumnFilter';
      let uniqueAttCategoryId;
      let filterColDatavalues;
      const colData = objData; // await apiCall('gridViewStructure').then(res => { return res });// Get Column Structure data from API
      const uniqueAttCat = []; // Unique Attribute Category
      const map = new Map();
      for (const item of colData) {
        if (!map.has(item.attribute_category_id)) {
          map.set(item.attribute_category_id, true); // set any value to Map
          uniqueAttCat.push({
            AttributeCategoryID: item.attribute_category_id,
            AttributeCategory: item.attribute_category,
          });
        }
      }

      for (let j = 0; j < uniqueAttCat.length; j++) {
        childOfHeader = [];
        attributeCategory = [];
        uniqueAttCategoryId = uniqueAttCat[j].AttributeCategoryID;
        filterColDatavalues = this.getfilterColDatavalues(colData, uniqueAttCategoryId);
        childOfHeader = filterColDatavalues;
        for (let l = 0; l < childOfHeader.length; l++) {
          categoryChild = childOfHeader[l];
          attributeCategoryName = categoryChild.attribute_category;
          attributeCategoryId = categoryChild.attribute_category_id;
          headername = categoryChild.attribute_display_name;
          fileldName = categoryChild.attribute_name;
          headerDataType = categoryChild.data_type;
          if (headerDataType === 'Date') {
            agfilter = 'agDateColumnFilter';
          } else if (headerDataType === 'Amount' || headerDataType === 'Numeric' || headerDataType === 'Int') {
            agfilter = 'agNumberColumnFilter';
          } else {
            agfilter = 'agSetColumnFilter';
          }
          if (backgroundFilters[fileldName]) {
            IsSuppressFilter = agfilter;
          } else {
            IsSuppressFilter = false;
          }
          mappedColDef[fileldName] = headername;
          if (invisibleColumns.has(fileldName)) {
            attributeCategory.push({
              suppressToolPanel: true, // hide from column tool panel
              id: fileldName,
              colId: headername,
              headerName: headername,
              field: fileldName,
              hide: true,
              filter: IsSuppressFilter,
            });
          } else if (fileldName === 'KeyFigureValue') {
            attributeCategory.push({
              id: fileldName,
              colId: headername,
              headerDataType: headerDataType,
              headerName: headername,
              field: fileldName,
              filter: IsSuppressFilter,
              enableRowGroup: false,
              enableValue: true,
              cellStyle: { textAlign: 'right' },
              allowedAggFuncs: ['sum', 'min', 'max', 'count', 'avg'],
              // aggFunc: this.state.aggFuncs,
              cellClass: this.totalRowCss,
              valueGetter: this.concatenateKey,
              valueFormatter: this.keyfigureValueFormatter.bind(this),
              cellRenderer: this.customCellRendererFunc,
              comparator: function(number1, number2) {
                if (number1 != null) {
                  if (typeof number1 === 'object') {
                    number1 = number1.value;
                  }
                }
                if (number2 != null) {
                  if (typeof number2 === 'object') {
                    number2 = number2.value;
                  }
                }

                if (number1 === null && number2 === null) {
                  return 0;
                }
                if (number1 === null) {
                  return -1;
                }
                if (number2 === null) {
                  return 1;
                }
                return number1 - number2;
              },
              filterParams: {
                filterOptions: [
                  {
                    displayKey: 'equals',
                    displayName: 'Equals',
                    test: function(filterValue, cellValue) {
                      if (filterValue === cellValue) return true;
                    },
                  },
                  'notEqual',
                  'lessThan',
                  'lessThanOrEqual',
                  'greaterThan',
                  'greaterThanOrEqual',
                  'inRange',
                ],
              },
            });
          } else if (fileldName === 'Value' && this.state.selectedViewName === this.props.EventReportName) {
            attributeCategory.push({
              id: fileldName,
              colId: headername,
              headerDataType: headerDataType,
              headerName: headername,
              field: fileldName,
              filter: IsSuppressFilter,
              enableRowGroup: false,
              enableValue: true,
              cellStyle: { textAlign: 'right' },
              allowedAggFuncs: ['min', 'max', 'count', 'agg'],
              cellClass: this.totalRowCss,
              valueGetter: this.concatenateKeyValue,
              valueFormatter: this.AggValueFormatter.bind(this),
              cellRenderer: this.customCellRendererFunc,
              comparator: function(number1, number2) {
                if (number1 != null) {
                  if (typeof number1 === 'object') {
                    number1 = number1.value;
                  }
                }
                if (number2 != null) {
                  if (typeof number2 === 'object') {
                    number2 = number2.value;
                  }
                }

                if (number1 === null && number2 === null) {
                  return 0;
                }
                if (number1 === null) {
                  return -1;
                }
                if (number2 === null) {
                  return 1;
                }
                return number1 - number2;
              },
              filterParams: {
                filterOptions: [
                  {
                    displayKey: 'equals',
                    displayName: 'Equals',
                    test: function(filterValue, cellValue) {
                      if (filterValue === cellValue) return true;
                    },
                  },
                  'notEqual',
                  'lessThan',
                  'lessThanOrEqual',
                  'greaterThan',
                  'greaterThanOrEqual',
                  'inRange',
                ],
              },
            });
          } else if (fileldName === 'Level' && this.state.selectedViewName === this.props.EventReportName) {
            attributeCategory.push({
              id: fileldName,
              colId: headername,
              headerDataType: headerDataType,
              headerName: headername,
              field: fileldName,
              filter: IsSuppressFilter,
              enableRowGroup: true,
              enablePivot: true,
              enableValue: false,
              cellStyle: { textAlign: 'center' },
              cellClass: this.totalRowCss,
              pivotComparator: function(a, b) {
                const requiredOrder = EVR_Level_Order;
                return requiredOrder.indexOf(a) - requiredOrder.indexOf(b);
              },
            });
          } else if (fileldName === 'KeyFigure' && this.state.selectedViewName === this.props.EventReportName) {
            attributeCategory.push({
              id: fileldName,
              colId: headername,
              headerDataType: headerDataType,
              headerName: headername,
              field: fileldName,
              filter: IsSuppressFilter,
              enableRowGroup: true,
              enablePivot: true,
              enableValue: false,
              autoHeight: true,
              cellClass: this.totalRowCss,
              cellStyle: { textAlign: 'center' },
              pivotComparator: function(a, b) {
                const requiredOrder = EVR_KPI_Order;
                return requiredOrder.indexOf(a) - requiredOrder.indexOf(b);
              },
            });
          } else if (headerDataType === 'Date') {
            attributeCategory.push({
              id: fileldName,
              colId: headername,
              headerDataType: headerDataType,
              headerName: headername,
              field: fileldName,
              filter: IsSuppressFilter,
              enableRowGroup: true,
              // cellClass: 'ag-grid-cellClass',
              cellStyle: function(params) {
                if (params.column.aggFunc === 'Count' && typeof params.value === 'object') {
                  return { textAlign: 'right' };
                }
                return { textAlign: 'center' };
              },
              cellClass: this.totalRowCss,
              allowedAggFuncs: ['min', 'max', 'count'],
              // , comparator: this.dateComparator
              filterParams: {
                filterOptions: [
                  'equals',
                  'greaterThan',
                  'lessThan',
                  'notEqual',
                  'inRange',
                  {
                    displayKey: 'BlankDate',
                    displayName: 'Blank Date',
                    suppressAndOrCondition: true,
                    hideFilterInput: true,
                    test: function(filterValue, cellValue) {
                      if (cellValue == null || cellValue === '') return true;
                    },
                  },
                ],

                comparator: function(filterLocalDateAtMidnight, cellValue) {
                  if (cellValue == null) return -1;
                  const dateParts = cellValue.split('/');
                  const cellDate = new Date(Number(dateParts[2]), Number(dateParts[0] - 1), Number(dateParts[1]));

                  if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
                    return 0;
                  }

                  if (cellDate < filterLocalDateAtMidnight) {
                    return -1;
                  }

                  if (cellDate > filterLocalDateAtMidnight) {
                    return 1;
                  }
                },
                browserDatePicker: true,
              },
            });
          } else if (headerDataType === 'Amount') {
            attributeCategory.push({
              id: fileldName,
              colId: headername,
              headerDataType: headerDataType,
              headerName: headername,
              field: fileldName,
              filter: IsSuppressFilter,
              enableRowGroup: false,
              enableValue: true,
              cellStyle: { textAlign: 'right' },
              cellClass: this.totalRowCss,
              allowedAggFuncs: ['sum', 'min', 'max', 'count', 'avg', 'agg'],
              valueFormatter: this.amountValueFormatter,
              comparator: function(number1, number2) {
                if (number1 != null) {
                  if (typeof number1 === 'object') {
                    number1 = number1.value;
                  }
                }
                if (number2 != null) {
                  if (typeof number2 === 'object') {
                    number2 = number2.value;
                  }
                }

                if (number1 === null && number2 === null) {
                  return 0;
                }
                if (number1 === null) {
                  return -1;
                }
                if (number2 === null) {
                  return 1;
                }
                return number1 - number2;
              },
              filterParams: {
                filterOptions: [
                  {
                    displayKey: 'equals',
                    displayName: 'Equals',
                    test: function(filterValue, cellValue) {
                      if (filterValue === cellValue) return true;
                    },
                  },
                  'notEqual',
                  'lessThan',
                  'lessThanOrEqual',
                  'greaterThan',
                  'greaterThanOrEqual',
                  'inRange',
                ],
              },
            });
          } else if (headerDataType === 'Numeric') {
            attributeCategory.push({
              id: fileldName,
              colId: headername,
              headerDataType: headerDataType,
              headerName: headername,
              field: fileldName,
              filter: IsSuppressFilter,
              enableRowGroup: false,
              enableValue: true,
              cellStyle: { textAlign: 'right' },
              cellClass: this.totalRowCss,
              allowedAggFuncs: ['sum', 'min', 'max', 'count', 'avg', 'agg'],
              valueFormatter: this.numericValueFormatter.bind(this),
              comparator: function(number1, number2) {
                if (number1 != null) {
                  if (typeof number1 === 'object') {
                    number1 = number1.value;
                  }
                }
                if (number2 != null) {
                  if (typeof number2 === 'object') {
                    number2 = number2.value;
                  }
                }

                if (number1 === null && number2 === null) {
                  return 0;
                }
                if (number1 === null) {
                  return -1;
                }
                if (number2 === null) {
                  return 1;
                }
                return number1 - number2;
              },
              filterParams: {
                filterOptions: [
                  {
                    displayKey: 'equals',
                    displayName: 'Equals',
                    test: function(filterValue, cellValue) {
                      if (filterValue === cellValue) return true;
                    },
                  },
                  'notEqual',
                  'lessThan',
                  'lessThanOrEqual',
                  'greaterThan',
                  'greaterThanOrEqual',
                  'inRange',
                ],
              },
            });
          } else if (headerDataType === 'Int') {
            attributeCategory.push({
              id: fileldName,
              colId: headername,
              headerDataType: headerDataType,
              headerName: headername,
              field: fileldName,
              filter: IsSuppressFilter,
              enableRowGroup: false,
              enableValue: true,
              cellStyle: { textAlign: 'right' },
              cellClass: this.totalRowCss,
              allowedAggFuncs: ['sum', 'min', 'max', 'count', 'avg', 'agg'],
              valueFormatter: this.intValueFormatter,
              comparator: function(number1, number2) {
                if (number1 !== null) {
                  if (typeof number1 === 'object') {
                    number1 = number1.value;
                  }
                }
                if (number2 !== null) {
                  if (typeof number2 === 'object') {
                    number2 = number2.value;
                  }
                }

                if (number1 === null && number2 === null) {
                  return 0;
                }
                if (number1 === null) {
                  return -1;
                }
                if (number2 === null) {
                  return 1;
                }
                return number1 - number2;
              },
              filterParams: {
                filterOptions: [
                  {
                    displayKey: 'equals',
                    displayName: 'Equals',
                    test: function(filterValue, cellValue) {
                      if (filterValue === cellValue) return true;
                    },
                  },
                  'notEqual',
                  'lessThan',
                  'lessThanOrEqual',
                  'greaterThan',
                  'greaterThanOrEqual',
                  'inRange',
                ],
              },
            });
          } else if (headerDataType === 'decimal') {
            attributeCategory.push({
              id: fileldName,
              colId: headername,
              headerDataType: headerDataType,
              headerName: headername,
              field: fileldName,
              filter: IsSuppressFilter,
              enableRowGroup: false,
              enableValue: true,
              cellStyle: { textAlign: 'right' },
              cellClass: this.totalRowCss,
              allowedAggFuncs: ['sum', 'min', 'max', 'count', 'avg'],
              comparator: function(number1, number2) {
                if (number1 !== null) {
                  if (typeof number1 === 'object') {
                    number1 = number1.value;
                  }
                }
                if (number2 !== null) {
                  if (typeof number2 === 'object') {
                    number2 = number2.value;
                  }
                }

                if (number1 === null && number2 === null) {
                  return 0;
                }
                if (number1 === null) {
                  return -1;
                }
                if (number2 === null) {
                  return 1;
                }
                return number1 - number2;
              },
              filterParams: {
                filterOptions: [
                  {
                    displayKey: 'equals',
                    displayName: 'Equals',
                    test: function(filterValue, cellValue) {
                      if (filterValue === cellValue) return true;
                    },
                  },
                  'notEqual',
                  'lessThan',
                  'lessThanOrEqual',
                  'greaterThan',
                  'greaterThanOrEqual',
                  'inRange',
                ],
              },
            });
          } else if (headerDataType === 'Id' || headerDataType === 'Key') {
            attributeCategory.push({
              id: fileldName,
              colId: headername,
              headerDataType: headerDataType,
              headerName: headername,
              field: fileldName,
              filter: IsSuppressFilter,
              enableRowGroup: true,
              allowedAggFuncs: ['count'],
              cellClass: this.totalRowCss,
              comparator: function(number1, number2) {
                if (number1 !== null) {
                  if (typeof number1 === 'object') {
                    number1 = number1.value;
                  }
                }
                if (number2 != null) {
                  if (typeof number2 === 'object') {
                    number2 = number2.value;
                  }
                }
                if (number1 === null && number2 === null) {
                  return 0;
                }
                if (number1 === null) {
                  return -1;
                }
                if (number2 === null) {
                  return 1;
                }
                return number1 - number2;
              },
            });
          } else
            attributeCategory.push({
              id: fileldName,
              colId: headername,
              headerDataType: headerDataType,
              headerName: headername,
              field: fileldName,
              filter: IsSuppressFilter,
              enableRowGroup: true,
              allowedAggFuncs: ['count'],
              cellClass: this.totalRowCss,
            });
        }
        coldef.push({
          headerName: attributeCategoryName,
          id: attributeCategoryId,
          children: attributeCategory,
        });
      }
      if (this.isResetFilterState) {
        this.setAgGridFilterState();
      }
      return coldef;
    } catch (error) {
      console.log(error);
    }
  };

  setAgGridFilterState() {
    const filterState = gridOptions.api.getFilterModel();
    this.setState({ currentFilterState: JSON.stringify(filterState) });
  }

  valueGetter(params) {
    return params.data[params.colDef.field];
  }

  totalRowCss(params) {
    if (params.node.footer) {
      return 'total-row';
    }
  }

  concatenateKey(params) {
    let fieldvalue = '';
    if (params.data === undefined || params.data[params.colDef.field] === undefined) {
      return '';
    }
    if (params.data.indicator === 0) {
      return params.data[params.colDef.field];
    }
    if (params.column.aggFunc !== 'sum') {
      if (params.data.value2 - params.data.value3 === 0) {
        return 0;
      }
      fieldvalue = params.data[params.colDef.field];
      return (fieldvalue / (params.data.value2 - params.data.value3)) * 100;
    }
    fieldvalue = params.data[params.colDef.field];
    return `${fieldvalue}|${params.data.value2}|${params.data.value3}|${params.data.indicator}`;
  }

  concatenateKeyValue(params) {
    let fieldvalue = '';
    if (params.data === undefined || params.data[params.colDef.field] === undefined) {
      return '';
    }
    if (
      params.data.CalcType === 'AVG' ||
      params.data.CalcType === 'AVGE' ||
      params.data.CalcType === 'PERC' ||
      params.data.CalcType === 'HFlag'
    ) {
      fieldvalue = params.data[params.colDef.field];
      return `${fieldvalue}|${params.data.Value2}|${params.data.CalcType}`;
    }
    if (params.data.CalcType === 'SUM') {
      fieldvalue = params.data[params.colDef.field];
      return `${fieldvalue}|${params.data.CalcType}`;
    }
    return params.data[params.colDef.field];
  }

  intValueFormatter(cellValue) {
    let returnValue = '';
    if (cellValue.value == null || cellValue.value === undefined || cellValue.value === '') {
      returnValue = '';
    } else if (
      (cellValue.node.group && (cellValue.column.aggFunc === 'avg' || cellValue.column.aggFunc === 'sum')) ||
      (cellValue.node.group &&
        cellValue.colDef.pivotValueColumn !== undefined &&
        (cellValue.colDef.pivotValueColumn.aggFunc === 'avg' || cellValue.colDef.pivotValueColumn.aggFunc === 'sum'))
    ) {
      if (typeof cellValue.value === 'object') {
        if (
          isNaN(cellValue.value.value) ||
          cellValue.value.value == null ||
          (cellValue.value.value === '' && cellValue.value.value !== '0')
        ) {
          returnValue = '';
        } else {
          returnValue = cellValue.value.value;
        }
      } else {
        return cellValue.value;
      }
    } else if (typeof cellValue.value === 'object') {
      if (
        isNaN(cellValue.value.value) ||
        cellValue.value.value == null ||
        (cellValue.value.value === '' && cellValue.value.value !== '0')
      ) {
        returnValue = '';
      } else {
        return cellValue.value.value;
      }
    } else {
      returnValue = cellValue.value;
    }
    return returnValue;
  }

  numericValueFormatter(cellValue) {
    keyDecimalNo = 2;
    let returnValue = '';
    if (cellValue.value == null || cellValue.value === undefined || cellValue.value === '') {
      returnValue = '';
    } else if (
      (cellValue.node.group && cellValue.column.aggFunc === 'count') ||
      (cellValue.node.group &&
        cellValue.colDef.pivotValueColumn !== undefined &&
        cellValue.colDef.pivotValueColumn.aggFunc === 'count')
    ) {
      if (typeof cellValue.value === 'object') {
        returnValue = cellValue.value.value;
      } else {
        returnValue = cellValue.value;
      }
    } else if (typeof cellValue.value === 'object') {
      if (
        isNaN(cellValue.value.value) ||
        cellValue.value.value == null ||
        (cellValue.value.value === '' && cellValue.value.value !== '0')
      ) {
        returnValue = '';
      } else if (parseFloat(cellValue.value.value)) {
        returnValue = this.parseDecimalPlace(cellValue.value.value, keyDecimalNo);
      } else {
        returnValue = '';
      }
    } else if (isNaN(cellValue.value)) {
      returnValue = '';
    } else {
      returnValue = this.parseDecimalPlace(cellValue.value, keyDecimalNo);
    }
    return returnValue;
  }

  keyFigureRowGroupValueCalculation(event, children) {
    let returnValue = '';
    let nextChild = '';
    const openColId = mappedColDef[event.node.field];
    if (arrgroupLevel.indexOf(openColId) >= 0) {
      nextChild = arrgroupLevel[arrgroupLevel.indexOf(openColId) + 1];
    }
    if (
      event.node.groupData !== undefined &&
      event.node.groupData[`ag-Grid-AutoColumn-${nextChild}`] === null // collapse node
    ) {
      children.forEach(element => {
        if (element.childrenAfterFilter !== undefined) {
          this.keyFigureRowGroupValueCalculation(event, element.childrenAfterFilter);
        } else {
          this.indicator = element.data.indicator;
          if (element.data.key_figure) {
            keyFigureValue = element.data.key_figure;
          } else {
            keyFigureValue = '';
          }
          if (element.data.SLE_Actual_LE) {
            if (coloredVarianceKeyFigureValues_percent.indexOf(element.data.SLE_Actual_LE) >= 0) {
              keyDecimalNo = 1;
            } else {
              keyDecimalNo = element.data.Key_DecimalNo;
            }
          } else {
            keyDecimalNo = element.data.Key_DecimalNo;
          }
          sum1 += element.data.KeyFigureValue;
          sum2 += element.data.value2;
          sum3 += element.data.value3;
        }
      });
      if (event.node.level !== 0 || this.indicator === 1 || this.indicator === 2) {
        if (this.indicator === 1 || this.indicator === 2) {
          returnValue = this.indicatorCalculation(this.indicator, sum1, sum2, sum3);
        } else {
          returnValue = sum1;
        }
      } else {
        returnValue = event.value;
      }
    } else {
      returnValue = event.value;
    }
    if (!parseFloat(returnValue)) {
      returnValue = '';
    }
    returnValue = this.parseDecimalPlace(returnValue, keyDecimalNo);
    return returnValue;
  }

  indicatorCalculation(indicator, value1, value2, value3) {
    let returnValue = 0;
    if (indicator === 1) {
      if (value2 - value3 === 0) {
        returnValue = 0;
      } else {
        returnValue = (value1 / (value2 - value3)) * 100;
      }
    } else if (indicator === 2) {
      if (value1 !== 0 && value2 !== 0 && value3 !== 0) {
        returnValue = value2 / value1 + value3 / value1;
      } else if (value1 === 0 && value2 === 0 && value3 === 0) {
        returnValue = 0;
      } else if (value1 === 0) {
        returnValue = 0;
      } else if (value2 === 0) {
        returnValue = value3 / value1;
      } else if (value3 === 0) {
        returnValue = value2 / value1;
      }
    }
    return returnValue;
  }

  AggValueRowGroupValueCalculation(event, children) {
    // eslint-disable-next-line no-debugger
    debugger;
    let returnValue = '';
    let nextChild = '';

    const openColId = mappedColDef[event.node.field];
    if (arrgroupLevel.indexOf(openColId) >= 0) {
      nextChild = arrgroupLevel[arrgroupLevel.indexOf(openColId) + 1];
    }
    if (
      event.node.groupData !== undefined &&
      event.node.groupData[`ag-Grid-AutoColumn-${nextChild}`] == null // collapse node
    ) {
      children.forEach(element => {
        if (element.childrenAfterFilter !== undefined) {
          this.AggValueRowGroupValueCalculation(event, element.childrenAfterFilter);
        } else {
          CalcType = element.data.CalcType;
          if (CalcType === 'AVGE' || CalcType === 'HFlag') {
            if (element.data.Value !== element.data.Value2) {
              checkflag = 1;
            } else {
              sum1 += element.data.Value;
              count1 += 1;
              prevsum = element.data.Value;
            }
          } else if (CalcType === 'PERC' || CalcType === 'AVG') {
            sum1 += element.data.Value;
            sum2 += element.data.Value2;
          } else {
            sum1 += element.data.Value;
          }
        }
      });

      if (
        event.node.level !== 0 ||
        CalcType === 'AVGE' ||
        CalcType === 'AVG' ||
        CalcType === 'PERC' ||
        CalcType === 'SUM' ||
        CalcType === 'HFlag'
      ) {
        if (CalcType === 'AVGE') {
          if (count1 === 0 && checkflag !== 1) {
            returnValue = 0;
          } else {
            roundvalue = parseFloat((sum1 / count1).toFixed(3));

            if (roundvalue !== parseFloat(prevsum.toFixed(3))) {
              checkflag = 1;
            } else {
              checkflag = 0;
            }

            if (checkflag === 1) {
              returnValue = '*';
            } else {
              returnValue = sum1 / count1;
            }
          }
        } else if (CalcType === 'Hlag') {
          if (count1 === 0 && checkflag !== 1) {
            returnValue = 0;
          } else {
            roundvalue = parseFloat((sum1 / count1).toFixed(3));

            if (roundvalue !== parseFloat(prevsum.toFixed(3))) {
              checkflag = 1;
            } else {
              checkflag = 0;
            }

            if (checkflag === 1) {
              returnValue = 'Fail';
            }
            if (checkflag === 0) {
              returnValue = 'Passing';
            }
          }
        } else if (CalcType === 'AVG') {
          returnValue = sum2 !== 0 ? sum1 / sum2 : 0;
        } else if (CalcType === 'PERC') {
          if (sum2 === 0) {
            returnValue = 0;
          } else {
            returnValue = (sum1 / sum2) * 100;
          }
        } else {
          returnValue = sum1;
        }
      } else {
        returnValue = event.value;
      }
      if (parseFloat(returnValue)) {
        if (CalcType === 'PERC') {
          returnValue = parseFloat(returnValue.toFixed(3));
        } else {
          returnValue = parseFloat(returnValue.toFixed(3));
        }
      } else if (returnValue === '*') {
        returnValue = '*';
      } else {
        returnValue = ' ';
      }
      return returnValue;
    }
  }

  keyFigurePivotValueCalculation(event) {
    let returnValue = 0;
    let nextChild = '';
    let result = { indicator: 0, sum1: 0, sum2: 0, sum3: 0 };
    const openColId = mappedColDef[event.node.field];
    if (arrgroupLevel.indexOf(openColId) >= 0) {
      nextChild = arrgroupLevel[arrgroupLevel.indexOf(openColId) + 1];
    }
    if (
      event.node.groupData !== undefined &&
      event.node.groupData[`ag-Grid-AutoColumn-${nextChild}`] === null // collapse node
    ) {
      if (event.node.childrenAfterFilter !== undefined) {
        sum1 = 0;
        sum2 = 0;
        sum3 = 0;
        result = this.checkChildNode(event.node.childrenAfterFilter, pivotkey, event.value);
        this.indicator = result.indicator;
        if (this.indicator === 0) {
          sum1 = event.value;
          sum2 = 0;
          sum3 = 0;
        } else {
          sum1 += result.sum1;
          sum2 += result.sum2;
          sum3 += result.sum3;
        }
      }
    } else if (event.node.childrenMapped === undefined) {
      sum1 = 0;
      sum2 = 0;
      sum3 = 0;
    } else if (event.node.childrenMapped[pivotkey[0]] === undefined) {
      sum1 = 0;
      sum2 = 0;
      sum3 = 0;
    } else if (pivotkey.length > 1) {
      sum1 = 0;
      sum2 = 0;
      sum3 = 0;
      result = this.getMultiLevelPivotValues(event.node.childrenMapped, pivotkey[0], pivotkey, 0);
      this.indicator = result.indicator;
      if (this.indicator === 0) {
        sum1 = event.value;
        sum2 = 0;
        sum3 = 0;
      } else {
        sum1 += result.sum1;
        sum2 += result.sum2;
        sum3 += result.sum3;
      }
    } else {
      sum1 = 0;
      sum2 = 0;
      sum3 = 0;
      if (event.node.childrenMapped[pivotkey[0]]) {
        event.node.childrenMapped[pivotkey[0]].forEach(element => {
          this.indicator = element.data.indicator;
          if (element.data.key_figure) {
            keyFigureValue = element.data.key_figure;
          } else {
            keyFigureValue = '';
          }
          if (element.data.SLE_Actual_LE) {
            if (coloredVarianceKeyFigureValues_percent.indexOf(element.data.SLE_Actual_LE) >= 0) {
              keyDecimalNo = 1;
            } else {
              keyDecimalNo = element.data.Key_DecimalNo;
            }
          } else {
            keyDecimalNo = element.data.Key_DecimalNo;
          }
          sum1 += element.data.KeyFigureValue;
          sum2 += element.data.value2;
          sum3 += element.data.value3;
        });
      } else {
        sum1 = 0;
        sum2 = 0;
        sum3 = 0;
      }
    }
    if (event.node.level !== 0 || this.indicator === 1 || this.indicator === 2) {
      if (this.indicator === 1 || this.indicator === 2) {
        returnValue = this.indicatorCalculation(this.indicator, sum1, sum2, sum3);
      } else {
        returnValue = sum1;
      }
    } else {
      returnValue = event.value;
    }
    if (!parseFloat(returnValue)) {
      returnValue = '';
    }
    returnValue = this.parseDecimalPlace(returnValue, keyDecimalNo);
    return returnValue;
  }

  AggValuePivotValueCalculation(event) {
    let returnValue = '';
    let nextChild = '';
    let result = 0;
    const openColId = mappedColDef[event.node.field];
    if (arrgroupLevel.indexOf(openColId) >= 0) {
      nextChild = arrgroupLevel[arrgroupLevel.indexOf(openColId) + 1];
    }
    if (
      event.node.groupData !== undefined &&
      event.node.groupData[`ag-Grid-AutoColumn-${nextChild}`] == null // collapse node
    ) {
      if (event.node.childrenAfterFilter !== undefined) {
        sum1 = 0;
        count1 = 0;
        checkflag = 0;
        sum2 = 0;
        prevsum = 0;

        result = this.checkChildNodeAggValue(event.node.childrenAfterFilter, pivotkey, event.value);

        CalcType = result.CalcType;
        if (CalcType === 'SUM') {
          sum1 = event.value;
          count1 = 0;
          checkflag = 0;
          prevsum = 0;
          sum2 = 0;
        } else {
          sum1 += result.sum1;
          count1 += result.count1;
          checkflag = result.checkflag;
          prevsum = result.prevsum;
          sum2 += result.sum2;
          CalcType = result.CalcType;
        }
      }
    } else if (event.node.childrenMapped === undefined) {
      sum1 = 0;
      count1 = 0;
      checkflag = 0;
      prevsum = 0;
      sum2 = 0;
    } else if (event.node.childrenMapped[pivotkey[0]] === undefined) {
      sum1 = 0;
      count1 = 0;
      checkflag = 0;
      prevsum = 0;
      sum2 = 0;
    } else if (pivotkey.length > 1) {
      sum1 = 0;
      count1 = 0;
      checkflag = 0;
      prevsum = 0;
      sum2 = 0;
      result = this.getAggValueMultiLevelPivotValues(event.node.childrenMapped, pivotkey[0], pivotkey, 0);

      CalcType = result.CalcType;
      if (CalcType === 'SUM') {
        sum1 = event.value;
        count1 = 0;
        checkflag = 0;
        prevsum = 0;
        sum2 = 0;
      } else {
        sum1 += result.sum1;
        count1 += result.count1;
        checkflag = result.checkflag;
        prevsum = result.prevsum;
        sum2 += result.sum2;
        CalcType = result.CalcType;
      }
    } else {
      sum1 = 0;
      count1 = 0;
      prevsum = 0;
      checkflag = 0;
      sum2 = 0;

      if (event.node.childrenMapped[pivotkey[0]]) {
        event.node.childrenMapped[pivotkey[0]].forEach(element => {
          CalcType = element.data.CalcType;

          if (CalcType === 'AVGE' || CalcType === 'HFlag') {
            if (element.data.Value !== element.data.Value2) {
              checkflag = 1;
            } else {
              sum1 += element.data.Value;
              count1 += 1;
              prevsum = element.data.Value;
            }
          } else if (CalcType === 'PERC' || CalcType === 'AVG') {
            sum1 += element.data.Value;
            sum2 += element.data.Value2;
          } else {
            sum1 += element.data.Value;
          }
        });
      } else {
        sum1 = 0;
        count1 = 0;
        checkflag = 0;
        prevsum = 0;
        sum2 = 0;
      }
    }
    if (
      event.node.level !== 0 ||
      CalcType === 'AVGE' ||
      CalcType === 'AVG' ||
      CalcType === 'PERC' ||
      CalcType === 'SUM' ||
      CalcType === 'HFlag'
    ) {
      if (CalcType === 'AVGE') {
        if (count1 === 0 && checkflag !== 1) {
          returnValue = 0;
        } else {
          roundvalue = parseFloat((sum1 / count1).toFixed(3));

          if (roundvalue === parseFloat(prevsum.toFixed(3))) {
            checkflag = 0;
          } else {
            checkflag = 1;
          }

          if (checkflag === 1) {
            returnValue = '*';
          } else {
            returnValue = sum1 / count1;
          }
        }
      } else if (CalcType === 'HFlag') {
        if (count1 === 0 && checkflag !== 1) {
          returnValue = 0;
        } else {
          roundvalue = parseFloat((sum1 / count1).toFixed(3));
          if (roundvalue > 0) {
            checkflag = 1;
          } else {
            checkflag = 0;
          }
          if (checkflag === 1) {
            returnValue = 'Fail';
          }
          if (checkflag === 0) {
            returnValue = 'Pass';
          }
        }
      } else if (CalcType === 'AVG') {
        returnValue = sum2 !== 0 ? sum1 / sum2 : 0;
      } else if (CalcType === 'PERC') {
        if (sum2 === 0) {
          returnValue = 0;
        } else {
          returnValue = (sum1 / sum2) * 100;
        }
      } else {
        returnValue = sum1;
      }
    } else {
      returnValue = event.value;
    }
    if (parseFloat(returnValue)) {
      if (CalcType === 'PERC') {
        returnValue = parseFloat(returnValue.toFixed(3));
      } else {
        returnValue = parseFloat(returnValue.toFixed(3));
      }
    } else if (returnValue === '*') {
      returnValue = '*';
    } else if (returnValue === 'Pass') {
      returnValue = 'Pass';
    } else if (returnValue === 'Fail') {
      returnValue = 'Fail';
    } else {
      returnValue = ' ';
    }
    return returnValue;
  }

  keyfigureValueCopyPasteFormatter(event) {
    let returnValue = '';
    nodeId = event.node.id;
    if (event.column.colDef.pivotKeys) {
      currentSLEActualLEVarainceValue = minusPercantageInvolvedVarianceFields.filter(element =>
        event.column.colDef.pivotKeys.includes(element),
      )[0];
      pivotKeysValue = event.column.colDef.pivotKeys.join(',');
    }
    if (
      event.node.group &&
      event.column.colDef.pivotValueColumn !== undefined &&
      event.column.colDef.pivotValueColumn.aggFunc ===
        arrAvoidKeyFigureValueFormatter[event.column.colDef.pivotValueColumn.aggFunc]
    ) {
      if (event.value !== null) {
        if (event.column.colDef.pivotValueColumn.aggFunc !== 'count') {
          returnValue = event.value; // avg function
          if (!parseFloat(returnValue)) {
            returnValue = '';
          }
          returnValue = this.parseDecimalPlace(returnValue, keyDecimalNo);
          return returnValue;
        }
        returnValue = event.value; // count function
        return returnValue;
      }
      returnValue = event.value;
      if (!parseFloat(returnValue)) {
        returnValue = '';
      }
      returnValue = this.parseDecimalPlace(returnValue, keyDecimalNo);
      return returnValue;
    }
    if (event) {
      if (event.column.colDef.pivotKeys === undefined) {
        sum1 = 0;
        sum2 = 0;
        sum3 = 0;
        returnValue = this.keyFigureRowGroupValueCalculation(event, event.node.childrenAfterFilter);
        return returnValue;
      }
      pivotkey = event.column.colDef.pivotKeys;
      returnValue = this.keyFigurePivotValueCalculation(event);

      return returnValue;
    }
    returnValue = '';
    return returnValue;
  }

  AggValueCopyPasteFormatter(event) {
    let returnValue = '';
    if (
      event.node.group &&
      event.column.colDef.pivotValueColumn !== undefined &&
      event.column.colDef.pivotValueColumn.aggFunc ===
        arrAvoidKeyFigureValueFormatter[event.column.colDef.pivotValueColumn.aggFunc]
    ) {
      if (event.value !== null) {
        if (event.column.colDef.pivotValueColumn.aggFunc !== 'count') {
          returnValue = event.value; // avg function
          if (parseFloat(returnValue)) {
            returnValue = this.parseDecimalPlace(returnValue, 2);
            return returnValue;
          }
          returnValue = '';
          return returnValue;
        }
        returnValue = event.value; // count function
        return returnValue;
      }
      returnValue = event.value;
      if (parseFloat(returnValue)) {
        returnValue = this.parseDecimalPlace(returnValue, 2);
        return returnValue;
      }
      returnValue = '';
      return returnValue;
    }
    if (event) {
      if (event.column.colDef.pivotKeys === undefined) {
        sum1 = 0;
        sum2 = 0;
        count1 = 0;
        prevsum = 0;
        checkflag = 0;
        returnValue = this.AggValueRowGroupValueCalculation(event, event.node.childrenAfterFilter);
        return returnValue;
      }
      pivotkey = event.column.colDef.pivotKeys;
      returnValue = this.AggValuePivotValueCalculation(event);

      return returnValue;
    }
    returnValue = '';
    return returnValue;
  }

  keyfigureValueFormatter(cellValue) {
    nodeId = cellValue.node.id;
    if (cellValue.colDef.pivotKeys) {
      currentSLEActualLEVarainceValue = minusPercantageInvolvedVarianceFields.filter(element =>
        cellValue.colDef.pivotKeys.includes(element),
      )[0];
      pivotKeysValue = cellValue.colDef.pivotKeys.join(',');
    }
    arrAvoidKeyFigureValueFormatter = [];
    avoidKeyFigureValueFormatterFunction.forEach(fun => {
      arrAvoidKeyFigureValueFormatter[fun] = fun;
    });
    let i = 0;
    arrgroupLevel = [];
    const groupLevel = cellValue.columnApi.getColumnGroupState();
    groupLevel.forEach(element => {
      if (arrgroupLevel.indexOf(element.groupId.substring(29, element.groupId.indexOf('}'))) < 0) {
        arrgroupLevel[i] = element.groupId.substring(29, element.groupId.indexOf('}'));
        i += 1;
      }
    });
    let returnValue = '';
    if (
      (cellValue.node.group &&
        cellValue.column.aggFunc !== undefined &&
        cellValue.column.aggFunc === arrAvoidKeyFigureValueFormatter[cellValue.column.aggFunc]) ||
      (cellValue.node.group &&
        cellValue.colDef.pivotValueColumn !== undefined &&
        cellValue.colDef.pivotValueColumn.aggFunc !== undefined &&
        cellValue.colDef.pivotValueColumn.aggFunc ===
          arrAvoidKeyFigureValueFormatter[cellValue.colDef.pivotValueColumn.aggFunc])
    ) {
      if (cellValue.value !== null) {
        if (cellValue.value.value !== undefined) {
          if (cellValue.value.count !== undefined) {
            returnValue = cellValue.value.value; // avg function
            if (!parseFloat(returnValue)) {
              returnValue = '';
            }
            returnValue = this.parseDecimalPlace(returnValue, keyDecimalNo);
            return returnValue;
          }
          returnValue = cellValue.value.value; // count function
          return returnValue;
        }
        returnValue = cellValue.value;
        if (!parseFloat(returnValue)) {
          returnValue = '';
        }
        returnValue = this.parseDecimalPlace(returnValue, keyDecimalNo);
        return returnValue;
      }
      returnValue = '';
      return returnValue;
    }
    if (cellValue) {
      if (cellValue.colDef.pivotKeys === undefined) {
        sum1 = 0;
        sum2 = 0;
        sum3 = 0;
        returnValue = this.keyFigureRowGroupValueCalculation(cellValue, cellValue.node.childrenAfterFilter);
        return returnValue;
      }
      pivotkey = cellValue.colDef.pivotKeys;
      returnValue = this.keyFigurePivotValueCalculation(cellValue);
      return returnValue;
    }
    returnValue = '';
    return returnValue;
  }

  AggValueFormatter(cellValue) {
    arrAvoidAggValueFormatter = [];
    avoidAggValueFormatterFunction.forEach(fun => {
      arrAvoidAggValueFormatter[fun] = fun;
    });
    let i = 0;
    arrgroupLevel = [];
    const groupLevel = cellValue.columnApi.getColumnGroupState();
    groupLevel.forEach(element => {
      if (arrgroupLevel.indexOf(element.groupId.substring(29, element.groupId.indexOf('}'))) < 0) {
        arrgroupLevel[i] = element.groupId.substring(29, element.groupId.indexOf('}'));
        i += 1;
      }
    });
    let returnValue = '';
    if (
      (cellValue.node.group &&
        cellValue.column.aggFunc !== undefined &&
        cellValue.column.aggFunc === arrAvoidAggValueFormatter[cellValue.column.aggFunc]) ||
      (cellValue.node.group &&
        cellValue.colDef.pivotValueColumn !== undefined &&
        cellValue.colDef.pivotValueColumn.aggFunc !== undefined &&
        cellValue.colDef.pivotValueColumn.aggFunc ===
          arrAvoidAggValueFormatter[cellValue.colDef.pivotValueColumn.aggFunc])
    ) {
      if (cellValue.value !== null) {
        if (cellValue.value.value !== undefined) {
          if (cellValue.value.count !== undefined) {
            returnValue = cellValue.value.value; // avg function
            if (!parseFloat(returnValue)) {
              returnValue = '';
            }
            returnValue = parseFloat(returnValue.toFixed(2));
            return returnValue;
          }
          returnValue = cellValue.value.value; // count function
          return returnValue;
        }
        returnValue = cellValue.value;
        if (!parseFloat(returnValue)) {
          returnValue = '';
        }
        returnValue = parseFloat(returnValue.toFixed(2));
        return returnValue;
      }
      returnValue = '';
      return returnValue;
    }
    if (cellValue) {
      if (cellValue.colDef.pivotKeys === undefined) {
        sum1 = 0;
        count1 = 0;
        sum2 = 0;
        prevsum = 0;
        checkflag = 0;
        returnValue = this.AggValueRowGroupValueCalculation(cellValue, cellValue.node.childrenAfterFilter);
        return returnValue;
      }
      pivotkey = cellValue.colDef.pivotKeys;
      returnValue = this.AggValuePivotValueCalculation(cellValue);

      return returnValue;
    }

    returnValue = '';
    return returnValue;
  }

  customCellRendererFunc(params) {
    let returnValue = '';
    let cellContent = '';
    try {
      if (params.colDef.pivotKeys !== undefined) {
        const isExistVarianceValue = coloredVarianceKeyFigureValues.filter(value =>
          params.colDef.pivotKeys.includes(value),
        );
        // const isReverseColoredKeyFigureExist = reverseColoredKeyFigureValues.indexOf(keyFigureValue);
        const isReverseColoredKeyFigureExist = reverseColoredKeyFigureValues.indexOf(
          keyFigureValuesArray[params.node.id],
        );
        if (isExistVarianceValue.length > 0) {
          if (params.valueFormatted !== undefined) {
            cellContent = params.valueFormatted;
          } else {
            cellContent = params.value;
          }
          if (parseFloat(cellContent)) {
            if (parseFloat(cellContent) > 0) {
              if (isReverseColoredKeyFigureExist >= 0) {
                returnValue = `<span style="color: red;">${cellContent}</span>`;
              } else {
                returnValue = `<span style="color: green;">${cellContent}</span>`;
              }
            } else if (isReverseColoredKeyFigureExist >= 0) {
              returnValue = `<span style="color: green;">${cellContent}</span>`;
            } else {
              returnValue = `<span style="color: red;">${cellContent}</span>`;
            }
          } else {
            returnValue = cellContent;
          }
        } else {
          if (params.valueFormatted !== undefined) {
            cellContent = params.valueFormatted;
          } else {
            cellContent = params.value;
          }
          returnValue = cellContent;
        }
      } else {
        if (params.valueFormatted !== undefined) {
          cellContent = params.valueFormatted;
        } else {
          cellContent = params.value;
        }
        returnValue = cellContent;
      }
    } catch (exception) {
      console.error(exception);
    }
    return returnValue;
  }

  checkChildNode(node, pivotkey, cellValue) {
    node.forEach(element => {
      if (element.childrenAfterFilter !== undefined) {
        if (this.props.reportName.includes('P&L')) {
          const filteredChildren = element.childrenAfterFilter.filter(x => {
            if (x.data) {
              return x.data.SLE_Actual_LE === pivotkey[0];
            }
            return true;
          });
          this.checkChildNode(filteredChildren, pivotkey, cellValue);
        } else {
          this.checkChildNode(element.childrenAfterFilter, pivotkey, cellValue);
        }
      } else if (pivotkey.length > 1) {
        this.getMultiLevelPivotValues(element.parent.childrenMapped, pivotkey[0], pivotkey, 0);
      } else if (element.parent.childrenMapped[pivotkey[0]]) {
        element.parent.childrenMapped[pivotkey[0]].forEach(innerElement => {
          this.indicator = innerElement.data.indicator;
          if (innerElement.data.key_figure) {
            keyFigureValue = innerElement.data.key_figure;
          } else {
            keyFigureValue = 0;
          }
          if (innerElement.data.SLE_Actual_LE) {
            if (coloredVarianceKeyFigureValues_percent.indexOf(innerElement.data.SLE_Actual_LE) >= 0) {
              keyDecimalNo = 1;
            } else {
              keyDecimalNo = innerElement.data.Key_DecimalNo;
            }
          } else {
            keyDecimalNo = innerElement.data.Key_DecimalNo;
          }
          sum1 += innerElement.data.KeyFigureValue;
          sum2 += innerElement.data.value2;
          sum3 += innerElement.data.value3;
        });
      }
    });
    return { indicator: this.indicator, sum1: sum1, sum2: sum2, sum3: sum3 };
  }

  checkChildNodeAggValue(node, pivotkey, cellValue) {
    let result = {};
    node.forEach(element => {
      if (element.childrenAfterFilter !== undefined) {
        this.checkChildNodeAggValue(element.childrenAfterFilter, pivotkey, cellValue);
      } else if (pivotkey.length > 1) {
        this.getAggValueMultiLevelPivotValues(element.parent.childrenMapped, pivotkey[0], pivotkey, 0);
      } else if (element.parent.childrenMapped[pivotkey[0]]) {
        element.parent.childrenMapped[pivotkey[0]].forEach(element => {
          CalcType = element.data.CalcType;

          if (CalcType === 'AVGE' || CalcType === 'HFlag') {
            if (element.data.Value != element.data.Value2) {
              checkflag = 1;
            } else {
              sum1 += element.data.Value;
              count1 += 1;
              prevsum = element.data.Value;
            }
          } else if (CalcType === 'PERC' || CalcType === 'AVG') {
            sum1 += element.data.Value;
            sum2 += element.data.Value2;
          } else {
            sum1 += element.data.Value;
          }
        });
      }
    });
    result = { sum1: sum1, sum2: sum2, count1: count1, checkflag: checkflag, prevsum: prevsum, CalcType: CalcType };
    return result;
  }

  getMultiLevelPivotValues(node, key, pivotKeys, startIndex) {
    let result = {};
    startIndex += 1;
    if (node[key]) {
      if (node[key][0]) {
        node[key].forEach(element => {
          if (element.data !== undefined) {
            if (element.data.indicator !== 'NaN') {
              this.indicator = element.data.indicator;
            }
            if (element.data.key_figure) {
              keyFigureValue = element.data.key_figure;
            } else {
              keyFigureValue = '';
            }
            if (element.data.SLE_Actual_LE) {
              if (coloredVarianceKeyFigureValues_percent.indexOf(element.data.SLE_Actual_LE) >= 0) {
                keyDecimalNo = 1;
              } else {
                keyDecimalNo = element.data.Key_DecimalNo;
              }
            } else {
              keyDecimalNo = element.data.Key_DecimalNo;
            }
            sum1 += element.data.KeyFigureValue;
            sum2 += element.data.value2;
            sum3 += element.data.value3;
          } else {
            sum1 = 0;
            sum2 = 0;
            sum3 = 0;
          }
        });
        result = { indicator: this.indicator, sum1: sum1, sum2: sum2, sum3: sum3 };
        return result;
      }
      this.getMultiLevelPivotValues(node[key], pivotKeys[startIndex], pivotKeys, startIndex);

      result = { indicator: this.indicator, sum1: sum1, sum2: sum2, sum3: sum3 };
      return result;
    }
    sum1 = 0;
    sum2 = 0;
    sum3 = 0;
    result = { indicator: this.indicator, sum1: sum1, sum2: sum2, sum3: sum3 };
    return result;
  }

  getAggValueMultiLevelPivotValues(node, key, pivotKeys, startIndex) {
    let result = {};
    startIndex += 1;
    // initflag = 0;
    if (node[key]) {
      if (node[key][0]) {
        node[key].forEach(element => {
          if (element.data !== undefined) {
            CalcType = element.data.CalcType;
            if (CalcType === 'AVGE' || CalcType === 'HFlag') {
              if (element.data.Value != element.data.Value2) {
                checkflag = 1;
              } else {
                sum1 += element.data.Value;
                count1 += 1;
                prevsum = element.data.Value;
              }
            } else if (CalcType === 'PERC' || CalcType === 'AVG') {
              sum1 += element.data.Value;
              sum2 += element.data.Value2;
            } else {
              sum1 += element.data.Value;
            }
          } else {
            sum1 = 0;
            count1 = 0;
            checkflag = 0;
            sum2 = 0;
            prevsum = 0;
            CalcType = '';
          }
        });
        result = { sum1: sum1, sum2: sum2, count1: count1, checkflag: checkflag, prevsum: prevsum, CalcType: CalcType };
        return result;
      }
      this.getAggValueMultiLevelPivotValues(node[key], pivotKeys[startIndex], pivotKeys, startIndex);

      result = { sum1: sum1, sum2: sum2, count1: count1, checkflag: checkflag, prevsum: prevsum, CalcType: CalcType };
      return result;
    }
    sum1 = 0;
    count1 = 0;
    checkflag = 0;
    prevsum = 0;

    result = { sum1: sum1, sum2: sum2, count1: count1, checkflag: checkflag, prevsum: prevsum, CalcType: CalcType };
    return result;
  }

  amountValueFormatter(cellValue) {
    let returnValue = '';
    if (cellValue.value == null || cellValue.value === undefined || cellValue.value === '') {
      returnValue = '';
    } else if (
      (cellValue.node.group && cellValue.column.aggFunc === 'count') ||
      (cellValue.node.group &&
        cellValue.colDef.pivotValueColumn !== undefined &&
        cellValue.colDef.pivotValueColumn.aggFunc === 'count')
    ) {
      if (typeof cellValue.value === 'object') {
        returnValue = cellValue.value.value;
      } else {
        returnValue = cellValue.value;
      }
    } else if (typeof cellValue.value === 'object') {
      if (
        isNaN(cellValue.value.value) ||
        cellValue.value.value == null ||
        (cellValue.value.value === '' && cellValue.value.value !== '0')
      ) {
        returnValue = '';
      } else if (parseFloat(cellValue.value.value)) {
        returnValue = parseFloat(cellValue.value.value).toFixed(3);
      } else {
        returnValue = '';
      }
    } else if (isNaN(cellValue.value)) {
      returnValue = '';
    } else {
      returnValue = parseFloat(cellValue.value).toFixed(3);
    }
    return returnValue;
  }

  parseDecimalPlace(value, place) {
    let minusPercentageDependentFields = [];
    const pivotColumns = gridOptions.columnApi.getSecondaryColumns();
    if (pivotColumns) {
      minusPercentageDependentFields = pivotColumns.map(x => x.colDef.pivotKeys.join(','));
    }
    if (value == '') {
      value = 0;
    }
    let value1 = 0;
    let value2 = 0;
    const minusPercentageCalculatedVarianceFieldIndex = minusPercentageCalculationFields.findIndex(item =>
      item.includes(currentSLEActualLEVarainceValue),
    );
    const minusCalculatedVarianceFieldIndex = minusCalculatedVarianceFields.indexOf(currentSLEActualLEVarainceValue);
    const percentageCalculatedVarianceFieldIndex = percentageCalculatedVarianceFields.indexOf(
      currentSLEActualLEVarainceValue,
    );
    const dependentVarianceFieldIndex = Object.keys(dependentVarianceFieldsWithReportingPeriod)
      .map(function(x) {
        return x;
      })
      .indexOf(currentSLEActualLEVarainceValue);
    if (arrPivotKeyValues[pivotKeysValue]) {
      arrPivotKeyValues[pivotKeysValue][nodeId] = value;
    } else {
      arrPivotKeyValues[pivotKeysValue] = [];
      arrPivotKeyValues[pivotKeysValue][nodeId] = value;
    }
    if (dependentVarianceFieldIndex >= 0) {
      dependentVarianceFieldsWithReportingPeriod[currentSLEActualLEVarainceValue] = value;
    } else if (minusPercentageCalculatedVarianceFieldIndex >= 0) {
      const index = minusPercentageCalculatedVarianceFieldIndex;
      let pivotKeysValue1 = '';
      let pivotKeysValue2 = '';
      const field1 = Object.keys(
        minusPercentageCalculationFormulatedFields[index][currentSLEActualLEVarainceValue][0],
      )[0];
      const field2 = Object.keys(
        minusPercentageCalculationFormulatedFields[index][currentSLEActualLEVarainceValue][0],
      )[1];
      if (field1) {
        pivotKeysValue1 = pivotKeysValue.replace(currentSLEActualLEVarainceValue, field1);
      }
      if (field2) {
        pivotKeysValue2 = pivotKeysValue.replace(currentSLEActualLEVarainceValue, field2);
      }
      if (
        minusPercentageDependentFields.indexOf(pivotKeysValue1) >= 0 &&
        minusPercentageDependentFields.indexOf(pivotKeysValue2) >= 0
      ) {
        if (arrPivotKeyValues[pivotKeysValue1]) {
          if (arrPivotKeyValues[pivotKeysValue1][nodeId]) {
            value1 = arrPivotKeyValues[pivotKeysValue1][nodeId];
          }
        }
        if (arrPivotKeyValues[pivotKeysValue2]) {
          if (arrPivotKeyValues[pivotKeysValue2][nodeId]) {
            value2 = arrPivotKeyValues[pivotKeysValue2][nodeId];
          }
        }
        if (minusCalculatedVarianceFieldIndex >= 0) {
          value = value1 - value2;
        } else if (percentageCalculatedVarianceFieldIndex >= 0) {
          if (keyFigureValueForPercentage.indexOf(keyFigureValue) >= 0) {
            value = value1 - value2;
          } else if (value1 != 0 && value2 != 0) {
            value = (value1 / value2 - 1) * 100;
          } else {
            value = 0;
          }
        }
      } else {
        value = 0;
      }
    }
    arrPivotKeyValues[pivotKeysValue][nodeId] = value;
    if (value !== 0) {
      if (parseFloat(value)) {
        if (place === 0) {
          value = parseFloat(value)
            .toFixed(place)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        } else {
          value = parseFloat(value)
            .toFixed(place)
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        }
      }
    } else if (value === 0) {
      value = '';
    }
    keyFigureValuesArray[nodeId] = keyFigureValue;
    return value;
  }

  async defColumns(colData) {
    // Get and generate the Ag-grid column structure
    return this.generateDefColumns(colData);
  }

  // insert expand/collpase icon in right panel
  addToggleOption() {
    try {
      $('.ag-pivot-mode-panel').each(function() {
        $(this).insertAfter($('.ag-column-drop-values'));
      });

      $('.ag-column-drop-pivot').each(function() {
        // ag-column-drop-values
        $(this).insertAfter(
          $(this)
            .parent()
            .find('.ag-column-select-panel'),
        );
      });
      $('#colGroupToggle').each(function() {
        $(this).insertAfter($('.ag-column-select-panel'));
      });

      $('#rowGroupToggle').each(function() {
        $(this).insertAfter($('.ag-column-drop-pivot')[1]);
      });

      $('#valueToggle').each(function() {
        $(this).insertAfter($('.ag-column-drop-row-group')[1]);
      });
    } catch (error) {
      console.log(error);
    }
  }

  // handle expand/ collapse on values
  valueToggle = () => {
    try {
      const x = $('#spnvalueToggle');
      $('.ag-column-panel > .ag-column-drop-values').toggle();
      if (x[0].className.indexOf('ag-icon-tree-closed') > 0) {
        $('#spnvalueToggle').addClass('ag-icon-tree-open');
        $('#spnvalueToggle').removeClass('ag-icon-tree-closed');
        $('#valueToggle').removeClass('border-bottom');
      } else {
        $('#spnvalueToggle').removeClass('ag-icon-tree-open');
        $('#spnvalueToggle').addClass('ag-icon-tree-closed');
        $('#valueToggle').addClass('border-bottom');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handle expand/ collapse on row groups
  rowGroupToggle = () => {
    try {
      const x = $('#spnrowGroupToggle');
      $('.ag-column-panel > .ag-column-drop-row-group').toggle();
      if (x[0].className.indexOf('ag-icon-tree-closed') > 0) {
        $('#spnrowGroupToggle').addClass('ag-icon-tree-open');
        $('#spnrowGroupToggle').removeClass('ag-icon-tree-closed');
        $('#rowGroupToggle').removeClass('border-bottom');
      } else {
        $('#spnrowGroupToggle').removeClass('ag-icon-tree-open');
        $('#spnrowGroupToggle').addClass('ag-icon-tree-closed');
        $('#rowGroupToggle').addClass('border-bottom');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handle expand/ collapse on column labels
  colGroupToggle = () => {
    try {
      const x = $('#spncolGroupToggle');
      $('.ag-column-panel > .ag-column-drop-pivot').toggle();
      if (x[0].className.indexOf('ag-icon-tree-closed') > 0) {
        $('#spncolGroupToggle').addClass('ag-icon-tree-open');
        $('#spncolGroupToggle').removeClass('ag-icon-tree-closed');
        $('#colGroupToggle').removeClass('border-bottom');
      } else {
        $('#spncolGroupToggle').removeClass('ag-icon-tree-open');
        $('#spncolGroupToggle').addClass('ag-icon-tree-closed');
        $('#colGroupToggle').addClass('border-bottom');
      }
    } catch (error) {
      console.log(error);
    }
  };

  createMinusCalculatedVarianceFields(currentReportingPeriod, level) {
    minusPercentageDependentCalculationFields = [];
    minusPercantageInvolvedVarianceFields = [];
    //  minusPercantageInvolvedVarianceFields = percentageCalculatedVarianceFields;
    dependentVarianceFieldsWithReportingPeriod = [];
    if (level === 3) {
      minusPercentageCalculationFormulatedFields = [
        { 'Var CY Actuals YTD v PY Actuals YTD': [{ 'Actuals (Monthly YTD)': [], 'Actuals YTD (Monthly)': [] }] },
        { 'Var CY SLE v PY Actuals': [{ SLE: [], Actuals: [] }] },
        { 'Var CY Actuals YTD v PY Actuals YTD %': [{ 'Actuals (Monthly YTD)': [], 'Actuals YTD (Monthly)': [] }] },
        { 'Var CY SLE v PY Actuals %': [{ SLE: [], Actuals: [] }] },
      ];
    } else {
      minusPercentageCalculationFormulatedFields = [
        { 'Var CY Actuals YTD v PY Actuals YTD': [{ 'Actuals (Weekly YTD)': [], 'Actuals YTD (Weekly)': [] }] },
        { 'Var CY SLE v PY Actuals': [{ SLE: [], Actuals: [] }] },
        { 'Var CY Actuals YTD v PY Actuals YTD %': [{ 'Actuals (Weekly YTD)': [], 'Actuals YTD (Weekly)': [] }] },
        { 'Var CY SLE v PY Actuals %': [{ SLE: [], Actuals: [] }] },
      ];
    }

    minusPercentageCalculationFormulatedFields = minusPercentageCalculationFormulatedFields.map(function(obj) {
      const param1 = Object.keys(obj[Object.keys(obj)][0])[0];
      const param2 = Object.keys(obj[Object.keys(obj)][0])[1];
      const PreviousReportingPeriod = currentReportingPeriod - 1;
      dependentVarianceFieldsWithReportingPeriod[`${currentReportingPeriod} ${param1}`] = 0;
      dependentVarianceFieldsWithReportingPeriod[`${PreviousReportingPeriod} ${param2}`] = 0;
      minusPercantageInvolvedVarianceFields.push(Object.keys(obj)[0]);
      minusPercantageInvolvedVarianceFields.push(`${currentReportingPeriod} ${param1}`);
      minusPercantageInvolvedVarianceFields.push(`${PreviousReportingPeriod} ${param2}`);
      obj[Object.keys(obj)][0][`${currentReportingPeriod} ${param1}`] = obj[Object.keys(obj)][0][param1]; // Assign new key
      obj[Object.keys(obj)][0][`${PreviousReportingPeriod} ${param2}`] = obj[Object.keys(obj)][0][param2];
      delete obj[Object.keys(obj)][0][param1]; // Delete old key
      delete obj[Object.keys(obj)][0][param2];
      if (minusPercentageDependentCalculationFields.indexOf(`${currentReportingPeriod} ${param1}`) < 0) {
        minusPercentageDependentCalculationFields.push(`${currentReportingPeriod} ${param1}`);
      }
      if (minusPercentageDependentCalculationFields.indexOf(`${PreviousReportingPeriod} ${param2}`) < 0) {
        minusPercentageDependentCalculationFields.push(`${PreviousReportingPeriod} ${param2}`);
      }
      return obj;
    });
  }

  setRowDataAfterApply() {
    gridOptions.api.setRowData(this.props.gridviewdata.length > 0 ? this.props.gridviewdata : []);
    gridOptions.api.setFilterModel(JSON.parse(this.state.currentFilterState)); // filter not set for blank data
    this.isResetFilterState = true;
  }

  // get field name from coldef i.e column name exist in database table
  getField(colId) {
    gridviewstructure = this.props.gridviewstructure;
    return gridviewstructure.filter(x => x.attribute_display_name === colId)[0].attribute_name;
  }

  // create dynamic query
  getDynamicQuery() {
    let colId = '';
    let field = '';
    const aggregateArr = [];
    gridviewstructure = this.props.gridviewstructure;
    const backgroundFilters = JSON.parse(localStorage.getItem('backgroundFilters'));
    const valuecols = gridOptions.columnApi.columnController.valueColumns;
    if (backgroundFilters !== null && backgroundFilters.length === 0) {
      const displaycols = gridOptions.columnApi.columnController.allDisplayedColumns;
      const rowcols = gridOptions.columnApi.columnController.rowGroupColumns;
      const pivotcols = gridOptions.columnApi.columnController.pivotColumns;
      displaycols.forEach(element => {
        colId = element.colDef.headerName;
        field = this.getField(colId);
        if (field) {
          if (!backgroundFilters[field]) {
            backgroundFilters[field] = true;
          }
        }
      });
      pivotcols.forEach(element => {
        colId = element.colDef.headerName;
        field = this.getField(colId);
        if (field) {
          if (!backgroundFilters[field]) {
            backgroundFilters[field] = true;
          }
        }
      });
      rowcols.forEach(element => {
        colId = element.colDef.headerName;
        field = this.getField(colId);
        if (field) {
          if (!backgroundFilters[field]) {
            backgroundFilters[field] = true;
          }
        }
      });
      valuecols.forEach(element => {
        // avoid filter on Aggrgate functions
        colId = element.userProvidedColDef.colId;
        field = this.getField(colId);
        aggregateArr.push(`${element.aggFunc}(${field}) ${field}`);
        if (field) {
          if (backgroundFilters[field]) {
            delete backgroundFilters[field];
          }
        }
      });
      localStorage.setItem('backgroundFilters', JSON.stringify(backgroundFilters));
    } else {
      valuecols.forEach(element => {
        colId = element.userProvidedColDef.colId;
        field = this.getField(colId);
        aggregateArr.push(`${element.aggFunc}(${field}) ${field}`);
      });
    }
    this.setState({ backgroundFilters: backgroundFilters });
    this.fields = Object.keys(backgroundFilters)
      .filter(Boolean)
      .join(',');

    this.aggregate = aggregateArr.filter(Boolean).join(',');
    if (this.fields !== '' || this.aggregate !== '') {
      return true;
    }
    return false;
  }

  getGridOptions = () => {
    const is_pivot_mode = gridOptions.columnApi.isPivotMode();
    const col_state = gridOptions.columnApi.getColumnState();
    const group_state = gridOptions.columnApi.getColumnGroupState();
    const sort_state = gridOptions.api.getSortModel();
    const filter_state = gridOptions.api.getFilterModel();
    const options = {
      is_pivot_mode: is_pivot_mode,
      col_state: col_state,
      group_state: group_state,
      sort_state: sort_state,
      filter_state: filter_state,
    };
    return options;
  };

  restoreGridState = (id, view_id) => {
    gridOptions.api.setRowData([]);
    this.setState({
      rowData: [],
      selectedStateID: id,
      selectedViewId: view_id,
    });
  };

  // set  ag-grid state
  setGridState(data) {
    try {
      if (data.length === 0) {
        gridOptions.columnApi.setPivotMode(true);
      } else {
        gridOptions.columnApi.setColumnState(JSON.parse(data.col_state));
        gridOptions.columnApi.setColumnGroupState(JSON.parse(data.group_state));
        gridOptions.api.setSortModel(JSON.parse(data.sort_state));
        gridOptions.api.setFilterModel(JSON.parse(data.filter_state)); // filter not set for blank data
        gridOptions.columnApi.setPivotMode(data.is_pivot_mode);
        this.setState({ currentFilterState: data.filter_state });
        this.isResetFilterState = false;
      }
    } catch (error) {
      console.log(error);
    }
  }

  setDefaultState(level) {
    let defaultState = this.props.gridviewstate.filter(
      x => x.id === this.state.selectedStateID && x.report_filters.split('||')[0].split(':')[1] === level,
    );
    if (defaultState.length === 0) {
      defaultState = this.props.gridviewstate.filter(
        x =>
          x.user_id === '0' &&
          x.view_id === this.state.selectedViewId &&
          x.report_filters.split('||')[0].split(':')[1] === level,
      );
    }
    if (defaultState.length > 0) {
      this.setGridState(defaultState[0]);
      this.props.setFilterState(defaultState[0]);
    } else {
      gridOptions.columnApi.setColumnState([]);
      gridOptions.columnApi.setColumnGroupState([]);
      gridOptions.api.setSortModel([]);
      gridOptions.api.setFilterModel({});
      gridOptions.columnApi.setPivotMode(true);
    }
  }

  activeTab() {
    if (document.getElementsByClassName('ant-menu-item-selected')[0] !== undefined) {
      document.getElementsByClassName('ant-menu-item-selected')[0].classList.remove('ant-menu-item-selected');
    }
    if (document.getElementsByClassName('ant-menu-submenu-vertical')[0] !== undefined) {
      document.getElementsByClassName('ant-menu-submenu-vertical')[0].classList.add('ant-menu-item-selected');
    }
  }

  render() {
    this.activeTab();
    return (
      <Styled.ReportViewWrapper>
        <CustomizedSnackbar ref={el => (this.snackbar = el)} />
        <div className='box ag-theme-balham'>
          <div style={{ display: 'none' }}>
            <div id='valueToggle'>
              <span id='spnvalueToggle' className='ag-icon ag-icon-tree-open toggle' onClick={this.valueToggle} />
              <span className='ag-icon ag-icon-aggregation ag-column-drop-icon spnag-column-drop-icon' />
              <span className='ag-column-drop-title'>Values</span>
            </div>

            <div id='rowGroupToggle'>
              <span id='spnrowGroupToggle' className='ag-icon ag-icon-tree-open toggle' onClick={this.rowGroupToggle} />
              <span className='ag-icon ag-icon-group ag-column-drop-icon spnag-column-drop-icon' />
              <span className='ag-column-drop-title'>Row Groups</span>
            </div>

            <div id='colGroupToggle' className='colGroupToggle'>
              <span id='spncolGroupToggle' className='ag-icon ag-icon-tree-open toggle' onClick={this.colGroupToggle} />
              <span className='ag-icon ag-icon-pivot ag-column-drop-icon spnag-column-drop-icon' />
              <span className='ag-column-drop-title'>Column Labels</span>
            </div>
          </div>
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={this.state.rowData}
            gridOptions={gridOptions}
            aggFuncs={this.state.aggFuncs}
            pagination={false}
            onGridColumnsChanged={params => params.api.redrawRows()}
            processCellForClipboard={this.processCellForClipboard.bind(this)}
            processHeaderForClipboard={this.processHeaderForClipboard.bind(this)}
          />
        </div>
      </Styled.ReportViewWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    gridviewstructure: state.Reporting.gridviewstructure,
    gridviewstate: state.Reporting.gridviewstate,
    gridviewdata: state.Reporting.gridviewdata,
    user: state.Reporting.user,
    isSave: state.Reporting.isSave,
    isDelete: state.Reporting.isDelete,
    filterList: state.Reporting.reportfilter,
    frozenVersionList: state.Reporting.frozenversion,
    keyFigureList: state.Reporting.keyfigure,
    EventReportName: state.Reporting.EventReportName,
    NetPriceReportName: state.Reporting.NetPriceReportName,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getGridViewStructure: actions.GetGridViewStructureAction,
      getGridViewState: actions.GetGridViewStateAction,
      getGridViewData: actions.GetGridViewDataAction,
      getReportFilterList: actions.GetReportFilterAction,
      getFrozenVersionList: actions.GetFrozenVersionAction,
      getKeyFigureList: actions.GetKeyFigureAction,
    },
    dispatch,
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(ReportView);
