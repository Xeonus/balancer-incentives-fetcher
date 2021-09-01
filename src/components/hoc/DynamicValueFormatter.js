import React from 'react';
import CountUp, { useCountUp } from 'react-countup';

export default function DynamicValueFormatter(props) {
    return (
        <CountUp 
            className={props.name} 
            start={0} 
            end={Number(props.value).toFixed(props.decimals)} 
            duration={2} 
            decimals={props.decimals} 
            separator="'">{Number(props.value).toFixed(props.decimals)}
        </CountUp>

    );
}