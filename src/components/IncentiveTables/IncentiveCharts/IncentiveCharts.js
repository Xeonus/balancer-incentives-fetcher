import React, { PureComponent } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import { Typography } from '@material-ui/core';
import Title from '../../UI/Title';
import { getFormattedNumber } from '../../../utils/getFormattedNumber';

export default function IncentiveCharts(props) {
  const COLORS = ['#003f5c','#58508d','#bc5090','#ff6361' ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = 22 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      percent * 100 > 2 ?
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {data[index].name} : {data[index].formattedValue}  ({Number(percent * 100).toFixed(0)}%)
      </text>
      : ""
    );
  };


  let renderLabel = function (entry) {
    return entry.name;
  }


  //Init data object
  const data = [];

  //Create BAL and coIncentives array
  const coIncentives = [];
  let balAmount = 0;
  props.rows.forEach(element => {
    if (element.coIncentives) {
      const entry = { name: element.coIncentives['text'], value: Number(element.coIncentives['valueInUsd']), formattedValue: Number(element.coIncentives['valueInUsd']) };
      coIncentives.push(entry);
    }
    //BAL
    balAmount += element.bal;
  });

  data.push({ name: "BAL", value: Number(balAmount * props.balPrice), formattedValue: '$' + getFormattedNumber(Number(balAmount * props.balPrice).toFixed(0))});


  //Create data entry:
  coIncentives.forEach(element => {
    const index = data.findIndex((el) => el['name'] === element['name']);
    if (index !== -1) {
      data[index] = {
        name: element['name'],
        value: Number(data[index]['value'] + element['value']),
        formattedValue: '$' + getFormattedNumber(Number(data[index]['value'] + element['value']).toFixed(0))  ,
      }
    } else {
      const entry = { 
        name: element['name'], 
        value: Number(element['value']), 
        formattedValue: '$' + getFormattedNumber(Number(element['value']).toFixed(0)),
      
      };
      data.push(entry);
    }
  });

  console.log("data", data);

  return (
    <div>
      <Title>Incentive Allocation Distribution</Title>
      <PieChart width={600} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          label={renderCustomizedLabel}
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
      <Typography variant="caption" display="block" gutterBottom>Note: Incentives making up less than 1% of the total allocation are not shown</Typography>
    </div>
  );
}