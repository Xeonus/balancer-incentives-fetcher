import React, { PureComponent } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import Title from '../components/UI/Title';
import { getFormattedNumber } from '../utils/getFormattedNumber';
import DynamicValueFormatter from '../components/hoc/DynamicValueFormatter';

export default function PoolIncentiveChart(props) {
  const COLORS = ['#003f5c','#58508d','#bc5090','#ff6361','#003f5c','#58508d','#bc5090','#ff6361'  ];


  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = 22 + innerRadius + (outerRadius - innerRadius);
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {data[index].name} : {data[index].formattedValue} ({Number(percent * 100).toFixed(0)}%)
      </text>
    );
  };


  let renderLabel = function (entry) {
    return entry.name;
  }

  //Create data (assuming only one co-incentive for now)
  const data = [];
 
  const balEntry = { 
      name: 'BAL', 
      value: props.bal, 
      formattedValue: '$' + getFormattedNumber(Number(props.bal).toFixed(0))};
  data.push(balEntry);
  
  if (props.coIncentive.length >= 1) {
  props.coIncentive.forEach((incentive) => {
  const incentiveEntry = { 
      name: incentive['text'], 
      value: incentive['valueInUsd'], 
      formattedValue: '$' + getFormattedNumber(Number(incentive['valueInUsd']).toFixed(0))};
  data.push(incentiveEntry);
  });
} else {
  const incentiveEntry = { 
    name: props.coIncentive['text'], 
    value: props.coIncentive['valueInUsd'], 
    formattedValue: '$' + getFormattedNumber(Number(props.coIncentive['valueInUsd']).toFixed(0))};
data.push(incentiveEntry);
}

//Total worth
let incentiveValue = 0;
data.forEach((el) => {
  incentiveValue += el.value;
});


  return (
    <div>
      <Title>
      {`Weekly Pool Incentive Allocation `}
      {` 
        `}
          ~$<DynamicValueFormatter value={Number(incentiveValue).toFixed(0)} name={'totalValue'} decimals={0}/>
          </Title>
      <PieChart width={550} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          label={renderCustomizedLabel}
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
}