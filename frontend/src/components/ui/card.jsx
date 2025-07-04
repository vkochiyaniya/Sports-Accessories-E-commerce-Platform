import React from "react";

export function Card({ children, className }) {
  return <div className={`p-6 bg-gray-900 rounded-xl shadow-lg ${className}`}>{children}</div>;
}

export function CardHeader({ children, className }) {
  return <div className={`mb-4 text-center ${className}`}>{children}</div>;
}

export function CardTitle({ children, className }) {
  return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;
}

export function CardDescription({ children, className }) {
  return <p className={`text-sm text-gray-400 ${className}`}>{children}</p>;
}

export function CardContent({ children, className }) {
  return <div className={className}>{children}</div>;
}
