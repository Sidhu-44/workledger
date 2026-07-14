import { Phone, Plus, Search, Trash2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import Button from "../components/common/Button";
import Card from "../components/common/Card";
import ConfirmDialog from "../components/common/ConfirmDialog";
import EmptyState from "../components/common/EmptyState";
import Modal from "../components/common/Modal";
import PageHeader from "../components/common/PageHeader";
import Pagination from "../components/common/Pagination";
import { SkeletonTable } from "../components/common/Skeleton";
import CustomerForm from "../components/customers/CustomerForm";
import { customerService } from "../services/customerService";

export default function Customers() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    customerService
      .list({ search: search || undefined, sort_by: sortBy, sort_dir: sortDir, page, page_size: 10 })
      .then(setData)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(load, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sortBy, sortDir, page]);

  const toggleSort = (column) => {
    if (sortBy === column) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
  };

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (customer) => {
    setEditing(customer);
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editing) {
        await customerService.update(editing.id, values);
        toast.success("Customer updated.");
      } else {
        await customerService.create(values);
        toast.success("Customer added.");
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
      await customerService.remove(deleteTarget.id);
      toast.success("Customer deleted.");
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not delete customer.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Everyone you've worked for, in one place."
        action={
          <Button onClick={openCreate}>
            <Plus size={16} /> Add Customer
          </Button>
        }
      />

      <Card>
        <div className="p-4 border-b border-gray-100 dark:border-gray-800">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search customers..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {!loading && data?.items?.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No customers yet"
            description="Add your first customer to start logging work and payments."
            action={
              <Button onClick={openCreate}>
                <Plus size={16} /> Add Customer
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-100 dark:border-gray-800">
                  <th className="px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort("name")}>
                    Name {sortBy === "name" && (sortDir === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              {loading ? (
                <SkeletonTable rows={5} columns={4} />
              ) : (
                <tbody>
                  {data.items.map((c) => (
                    <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="px-4 py-3">
                        <Link to={`/customers/${c.id}`} className="font-medium text-brand-700 dark:text-brand-400 hover:underline">
                          {c.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                        {c.phone_number ? (
                          <span className="flex items-center gap-1.5">
                            <Phone size={13} className="text-gray-400" /> {c.phone_number}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{c.address || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="secondary" onClick={() => openEdit(c)}>
                            Edit
                          </Button>
                          <button
                            onClick={() => setDeleteTarget(c)}
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Customer" : "Add Customer"}>
        <CustomerForm defaultValues={editing} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} isSubmitting={submitting} />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isLoading={deleting}
        title="Delete Customer"
        message={`Are you sure you want to delete ${deleteTarget?.name}? All their work entries and payments will also be removed.`}
      />
    </div>
  );
}
