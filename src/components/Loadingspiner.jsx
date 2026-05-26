import { FiLoader } from "react-icons/fi";

export default function LoadingSpinner() {
  return (

    <div className="flex justify-center items-center h-screen">

      <div className="flex flex-col items-center gap-3">

        {/* Spinner */}
        <FiLoader className="animate-spin text-blue-600" size={50} />

        {/* Text */}
        <p className="text-gray-600 font-medium">
          Loading...
        </p>

      </div>

    </div>
  );
}