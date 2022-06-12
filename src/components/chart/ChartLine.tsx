import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CharLineProps {
  data: ChartData[];
}

const ChartLine = (props: CharLineProps) => {
  const data = props.data;
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [chartKeys, setChartKeys] = useState<string[]>([]);
  const [max, setMax] = useState(0);

  const colors = ['#8884d8', '#82ca9d', '#F9627D'];

  useEffect(() => {
    return () => {
      setChartKeys([]);
      setChartData([]);
      setMax(0);
    };
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const tmp_keys: string[] = [];
      for (const key of Object.keys(data[0])) {
        if (key !== 'name') tmp_keys.push(key);
      }

      setChartKeys([...tmp_keys]);
    }

    let cur_max = 0;
    for (const item of data) {
      for (const key of Object.keys(data[0])) {
        if (key !== 'name') {
          if (Number(item[key]) > cur_max) {
            cur_max = Number(item[key]);
          }
        }
      }
    }
    setMax(cur_max);
    setChartData([...data]);
  }, [data]);

  return (
    <>
      <ResponsiveContainer width='100%' height='100%'>
        <LineChart
          width={500}
          height={300}
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray='3 3' />
          <XAxis dataKey='name' />
          <YAxis domain={[0, max * 2]} />
          <Tooltip />
          <Legend />
          {chartKeys.map((key, key_idx) => {
            return <Line type='monotone' dataKey={key} stroke={colors[key_idx]} key={`chart_line_${key_idx}`} />;
          })}
        </LineChart>
      </ResponsiveContainer>
    </>
  );
};

export default ChartLine;
