import { useForm } from "react-hook-form";
import { IoArrowBackCircle } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { supabase_client } from "../../../utils/supabaseClient";
import toast, { Toaster } from "react-hot-toast";

export default function GlassLoginPage() {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // =========================
  // LOGIN
  // =========================

  const onSubmit = async (formData) => {

    const toastId =
      toast.loading("Logging in...");

    const { data, error } =
      await supabase_client.auth
      .signInWithPassword({

        email: formData.email_id,
        password: formData.password,

      });

    toast.dismiss(toastId);

    if (error) {

      toast.error(error.message);

      return;
    }

    toast.success("Login Successfully");

    console.log(data);

    navigate("/Dashboard/Home");
  };

  return (

    <div
      data-aos="fade-down"
      data-aos-easing="linear"
      data-aos-duration="300"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 px-4 overflow-hidden relative"
    >

      <Toaster position="top-right" />

      {/* Background Glow */}
      <div className="absolute top-[-80px] left-[-80px] w-72 h-72 bg-cyan-300/30 blur-3xl rounded-full" />

      <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-purple-400/30 blur-3xl rounded-full" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 text-white">

        {/* Back Button */}
        <div className="flex justify-center">

          <IoArrowBackCircle
            size={50}
            color="white"
            className="cursor-pointer"
            onClick={() => navigate(-1)}
          />

        </div>

        {/* Heading */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-extrabold tracking-wide">
            Welcome Back
          </h1>

          <p className="text-white/70 mt-3 text-sm sm:text-base">
            Login to continue to ICE Computer Dashboard
          </p>

        </div>

        {/* FORM */}
        <form
          className="space-y-6"
          onSubmit={handleSubmit(onSubmit)}
        >

          {/* Email */}
          <div>

            <label className="block mb-2 text-sm font-medium text-white/80">
              Email
            </label>

            <input
              {...register("email_id", {
                required: "Email ID is required",
              })}
              type="email"
              placeholder="Enter your email"
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-cyan-300 text-white placeholder:text-white/50 transition-all"
            />

            {errors.email_id && (

              <p className="text-red-300 text-sm mt-1">
                {errors.email_id.message}
              </p>

            )}

          </div>

          {/* Password */}
          <div>

            <label className="block mb-2 text-sm font-medium text-white/80">
              Password
            </label>

            <input
              {...register("password", {
                required: "Password is required",
              })}
              type="password"
              placeholder="Enter your password"
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-cyan-300 text-white placeholder:text-white/50 transition-all"
            />

            {errors.password && (

              <p className="text-red-300 text-sm mt-1">
                {errors.password.message}
              </p>

            )}

          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">

            <button
              type="button"
              className="text-sm text-cyan-200 hover:text-white transition-all"
            >
              Forgot Password?
            </button>

          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            className="w-full bg-white text-blue-700 hover:bg-cyan-100 transition-all py-3 rounded-2xl font-bold text-lg shadow-lg"
          >
            Login
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-sm text-white/60 mt-8">
          © 2026 ICE Computer Institute
        </p>

      </div>

    </div>
  );
}