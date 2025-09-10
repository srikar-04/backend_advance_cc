import * as z from 'zod'

export const video = z.object({
    thumbnail: z.string(),
    title: z.string().trim(),
    description: z.string(),
    views: z.number().default(0),
    owner: z.string().regex(/^[a-fA-F0-9]{24}$/, {error: "Invalid ObjectId Format"}).optional(),
    duration: z.number(),
    isPublished: z.boolean(),
    videoFile: z.string()
})

export type VideoInput = z.infer<typeof video>