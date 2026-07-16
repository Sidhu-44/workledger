import {
  AlertTriangle,
  Bot,
  Calendar,
  Crown,
  ReceiptText,
  RefreshCw,
  Sparkles,
  UserX,
  Wallet,
} from "lucide-react";

import Card from "../common/Card";
import EmptyState from "../common/EmptyState";
import { SkeletonCard } from "../common/Skeleton";
import { useAuth } from "../../context/AuthContext";
import useAiInsights from "../../hooks/useAiInsights";

function InsightCard({ icon: Icon, title, value, description }) {
  return (
    <Card className="p-5 hover:shadow-card transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <div className="h-8 w-8 rounded-lg bg-brand-50 dark:bg-brand-900/20 flex items-center justify-center shrink-0">
          <Icon className="text-brand-600 dark:text-brand-400" size={16} />
        </div>
      </div>
      <p className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
      {description && <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description}</p>}
    </Card>
  );
}

function CustomerListCard({ title, icon: Icon, items, emptyText, renderLine }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="text-brand-600 dark:text-brand-400" size={16} />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-gray-500 py-2">{emptyText}</p>
      ) : (
        <ul className="space-y-2.5">
          {items.map((item, i) => (
            <li key={item.customer_id} className="flex items-center justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-200 truncate">
                {i + 1}. {item.customer_name}
              </span>
              {renderLine(item)}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default function AiInsights() {
  const { user } = useAuth();
  const { insights, loading, error, reload } = useAiInsights();
  const currencySymbol = (user?.currency || "INR") === "INR" ? "₹" : (user?.currency || "") + " ";
  const fmt = (n) => currencySymbol + Number(n || 0).toLocaleString(undefined, { maximumFractionDigits: 0 });

  const isEmpty =
    insights &&
    insights.this_month_earnings === 0 &&
    insights.total_pending_amount === 0 &&
    (insights.top_customers || []).length === 0;

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-brand-600 dark:text-brand-400" size={18} />
        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">🤖 AI Business Insights</h2>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {!loading && error && (
        <Card>
          <EmptyState
            icon={AlertTriangle}
            title="Couldn't load insights"
            description="Something went wrong while generating your business insights."
            action={
              <button
                onClick={reload}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors duration-200"
              >
                <RefreshCw size={14} /> Try Again
              </button>
            }
          />
        </Card>
      )}

      {!loading && !error && isEmpty && (
        <Card>
          <EmptyState
            icon={Bot}
            title="Not enough data yet"
            description="Add a few customers and work entries and your business insights will show up here."
          />
        </Card>
      )}

      {!loading && !error && insights && !isEmpty && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <InsightCard
              icon={Wallet}
              title="Total Pending Amount"
              value={fmt(insights.total_pending_amount)}
              description="Across all customers"
            />

            <InsightCard
              icon={Crown}
              title="Highest Paying Customer"
              value={insights.highest_paying_customer ? insights.highest_paying_customer.customer_name : "—"}
              description={
                insights.highest_paying_customer
                  ? fmt(insights.highest_paying_customer.amount) + " total"
                  : "No data yet"
              }
            />

            <InsightCard
              icon={AlertTriangle}
              title="Highest Outstanding Customer"
              value={
                insights.highest_outstanding_customer ? insights.highest_outstanding_customer.customer_name : "—"
              }
              description={
                insights.highest_outstanding_customer
                  ? fmt(insights.highest_outstanding_customer.amount) + " pending"
                  : "Nobody owes you right now"
              }
            />

            <InsightCard
              icon={UserX}
              title="Overdue Customers"
              value={insights.overdue_customers_count}
              description="Customers with any pending balance"
            />

            <InsightCard
              icon={Calendar}
              title="This Month Earnings"
              value={fmt(insights.this_month_earnings)}
              description={`${insights.monthly_trend.change_percent > 0 ? "+" : ""}${
                insights.monthly_trend.change_percent
              }% vs last month`}
            />

            <InsightCard
              icon={ReceiptText}
              title="Average Payment"
              value={fmt(insights.average_payment)}
              description="Per payment recorded"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <CustomerListCard
              title="Top 3 Customers"
              icon={Crown}
              items={insights.top_customers}
              emptyText="No customers yet."
              renderLine={(item) => (
                <span className="font-medium text-gray-900 dark:text-gray-100">{fmt(item.amount)}</span>
              )}
            />

            <CustomerListCard
              title="Overdue Customers (15+ days)"
              icon={UserX}
              items={insights.overdue_customers}
              emptyText="Nobody's overdue by more than 15 days. 🎉"
              renderLine={(item) => (
                <span className="text-accent-600 font-medium">
                  {fmt(item.remaining_amount)} · {item.days_overdue}d
                </span>
              )}
            />
          </div>

          {insights.recommendations.length > 0 && (
            <Card className="mt-4 p-5 bg-gradient-to-br from-brand-50 to-white dark:from-brand-900/20 dark:to-gray-900 border-brand-100 dark:border-brand-900/40">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
                  <Bot className="text-white" size={16} />
                </div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">AI Recommendations</h3>
              </div>
              <ul className="space-y-2">
                {insights.recommendations.map((rec, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-gray-900/60 rounded-lg px-3 py-2"
                  >
                    <Sparkles className="text-brand-500 shrink-0 mt-0.5" size={14} />
                    {rec}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}
    </div>
  );
}