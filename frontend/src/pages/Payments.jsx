import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import EmptyState from "../components/common/EmptyState";
import Input from "../components/common/Input";
import PageHeader from "../components/common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { paymentService } from "../services/paymentService";
import { workEntryService } from "../services/workEntryService";

export default function Payments() {
  const { user } = useAuth();
  const currencySymbol = (user?.currency || "INR") === "INR" ? "₹" : (user?.currency || "") + " ";

  const [pendingEntries, setPendingEntries] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { payment_date: new Date().toISOString().slice(0, 10) } });

  const loadPendingEntries = () => {
    workEntryService.list({ page_size: 100 }).then((res) => {
      setPendingEntries(res.items.filter((e) => e.remaining_amount > 0));
    });
  };

  const loadPayments = () => {
    paymentService.list().then(setPayments);
  };

  useEffect(() => {
    loadPendingEntries();
    loadPayments();
  }, []);

  const onSelectEntry = (entryId) => {
    const entry = pendingEntries.find((e) => e.id === entryId);
    setSelectedEntry(entry || null);
    setValue("work_entry_id", entryId);
    setValue("amount", entry ? entry.remaining_amount : 0);
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await paymentService.record({ ...values, amount: Number(values.amount) });
      toast.success("Payment recorded.");
      reset({ payment_date: new Date().toISOString().slice(0, 10) });
      setSelectedEntry(null);
      loadPendingEntries();
      loadPayments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not record payment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Payments" subtitle="Record full or partial payments against any work entry." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">Record a Payment</h3>

          {pendingEntries.length === 0 ? (
            <EmptyState icon={Wallet} title="Nothing pending" description="All your work entries are fully paid up." />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Work Entry</label>
                <select
                  onChange={(e) => onSelectEntry(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3.5 py-2.5 text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select a work entry with a pending balance
                  </option>
                  {pendingEntries.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.customer_name} — {e.description} (Due: {currencySymbol}
                      {e.remaining_amount.toLocaleString()})
                    </option>
                  ))}
                </select>
                <input type="hidden" {...register("work_entry_id", { required: true })} />
              </div>

              {selectedEntry && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm flex justify-between">
                  <span className="text-gray-500">Remaining Balance</span>
                  <span className="font-semibold">
                    {currencySymbol}
                    {selectedEntry.remaining_amount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Amount"
                  type="number"
                  step="0.01"
                  error={errors.amount?.message}
                  {...register("amount", { required: "Amount is required", min: { value: 0.01, message: "Must be greater than 0" } })}
                />
                <Input label="Payment Date" type="date" {...register("payment_date", { required: true })} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes</label>
                <textarea
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3.5 py-2.5 text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  {...register("notes")}
                />
              </div>

              {selectedEntry && (
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setValue("amount", selectedEntry.remaining_amount / 2)}>
                    Half
                  </Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => setValue("amount", selectedEntry.remaining_amount)}>
                    Full Amount
                  </Button>
                </div>
              )}

              <Button type="submit" className="w-full" isLoading={submitting}>
                Record Payment
              </Button>
            </form>
          )}
        </Card>

        <Card>
          <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Recent Payments</h3>
          </div>
          {payments.length === 0 ? (
            <EmptyState title="No payments recorded yet" />
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-gray-800 max-h-[520px] overflow-y-auto">
              {payments.map((p) => (
                <div key={p.id} className="px-5 py-3 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-800 dark:text-gray-100">{p.payment_date}</p>
                    {p.notes && <p className="text-xs text-gray-400">{p.notes}</p>}
                  </div>
                  <p className="font-semibold text-brand-700 dark:text-brand-400">
                    +{currencySymbol}
                    {p.amount.toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
