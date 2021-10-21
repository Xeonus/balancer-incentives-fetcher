import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './../UI/Title'
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Link from '@material-ui/core/Link';


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(20),
        fontWeight: theme.typography.fontWeightRegular,
    },
    paper: {
        marginTop: theme.spacing(3),
        overflowX: "auto",
        marginBottom: theme.spacing(2),
        margin: "auto"
    },
}));

//Create data helper function:
function createData(tokenName, chain, claimLocation) {
    return { tokenName, chain, claimLocation };
}

const claimingInfo = [
    {
        tokenName: "BAL",
        chain: "ETH Mainnet",
        chainId: "ethereum",
        claimLocation: "https://claim.balancer.fi",

    },
    {
        tokenName: "LDO",
        chain: "ETH Mainnet",
        chainId: "ethereum",
        claimLocation: "https://claim-lido.balancer.fi"
    },
    {
        tokenName: "VITA",
        chain: "ETH Mainnet",
        chainId: "ethereum",
        claimLocation: "https://claim-vita.balancer.fi"
    },
    {
        tokenName: "BAL",
        chain: "Polygon",
        chainId: "polygon",
        claimLocation: "Airdrop around Tue-Wed"
    },
    {
        tokenName: "QI",
        chain: "Polygon",
        chainId: "polygon",
        claimLocation: "Airdrop around Wed-Thu"
    },
    {
        tokenName: "MTA",
        chain: "Polygon",
        chainId: "polygon",
        claimLocation: "Airdrop around Wed"
    },
    {
        tokenName: "TEL",
        chain: "Polygon",
        chainId: "polygon",
        claimLocation: "Airdrop around Wed"
    },
    {
        tokenName: "BAL",
        chain: "Aribitrum",
        chainId: "arbitrum",
        claimLocation: "https://claim-arbitrum.balancer.fi"
    },
    {
        tokenName: "MCB",
        chain: "Aribitrum",
        chainId: "arbitrum",
        claimLocation: "https://claim-mcdex.balancer.fi"
    }
];

//Title Switch
function titleSwitch(param) {
    switch (param) {
        case 'polygon':
            return <Title>How to Claim Rewards on Polygon?</Title>
        case 'arbitrum':
            return <Title>How to Claim Rewards on Arbitrum?</Title>
        default:
            return <Title>How to Claim Rewards on ETH Mainnet?</Title>
    }
};


export default function ClaimInfo(props) {
    const classes = useStyles();

    const rows = [];
    //Create table data:
    claimingInfo.forEach(element => {
        if (element.chainId === props.chainId) {
            rows.push(
                createData(
                    element.tokenName,
                    element.chain,
                    element.claimLocation
                )
            )
        }
    });

    return (
        <div>
            {titleSwitch(props.chainId)}
            <Container className={classes.paper} fixed>
                <Typography component={'div'} color="primary" align="left" key="rewardsExplanation">
                    On Balancer, rewards are distributed through different mechanics, depending on which chain you provide liquidity.
                    Below you find an overview of the different claiming locations (depending on the chain you chose):
                    <br></br>
                    <br></br>
                </Typography>
                <Paper elevation={3}>
                    <Table className={classes.table} size="small" aria-label="a dense table" >
                        <TableHead >
                            <TableRow >
                                <TableCell><b>Token</b></TableCell>
                                <TableCell align="right"><b>Chain/Network</b></TableCell>
                                <TableCell align="right"><b>Location</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.tokenName} >
                                    <TableCell align="left">{row.tokenName}</TableCell>
                                    <TableCell align="right">{row.chain}</TableCell>
                                    {props.chainId === 'ethereum' || props.chainId === 'arbitrum' ? 
                                    <TableCell align="right"><Link href={row.claimLocation}>{row.claimLocation}</Link></TableCell> 
                                    : 
                                    <TableCell align="right">{row.claimLocation}</TableCell> 
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Container>
        </div>
    );
}