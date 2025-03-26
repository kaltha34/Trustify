import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import {
  UserCheck,
  BadgeCheck,
  ShieldAlert,
  BarChart3,
  FileText,
  Lock,
} from "lucide-react";
import "./InsightsPage.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale);

const mockData = {
  verifiedUsers: 1200,
  govVerifications: 850,
  approved: 700,
  rejected: 150,
  pending: 350,
  fraudAlerts: 5,
  recentTransactions: [
    "Tx 1: Verified - 2025-02-01",
    "Tx 2: Verified - 2025-02-01",
    "Tx 3: Verified - 2025-02-02",
  ],
  securityStatus: {
    encryption: "AES-256",
    accessControl: "Role-based",
  },
};

const InsightsPage = () => {
  const [stats, setStats] = useState(mockData);

  useEffect(() => {
    return () => {
      const chart = ChartJS.getChart("pieChart");
      if (chart) {
        chart.destroy();
      }
    };
  }, []);

  return (
    <div className="insight-body">
      <h1>Insight</h1>
      <div className="insight-container">
        <div className="insight-box">
          <UserCheck size={40} className="insight-icon" />
          <h2>Total Verified Users</h2>
          <p>{stats.verifiedUsers}</p>
        </div>

        <div className="insight-box">
          <BadgeCheck size={40} className="insight-icon" />
          <h2>Government Verifications Completed</h2>
          <p>{stats.govVerifications}</p>
        </div>

        <div className="insight-box">
          <BarChart3 size={40} className="insight-icon" />
          <h3>Monthly Activity Report</h3>
          <div className="pie-chart-container">
            <Pie
              id="pieChart"
              data={{
                labels: ["Approved", "Rejected", "Pending"],
                datasets: [
                  {
                    data: [stats.approved, stats.rejected, stats.pending],
                    backgroundColor: ["#2ecc71", "#e74c3c", "#f1c40f"],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: { legend: { position: "top" } },
              }}
            />
          </div>
        </div>

        <div className="insight-box">
          <ShieldAlert size={40} className="insight-icon" />
          <h2>Fraud Prevention Alerts</h2>
          <p>{stats.fraudAlerts} suspicious activities detected</p>
        </div>

        {/* 🔥 New Box for Recent Transactions */}
        <div className="insight-box">
          <FileText size={40} className="insight-icon" />
          <h2>Recent Transactions</h2>
          <ul>
            {stats.recentTransactions.map((tx, index) => (
              <li key={index}>{tx}</li>
            ))}
          </ul>
        </div>

        {/* 🔥 New Box for Security Status */}
        <div className="insight-box">
          <Lock size={40} className="insight-icon" />
          <h2>Security Status</h2>
          <p>🔐 Encryption Level: {stats.securityStatus.encryption}</p>
          <p>👤 Access Control: {stats.securityStatus.accessControl}</p>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
