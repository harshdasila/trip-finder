import * as z from "zod";

export const addTripSchema = z.object({
    title: z.string().min(1, 'Title is required.'),
    description: z.string().optional(),
    maxPeople: z.coerce.number()
        .min(2, "Must be at least 2")
        .positive("Must be a positive number"),
    minBudget: z.string(),
    maxBudget: z.string(),
})
