import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { name: "Abhishek Paswan", value: 400 },
  { name: "ADITYA PRAJAPATI", value: 300 },
  { name: "ANCHAL MODANWAL", value: 350 },
  { name: "ANISHA PATEL", value: 320 },
  { name: "ANJALI", value: 380 },
];

const COLORS = [
 "#E8742E", // orange
  "#187A24", // dark green
  "#2196C9", // blue
  "#9C2AA0", // purple
  "#4CAB29", // green
  "#F44336", // red
  "#FFC107", // amber
  "#3F51B5", // indigo
  "#009688", // teal
  "#795548", // brown
  "#00008B",
];

const LabelPieChart = ({data_is = data, data_key = "value"  }) => {
  return (
    <div className="w-full max-w-xl mx-auto  rounded-xl p-4 sm:p-6">
      
      {/* Heading */}
      <h2 className="text-center text-2xl font-semibold text-gray-700 mb-4">
        Today fees
      </h2>

      {/* Chart */}
      <div className="w-full h-[320px] sm:h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          
          <PieChart>
            <Pie
              data={data_is}
              cx="50%"
              cy="45%"
              outerRadius={95}
              innerRadius={0}
              dataKey={data_key}
              stroke="#ffffff"
              strokeWidth={3}
            >
              {data_is.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom Legend */}
      <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-2 text-sm">
        
        {data_is.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            
            <div
              className="w-3 h-3 rounded-sm"
              style={{
                backgroundColor: COLORS[index],
              }}
            ></div>

            <span className="text-gray-600">
              {item.s_name}
            </span>
          </div>
        ))}

      </div>
    </div>
  );
};

export default LabelPieChart;