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
import Tooltip from '@material-ui/core/Tooltip';
import DynamicValueFormatter from './../hoc/DynamicValueFormatter';
import { getNextDayAndTime } from './../../utils/getNextDayAndTime'
import { getPrice } from './../../utils/getPrice'


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
        '&:hover': {
            background: 'linear-gradient(20deg, #384aff 10%, #f21bf6 60%)',
          },
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(56,74,255, .5)',
        color: 'white',
        height: 40,
        padding: '0 10px',
      },
      tooltip: {
        maxWidth: "800",
        fontSize: "1em",
        textAlign: "center",
        whiteSpace: 'normal',
    },
}));

export function RewardsEstimator(props) {

    const classes = useStyles();
    //Create data helper function:
    function createData(tokenName, amount, velocity, weeklyEstimate, weeklyWorth) {
        return { tokenName, amount, velocity, weeklyEstimate, weeklyWorth };
    }

    //-------Refactor into HOC / REDUX--------

    //Token and Balancer infos:
    const tokenIDs = [
        {
            token_address: '0x580a84c73811e1839f75d86d75d88cca0c241ff4',
            token_name: 'QI',
            coingecko_id: 'qi-dao',
        },
        {
            token_address: '0xF501dd45a1198C2E1b5aEF5314A68B9006D842E0',
            token_name: 'MTA',
            coingecko_id: 'meta',
        },
        {
            token_address: '0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3',
            token_name: 'BAL',
            coingecko_id: 'balancer',
        },
        {
            token_address: '0xba100000625a3754423978a60c9317c58a424e3d',
            token_name: 'BAL',
            coingecko_id: 'balancer',
        },
        {
            token_address: '0x040d1edc9569d4bab2d15287dc5a4f10f56a56b8',
            token_name: 'BAL',
            coingecko_id: 'balancer',
        },
        {
            token_address: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
            token_name: 'MATIC',
            coingecko_id: 'polygon',
        },
        {
            token_address: '0x81f8f0bb1cb2a06649e51913a151f0e7ef6fa321',
            token_name: 'VITA',
            coingecko_id: 'vitadao',
        },
        {
            token_address: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
            token_name: 'LDO',
            coingecko_id: 'lido-dao',
        },
        {
            token_address: '0x4e352cf164e64adcbad318c3a1e222e9eba4ce42',
            token_name: 'MCB',
            coingecko_id: 'mcdex',
        },
        {
            token_address: '0x965772e0e9c84b6f359c8597c891108dcf1c5b1a',
            token_name: 'PICKLE',
            coingecko_id: 'pickle-finance',
        },
        {
            token_address: '0xdf7837de1f2fa4631d716cf2502f8b230f1dcc32',
            token_name: 'TEL',
            coingecko_id: 'telcoin',
        },
        {
            token_address: '0xA72159FC390f0E3C6D415e658264c7c4051E9b87',
            token_name: 'TCR',
            coingecko_id: 'tracer-dao',
        },
        {
            token_address: '0x226f7b842e0f0120b7e194d05432b3fd14773a9d',
            token_name: 'UNN',
            coingecko_id: 'union-protocol-governance-token',
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

    const estRewardsTooltip = 'The estimated weekly reward is calculated based on the Estimated Accrued Reward + the estimated reward until next Monday 00:00 UTC based on current token velocity'


    //Create rewards table data
    const mapRewardsData = (jsonData) => {
        let rewardsData = []
        const data = jsonData["result"]["liquidity-providers"];
        data.forEach(({ chain_id, current_estimate, token_address, velocity }) => {
            tokenIDs.forEach(element => {
                if (chain_id === chainId) {
                    if (token_address === element.token_address) {
                        if (Number(velocity) !== 0) {
                            const now = new Date().getTime()
                            var estWeekly =  velocity * (getNextDayAndTime(1, '00', '00') - now)/1000
                            var estTotalWeekly = Number(current_estimate) + Number(estWeekly);
                            var estReward = estTotalWeekly * getPrice(props, element.coingecko_id);
                            rewardsData.push(
                                createData(
                                    element.token_name,
                                    <DynamicValueFormatter value={Number(current_estimate).toFixed(2)} name={'current_estimate'} decimals={2}/>,
                                    <DynamicValueFormatter value={Number(velocity * 3600).toFixed(8)} name={'velocity'} decimals={8}/>,
                                    <DynamicValueFormatter value={estTotalWeekly} name={'weeklyEstimate'} decimals={3}/>,
                                    <DynamicValueFormatter value={estReward} name={'weeklyReward'} decimals={2}/>
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
        mapRewardsData(json, tokenIDs).length === 0 ?
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
                                <TableCell align="right"><b>Estimated rewards earned for week {props.weekNr}</b></TableCell>
                                <TableCell align="right"><b>Velocity (tokens/h)</b></TableCell>
                                <TableCell align="right"><Tooltip classes={{ tooltip: classes.tooltip }} title={estRewardsTooltip}><b>Estimated Weekly Reward</b></Tooltip></TableCell>
                                <TableCell align="right"><b>Value ($)</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mapRewardsData(json, tokenIDs).map((row) => (
                                <TableRow key={row.tokenName} >
                                    <TableCell align="left">{row.tokenName}</TableCell>
                                    <TableCell align="right">{row.amount}</TableCell>
                                    <TableCell align="right">{row.velocity}</TableCell>
                                    <TableCell align="right">{row.weeklyEstimate}</TableCell>
                                    <TableCell align="right">{row.weeklyWorth}</TableCell>
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
            <Container fixed alignItems="center">
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
