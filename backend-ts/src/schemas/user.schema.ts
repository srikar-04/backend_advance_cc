import * as z from 'zod'

export const user = z.object({
    username: z.string().trim().toLowerCase().min(3, {error: 'username should be above 3 characters'}),
    email: z.email({
        error: 'invalid email format'
    }),
    password: z.string().trim().min(6, {error: 'password should be above 6 characters'}),
    refreshToken: z.jwt({error: 'invalid jwt found'}).optional(),
    fullName: z.string().trim().min(3, {error: 'fullname should be above 3 characters'}),
    watchHistory: z.array(
        z.string().regex(/^[a-fA-F0-9]{24}$/, {error: "Invalid ObjectId Format"})
    ).optional(),
    avatar: z.string().optional(),
    coverImage: z.string().optional()
})

export type UserInput = z.infer<typeof user>