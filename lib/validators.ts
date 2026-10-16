import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  gender: z.enum(["Male", "Female"], { message: "Gender must be Male or Female" }),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const lifestyleSchema = z.object({
  age: z.number().int().min(18, "Age must be at least 18").max(90, "Age must be at most 90"),
  bmi: z.number().min(10, "BMI must be at least 10").max(60, "BMI must be at most 60"),
  physicalActivity: z.enum(["Low", "Moderate", "High"]),
  smokingStatus: z.enum(["Never", "Former", "Current"]),
  alcoholConsumption: z.enum(["None", "Occasional", "Frequent", "Heavy"]),
  dietQuality: z.enum(["Poor", "Average", "Good"]),
  stressLevel: z.enum(["Low", "Moderate", "High"]),
  familyHistory: z.boolean(),
  saltIntake: z.enum(["Low", "Moderate", "High"]),
  sleepHours: z.number().min(3, "Sleep hours must be at least 3").max(12, "Sleep hours must be at most 12"),
  caffeineIntake: z.enum(["None", "Occasional", "Moderate", "Heavy"]),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LifestyleInput = z.infer<typeof lifestyleSchema>;
