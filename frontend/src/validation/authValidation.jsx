import { z } from "zod";

// ✅ Reusable validation for email and password
export const emailSchema = z.string().email("Invalid email address");
export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .max(30, "Password cannot exceed 30 characters");

// ✅ Login Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// ✅ Signup Schema (includes name & confirm password)
export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
