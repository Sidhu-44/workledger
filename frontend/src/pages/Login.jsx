import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid phone number or password.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome back</h2>
      <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">Log in to manage your work and earnings.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
        <Input
          label="Phone Number"
          placeholder="9876543210"
          error={errors.phone_number?.message}
          {...register("phone_number", { required: "Phone number is required" })}
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password", { required: "Password is required" })}
        />
        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Log In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don't have an account?{" "}
        <Link to="/register" className="text-brand-600 font-medium hover:underline">
          Sign up
        </Link>
      </p>

      <div className="mt-6 p-3 rounded-lg bg-brand-50 dark:bg-brand-900/20 text-xs text-brand-800 dark:text-brand-300">
        Demo login: phone <strong>9999999999</strong>, password <strong>password123</strong> (after running the
        seed script).
      </div>
    </div>
  );
}
