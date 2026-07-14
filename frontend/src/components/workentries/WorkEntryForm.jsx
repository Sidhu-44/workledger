import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "../common/Button";
import Input from "../common/Input";

export default function WorkEntryForm({ customers, defaultValues, onSubmit, onCancel, isSubmitting }) {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || { work_date: new Date().toISOString().slice(0, 10), amount: 0, paid_amount: 0 },
  });

  useEffect(() => {
    reset(defaultValues || { work_date: new Date().toISOString().slice(0, 10), amount: 0, paid_amount: 0 });
  }, [defaultValues, reset]);

  const amount = Number(watch("amount")) || 0;
  const paid = Number(watch("paid_amount")) || 0;
  const remaining = Math.max(0, amount - paid);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Customer</label>
        <select
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3.5 py-2.5 text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          {...register("customer_id", { required: "Please select a customer" })}
        >
          <option value="">Select a customer</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.customer_id && <p className="mt-1 text-xs text-red-500">{errors.customer_id.message}</p>}
      </div>

      <Input label="Date" type="date" error={errors.work_date?.message} {...register("work_date", { required: "Date is required" })} />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Work Description</label>
        <textarea
          rows={2}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3.5 py-2.5 text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Amount"
          type="number"
          step="0.01"
          error={errors.amount?.message}
          {...register("amount", { required: "Amount is required", min: { value: 0, message: "Must be 0 or more" } })}
        />
        <Input
          label="Paid Amount"
          type="number"
          step="0.01"
          error={errors.paid_amount?.message}
          {...register("paid_amount", { min: { value: 0, message: "Must be 0 or more" } })}
        />
      </div>

      <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 flex justify-between text-sm">
        <span className="text-gray-500">Remaining Amount</span>
        <span className="font-semibold text-gray-900 dark:text-gray-100">{remaining.toLocaleString()}</span>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes</label>
        <textarea
          rows={2}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3.5 py-2.5 text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          {...register("notes")}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Save Entry
        </Button>
      </div>
    </form>
  );
}
