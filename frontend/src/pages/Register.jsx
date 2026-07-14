import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      toast.success("Account created! Welcome to Worker Ledger.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create your account</h2>
      <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">Start tracking your work in under a minute.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Input
          label="Full Name"
          placeholder="Ramesh Kumar"
          error={errors.full_name?.message}
          {...register("full_name", { required: "Full name is required" })}
        />
        <Input
          label="Phone Number"
          placeholder="9876543210"
          error={errors.phone_number?.message}
          {...register("phone_number", { required: "Phone number is required" })}
        />
        <Input
          label="Trade (optional)"
          placeholder="Painter, Electrician, Plumber..."
          {...register("trade")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 6 characters"
          error={errors.password?.message}
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-600 font-medium hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
