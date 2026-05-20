import React, { useState } from 'react';
import { Tooltip, PieChart, Pie, Cell, Sector } from 'recharts';

const COLORS = [
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#FACC15", // Yellow
  "#10B981", // Green
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#06B6D4", // Cyan
];
const data = [
  { st_name: 'Suhel', amount: 500 },
  { st_name: 'Mizan Khan', amount: 1000 },
  { st_name: 'Shubham Singh', amount: 2000 },
  { st_name: 'Aman', amount: 1200 },
  { st_name: 'Rahul', amount: 800 },
  { st_name: 'Zaid', amount: 1500 },
  { st_name: 'Imran', amount: 950 },
];


const CustomTooltipBar = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1a1a2e",
        border: "1px solid #FFA500",
        borderRadius: 8,
        padding: "8px 14px",
        fontSize: 13,
        color: "#fff",
      }}>
        <p style={{ margin: 0, fontWeight: 600, color: "#FFA500" }}>{label}</p>
        <p style={{ margin: "4px 0 0", color: "#fff" }}>Deposit: <strong>{payload[0].value.toLocaleString()}</strong></p>
      </div>
    );
  }
  return null;
};

const Piechart = ({
  width = 400,
  height = 400,
  cx = '50%',
  cy = '50%',
  outerRadius = 110,
  innerRadius = 40,
  data_is = data,
  data_key = "amount",
  name_key = "st_name"
}) => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <PieChart width={width} height={height}>
      <Pie
        data={data_is}
        cx={cx}
        cy={cy}
        outerRadius={outerRadius}
        innerRadius={innerRadius}
        dataKey={data_key}
        nameKey={name_key}
        stroke="none"
        label
        activeIndex={activeIndex}
        activeShape={({ outerRadius = 0, ...props }) => (
          <Sector {...props} outerRadius={outerRadius + 8} />
        )}
        onMouseEnter={(_, index) => setActiveIndex(index)}
        onMouseLeave={() => setActiveIndex(null)}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default Piechart;