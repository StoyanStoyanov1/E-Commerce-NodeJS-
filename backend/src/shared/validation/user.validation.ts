import {z} from "zod";

export const validatePhoneNumber = z.string().regex(
    /^\+?[1-9]\d{6,14}$/,
    "Invalid phone number format"
);

export const formatDate = z.string().regex(/^\d{2}-\d{2}-\d{4}$/, "Date must be in format DD-MM-YYYY");

export const validatePassword = z.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character"
);