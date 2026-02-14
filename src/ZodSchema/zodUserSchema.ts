import { z } from "zod";

export const createDoctorSchema = z.object({
  password: z
    .string("Password is required")
    .min(8, "Password must be at least 8 characters long"),

  doctror: z.object({
    name: z
      .string("Doctor name is required")
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string("Email is required")
      .email("Invalid email address"),

    profilePhoto: z.url("Profile photo must be a valid URL").optional(),

    contactNumber: z
      .string()
      .min(11, "Contact number must be at least 11 digits").max(14 , "Contact number must be at most 14 digits")
      .optional(),

    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .optional(),

    registrationNumber: z
      .string("Registration number is required")
      .min(5, "Registration number is too short"),

    experience: z
      .number()
      .int("Experience must be an integer")
      .min(0, "Experience cannot be negative")
      .optional(),

    gender: z.enum(["MALE", "FEMALE", "OTHER"], "Gender is required"),

    appointmentFee: z
      .number("Appointment fee is required")
      .min(0, "Appointment fee must be a positive number"),

    qualification: z
      .string("Qualification is required")
      .min(3, "Qualification must be at least 3 characters"),

    currentWorkingPlace: z
      .string( "Current working place is required")
      .min(3, "Working place must be at least 3 characters"),

    designation: z
      .string("Designation is required")
      .min(3, "Designation must be at least 3 characters"),
  }),

  specalities: z
    .array(z.uuid("Each speciality must be a valid UUID"), "Specalities are required")
    .min(1, "At least one speciality is required"),
});


export const updateDoctorSchema = z.object({
      name: z
      .string("Doctor name is required")
      .min(2, "Name must be at least 2 characters"),

    profilePhoto: z.url("Profile photo must be a valid URL").optional(),

    contactNumber: z
      .string()
      .min(11, "Contact number must be at least 11 digits").max(14 , "Contact number must be at most 14 digits")
      .optional(),

    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .optional(),

    registrationNumber: z
      .string("Registration number is required")
      .min(5, "Registration number is too short"),

    experience: z
      .number()
      .int("Experience must be an integer")
      .min(0, "Experience cannot be negative")
      .optional(),

    gender: z.enum(["MALE", "FEMALE", "OTHER"], "Gender is required"),

    appointmentFee: z
      .number("Appointment fee is required")
      .min(0, "Appointment fee must be a positive number"),

    qualification: z
      .string("Qualification is required")
      .min(3, "Qualification must be at least 3 characters"),

    currentWorkingPlace: z
      .string( "Current working place is required")
      .min(3, "Working place must be at least 3 characters"),

    designation: z
      .string("Designation is required")
      .min(3, "Designation must be at least 3 characters"),

}).partial()


export const createAdminSchema = z.object({
    password: z.string("Password is required").min(6, "Password must be 6 charecter long").max(16, "Password can't more then 16 charecter"),
  adminData: z.object({
    name: z.string("Name is required").max(20 , "Name can be maximum 20 charecter long!"),
    email: z.string("a valid email is required!").email("Invalid Email!"),
    image: z.string().optional()
  })

})
