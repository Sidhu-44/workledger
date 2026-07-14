import { Download, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";
import PageHeader from "../components/common/PageHeader";
import StatusBadge from "../components/common/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { reportService } from "../services/reportService";

const PERIODS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

export default function Reports() {
  const { user } = useAuth();
  const currencySymbol = (user?.currency || "INR") === "INR" ? "₹" : (user?.currency || "") + " ";
  const fmt = (n) => currencySymbol + Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });

  const [period, setPeriod] = useState("monthly");
  const [periodReport, setPeriodReport] = useState(null);
  const [customerWise, setCustomerWise] = useState([]);
  const [pending, setPending] = useState([]);
  const [highest, setHighest] = useState(null);
  const [frequent, setFrequent] = useState(null);
  const [exporting, setExporting] = useState(null);

  useEffect(() => {
    reportService.period({ period }).then(setPeriodReport);
  }, [period]);

  useEffect(() => {
    reportService.customerWise().then(setCustomerWise);
    reportService.pendingPayments().then(setPending);
    reportService.highestPayingCustomer().then(setHighest);
    reportService.mostFrequentCustomer().then(setFrequent);
  }, []);

  const handleExport = async (format) => {
    setExporting(format);
    try {
      await reportService.downloadExport(format, { period });
      toast.success(`Report downloaded as ${format.toUpperCase()}.`);
    } catch {
      toast.error("Could not export report.");
    } finally {
      setExporting(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="See how your work and earnings break down, and export for your records."
        action={
          <div className="flex gap-2">
            {["csv", "excel", "pdf"].map((fmt) => (
              <button
                key={fmt}
                onClick={() => handleExport(fmt)}
                disabled={exporting === fmt}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-60"
              >
                <Download size={14} />
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        }
      />

      {/* Period selector */}
      <div className="flex gap-2 mb-6">
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              period === p.value
                ? "bg-brand-600 text-white"
                : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Period summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Jobs</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{periodReport?.total_jobs ?? "—"}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Earnings</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{fmt(periodReport?.total_earnings)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Total Paid</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">{fmt(periodReport?.total_paid)}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Pending</p>
          <p className="mt-2 text-2xl font-bold text-accent-600">{fmt(periodReport?.total_pending)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2">
            <TrendingUp size={16} className="text-brand-600" /> Highest Paying Customer
          </h3>
          {highest ? (
            <div className="mt-3">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{highest.customer_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{fmt(highest.total_earnings)} total earnings</p>
            </div>
          ) : (
            <EmptyState title="Not enough data yet" />
          )}
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1 flex items-center gap-2">
            <Users size={16} className="text-brand-600" /> Most Frequent Customer
          </h3>
          {frequent ? (
            <div className="mt-3">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{frequent.customer_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{frequent.total_jobs} jobs completed</p>
            </div>
          ) : (
            <EmptyState title="Not enough data yet" />
          )}
        </Card>
      </div>

      {/* Customer-wise report */}
      <Card className="mb-6">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Customer-wise Report</h3>
        </div>
        {customerWise.length === 0 ? (
          <EmptyState title="No customers yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Jobs</th>
                  <th className="px-5 py-3 font-medium">Earnings</th>
                  <th className="px-5 py-3 font-medium">Paid</th>
                  <th className="px-5 py-3 font-medium">Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {customerWise.map((c) => (
                  <tr key={c.customer_id}>
                    <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-100">{c.customer_name}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{c.total_jobs}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{fmt(c.total_earnings)}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{fmt(c.total_paid)}</td>
                    <td className="px-5 py-3 font-medium text-accent-600">{fmt(c.total_pending)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pending payments report */}
      <Card>
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Pending Payments</h3>
        </div>
        {pending.length === 0 ? (
          <EmptyState title="No pending payments" description="Everything is fully settled." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Amount</th>
                  <th className="px-5 py-3 font-medium">Paid</th>
                  <th className="px-5 py-3 font-medium">Remaining</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {pending.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{p.work_date}</td>
                    <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-100">{p.customer_name}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{fmt(p.amount)}</td>
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{fmt(p.paid_amount)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status="pending" />
                      <span className="ml-2 font-medium text-accent-600">{fmt(p.remaining_amount)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
