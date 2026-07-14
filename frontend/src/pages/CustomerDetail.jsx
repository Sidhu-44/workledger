import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/common/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { customerService } from "../services/customerService";

export default function CustomerDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const currencySymbol = (user?.currency || "INR") === "INR" ? "₹" : (user?.currency || "") + " ";

  useEffect(() => {
    customerService.history(id).then(setData);
  }, [id]);

  if (!data) {
    return <div className="skeleton h-40 w-full" />;
  }

  const { customer, total_jobs, total_earnings, pending_amount, history } = data;

  return (
    <div>
      <Link to="/customers" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4">
        <ArrowLeft size={15} /> Back to Customers
      </Link>

      <Card className="p-6 mb-6">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{customer.name}</h1>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
          {customer.phone_number && (
            <span className="flex items-center gap-1.5">
              <Phone size={14} /> {customer.phone_number}
            </span>
          )}
          {customer.address && (
            <span className="flex items-center gap-1.5">
              <MapPin size={14} /> {customer.address}
            </span>
          )}
        </div>
        {customer.notes && <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">{customer.notes}</p>}

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-400">Total Jobs</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">{total_jobs}</p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-400">Total Earnings</p>
            <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mt-1">
              {currencySymbol}
              {total_earnings.toLocaleString()}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <p className="text-xs text-gray-400">Pending Amount</p>
            <p className="text-lg font-bold text-accent-600 mt-1">
              {currencySymbol}
              {pending_amount.toLocaleString()}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100">Work History</h3>
        </div>
        {history.length === 0 ? (
          <EmptyState title="No work logged yet" description="Work entries for this customer will show up here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Work</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Paid</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <td className="px-5 py-3 text-gray-600 dark:text-gray-300">{h.work_date}</td>
                    <td className="px-5 py-3 text-gray-800 dark:text-gray-100">{h.description}</td>
                    <td className="px-5 py-3">
                      {currencySymbol}
                      {h.amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      {currencySymbol}
                      {h.paid_amount.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={h.payment_status} />
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
