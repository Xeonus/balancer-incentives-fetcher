import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Title from './../UI/Title';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import DynamicValueFormatter from './DynamicValueFormatter';
import DynamicValueFormatterWithText from './DynamicValueFormatterWithText';
import IncentiveCharts from '../IncentiveTables/IncentiveCharts/IncentiveCharts';
import PoolIncentiveChart from '../../Charts/PoolIncentiveChart';
import Tooltip from '@material-ui/core/Tooltip';
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";
import {
  useQuery,
  gql
} from "@apollo/client";

//Styling config:
const useStyles = makeStyles((theme) => ({
  table: {
    alignItems: "center",
  },
  paper: {
    marginTop: theme.spacing(3),
    overflowX: "auto",
    marginBottom: theme.spacing(2),
    margin: "auto",
    alignItems: "center"
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  tooltip: {
    maxWidth: "800",
    fontSize: "1em",
    textAlign: "center",
    whiteSpace: 'normal',
  },
  chartTooltip: {
    maxWidth: "none",
    fontSize: "1em",
    textAlign: "center",
    whiteSpace: 'normal',
  },
}));

//Balancer URL:
const balancerUrl = 'https://app.balancer.fi/#/pool/';
const elementFiUrl = 'https://app.element.fi/pools/'
//Token IDs: TODO: own config file in v3-info!
const lidoId = '0x5a98fcbea516cf06857215779fd812ca3bef1b32';
const balId = '0xba100000625a3754423978a60c9317c58a424e3d';
const unnId = '0x226f7b842e0f0120b7e194d05432b3fd14773a9d';
const vitaId = '0x81f8f0bb1cb2a06649e51913a151f0e7ef6fa321';
const bankId = '0x2d94aa3e47d9d5024503ca8491fce9a2fb4da198';
const noteId = '0xcfeaead4947f0705a14ec42ac3d44129e1ef3ed5';
const nexoId = '0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206';

//-------Refactor into HOC / REDUX--------

//Descending comparator
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

//Comparator
function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

//Stablesort
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

//---------------------------------------------

//Headcell configuration:
const headCells = [
  { id: 'poolName', numeric: false, disablePadding: true, label: 'Pool' },
  { id: 'totalLiq', numeric: true, disablePadding: false, label: 'Total Liquidity ($)' },
  { id: 'bal', numeric: true, disablePadding: false, label: 'BAL' },
  { id: 'coIncentives', numeric: true, disablePadding: true, label: 'Co-Incentives' },
  { id: 'apr', numeric: true, disablePadding: false, label: 'LM APR (%)' },
];

const aprToolTip =
  "The liquidity mining annual percentage rate (APR) is calculated as the sum of all incentive APRs: <br /> <br />" +
  "$" +
  "\\sum\\frac{incentiveAmount \\times priceOfIncentive \\times 52 \\times 100}{totalLiquidity} " +
  "$ <br /><br />"

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.id === 'apr' ? <Tooltip classes={{ tooltip: classes.tooltip }} title={<Latex>{aprToolTip}</Latex>}><b>{headCell.label}</b></Tooltip> :
                <b>{headCell.label}</b>
              }
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};


export function MainnetQuery(props) {

  const jsonData = { ...props.data };

  function createData(poolName, hyperLink, totalLiq, bal, ldo, vita, note, nexo, coIncentives, apr) {
    return { poolName, hyperLink, totalLiq, bal, ldo, vita, note, nexo, coIncentives, apr };
  }

  let rows = [];
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('bal');
  const [selected, setSelected] = React.useState([]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.poolName);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;


  //Find newest week
  var week = 0;
  let weekStr = 'week_';
  for (var key in jsonData) {
    var id = parseInt(key.toString().split("_")[1]);
    if (id > week) {
      week = id;
    }
  };

  const newestWeek = weekStr.concat(week.toString());
  const weekNumber = week.toString();
  const classes = useStyles();

  //Obtain price from Coingecko Coindata
  const getPrice = (coinData, coinId) => {
    if (coinData.coinData) {
      var coinArray = Object.values(coinData.coinData)
      if (coinArray) {
        for (const el of coinArray) {
          if (el.id === coinId) {
            return el.current_price;
          }
        }
      }
    }
  }

  //Create incentives table
  const createTableArrayFunction = (queryData, myJsonData) => {
    const tableRows = [];
    const elementIds = ['0xEdf085f65b4F6c155e13155502Ef925c9a756003', '0x4bd6D86dEBdB9F5413e631Ad386c4427DC9D01B2', '0x7Edde0CB05ED19e03A9a47CD5E53fC57FDe1c80c']
    queryData.pools.forEach(({ id, tokens, totalLiquidity, poolType }) => {
      //TODO: Fix manual iteration, change through config and make it dynamic -> dependent on Table Head Cells
      let balAmount = 0;
      let lidoAmount = 0;
      let vitaAmount = 0;
      let unnAmount = 0;
      let bankAmount = 0;
      let noteAmount = 0;
      let nexoAmount = 0;
      let coIncentive;
      let apr = 0
      let indxId = id;
      let isElementEntry = false;
      let elementId = '';
      //Element.fi hard-coded check as IDs were not properly set up:
      elementIds.forEach((element) => {
        if (element.toLowerCase() === id.substring(0, 42)) {
          console.log("partial hit", element);
          isElementEntry = true;
          elementId = element;
        }
      });
      if (myJsonData.pools[indxId]) {
        myJsonData.pools[indxId].forEach((element) => {
          if (element.tokenAddress === balId) {
            balAmount = element.amount
            apr = apr + balAmount * getPrice(props.coinData, 'balancer') / totalLiquidity * 52 * 100
          }
          else if (element.tokenAddress === lidoId) {
            lidoAmount = element.amount
            apr = apr + lidoAmount * getPrice(props.coinData, 'lido-dao') / totalLiquidity * 52 * 100
            coIncentive = {
              text: 'LDO',
              value: lidoAmount,
              valueInUsd: Number(lidoAmount * getPrice(props.coinData, 'lido-dao')),
            };
          }
          else if (element.tokenAddress === vitaId) {
            vitaAmount = element.amount
            apr = apr + vitaAmount * getPrice(props.coinData, 'vitadao') / totalLiquidity * 52 * 100
            coIncentive = {
              text: 'VITA',
              value: vitaAmount,
              valueInUsd: Number(vitaAmount * getPrice(props.coinData, 'vitadao')),
            };
          }
          else if (element.tokenAddress === unnId) {
            unnAmount = element.amount
            apr = apr + unnAmount * getPrice(props.coinData, 'union-protocol-governance-token') / totalLiquidity * 52 * 100
            coIncentive = {
              text: 'UNN',
              value: unnAmount,
              valueInUsd: Number(unnAmount * getPrice(props.coinData, 'union-protocol-governance-token')),
            };
          }
          else if (element.tokenAddress === bankId) {
            bankAmount = element.amount
            apr = apr + unnAmount * getPrice(props.coinData, 'bankless-dao') / totalLiquidity * 52 * 100
            coIncentive = {
              text: 'BANK',
              value: bankAmount,
              valueInUsd: Number(bankAmount * getPrice(props.coinData, 'bankless-dao')),
            };
          }
          else if (element.tokenAddress === noteId) {
            noteAmount = element.amount
            apr = apr + noteAmount * getPrice(props.coinData, 'notional-finance') / totalLiquidity * 52 * 100
            coIncentive = {
              text: 'NOTE',
              value: noteAmount,
              valueInUsd: Number(noteAmount * getPrice(props.coinData, 'notional-finance')),
            };
          }
          else if (element.tokenAddress === nexoId) {
            nexoAmount = element.amount
            apr = apr + nexoAmount * getPrice(props.coinData, 'nexo') / totalLiquidity * 52 * 100
            coIncentive = {
              text: 'NEXO',
              value: nexoAmount,
              valueInUsd: Number(nexoAmount * getPrice(props.coinData, 'nexo')),
            };
          }
        });

        const tableEntry = createData(
          tokens.map(e => e.symbol ? e.symbol : "MKR").join('/'),
          isElementEntry ? elementFiUrl.concat(elementId) : balancerUrl.concat(id),
          Number(totalLiquidity),
          balAmount,
          lidoAmount,
          vitaAmount,
          noteAmount,
          nexoAmount,
          coIncentive,
          apr
        )
        if (poolType === "Weighted") {
          const ratios = " (" + tokens.map(e => Number(e.weight * 100).toFixed(0)).join('/') + ")";
          tableEntry.poolName = tableEntry.poolName + ratios;
        }
        tableRows.push(tableEntry);
      }
    });
    return tableRows;
  };

  //Get total worth
  const getTotalIncentivesWorth = (inputTable) => {
    var totalWorthInUSD = 0;
    inputTable.forEach((row) => {
      totalWorthInUSD = totalWorthInUSD + row.bal * getPrice(props.coinData, 'balancer') + row.ldo * getPrice(props.coinData, 'lido-dao') + row.vita * getPrice(props.coinData, 'vitadao') + row.note * getPrice(props.coinData, 'notional-finance') + row.nexo * getPrice(props.coinData, 'nexo');

    });
    //Special case: AAVE allocation for ETH Mainnet: 12500 BAL
    //totalWorthInUSD = totalWorthInUSD + 12500 * getPrice(props.coinData, 'balancer');
    return totalWorthInUSD;
  }

  //Mainnet Query
  const { loading, error, data } = useQuery(gql`
  {
    balancers(first: 500) {
      id
      pools(first: 500) {
        totalLiquidity
        poolType
        tokens {
          symbol
          id
          weight
        }
        id
      }
      totalLiquidity
    }
  }
    `,
    {
      context: { clientName: 'mainnet' },
      fetchPolicy: "no-cache",
    },
  );

  //If data is not fully loaded, display progress
  if (loading || jsonData[newestWeek] === null) return (
    <div>
      <Grid>
        <CircularProgress></CircularProgress>
        {/* <Typography noWrap={false} variant="caption" color="textSecondary" component="span">Loading Subgraph...</Typography> */}
      </Grid>
    </div>);
  if (error) return (
    <Typography noWrap={false} variant="caption" color="textSecondary" component="span">Error while fetching Balancer Subgraph data :(</Typography>
  );

  rows = createTableArrayFunction(data.balancers[0], jsonData[newestWeek][0]);


  return (
    <div>
      <Title>{`ETH Mainnet - Incentives of Week `}
        {weekNumber} {` 
        `}
        ~$<DynamicValueFormatter value={getTotalIncentivesWorth(rows).toFixed(0)} name={'totalValue'} decimals={0} /></Title>
      <Container fixed>
        <Paper className={classes.paper} elevation={3}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .map((row) => {
                  const isItemSelected = isSelected(row.poolName);
                  return (

                    <Tooltip
                      key={row.poolName + "_tooltip"}
                      classes={{ tooltip: classes.chartTooltip }}
                      title={
                        row.coIncentives ?
                        <PoolIncentiveChart
                          bal={Number(Number(row.bal).toFixed(0) * getPrice(props.coinData, 'balancer'))}
                          coIncentive={row.coIncentives}
                        >
                        </PoolIncentiveChart>: ""}>
                      <TableRow
                        onClick={(event) => handleClick(event, row.poolName)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.poolName}
                        selected={isItemSelected}
                        hover={true}
                      >
                        <TableCell align="left">
                          <Link href={row.hyperLink}>{row.poolName}</Link>
                        </TableCell>
                        <TableCell align="right"><DynamicValueFormatter value={Number(row.totalLiq).toFixed(0)} name={row.poolName} decimals={0} /></TableCell>
                        <TableCell align="right"><DynamicValueFormatter value={Number(row.bal).toFixed(0)} name={row.poolName} decimals={0} /></TableCell>
                        <TableCell align="right">
                          {row.coIncentives ?
                            <DynamicValueFormatterWithText value={Number(row.coIncentives['value']).toFixed(0)} name={'coIncentives'} text={row.coIncentives['text']} decimals={0} />
                            : '-'}
                        </TableCell>
                        <TableCell align="right">{row.apr === 0 ? '-' : <DynamicValueFormatter value={Number(row.apr).toFixed(2)} name={row.poolName} decimals={2} />}</TableCell>
                      </TableRow>
                    </Tooltip>
                  );
                })}
            </TableBody>
          </Table>
        </Paper>
        {
          <Paper className={classes.paper} elevation={3}>
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
          >
            <Grid item xs={12}>
              <IncentiveCharts rows={rows} coinData={props.coinData} balPrice={getPrice(props.coinData, 'balancer')}></IncentiveCharts>

            </Grid>
          </Grid>
          </Paper>
        }
      </Container>
    </div>

  )
}