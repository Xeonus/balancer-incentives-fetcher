import React, { useEffect, useState } from 'react';
import Header from '../UI/Header';
import Container from "@material-ui/core/Container";
import { Box } from '@material-ui/core';
import BgImage from './../resources/bg-header.svg';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';
import { PolygonQuery } from '../hoc/PolygonQuery';
import { MainnetQuery } from '../hoc/MainnetQuery';
import { ArbitrumTable } from '../IncentiveTables/ArbitrumTable';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Footer from '../UI/Footer'
import BalancerLogo from './../resources/logo-dark.svg';
import EtherLogo from './../resources/ethereum.svg';
import PolygonLogo from './../resources/polygon.svg';
import ArbitrumLogo from './../resources/arbitrum.svg';
import CoinPriceData from '../CoinPriceData/CoinPriceData';
import { RewardsEstimator } from '../RewardsEstimator/RewardsEstimator';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ReactRoundedImage from "react-rounded-image";
import PropTypes from 'prop-types';
import Roadmap from '../UI/Roadmap';
import IncentiveCharts from './../IncentiveTables/IncentiveCharts/IncentiveCharts';
import ClaimInfo from '../Rewards/ClaimInfo';
import RewardsInfo from '../Rewards/RewardsInfo';
import AddTokenToMetaMask from '../UI/AddTokenToMetaMask';



function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div component="span"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box>
                    <Typography key={index} component="span">{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}



export default function Dashboard(props) {



    //Default initialization. In the future replace with REDUX?
    const state = {
        coinData: [],
        chainId: 'ethereum'

    };

    //Tab states
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [data, setData] = useState(state);
    const [loading, setLoading] = useState(false);
    const [polygon, setPolygon] = useState(true);
    const [jsonData, setJsonData] = useState("");
    let isMMInstalled = false;
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
        isMMInstalled = true;
    }

    //Theme properties
    const palletType = "dark";
    const mainPrimaryColor = "#ffffff";
    const mainSecondaryColor = "#272936";
    const backgroundColor = "	#091027";
    const paperColor = "#162031";
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
            },

        },
        active_tabStyle: {
            fontSize: 11,
            color: 'white',
            backgroundColor: 'red',
        },
        typography: {
            // Use the system font instead of the default Roboto font.
            fontFamily: [

                'Inter-Variable',
                '-apple-system',
                'BlinkMacSystemFont',
                'Segoe UI',
                'Helvetica',
                'Arial',
                'sans-serif',
                'Apple Color Emoji',
                'Segoe UI Emoji',

            ].join(','),
        },
    });

    //Theme properties
    const useStyles = makeStyles((theme) => ({
        backDrop: {
            backgroundImage: `url(${BgImage})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            flexDirection: "column",
        },
        root: {
            flexGrow: 1,
            spacing: 0,
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
            alignItems: "center",
        },
        container: {
            flexGrow: 1,
            paddingTop: theme.spacing(2),
            paddingBottom: theme.spacing(2),
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            spacing: 2,
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
            minWidth: 'auto',
            textAlign: 'center',
            align: 'center',
            justifyContent: 'center',
            color: '#272936',
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 'auto',
        },
        tabTheme: {
            background: 'linear-gradient(20deg, #1022d7 25%, #6a7cff 95%)',
            maxWidth: 500,
            align: 'center',
            justifyContent: 'center',
            borderRadius: 3
        },
        rightToolbar: {
            marginLeft: "auto",
            marginRight: -12
        },
        toolBar: {
            //minHeight: 128,
        },
    }));

    const classes = useStyles();


    //
    //TODO: fetch Data in higher component or redux
    //
    //const [data, setData] = useState(state);
    //TODO: Onchange handler for passing data
    const onchange = (data) => {
        setData(data)
    }

    
    const handleFormChange = (event) => {
        const name = event.target.name;
        setData({
            ...state,
            [name]: event.target.value,
            coinData: data.coinData,
        });
    };

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
    }, [setLoading]);

    //Polygon Table
    const showPolygon = () => (
        <Grid item xs={12}>
            <Paper elevation={3} className={classes.paper}>
                <Box p={1}>
                    <PolygonQuery data={jsonData} coinData={data} ></PolygonQuery>
                </Box>
            </Paper>
        </Grid>
    );

    //ETH Mainnet table
    const showEther = () => (
        <Grid item xs={12}>
            <Paper elevation={3} className={classes.paper}>
                <Box p={1}>
                    <MainnetQuery data={jsonData} coinData={data}></MainnetQuery>
                </Box>
            </Paper>
        </Grid>
    );

    //Arbitrum table
    const showArbitrum = () => (
        <Grid item xs={12}>
            <Paper elevation={3} className={classes.paper}>
                <Box p={1}>
                    <ArbitrumTable data={jsonData} coinData={data}></ArbitrumTable>
                </Box>
            </Paper>
        </Grid>
    );

    //Render Switch for Dropdown Menu
    function renderSwitch(param) {
        switch (param) {
            case 'polygon':
                return showPolygon();
            case 'arbitrum':
                return showArbitrum();
            default:
                return showEther();
        }
    };

    function headerSwitch(context) {
        switch (context) {
            case 0:
                return (
                    <Header className={classes.title}  >{
                        `
                        Liquidity Mining Incentives
                        `}
                    </Header>
                );
            case 1:
                return (
                    <Header className={classes.title}  >{
                        `
                            Rewards Estimation
                            `}
                    </Header>
                )
            case 2:
                return (
                    <Header className={classes.title}  >{
                        `
                            Development Roadmap
                            `}
                    </Header>
                )
        }
    };

    //Rewards fetcher
    const showRewardsEstimator = (chain, coinData) => (
        <Grid item xs={12}>
            <Paper elevation={3} className={classes.paper}>
                <Box p={1}>
                    <RewardsEstimator chainId={chain} coinData={coinData} onchange={(e) => { onchange(e) }}></RewardsEstimator>
                </Box>
            </Paper>
        </Grid>
    );

    //Information about where to claim tokens
    const showClaimingInfo = (chain) => (
        <Grid item xs={12}>
            <Paper elevation={3} className={classes.paper}>
                <Box p={1}>
                    <ClaimInfo chainId={chain}></ClaimInfo>
                </Box>
            </Paper>
        </Grid>
    );

    //Information about liquidity mining
    const showLMInfo = () => (
        <Grid item xs={12}>
            <Paper elevation={3} className={classes.paper}>
                <Box p={1}>
                    <RewardsInfo></RewardsInfo>
                </Box>
            </Paper>
        </Grid>
    );

    //State checks until incentive Json is loaded
    if (loading) {
        return (
            <div>
                <Grid>
                    <CircularProgress></CircularProgress>
                    {/* <Typography noWrap={false} variant="caption" color="textSecondary" component="span">Loading Subgraph...</Typography> */}
                </Grid>
            </div>);
    }
    if (data == null) {
        return (<Typography key="error" noWrap={false} variant="caption" color="textSecondary" component="span">Error while fetching Balancer Incentive data :(</Typography>)
    }

    return (
        <div key='Container'>
            <ThemeProvider theme={theme} >
                <AppBar position="static" color="secondary" style={{ margin: -0 }} >
                    <Toolbar className={classes.toolBar}>
                        <Box display="flex" alignItems="center" sx={{ mr: 2 }} edge="start">
                            <Box p={1}>
                                <img src={BalancerLogo} alt="Balancer Logo" width="30" />
                            </Box>
                            <Box mr={2}>
                                <Typography variant="h6" className={classes.root} key="appTitle">
                                    Balancer Tools
                                </Typography>
                            </Box>
                            <FormControl variant="outlined" size="small" className={classes.formControl}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="chainSelect"
                                    value={data.chainId}
                                    onChange={handleFormChange}
                                    inputProps={{
                                        name: 'chainId',
                                        id: 'chainId-native-simple',
                                    }}
                                >
                                    <MenuItem value={'ethereum'} key="eth">
                                        <Box display="flex" alignItems="center">
                                            <Box mr={0.5}>
                                                <ReactRoundedImage
                                                    image={EtherLogo}
                                                    imageWidth="20"
                                                    imageHeight="20"
                                                    roundedSize="0"
                                                />
                                            </Box>
                                            <Box>
                                                Ethereum
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value={'polygon'} key="poly">
                                        <Box display="flex" alignItems="center">
                                            <Box mr={0.5}>
                                                <ReactRoundedImage
                                                    image={PolygonLogo}
                                                    imageWidth="20"
                                                    imageHeight="20"
                                                    roundedSize="0"
                                                />
                                            </Box>
                                            <Box>
                                                Polygon
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                    <MenuItem value={'arbitrum'} key="arb">
                                        <Box display="flex" alignItems="center">
                                            <Box mr={0.5}>
                                                <ReactRoundedImage
                                                    image={ArbitrumLogo}
                                                    imageWidth="20"
                                                    imageHeight="20"
                                                    roundedSize="0"
                                                />
                                            </Box>
                                            <Box>
                                                Arbitrum
                                            </Box>
                                        </Box>
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <section className={classes.rightToolbar}>
                            {isMMInstalled ? <AddTokenToMetaMask chainId={data.chainId} /> : null}
                        </section>
                    </Toolbar>
                    <Box className={classes.backDrop}>
                        <Box mx="auto" align="center">
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                centered
                                className={classes.tabTheme}
                            >
                                <Tab label="Incentives" {...a11yProps(0)} />
                                <Tab label="Rewards" {...a11yProps(1)} />
                                <Tab label="Roadmap" {...a11yProps(2)} />
                            </Tabs>

                            <Box className={classes.titleBox}>
                                {headerSwitch(value)}
                            </Box>
                        </Box>
                    </Box>
                </AppBar>
                <CssBaseline />
                <Container className={classes.container}  >
                    <TabPanel value={value} index={0}>
                        <Grid container className={classes.root} spacing={2} component="span" >

                            <Grid item xs={12}>
                                <Paper elevation={3} className={classes.paper}>
                                    <Box>
                                        <CoinPriceData  data={data} onchange={(e) => { onchange(e) }} />
                                    </Box>
                                </Paper>
                            </Grid>
                            {renderSwitch(data.chainId)}

                            <Grid item xs={12} component="span">
                                <Paper elevation={3} className={classes.paper}>
                                    <Footer className={classes.footer}></Footer>
                                </Paper>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={1}>
                        <Grid container className={classes.root} spacing={2} component="span" >
                            {showRewardsEstimator(data.chainId, data.coinData)}
                            {showClaimingInfo(data.chainId)}
                            {showLMInfo()}
                            <Grid item xs={12} component="span">
                                <Paper elevation={3} className={classes.paper}>
                                    <Footer className={classes.footer}></Footer>
                                </Paper>
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Roadmap></Roadmap>
                    </TabPanel>
                </Container>
            </ThemeProvider>
        </div>
    );
}