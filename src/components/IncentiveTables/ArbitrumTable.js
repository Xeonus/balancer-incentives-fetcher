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
import Title from '../UI/Title';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import DynamicValueFormatter from '../hoc/DynamicValueFormatter';
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
    margin: "auto"
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
  }
}));

//-------Refactor into HOC / REDUX--------

//Token and Balancer infos:
const balId = '0x040d1edc9569d4bab2d15287dc5a4f10f56a56b8';
const mcbId = '0x4e352cf164e64adcbad318c3a1e222e9eba4ce42';
const pickleId = '0x965772e0e9c84b6f359c8597c891108dcf1c5b1a';
const balancerUrl = 'https://arbitrum.balancer.fi/#/pool/';

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
  { id: 'mcb', numeric: true, disablePadding: false, label: 'MCB' },
  { id: 'pickle', numeric: true, disablePadding: false, label: 'PICKLE' },
  { id: 'apr', numeric: true, disablePadding: false, label: 'LM APR (%)' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

const aprToolTip = 
      "The liquidity mining annual percentage rate (APR) is calculated as the sum of all incentive APRs: <br /> <br />" +
      "$" +
      "\\sum\\frac{incentiveAmount \\times priceOfIncentive \\times 52 \\times 100}{totalLiquidity} " +
      "$ <br /><br />"

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

export function ArbitrumTable(props) {

  let jsonData = { ...props.data };

  //Create data helper function:
  function createData(poolName, hyperLink, totalLiq, bal, mcb, pickle, apr) {
    return { poolName, hyperLink, totalLiq, bal, mcb, pickle, apr};
  }

  
  //Row variable and state change settings
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
    if ( coinData.coinData) {
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

  //Get total worth
  const getTotalIncentivesWorth = (inputTable) => {
    var totalWorthInUSD = 0;
    inputTable.forEach((row) => {
      totalWorthInUSD = totalWorthInUSD + row.bal * getPrice(props.coinData, 'balancer') + row.mcb * getPrice(props.coinData, 'mcdex') + row.pickle * getPrice(props.coinData, 'pickle-finance');
    });
    return totalWorthInUSD;
  }


  //Create Table Array function
  //TODO: move into HOC as single js function that is called by all 
  //TODO: APR
  //[amt of tokens distributed weekly] * [price of token] / [total liquidity] * 52
  const createTableArrayFunction = (queryData, myJsonData) => {
    const tableRows = [];
    queryData.pools.forEach(({ id, tokens, totalLiquidity, poolType}) => {
      //TODO: Fix manual iteration, change through config and make it dynamic -> dependent on Table Head Cells
      let apr = 0
      let balAmount = 0
      let mcbAmount = 0
      let pickleAmount = 0
      if (myJsonData.pools[id.toString()]) {
      myJsonData.pools[id.toString()].forEach((element) => {
        if (element.tokenAddress === balId) {
          balAmount = element.amount
          apr = apr + balAmount * getPrice(props.coinData, 'balancer') / totalLiquidity * 52 * 100
        } 
        else if (element.tokenAddress === mcbId) {
          mcbAmount = element.amount
          apr = apr + mcbAmount * getPrice(props.coinData, 'mcdex') / totalLiquidity * 52 * 100
        }
        else if (element.tokenAddress === pickleId) {
          pickleAmount = element.amount
          apr = apr + pickleAmount * getPrice(props.coinData, 'pickle-finance') / totalLiquidity * 52 * 100
        }
      });
      const tableEntry = createData(
        tokens.map(e => e.symbol).join('/'),
        balancerUrl.concat(id),
        Number(totalLiquidity),
        balAmount,
        mcbAmount,
        pickleAmount,
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

  //Arbitrum query
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
      context: {
          clientName: 'arbitrum',
          uri: 'https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-arbitrum-v2',
         },
      fetchPolicy: "no-cache",
    },
  );

  //If data is not fully loaded, display progress
  if (loading || jsonData === null) return (
    <div>
      <Grid>
        <CircularProgress></CircularProgress>
        {/* <Typography noWrap={false} variant="caption" color="textSecondary" component="span">Loading Subgraph...</Typography> */}
      </Grid>
    </div>);

  //Fetching error warning
  if (error) return (
    <Typography noWrap={false} variant="caption" color="textSecondary" component="span">Error while fetching Balancer Subgraph data :(</Typography>
  );

  if (data !== null && jsonData !== null && jsonData[newestWeek] !== null) {
    rows = createTableArrayFunction(data.balancers[0], jsonData[newestWeek][2]);
  };

  return (
    <div>
      <Title>{`Arbitrum - Incentives of Week `}
        {weekNumber} {` 
        `}
        ~$<DynamicValueFormatter value={getTotalIncentivesWorth(rows).toFixed(0)} name={'totalValue'} decimals={0}/></Title>
      <Container  fixed>
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
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.poolName)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.poolName}
                      selected={isItemSelected}
                    >
                      <TableCell align="left"><Link href={row.hyperLink}>{row.poolName}</Link></TableCell>
                      <TableCell align="right"><DynamicValueFormatter value={Number(row.totalLiq).toFixed(0)} name={row.poolName} decimals={0}/></TableCell>
                      <TableCell align="right"><DynamicValueFormatter value={Number(row.bal).toFixed(0)} name={row.poolName} decimals={0}/></TableCell>
                      <TableCell align="right">{row.mcb === 0 ? '-' : <DynamicValueFormatter value={Number(row.mcb).toFixed(0)} name={row.poolName} decimals={0}/>}</TableCell>
                      <TableCell align="right">{row.pickle === 0 ? '-' : <DynamicValueFormatter value={Number(row.pickle).toFixed(0)} name={row.poolName} decimals={0}/>}</TableCell>
                      <TableCell align="right">{row.apr === 0 ? '-' : <DynamicValueFormatter value={Number(row.apr).toFixed(2)} name={row.poolName} decimals={2}/>}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </div>

  )
}