import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './../UI/Title'
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
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



export default function GaugeInfo() {

    const classes = useStyles();

    return (
        <div>
            <Title>Mainnet Incentives: veBAL and Gauges Update</Title>
            <Container className={classes.paper} fixed>
                <Typography component={'div'} align="left" color="primary">
                    Liquidity mining incentives on mainnet have changed in the following way:
                    <ul>
                        <li>Balancer has shifted to a Curve-style gauge voting system</li>
                        <li>You are eligible to vote by holding veBAL. Read more about our tokenomics revamp <Link underline="always" target="_blank" href={"https://balancer-dao.gitbook.io/learn-about-balancer/fundamentals/vebal-tokenomics"}>{"here"}</Link></li>
                        <li>veBAL holders can now vote where BAL incentives should be directed for mainnet from the following <Link underline="always" target="_blank" href={"https://app.balancer.fi/#/vebal"}>{"pool whitelist"}</Link></li>
                        <li>10% of BAL allocations (14500 BAL) and pool eligibility are still determined weekly by the community ‘Ballers’.</li>
                        <li>Polygon and Arbitrum incentives will migrate at a later point in time</li>
                    </ul>
                </Typography>
            </Container>
        </div>
    );
}