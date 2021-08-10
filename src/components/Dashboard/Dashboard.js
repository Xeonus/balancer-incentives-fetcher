import Title from './../UI/Title';
import Container from "@material-ui/core/Container";
import { Box, Switch } from '@material-ui/core';
import BgImage from './../resources/bg-header.svg';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { PoolQuery } from '../hoc/PoolQuery';
import { MainnetQuery } from '../hoc/MainnetQuery';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Footer from '../UI/Footer'
import BalancerLogo from './../resources/logo-dark.svg';
import PolygonLogo from './../resources/ethereum.svg';
import EtherLogo from './../resources/polygon.svg';
import CoinPriceData from '../CoinPriceData/CoinPriceData';


export default function Dashboard() {

    

    //Default initialization. In future replace with rest-api elements
    const state = {
        coinData: [],

    };

    const [data, setData] = useState(state);
    
    //Theme properties
    const useStyles = makeStyles((theme) => ({
        backDrop: {
            backgroundImage: `url(${BgImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
        },
        root: {
            flexGrow: 1,
            spacing: 0,
            direction: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        title: {
            flexGrow: 1,
            flexDirection: "row",
            display: "flex",
            margin: "2px",
            justifyContent: 'center',
            textAlign: 'center',
            align: "center",
        },
        titleBox: {
            flexGrow: 1,
            flexDirection: "column",
            display: "flex",
            justifyContent: 'center',
            textAlign: 'center',
            align: "center",
        },
        container: {
            flexGrow: 1,
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
        },
        footer: {
            flexGrow: 1,
            spacing: 0,
            position: "absolute",
            bottom: "0",
            textAlign: 'center',
            align: "center",
            justifyContent: 'center',
        },
        paper: {
            '@media only screen and (min-width: 600px)': {
                padding: theme.spacing(1),
            },
            textAlign: 'center',
            align: 'center',
            justifyContent: 'center',
            color: '#272936',
        },
    }));

    const classes = useStyles();


    //
    //TODO: fetch Data in higher component or redux
    //
    //const [data, setData] = useState(state);
    //TODO: Onchange handler for passing data
    // const onchange = (data) => {
    //     setData(data)
    // }
    // const state = {
    //     newestWeek: '60',
    //     weekNumber: 'week_60',
    //     jsonData: [],
    // };

    const [polygon, setPolygon] = useState(true);
    const [jsonData, setJsonData] = useState("");
    const palletType = "dark";
    const mainPrimaryColor = "#ffffff";
    const mainSecondaryColor = "#272936";
    const backgroundColor = "	#091027";
    const paperColor = "#272936";
    const theme = createTheme({
        palette: {
            type: palletType,
            primary: {
                main: mainPrimaryColor
            },
            secondary: {
                main: mainSecondaryColor
            },
            background: {
                default: backgroundColor,
                paper: paperColor
            }
        }
    });

    const handleThemeChange = () => {
        //Update cookie
        setPolygon(!polygon);
    }

    //Fetch Balancer Front-End Json containing incentives data:
    useEffect(() => {
        const url = "https://raw.githubusercontent.com/balancer-labs/frontend-v2/master/src/lib/utils/liquidityMining/MultiTokenLiquidityMining.json";

        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const json = await response.json();

                setJsonData(json);
            } catch (error) {
                console.log("error", error);
            }
        };

        fetchData();
    }, []);

    //Polygon Table
    const showPolygon = () => (
        <Grid item xs={12}>
            <Paper elevation={3} className={classes.paper}>
                <Box p={1}>
                    <PoolQuery data={jsonData} ></PoolQuery>
                </Box>
            </Paper>
        </Grid>
    );

    //ETH Mainnet table
    const showEther = () => (
        <Grid item xs={12}>
            <Paper elevation={3} className={classes.paper}>
                <Box p={1}>
                    <MainnetQuery data={jsonData} ></MainnetQuery>
                </Box>
            </Paper>
        </Grid>
    );

    //Coin-price data
    const showPriceData = () => (
        <Grid item xs={12}>
            <Paper elevation={3} className={classes.paper}>
                <Box p={1}>
                    <CoinPriceData></CoinPriceData>
                </Box>
            </Paper>
        </Grid>
    );

    return (
        <div key='Container'>
            <ThemeProvider theme={theme} >
                <CssBaseline />
                <Container className={classes.container} >
                    <Paper item xs={12} elevation={3} className={classes.backDrop} direction="column" justify="space-evenly" component="span">
                        <Box className={classes.titleBox} alignItems="center" flexDirection="column">
                            <img src={BalancerLogo} alt="Balancer Logo" width="30" />
                            <Title className={classes.title}  >{`Balancer
                                Liquidity Mining Incentives
                                `}
                            </Title>
                        </Box>
                    </Paper>
                    <Grid container direction="row" justify="left" alignItems="center">
                        <img src={PolygonLogo} alt="Polygon Logo" width="20" />
                        <Switch checked={polygon} onChange={handleThemeChange} className={classes.menuButton} color="primary"></Switch>
                        <img src={EtherLogo} alt="Ethereum Logo" width="20" />
                    </Grid>
                    <Grid container={true} spacing={2} className={classes.root} component="span" >
                    <Grid item xs={12} component="span">
                    <Paper elevation={3} className={classes.paper}>
                        <Title>Tokenomics</Title>
                        <CoinPriceData data={data} onchange={(e) => { onchange(e) }} />
                    </Paper>
                </Grid>
                        {showPriceData}
                        {polygon ? showPolygon() : showEther()}
                        <Grid item xs={12} component="span">
                            <Paper elevation={3} className={classes.paper}>
                                <Footer className={classes.footer}></Footer>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </ThemeProvider>
        </div>
    );
}