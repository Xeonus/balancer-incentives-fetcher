import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Title from './../UI/Title'
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';


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



export default function RewardsInfo() {

    const classes = useStyles();

    return (
        <div>
            <Title>About Liquidity Mining on Balancer</Title>
            <Container className={classes.paper} fixed>
                <Typography component={'div'} align="left" color="primary">
                    Liquidity mining details:
                    <ul>
                        <li>You’re eligible to receive token distributions if you add liquidity to any of the eligible pools.</li>
                        <li>Liquidity mining weeks start and end at 00:00 UTC on Mondays.</li>
                        <li>BAL allocations and pool eligibility are determined weekly by the community ‘Ballers’.</li>
                    </ul>
                </Typography>
            </Container>
        </div>
    );
}