import { HardHat, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Modal from "../components/common/Modal";
import PageHeader from "../components/common/PageHeader";
import Pagination from "../components/common/Pagination";
import { SkeletonTable } from "../components/common/Skeleton";
import StatusBadge from "../components/common/StatusBadge";
import WorkEntryForm from "../components/workentries/WorkEntryForm";
import { useAuth } from "../context/AuthContext";
import { customerService } from "../services/customerService";
import { workEntryService } from "../services/workEntryService";

export default function WorkEntries() {
  const { user } = useAuth();
  const currencySymbol = (user?.currency || "INR") === "INR" ? "₹" : (user?.currency || "") + " ";

  const [customers, setCustomers] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({ search: "", customer_id: "", status: "", date_from: "", date_to: "" });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    customerService.list({ page_size: 100 }).then((res) => setCustomers(res.items));
  }, []);

  const load = () => {
    setLoading(true);
    workEntryService
      .list({
        search: filters.search || undefined,
        customer_id: filters.customer_id || undefined,
        status: filters.status || undefined,
        date_from: filters.date_from || undefined,
        date_to: filters.date_to || undefined,
        page,
        page_size: 10,
      })
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(load, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (entry) => {
    setEditing({ ...entry, work_date: entry.work_date });
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    const payload = { ...values, amount: Number(values.amount), paid_amount: Number(values.paid_amount || 0) };
    try {
      if (editing) {
        await workEntryService.update(editing.id, payload);
        toast.success("Work entry updated.");
      } else {
        await workEntryService.create(payload);
        toast.success("Work entry added.");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await workEntryService.remove(deleteTarget.id);
      toast.success("Work entry deleted.");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete entry.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Work Entries"
        subtitle="Every job you've logged, with amounts and payment status."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add Work Entry
          </Button>
        }
      />

      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <input
            value={filters.search}
            onChange={(e) => {
              setPage(1);
              setFilters((f) => ({ ...f, search: e.target.value }));
            }}
            placeholder="Search work..."
            className="col-span-2 sm:col-span-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <select
            value={filters.customer_id}
            onChange={(e) => {
              setPage(1);
              setFilters((f) => ({ ...f, customer_id: e.target.value }));
            }}
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          >
            <option value="">All Customers</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => {
              setPage(1);
              setFilters((f) => ({ ...f, status: e.target.value }));
            }}
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="pending">Pending</option>
          </select>
          <input
            type="date"
            value={filters.date_from}
            onChange={(e) => {
              setPage(1);
              setFilters((f) => ({ ...f, date_from: e.target.value }));
            }}
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          />
          <input
            type="date"
            value={filters.date_to}
            onChange={(e) => {
              setPage(1);
              setFilters((f) => ({ ...f, date_to: e.target.value }));
            }}
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          />
        </div>

        {!loading && data?.items?.length === 0 ? (
          <EmptyState
            icon={HardHat}
            title="No work entries yet"
            description="Log your first job to start tracking earnings and payments."
            action={
              <Button onClick={openCreate}>
                <Plus size={16} /> Add Work Entry
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Paid</th>
                  <th className="px-4 py-3">Remaining</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              {loading ? (
                <SkeletonTable rows={5} columns={8} />
              ) : (
                <tbody>
                  {data.items.map((e) => (
                    <tr key={e.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">{e.work_date}</td>
                      <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{e.customer_name}</td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300 max-w-xs truncate">{e.description}</td>
                      <td className="px-4 py-3">
                        {currencySymbol}
                        {e.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {currencySymbol}
                        {e.paid_amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        {currencySymbol}
                        {e.remaining_amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={e.payment_status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="secondary" onClick={() => openEdit(e)}>
                            Edit
                          </Button>
                          <button
                            onClick={() => setDeleteTarget(e)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        )}

        {data && <Pagination page={page} pageSize={10} total={data.total} onPageChange={setPage} />}
      </Card>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Work Entry" : "Add Work Entry"} maxWidth="max-w-xl">
        <WorkEntryForm
          customers={customers}
          defaultValues={editing}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          isSubmitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Delete Work Entry"
        message="Are you sure you want to delete this work entry and its associated payments?"
      />
    </div>
  );
}
