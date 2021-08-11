import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';


const styles = theme => ({
  table: {
    overflow: 'auto',
    minWidth: 0,
  },
  tableCell: {
    paddingRight: 1,
    paddingLeft: 1
  },
  paper: {
    marginTop: theme.spacing(3),
    overflowX: "auto",
    marginBottom: theme.spacing(2),
    margin: "auto"
  },
});

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

class CoinPriceData extends Component {

  //Obsolete constructor
  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = {
      loading: true,
      coinData: null,
      globalDamLockedIn: null,
      globalFluxBurned: null,

    };
  };
  
  

  //Fetch coin price data
  async fetchData() {
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=balancer%2Cmeta%2Cqi-dao%2Cmatic-network%2Cethereum&order=market_cap_desc&per_page=100&page=1&sparkline=false%22";
    const response = await fetch(url);
    const json = await response.json();
    const coinData = json;
    var today = new Date();
    var time = today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.setState((state) => ({
      coinData: { ...coinData },
      coinDataSize: coinData.length,
      loading: false,
      time: time,
    }), () => {
      if (this.props.onChange) {
        this.props.onChange(this.state);
      }
    }
    );
  }
  componentDidMount() {
    //Set interval for automatic refresh
    this.mounted = true;
    this.fetchData();
    //Fetch coin data every 60 seconds
    this.inverval = setInterval(() => {
      if (this.mounted) {
      this.fetchData()
      }
    },60000);

    //Update data here as a test:
    if (this.state.coinData !== null && this.state.coinData !== this.props.coinData) {
      //Update important components:
      //this.setState ({
       // damPrice : this.state.coinData[1].current_price,
        //fluxPrice : this.state.coinData[2].current_price,
      //});
      this.props.data.coinData = this.state.coinData;
      //Map dam- and flux-prices:
      //this.props.data.damPrice = this.state.coinData[1].current_price;
      //this.props.data.fluxPrice = this.state.coinData[2].current_price;
      }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.contractInterval);
    this.mounted = false;
  }


  render() {
    const { classes } = this.props;

    function createData(name, currentPrice, allTimeHigh, allTimeLow, marketCap) {
      return { name, currentPrice, allTimeHigh, allTimeLow, marketCap };
    }

    //The default return object is parsed and used in CoinStatistics to display
    if (this.state.loading) {
      return (
        <div component="span"><CircularProgress /></div>
      )
    }

    //No data could be fetched
    if (!this.state.coinData[2].current_price) {

      return (
        <div component="span">Could not fetch any price data from coingecko API...</div>

      )
    }

    if (this.state.coinData[2].current_price !== null) {
      //Map props to data:
      this.props.data.coinData = this.state.coinData;
      //Map dam- and flux-prices:
      //this.props.data.damPrice = this.state.coinData[1].current_price;
      //this.props.data.fluxPrice = this.state.coinData[2].current_price;
      //useEffect(() => { this.props.data.damPrice = this.state.coinData[1].current_price}, []);
      //Only initialize data when it has been fully mounted before render
      const rows = [
      ];

      for (var i = 0; i <= 4; i++) {
        const dataEntry = createData(this.state.coinData[i].symbol.toUpperCase(), this.state.coinData[i].current_price, this.state.coinData[i].ath, this.state.coinData[i].atl, this.state.coinData[i].market_cap);
        rows.push(dataEntry);
      }
      return (
        <div>
        <Container fixed>
        <Paper className={classes.paper} elevation={3}>
          <Table className={classes.table} size="small" aria-label="a dense table">
          <caption>Price data fetched every minute through Coingecko API. Last update: {this.state.time}</caption>
            <TableHead>
              <TableRow >
                <TableCell align="left"><b>Token</b></TableCell>
                <TableCell align="right"><b>Price ($)</b></TableCell>
                <TableCell align="right"><b>All-time high price ($)</b></TableCell>
                <TableCell align="right"><b>All-time low price ($)</b></TableCell>
                <TableCell align="right"><b>Market Cap ($)</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{numberWithCommas(Number(row.currentPrice).toFixed(2))}</TableCell>
                  <TableCell align="right">{numberWithCommas(Number(row.allTimeHigh).toFixed(2))}</TableCell>
                  <TableCell align="right">{numberWithCommas(Number(row.allTimeLow).toFixed(3))}</TableCell>
                  <TableCell align="right">{numberWithCommas(Number(row.marketCap).toFixed(2))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </Paper>
            </Container>
            </div>
      );
    }
  }
}

export default (withStyles(styles)(CoinPriceData))