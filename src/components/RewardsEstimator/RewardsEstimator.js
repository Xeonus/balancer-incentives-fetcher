import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Title from './../UI/Title';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';


//Styling config:
const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    heading: {
        fontSize: theme.typography.pxToRem(20),
        fontWeight: theme.typography.fontWeightRegular,
    },
    table: {
        alignItems: "center",

    },
    paper: {
        marginTop: theme.spacing(3),
        overflowX: "auto",
        marginBottom: theme.spacing(2),
        margin: "auto"
    },
    alignItemsAndJustifyContent: {
        direction: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputField: {
        '@media only screen and (min-width: 800px)': {
            width: '75%'
        },
    },
    button: {
        background: 'linear-gradient(15deg, #384aff 10%, #f21bf6 95%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(56,74,255, .5)',
        color: 'white',
        height: 40,
        padding: '0 30px',
      },
}));

export function RewardsEstimator(props) {

    const classes = useStyles();
    //Create data helper function:
    function createData(tokenName, amount, velocity, weeklyEstimate) {
        return { tokenName, amount, velocity, weeklyEstimate };
    }

    //-------Refactor into HOC / REDUX--------

    //Token and Balancer infos:
    const maticTokenIDs = [
        {
            token_address: '0x580a84c73811e1839f75d86d75d88cca0c241ff4',
            token_name: 'QI',
        },
        {
            token_address: '0xF501dd45a1198C2E1b5aEF5314A68B9006D842E0',
            token_name: 'MTA',
        },
        {
            token_address: '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3',
            token_name: 'BAL',
        },
        {
            token_address: '0xba100000625a3754423978a60c9317c58a424e3d',
            token_name: 'BAL',
        },
        {
            token_address: '0x040d1edc9569d4bab2d15287dc5a4f10f56a56b8',
            token_name: 'BAL',
        },
        {
            token_address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
            token_name: 'MATIC',
        }
    ]

    //ChainId ETH is default:
    let chainId = 1;
    if (props.chainId === 'polygon') {
        chainId = 137;
    } else if (props.chainId === 'arbitrum') {
        chainId = 42161;
    };

    const baseUrl = "https://api.balancer.finance/liquidity-mining/v1/liquidity-provider-multitoken";

    //Number formatting
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    }

    const mapRewardsData = (jsonData) => {
        let rewardsData = []
        const data = jsonData["result"]["liquidity-providers"];
        data.forEach(({ chain_id, current_estimate, token_address, velocity }) => {
            maticTokenIDs.forEach(element => {
                if (chain_id === chainId) {
                    if (token_address === element.token_address) {
                        if (Number(velocity) !== 0) {
                            rewardsData.push(
                                createData(
                                    element.token_name,
                                    numberWithCommas(Number(current_estimate).toFixed(2)),
                                    Number(velocity).toFixed(8),
                                    Number(velocity * 604800).toFixed(2)
                                ));
                        }
                    }
                }
            }
            );

        });
        return rewardsData;
    }

    const [json, setJson] = useState('');
    const [values, setValues] = useState({
        address: '',
        timeStamp: '',
    });

    //Form Change Handler
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    //Fetch per address rewards from Balancer API
    const handleClick = async () => {
        if (values.address !== '') {
            try {
                const response = await fetch(baseUrl.concat('/', values.address));
                const json = await response.json();
                setJson(json);
                //Convert timestamp for user display
                if (json["success"]) {
                    if (Array.isArray(json["result"]["liquidity-providers"]) && json["result"]["liquidity-providers"].length) {
                        var timestamp = Date.parse(json["result"]["liquidity-providers"][0].snapshot_timestamp);
                        var t = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        setValues(
                            {
                                ...values,
                                'timeStamp': t,
                            }
                        )
                    }
                };
            } catch (error) {
                console.log("error", error);
                handleClick();
            }
        }
    }

    //Rewards fetcher
    const noResults = (input) => (
        input["error"] ?
            <Grid item xs={12}>
                <Box p={1}>
                    <Typography noWrap={false} variant="body1" color="textSecondary" component="span"><b>{input["error"]}</b></Typography>
                </Box>
            </Grid>
            : ''
    );

        //Title Switch
        function titleSwitch(param) {
            switch (param) {
                case 'polygon':
                    return <Title>Liquidity Mining Estimates for Polygon</Title>
                case 'arbitrum':
                    return <Title>Liquidity Mining Estimates for Arbitrum</Title>
                default:
                    return <Title>Liquidity Mining Estimates for ETH Mainnet</Title>
            }
        };

    const resultsFound = () => (
        mapRewardsData(json, maticTokenIDs).length === 0 ?
            <Grid item xs={12}>
                <Box p={1}>
                    <Typography noWrap={false} variant="body1" color="textSecondary" component="span"><b>No estimates for this chain found!</b></Typography>
                </Box>
            </Grid>
            :
            <Grid justifyContent="center">
                <Paper className={classes.paper} elevation={3}>
                    <Table className={classes.table} size="small" aria-label="a dense table" >
                        <caption>Estimates of currently running liquidity mining week fetched through Balancer API. Last calculation: {values['timeStamp']}</caption>
                        <TableHead >
                            <TableRow >
                                <TableCell><b>Token</b></TableCell>
                                <TableCell align="right"><b>Estimated Accrued Reward</b></TableCell>
                                <TableCell align="right"><b>Velocity (tokens/s)</b></TableCell>
                                <TableCell align="right"><b>Estimated Weekly Reward</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mapRewardsData(json, maticTokenIDs).map((row) => (
                                <TableRow key={row.tokenName} >
                                    <TableCell align="left">{row.tokenName}</TableCell>
                                    <TableCell align="right">{row.amount}</TableCell>
                                    <TableCell align="right">{row.velocity}</TableCell>
                                    <TableCell align="right">{row.weeklyEstimate}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Grid>
    );

    return (
        <div>
            {titleSwitch(props.chainId)}
            <Container fixed justifyContent="center" alignItems="center">
                <Box className={classes.alignItemsAndJustifyContent}>
                    <TextField
                        id="outlined-basic"
                        label="Search Address"
                        variant="outlined"
                        placeholder="0x..."
                        helperText="Input an address that is providing liquidity on Balancer to estimate rewards"
                        value={values.address}
                        size="small"
                        fullWidth
                        margin="normal"
                        onChange={handleChange('address')}
                    />
                    <Button className={classes.button} variant="outlined" onClick={handleClick}>Request Estimate</Button>
                </Box>
                {json["success"] ?
                    resultsFound()
                    : noResults(json)}
            </Container>
        </div>
    );

}
