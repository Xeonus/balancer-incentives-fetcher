import './App.css';
import React  from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { RetryLink } from 'apollo-link-retry';
import { HttpLink } from '@apollo/client';
import { Box } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from "@material-ui/core/Container";
import Title from './components/UI/Title';
import Header from './components/UI/Header';
import BalLogo from './components/resources/logo-dark.svg'
import Button from '@material-ui/core/Button';
//Init firebase statistics:
//import firebase from './config/firebase';


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

const useStyles = makeStyles((theme) => ({
    title: {
        flexGrow: 1,
        flexDirection: "row",
        display: "flex",
        margin: "1px",
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
        paddingTop: theme.spacing(15),
        direction: "column",
        justifyContent: "center",
        alignItems: "center",
        spacing: 2,
    },
    alignItemsAndJustifyContent: {
        direction: 'column',
        alignItems: 'center',
        justifyContent: 'center',

    },
    button: {
        color: "#fff",
        height: "48px",
        minWidth: "200px",
        borderRadius: "8px",
        textDecoration: "none",
        fontWeight: "600",
        backgroundSize: "200% 100%",
        transition: "all .2s ease-out",
        background: "linear-gradient(90deg,#00f,#f0f,#00f)",
        '&:hover': {
            backgroundPosition: "100% 0",
            boxShadow: "0 4px 15px 0 rgb(255 100 50 / 0%)",
            transition: "all .2s ease-out",
        },
        boxShadow: "0 4px 15px 0 rgb(224 100 61 / 8%)",
        margin: "0",
        border: 0,
    },
    paper: {
        minWidth: '320px',
        textAlign: 'center',
        align: 'center',
        color: '#272936',
        boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.35), 20px 20px 80px #FED533, -20px -20px 80px #EC4899",
        '&:hover': {
            backgroundPosition: "100% 0",
            boxShadow: "0px 0px 16px rgba(0, 0, 0, 0.35), 30px 30px 100px #FED533, -30px -30px 100px #EC4899",
            opacity: "1",
            transition: "all .2s ease-out",
        },
        borderRadius: "22px",
    },
    header: {
        justifyContent: 'center',
        //minHeight: "80px",
        display: "flex",
        alignItems: "center",
        align: "left",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
    }
}));




//Set up directional links
const directionalLink =
  new RetryLink().split(
  (operation) => operation.getContext().clientName === 'mainnet',
  new HttpLink({ uri: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-v2" }),
  new HttpLink({ uri: "https://api.thegraph.com/subgraphs/name/balancer-labs/balancer-polygon-v2" }),
  );

//Instantiate Apollo client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: directionalLink,
});

  export default function App() {
    const classes = useStyles();

    return (
      <div key='dashboard'>
        <ApolloProvider client={client}>
        <div className="CaptchaSolver">

            <ThemeProvider theme={theme} >
                <CssBaseline />
                <Container className={classes.container}>
                    <Grid
                        container
                        display="flex"
                        direction="column"
                        alignItems="center"
                    >
                        <Grid item  >
                            <Paper elevation={3} className={classes.paper}>
                                <Box className={classes.header} align="left">
                                    <Header  >
                                        <img src={BalLogo} alt="Balancer Logo" height="30" />
                                    </Header>  
                                </Box>
                                <Box align="left" m={2}>
                                    <Title align="left">This site is deprecated</Title>
                                </Box>
                                <Box p={4}>
                    {/*<MainnetQuery data={jsonData} coinData={data}></MainnetQuery>*/}
                    <Button href="https://balancer.tools" variant="contained" color="primary" className={classes.button}>
                       Go to Balancer.tools v2
                    </Button>
                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </ThemeProvider>

        </div>
        </ApolloProvider>
      
      </div>
    );
  }