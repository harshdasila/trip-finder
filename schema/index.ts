import * as z from "zod";

export const addTripSchema = z.object({
    title: z.string().min(1, 'Title is required.'),
    description: z.string().optional(),
    maxPeople: z.coerce.number()
        .min(2, "Must be at least 2")
        .positive("Must be a positive number"),
    minBudget: z.string(),
    maxBudget: z.string(),
    genderTrip: z.string().min(1, "Please select a option")
}).refine((data) => {
    const minBudget = parseFloat(data.minBudget);
    const maxBudget = parseFloat(data.maxBudget);
    
    // Check if both are valid numbers
    if (isNaN(minBudget) || isNaN(maxBudget)) {
        return true; // Let individual field validation handle this
    }
    
    return minBudget <= maxBudget;
}, {
    message: "Minimum budget cannot be greater than maximum budget",
    path: ["minBudget"], // This will show the error on the minBudget field
});
