"use client";

import { Chart } from "react-google-charts";
import { useTheme } from "next-themes";

const data = [
  ["From", "To", "Weight"],
  ["Community Web App", "Approved Access", 12],
  ["Community Mobile App", "Approved Access", 5],
  ["Researcher API", "Approved Access", 7],
  ["Approved Access", "Healthcare Data", 15],
  ["Approved Access", "Finance Data", 5],
  ["Approved Access", "Tech Data", 4],
];

export function SankeyChartPlaceholder() {
    const { theme } = useTheme();
    
    const options = {
        sankey: {
            node: {
                colors: ["#a6c1ee", "#f7b7a3", "#a6c1ee", "#e6a1c4", "#c1a6ee"],
                label: { 
                    color: theme === 'dark' ? '#FFFFFF' : '#000000',
                    fontName: 'inherit',
                    fontSize: 14,
                },
            },
            link: {
                colorMode: "gradient",
                colors: ["#a6c1ee", "#f7b7a3", "#a6c1ee", "#e6a1c4", "#c1a6ee"],
            },
        },
        backgroundColor: 'transparent'
    };

    return (
        <Chart
            chartType="Sankey"
            width="100%"
            height="300px"
            data={data}
            options={options}
        />
    );
}