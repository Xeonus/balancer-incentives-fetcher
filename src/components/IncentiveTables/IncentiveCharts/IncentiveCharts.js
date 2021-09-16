import React, { PureComponent } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import Title from '../../UI/Title';





export default function IncentiveCharts(props) {


  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ 
  cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = 25 + innerRadius + (outerRadius - innerRadius);
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {data[index].name} : {data[index].value}
    </text>
  );
};

const renderCustomizedLabelAlterantive = ({
  cx, cy, midAngle, innerRadius, outerRadius, value, startAngle, endAngle, index}) => {
  const RADIAN = Math.PI / 180;
  const diffAngle = endAngle - startAngle;
  const delta = ((360-diffAngle)/25)-1;
  const radius = innerRadius + (outerRadius - innerRadius);
  const x = cx + (radius+delta) * Math.cos(-midAngle * RADIAN);
  const y = cy + (radius+(delta*delta)) * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontWeight="normal">
      {data[index].name} : {data[index].value}
    </text>
  );
};

function renderCustomizedLabelLine(props){
  let { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle } = props;
  const RADIAN = Math.PI / 180;
  const diffAngle = endAngle - startAngle;
  const radius = innerRadius + (outerRadius - innerRadius);
  let path='';
  for(let i=0;i<((360-diffAngle)/25);i++){
    path += `${(cx + (radius+i) * Math.cos(-midAngle * RADIAN))},${(cy + (radius+i*i) * Math.sin(-midAngle * RADIAN))} `
  }
  return (
    <polyline points={path} stroke="white" fill="none" />
  );
}


let renderLabel = function(entry) {
  return entry.name ;
}


      const data = [
        { name: 'BAL', value: 104000 },
        { name: 'LDO', value: 25000 },
        { name: 'VITA', value: 150 },
      ];





      console.log("props", props)

      const rows = [];




    return (
      <div>
        <Title>Incentive Allocation Distribution</Title>
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            label={renderCustomizedLabel}
            //</PieChart>labelLine={renderCustomizedLabelLine}
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