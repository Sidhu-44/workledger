// import { useEffect, useState } from "react";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Cell,
//   Legend,
//   Line,
//   LineChart,
//   Pie,
//   PieChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";

// import Card from "../components/common/Card";
// import PageHeader from "../components/common/PageHeader";
// import { SkeletonCard } from "../components/common/Skeleton";
// import { useAuth } from "../context/AuthContext";
// import { dashboardService } from "../services/dashboardService";

// const COLORS = ["#2e9067", "#e07a34", "#c8611e"];

// function StatCard({ label, value, prefix = "", accent = false }) {
//   return (
//     <Card className="p-5">
//       <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
//       <p className={`mt-2 text-2xl font-bold ${accent ? "text-accent-600" : "text-gray-900 dark:text-gray-100"}`}>
//         {prefix}
//         {value}
//       </p>
//     </Card>
//   );
// }

// export default function Dashboard() {
//   const { user } = useAuth();
//   const [summary, setSummary] = useState(null);
//   const [charts, setCharts] = useState(null);
//   const currency = user?.currency || "INR";
//   const currencySymbol = currency === "INR" ? "₹" : currency + " ";

//   useEffect(() => {
//     dashboardService.summary().then(setSummary);
//     dashboardService.charts().then(setCharts);
//   }, []);

//   const fmt = (n) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });

//   return (
//     <div>
//       <PageHeader title={`Hi, ${user?.full_name?.split(" ")[0] || "there"} 👋`} subtitle="Here's how your work is going." />

//       <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
//         {!summary
//           ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
//           : [
//               { label: "Total Customers", value: fmt(summary.total_customers) },
//               { label: "Total Work Days", value: fmt(summary.total_work_days) },
//               { label: "Total Earnings", value: fmt(summary.total_earnings), prefix: currencySymbol },
//               { label: "Total Paid", value: fmt(summary.total_paid), prefix: currencySymbol },
//               { label: "Pending Amount", value: fmt(summary.total_pending), prefix: currencySymbol, accent: true },
//               { label: "This Month", value: fmt(summary.this_month_earnings), prefix: currencySymbol },
//             ].map((c) => <StatCard key={c.label} {...c} />)}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="p-5">
//           <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Monthly Earnings</h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <LineChart data={charts?.monthly_earnings || []}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//               <XAxis dataKey="month" tick={{ fontSize: 12 }} />
//               <YAxis tick={{ fontSize: 12 }} />
//               <Tooltip />
//               <Line type="monotone" dataKey="earnings" stroke="#2e9067" strokeWidth={2.5} dot={{ r: 3 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </Card>

//         <Card className="p-5">
//           <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Weekly Work</h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <BarChart data={charts?.weekly_work || []}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//               <XAxis dataKey="day" tick={{ fontSize: 12 }} />
//               <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
//               <Tooltip />
//               <Bar dataKey="jobs" fill="#4bab83" radius={[6, 6, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </Card>

//         <Card className="p-5">
//           <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Payment Status</h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <PieChart>
//               <Pie
//                 data={charts?.payment_status || []}
//                 dataKey="amount"
//                 nameKey="status"
//                 innerRadius={55}
//                 outerRadius={90}
//                 paddingAngle={3}
//               >
//                 {(charts?.payment_status || []).map((_, i) => (
//                   <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </Card>

//         <Card className="p-5">
//           <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Top Customers</h3>
//           <ResponsiveContainer width="100%" height={260}>
//             <BarChart data={charts?.top_customers || []} layout="vertical" margin={{ left: 20 }}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
//               <XAxis type="number" tick={{ fontSize: 12 }} />
//               <YAxis type="category" dataKey="customer_name" tick={{ fontSize: 12 }} width={100} />
//               <Tooltip />
//               <Bar dataKey="total_earnings" fill="#e07a34" radius={[0, 6, 6, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </Card>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import Card from "../components/common/Card";
import PageHeader from "../components/common/PageHeader";
import { SkeletonCard } from "../components/common/Skeleton";
import AiInsights from "../components/dashboard/AiInsights";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dashboardService";

const COLORS = ["#2e9067", "#e07a34", "#c8611e"];

function StatCard({ label, value, prefix = "", accent = false }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accent ? "text-accent-600" : "text-gray-900 dark:text-gray-100"}`}>
        {prefix}
        {value}
      </p>
    </Card>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const currency = user?.currency || "INR";
  const currencySymbol = currency === "INR" ? "₹" : currency + " ";

  useEffect(() => {
    dashboardService.summary().then(setSummary);
    dashboardService.charts().then(setCharts);
  }, []);

  const fmt = (n) => Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });

  return (
    <div>
      <PageHeader title={`Hi, ${user?.full_name?.split(" ")[0] || "there"} 👋`} subtitle="Here's how your work is going." />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        {!summary
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : [
              { label: "Total Customers", value: fmt(summary.total_customers) },
              { label: "Total Work Days", value: fmt(summary.total_work_days) },
              { label: "Total Earnings", value: fmt(summary.total_earnings), prefix: currencySymbol },
              { label: "Total Paid", value: fmt(summary.total_paid), prefix: currencySymbol },
              { label: "Pending Amount", value: fmt(summary.total_pending), prefix: currencySymbol, accent: true },
              { label: "This Month", value: fmt(summary.this_month_earnings), prefix: currencySymbol },
            ].map((c) => <StatCard key={c.label} {...c} />)}
      </div>

      <AiInsights />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Monthly Earnings</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={charts?.monthly_earnings || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="earnings" stroke="#2e9067" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Weekly Work</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts?.weekly_work || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="jobs" fill="#4bab83" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Payment Status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={charts?.payment_status || []}
                dataKey="amount"
                nameKey="status"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
              >
                {(charts?.payment_status || []).map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-4">Top Customers</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={charts?.top_customers || []} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="customer_name" tick={{ fontSize: 12 }} width={100} />
              <Tooltip />
              <Bar dataKey="total_earnings" fill="#e07a34" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}