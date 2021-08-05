import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Title from './../UI/Title';
import Link from '@material-ui/core/Link';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import TableContainer from '@material-ui/core/TableContainer';
import {
  useQuery,
  gql
} from "@apollo/client";

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
}));

const qiId = '0x580a84c73811e1839f75d86d75d88cca0c241ff4';
const mtaId = '0xF501dd45a1198C2E1b5aEF5314A68B9006D842E0';
const balancerUrl = 'https://polygon.balancer.fi/#/pool/';


export function PoolQuery(props) {

  const jsonData = { ...props.data };

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



  const { loading, error, data } = useQuery(gql`
  {
    balancers(first: 5) {
      id
      pools {
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



  if (loading || jsonData[newestWeek] === null) return (
    <div>
      <Grid direction="row">
        <CircularProgress></CircularProgress>
        {/* <Typography noWrap={false} variant="caption" color="textSecondary" component="span">Loading Subgraph...</Typography> */}
      </Grid>
    </div>);
  if (error) return (
    <Typography noWrap={false} variant="caption" color="textSecondary" component="span">Error while fetching Balancer Subgraph data :(</Typography>
  );

  return (
    <div>
      <Title>Polygon - Week {weekNumber}</Title>
      <Container fixed>
      <Paper className={classes.paper} elevation={3}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell width="35%" ><b>Pool</b></TableCell>
              <TableCell align="left"><b>BAL</b></TableCell>
              <TableCell align="left"><b>MATIC</b></TableCell>
              <TableCell align="left"><b>QI</b></TableCell>
              <TableCell align="left"><b>MTA</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.balancers[0].pools.map(({ id, tokens }) => (
              jsonData[newestWeek][1].pools[id.toString()] ?
                <TableRow key={id}>
                  <TableCell width="35%" align="left"><Link href={balancerUrl.concat(id)}>{tokens.map(e => e.symbol).join('/')}</Link> </TableCell>
                  <TableCell align="left">{jsonData[newestWeek][1].pools[id.toString()][0].amount}</TableCell>
                  <TableCell align="left">{jsonData[newestWeek][1].pools[id.toString()][1].amount}</TableCell>
                  {jsonData[newestWeek][1].pools[id.toString()][2] ?
                    <TableCell align="left">{jsonData[newestWeek][1].pools[id.toString()][2].tokenAddress === qiId ? jsonData[newestWeek][1].pools[id.toString()][2].amount : '-'}</TableCell>
                    :
                    <TableCell align="left">{'-'}</TableCell>
                  }
                  {jsonData[newestWeek][1].pools[id.toString()][2] ?
                    <TableCell align="left">{jsonData[newestWeek][1].pools[id.toString()][2].tokenAddress === mtaId ? jsonData[newestWeek][1].pools[id.toString()][2].amount : '-'}</TableCell>
                    :
                    <TableCell align="left">{'-'}</TableCell>
                  }
                </TableRow>
                : null

            ))}
          </TableBody>
        </Table>
        </Paper>
      </Container>
    </div>

  )
}