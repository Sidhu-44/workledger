import { useEffect } from "react";
import { useForm } from "react-hook-form";

import Button from "../common/Button";
import Input from "../common/Input";

export default function CustomerForm({ defaultValues, onSubmit, onCancel, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  useEffect(() => {
    reset(defaultValues || {});
  }, [defaultValues, reset]);

  return (
    <form
        onSubmit={(e) => {
          console.log("FORM SUBMITTED");
          handleSubmit(onSubmit)(e);
        }}
        className="space-y-4"
      >
      <Input label="Name" error={errors.name?.message} {...register("name", { required: "Name is required" })} />
      <Input label="Phone Number" {...register("phone_number")} />
      <Input label="Address" {...register("address")} />
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes</label>
        <textarea
          rows={3}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 px-3.5 py-2.5 text-sm bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
          {...register("notes")}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
            type="submit"
            isLoading={isSubmitting}
            onClick={() => console.log("BUTTON CLICKED")}
          >
            Save Customer
          </Button>
      </div>
    </form>
  );
}
