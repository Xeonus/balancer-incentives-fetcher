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
    width: "75%",
    overflowX: "auto",
    marginBottom: theme.spacing(2),
    margin: "auto",
    alignItems: "center",
  },
}));

//const balId = '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3';
//const maticId = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
const balancerUrl = 'https://app.balancer.fi/#/pool/';


export function MainnetQuery(props) {

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
    balancers(first: 500) {
      id
      pools(first: 500) {
        tokens {
          symbol
          id
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


  if (loading) return (
    <div>
      <Grid direction="row">
        <CircularProgress></CircularProgress>
        {/* <Typography noWrap={false} variant="caption" color="textSecondary" component="span">Loading Subgraph...</Typography> */}
      </Grid>
    </div>);
  if (error) return (
    <Typography noWrap={false} variant="caption" color="textSecondary" component="span">Error while fetching Balancer Subgraph data :(</Typography>
  );

  console.log("mainnet pools", data);

  return (
    <div>
      <Title>ETH Mainnet - Week {weekNumber}</Title>
      <Container fixed>
      <Paper className={classes.paper} elevation={3}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell width="35%" ><b>Pool</b></TableCell>
              <TableCell width="10%" align="left"><b>BAL</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.balancers[0].pools.map(({ id, tokens }) => (
              jsonData.week_60[0].pools[id.toString()] ?
                <TableRow key={id}>
                  <TableCell width="35%" align="left"> <Link href={balancerUrl.concat(id)}>{tokens.map(e => e.symbol ? e.symbol : "MKR").join('/')}</Link></TableCell>
                  <TableCell width="10%" align="left">{jsonData.week_60[0].pools[id.toString()][0].amount}</TableCell>
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