import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { dnsData_A } from './data/A.js';
import { dnsData_B } from './data/B.js';
import { dnsData_C } from './data/C.js';
import { dnsData_D } from './data/D.js';
import { dnsData_E } from './data/E.js';
import { dnsData_F } from './data/F.js';
import { dnsData_I } from './data/I.js';
import { dnsData_J } from './data/J.js';
import { dnsData_K } from './data/K.js';
import { dnsData_L } from './data/L.js';
import { dnsData_M } from './data/M.js';
import './App.css';

Chart.register(...registerables);

const roots = ['A', 'B', 'C', 'D', 'E', 'F', 'I', 'J', 'K', 'L', 'M'];

const allData = {
  A: dnsData_A,
  B: dnsData_B,
  C: dnsData_C,
  D: dnsData_D,
  E: dnsData_E,
  F: dnsData_F,
  I: dnsData_I,
  J: dnsData_J,
  K: dnsData_K,
  L: dnsData_L,
  M: dnsData_M,
};

const toMillions = (value) => value / 1_000_000;

const groupByMonth = (data) => {
  const monthlyData = {};

  data.forEach(item => {
    const month = item.date.substring(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = [];
    }
    monthlyData[month].push(item);
  });

  return monthlyData;
};

const calculateMonthlyAverages = (data) => {
  const averages = {};

  Object.keys(data).forEach(month => {
    const monthData = data[month];
    const totalCounts = {
      dns_udp_responses_sent_ipv4: 0,
      dns_tcp_responses_sent_ipv4: 0,
      dns_udp_queries_received_ipv4: 0,
      dns_tcp_queries_received_ipv4: 0,
      dns_udp_responses_sent_ipv6: 0,
      dns_tcp_responses_sent_ipv6: 0,
      dns_udp_queries_received_ipv6: 0,
      dns_tcp_queries_received_ipv6: 0
    };
    monthData.forEach(item => {
      totalCounts.dns_udp_responses_sent_ipv4 += item.dns_udp_responses_sent_ipv4;
      totalCounts.dns_tcp_responses_sent_ipv4 += item.dns_tcp_responses_sent_ipv4;
      totalCounts.dns_udp_queries_received_ipv4 += item.dns_udp_queries_received_ipv4;
      totalCounts.dns_tcp_queries_received_ipv4 += item.dns_tcp_queries_received_ipv4;
      totalCounts.dns_udp_responses_sent_ipv6 += item.dns_udp_responses_sent_ipv6;
      totalCounts.dns_tcp_responses_sent_ipv6 += item.dns_tcp_responses_sent_ipv6;
      totalCounts.dns_udp_queries_received_ipv6 += item.dns_udp_queries_received_ipv6;
      totalCounts.dns_tcp_queries_received_ipv6 += item.dns_tcp_queries_received_ipv6;
    });

    const count = monthData.length;
    averages[month] = {
      dns_udp_responses_sent_ipv4: toMillions(totalCounts.dns_udp_responses_sent_ipv4 / count),
      dns_tcp_responses_sent_ipv4: toMillions(totalCounts.dns_tcp_responses_sent_ipv4 / count),
      dns_udp_queries_received_ipv4: toMillions(totalCounts.dns_udp_queries_received_ipv4 / count),
      dns_tcp_queries_received_ipv4: toMillions(totalCounts.dns_tcp_queries_received_ipv4 / count),
      dns_udp_responses_sent_ipv6: toMillions(totalCounts.dns_udp_responses_sent_ipv6 / count),
      dns_tcp_responses_sent_ipv6: toMillions(totalCounts.dns_tcp_responses_sent_ipv6 / count),
      dns_udp_queries_received_ipv6: toMillions(totalCounts.dns_udp_queries_received_ipv6 / count),
      dns_tcp_queries_received_ipv6: toMillions(totalCounts.dns_tcp_queries_received_ipv6 / count),
    };
  });

  return averages;
};

const aggregateRootData = () => {
  const rootData = {};

  roots.forEach(root => {
    rootData[root] = calculateMonthlyAverages(groupByMonth(allData[root]));
  });

  return rootData;
};

const Graphs = () => {
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [monthlyAverages, setMonthlyAverages] = useState({});
  const [months, setMonths] = useState([]);

  useEffect(() => {
    const aggregatedData = aggregateRootData();
    setMonthlyAverages(aggregatedData);

    // Extract all unique months
    const uniqueMonths = new Set();
    Object.values(aggregatedData).forEach(rootData => {
      Object.keys(rootData).forEach(month => uniqueMonths.add(month));
    });
    setMonths([...uniqueMonths]);
  }, []);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const chartData_4 = {
    labels: roots,
    datasets: [
      {
        label: 'UDP Responses Sent (IPv4) (Millions)',
        data: roots.map(root => monthlyAverages[root]?.[selectedMonth]?.dns_udp_responses_sent_ipv4 || 0),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'TCP Responses Sent (IPv4) (Millions)',
        data: roots.map(root => monthlyAverages[root]?.[selectedMonth]?.dns_tcp_responses_sent_ipv4 || 0),
        borderColor: 'rgba(153,102,255,1)',
        fill: false,
      },
      {
        label: 'UDP Queries Received (IPv4) (Millions)',
        data: roots.map(root => monthlyAverages[root]?.[selectedMonth]?.dns_udp_queries_received_ipv4 || 0),
        borderColor: 'rgba(255,159,64,1)',
        fill: false,
      },
      {
        label: 'TCP Queries Received (IPv4) (Millions)',
        data: roots.map(root => monthlyAverages[root]?.[selectedMonth]?.dns_tcp_queries_received_ipv4 || 0),
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      }
    ],
  };

  const chartData_6 = {
    labels: roots,
    datasets: [

      {
        label: 'UDP Responses Sent (IPv6) (Millions)',
        data: roots.map(root => monthlyAverages[root]?.[selectedMonth]?.dns_udp_responses_sent_ipv6 || 0),
        borderColor: 'rgba(75,192,192,1)',
        fill: false,
      },
      {
        label: 'TCP Responses Sent (IPv6) (Millions)',
        data: roots.map(root => monthlyAverages[root]?.[selectedMonth]?.dns_tcp_responses_sent_ipv6 || 0),
        borderColor: 'rgba(153,102,255,1)',
        fill: false,
      },
      {
        label: 'UDP Queries Received (IPv6) (Millions)',
        data: roots.map(root => monthlyAverages[root]?.[selectedMonth]?.dns_udp_queries_received_ipv6 || 0),
        borderColor: 'rgba(255,159,64,1)',
        fill: false,
      },
      {
        label: 'TCP Queries Received (IPv6) (Millions)',
        data: roots.map(root => monthlyAverages[root]?.[selectedMonth]?.dns_tcp_queries_received_ipv6 || 0),
        borderColor: 'rgba(255,99,132,1)',
        fill: false,
      },
    ],
  };
  return (
    <div className="container">
      <h2>Select a Month:</h2>
      <select value={selectedMonth} onChange={handleMonthChange}>
        <option value="">Select Month</option>
        {months.map(month => (
          <option key={month} value={month}>{month}</option>
        ))}
      </select>

      {selectedMonth && (
        <div className='graphs'>
        <div className="graph-container">
          <h2>Monthly Averages for {selectedMonth} (IPv4)</h2>
          <Line
            data={chartData_4}
            options={{
              scales: {
                x: {
                  beginAtZero: true,
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
        <div className="graph-container">
          <h2>Monthly Averages for {selectedMonth} (IPv6)</h2>
          <Line
            data={chartData_6}
            options={{
              scales: {
                x: {
                  beginAtZero: true,
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
        </div>
      )}
    </div>
  );
}

export default Graphs;
