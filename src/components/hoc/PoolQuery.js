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
}));

//-------Refactor into HOC / REDUX--------

//Token and Balancer infos:
const qiId = '0x580a84c73811e1839f75d86d75d88cca0c241ff4';
const mtaId = '0xF501dd45a1198C2E1b5aEF5314A68B9006D842E0';
const balancerUrl = 'https://polygon.balancer.fi/#/pool/';

//Number formatting
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

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
  { id: 'matic', numeric: true, disablePadding: false, label: 'MATIC' },
  { id: 'qi', numeric: true, disablePadding: false, label: 'QI' },
  { id: 'mta', numeric: true, disablePadding: false, label: 'MTA' },
];

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
              <b>{headCell.label}</b>
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
  rowCount: PropTypes.number.isRequired,
};

export function PoolQuery(props) {

  const jsonData = { ...props.data };

  //Create data helper function:
  function createData(poolName, hyperLink, totalLiq, bal, matic, qi, mta) {
    return { poolName, hyperLink, totalLiq, bal, matic, qi, mta };
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

  //Create data function
  //TODO: Redux
  const createDataFunction = (queryData, myJsonData) => {
    const myRows = [];
    queryData.pools.forEach(({ id, tokens, totalLiquidity}) => {
      if (myJsonData.pools[id.toString()]) {
        //TODO: Mapping arguments for tokens
        let qiAmount = 0
        let mtaAmount = 0
        if (myJsonData.pools[id.toString()][2]) {
          if (myJsonData.pools[id.toString()][2].tokenAddress === qiId) {
            qiAmount = myJsonData.pools[id.toString()][2].amount;
          } 
          else if (myJsonData.pools[id.toString()][2].tokenAddress === mtaId) {
            mtaAmount = myJsonData.pools[id.toString()][2].amount;
          }
        }
        const entry = createData(
          tokens.map(e => e.symbol).join('/'),
          balancerUrl.concat(id),
          Number(totalLiquidity),
          myJsonData.pools[id.toString()][0].amount,
          myJsonData.pools[id.toString()][1].amount,
          qiAmount,
          mtaAmount
        )
        myRows.push(entry);
      }
    });
    return myRows;
  };

  //Polygon query
  //TODOs: set in ENV variables / Redux:
  const { loading, error, data } = useQuery(gql`
  {
    balancers(first: 5) {
      id
      pools {
        totalLiquidity
        tokens {
          symbol
          id
        }
        id
      }
    }
  }
    `,
    {
      context: { clientName: 'polygon' },

    },
  );

  //If data is not fully loaded, display progress
  if (loading || jsonData[newestWeek] === null) return (
    <div>
      <Grid direction="row">
        <CircularProgress></CircularProgress>
        {/* <Typography noWrap={false} variant="caption" color="textSecondary" component="span">Loading Subgraph...</Typography> */}
      </Grid>
    </div>);

  //Fetching error warning
  if (error) return (
    <Typography noWrap={false} variant="caption" color="textSecondary" component="span">Error while fetching Balancer Subgraph data :(</Typography>
  );

  rows = createDataFunction(data.balancers[0], jsonData[newestWeek][1]);


  return (
    <div>
      <Title>Polygon - Week {weekNumber}</Title>
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
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell align="left"><Link href={row.hyperLink}>{row.poolName}</Link></TableCell>
                      <TableCell align="right">{numberWithCommas(Number(row.totalLiq).toFixed(0))}</TableCell>
                      <TableCell align="right">{numberWithCommas(row.bal)}</TableCell>
                      <TableCell align="right">{numberWithCommas(row.matic)}</TableCell>
                      <TableCell align="right">{row.qi === 0 ? '-' : numberWithCommas(row.qi)}</TableCell>
                      <TableCell align="right">{row.mta === 0 ? '-' : numberWithCommas(row.mta)}</TableCell>
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