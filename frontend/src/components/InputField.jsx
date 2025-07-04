import React from "react";

const InputField = ({ label, type, name, register, error }) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
      <input
        type={type}
        {...register(name)}
        className="w-full px-4 py-2 bg-gray-800 border-gray-700 text-white rounded-md focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
};

export default InputField;
