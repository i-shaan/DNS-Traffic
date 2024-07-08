import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
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
import { useEffect } from 'react';
import Graphs from './Graphs.js';
// import Graphs from './Graphs.js';

Chart.register(...registerables);

const toMillions = (value) => value / 1_000_000;
const roots = ['A', 'B', 'C', 'D', 'E', 'F', 'I', 'J', 'K', 'L', 'M'];

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
  const rootData = {
    A: calculateMonthlyAverages(groupByMonth(dnsData_A)),
    B: calculateMonthlyAverages(groupByMonth(dnsData_B)),
    C: calculateMonthlyAverages(groupByMonth(dnsData_C)),
    D: calculateMonthlyAverages(groupByMonth(dnsData_D)),
    E: calculateMonthlyAverages(groupByMonth(dnsData_E)),
    F: calculateMonthlyAverages(groupByMonth(dnsData_F)),
    I: calculateMonthlyAverages(groupByMonth(dnsData_I)),
    J: calculateMonthlyAverages(groupByMonth(dnsData_J)),
    K: calculateMonthlyAverages(groupByMonth(dnsData_K)),
    L: calculateMonthlyAverages(groupByMonth(dnsData_L)),
    M: calculateMonthlyAverages(groupByMonth(dnsData_M))
  };

  const aggregatedData = {
    dns_udp_responses_sent_ipv4: [],
    dns_tcp_responses_sent_ipv4: [],
    dns_udp_queries_received_ipv4: [],
    dns_tcp_queries_received_ipv4: [],
    dns_udp_responses_sent_ipv6: [],
    dns_tcp_responses_sent_ipv6: [],
    dns_udp_queries_received_ipv6: [],
    dns_tcp_queries_received_ipv6: []
  };

  roots.forEach(root => {
    const data = rootData[root];
    const months = Object.keys(data);

    months.forEach(month => {
      aggregatedData.dns_udp_responses_sent_ipv4.push(data[month].dns_udp_responses_sent_ipv4);
      aggregatedData.dns_tcp_responses_sent_ipv4.push(data[month].dns_tcp_responses_sent_ipv4);
      aggregatedData.dns_udp_queries_received_ipv4.push(data[month].dns_udp_queries_received_ipv4);
      aggregatedData.dns_tcp_queries_received_ipv4.push(data[month].dns_tcp_queries_received_ipv4);
      aggregatedData.dns_udp_responses_sent_ipv6.push(data[month].dns_udp_responses_sent_ipv6);
      aggregatedData.dns_tcp_responses_sent_ipv6.push(data[month].dns_tcp_responses_sent_ipv6);
      aggregatedData.dns_udp_queries_received_ipv6.push(data[month].dns_udp_queries_received_ipv6);
      aggregatedData.dns_tcp_queries_received_ipv6.push(data[month].dns_tcp_queries_received_ipv6);
    });
  });

  return aggregatedData;
};

const App = () => {
  const [selectedRoot, setSelectedRoot] = useState('A');
  const [selectedMonth, setSelectedMonth] = useState('2024-01');
  const [monthlyData, setMonthlyData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [monthlyAverages, setMonthlyAverages] = useState({});

  useEffect(() => {
    const defaultRoot = 'A';
    const defaultMonth = '2024-01';
    setSelectedRoot(defaultRoot);
    const data = dnsData_A;
    const groupedData = groupByMonth(data);
    const averages = calculateMonthlyAverages(groupedData);
    setMonthlyData(groupedData);
    setMonthlyAverages(averages);
    setSelectedMonth(defaultMonth);
    setFilteredData(groupedData[defaultMonth] || []);
  }, []);
  
  const handleRootChange = (event) => {
    const selected = event.target.value;
    setSelectedRoot(selected);

    let data;

    switch (selected) {
      case 'A':
        data = dnsData_A;
        break;
      case 'B':
        data = dnsData_B;
        break;
      case 'C':
        data = dnsData_C;
        break;
      case 'D':
        data = dnsData_D;
        break;
      case 'E':
        data = dnsData_E;
        break;
      case 'F':
        data = dnsData_F;
        break;
      case 'I':
        data = dnsData_I;
        break;
      case 'J':
        data = dnsData_J;
        break;
      case 'K':
        data = dnsData_K;
        break;
      case 'L':
        data = dnsData_L;
        break;
      case 'M':
        data = dnsData_M;
        break;
      default:
        data = [];
    }

    const groupedData = groupByMonth(data);
    const averages = calculateMonthlyAverages(groupedData);
    setMonthlyData(groupedData);
    setMonthlyAverages(averages);
    const defaultMonth = '2024-01';
    setSelectedMonth(defaultMonth);
    setFilteredData(groupedData[defaultMonth] || []);
  };

  const handleMonthChange = (event) => {
    const selected = event.target.value;
    setSelectedMonth(selected);
    setFilteredData(monthlyData[selected] || []);
  };

  const aggregatedData = aggregateRootData();


  return (
    <div className="container">
      <h2>Select Root Instance</h2>
      <select value={selectedRoot} onChange={handleRootChange}>
        <option value="">Select Root</option>
        {roots.map(root => (
          <option key={root} value={root}>{root}</option>
        ))}
      </select>
      {selectedRoot && Object.keys(monthlyAverages).length > 0 && (
        <div className="graphs">
        <div className="graph-container">
          <h2>Monthly Averages for Root {selectedRoot}</h2>
          <Bar
            data={{
              labels: Object.keys(monthlyAverages),
              datasets: [
                {
                  label: 'UDP Responses Sent (IPv4) (Millions)',
                  data: Object.values(monthlyAverages).map(avg => avg.dns_udp_responses_sent_ipv4),
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,192,192,1)',
                  borderWidth: 1,
                },
                {
                  label: 'TCP Responses Sent (IPv4) (Millions)',
                  data: Object.values(monthlyAverages).map(avg => avg.dns_tcp_responses_sent_ipv4),
                  backgroundColor: 'rgba(153,102,255,0.4)',
                  borderColor: 'rgba(153,102,255,1)',
                  borderWidth: 1,
                },
                {
                  label: 'UDP Queries Received (IPv4) (Millions)',
                  data: Object.values(monthlyAverages).map(avg => avg.dns_udp_queries_received_ipv4),
                  backgroundColor: 'rgba(255,159,64,0.4)',
                  borderColor: 'rgba(255,159,64,1)',
                  borderWidth: 1,
                },
                {
                  label: 'TCP Queries Received (IPv4) (Millions)',
                  data: Object.values(monthlyAverages).map(avg => avg.dns_tcp_queries_received_ipv4),
                  backgroundColor: 'rgba(255,99,132,0.4)',
                  borderColor: 'rgba(255,99,132,1)',
                  borderWidth: 1,
                },
                {
                  label: 'UDP Responses Sent (IPv6) (Millions)',
                  data: Object.values(monthlyAverages).map(avg => avg.dns_udp_responses_sent_ipv6),
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,192,192,1)',
                  borderWidth: 1,
                },
                {
                  label: 'TCP Responses Sent (IPv6) (Millions)',
                  data: Object.values(monthlyAverages).map(avg => avg.dns_tcp_responses_sent_ipv6),
                  backgroundColor: 'rgba(153,102,255,0.4)',
                  borderColor: 'rgba(153,102,255,1)',
                  borderWidth: 1,
                },
                {
                  label: 'UDP Queries Received (IPv6) (Millions)',
                  data: Object.values(monthlyAverages).map(avg => avg.dns_udp_queries_received_ipv6),
                  backgroundColor: 'rgba(255,159,64,0.4)',
                  borderColor: 'rgba(255,159,64,1)',
                  borderWidth: 1,
                },
                {
                  label: 'TCP Queries Received (IPv6) (Millions)',
                  data: Object.values(monthlyAverages).map(avg => avg.dns_tcp_queries_received_ipv6),
                  backgroundColor: 'rgba(255,99,132,0.4)',
                  borderColor: 'rgba(255,99,132,1)',
                  borderWidth: 1,
                },
              ],
            }}
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
     
      {selectedRoot && (
        <>
          <h2>Select a Month:</h2>
          <select value={selectedMonth} onChange={handleMonthChange}>
            <option value="">Select Month</option>
            {Object.keys(monthlyData).map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          
          {selectedMonth && (
            <div className="graphs">
              <div className="graph-container">
                <h2>DNS Traffic Data (IPv4) for {selectedRoot}</h2>
                <Line
                  data={{
                    labels: filteredData.map(item => item.date),
                    datasets: [
                      {
                        label: 'UDP Responses Sent (IPv4) (Millions)',
                        data: filteredData.map(item => toMillions(item.dns_udp_responses_sent_ipv4)),
                        borderColor: 'rgba(75,192,192,1)',
                        fill: false,
                      },
                      {
                        label: 'TCP Responses Sent (IPv4) (Millions)',
                        data: filteredData.map(item => toMillions(item.dns_tcp_responses_sent_ipv4)),
                        borderColor: 'rgba(153,102,255,1)',
                        fill: false,
                      },
                      {
                        label: 'UDP Queries Received (IPv4) (Millions)',
                        data: filteredData.map(item => toMillions(item.dns_udp_queries_received_ipv4)),
                        borderColor: 'rgba(255,159,64,1)',
                        fill: false,
                      },
                      {
                        label: 'TCP Queries Received (IPv4) (Millions)',
                        data: filteredData.map(item => toMillions(item.dns_tcp_queries_received_ipv4)),
                        borderColor: 'rgba(255,99,132,1)',
                        fill: false,
                      },
                    ],
                  }}
                />
              </div>

              <div className="graph-container">
                <h2>DNS Traffic Data (IPv6) for {selectedRoot}</h2>
                <Line
                  data={{
                    labels: filteredData.map(item => item.date),
                    datasets: [
                      {
                        label: 'UDP Responses Sent (IPv6) (Millions)',
                        data: filteredData.map(item => toMillions(item.dns_udp_responses_sent_ipv6)),
                        borderColor: 'rgba(75,192,192,1)',
                        fill: false,
                      },
                      {
                        label: 'TCP Responses Sent (IPv6) (Millions)',
                        data: filteredData.map(item => toMillions(item.dns_tcp_responses_sent_ipv6)),
                        borderColor: 'rgba(153,102,255,1)',
                        fill: false,
                      },
                      {
                        label: 'UDP Queries Received (IPv6) (Millions)',
                        data: filteredData.map(item => toMillions(item.dns_udp_queries_received_ipv6)),
                        borderColor: 'rgba(255,159,64,1)',
                        fill: false,
                      },
                      {
                        label: 'TCP Queries Received (IPv6) (Millions)',
                        data: filteredData.map(item => toMillions(item.dns_tcp_queries_received_ipv6)),
                        borderColor: 'rgba(255,99,132,1)',
                        fill: false,
                      },
                    ],
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}

    
      <Graphs/>
    </div>
  );
}

export default App;