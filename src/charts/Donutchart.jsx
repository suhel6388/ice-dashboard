import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const data = [
  { name: "Abhishek Paswan", value: 400 },
  { name: "ADITYA PRAJAPATI", value: 300 },
  { name: "ANCHAL MODANWAL", value: 350 },
  { name: "ANISHA PATEL", value: 320 },
  { name: "ANJALI", value: 380 },
];

const COLORS = [
  "#E8742E",
  "#187A24",
  "#2196C9",
  "#9C2AA0",
  "#4CAB29",
];

const DonutChart = ({data_is = data, data_Key = "value", name_Key = "name"}) => {
  return (
    <div className="w-full h-[420px]  rounded-2xl p-4">
      
      <h2 className="text-center text-2xl font-semibold text-gray-700 mb-4">
        Total Fees
      </h2>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          
          <Pie
            data={data_is}
            dataKey={data_Key}
            nameKey={name_Key}
            cx="50%"
            cy="45%"
            outerRadius={100}
            innerRadius={60} // donut hole
            paddingAngle={2}
          >
            {data_is.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />

          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="square"
          />

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonutChart;
