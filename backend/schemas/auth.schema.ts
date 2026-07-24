
import z from "zod"
export const signupSchema=z.object({
    username:z.string().min(3,"Username must be atleast 3 characters"),
    password:z.string().min(6,"Password must be atleast 6 characters")
})


export const signInSchema=z.object({
    username:z.string().min(3,"Username must be atleast 3 characters"),
    password:z.string().min(6,"Password must be atleast 6 characters")
})

export const avatarImageSchema=z.object({
    name:z.string(),
    image:z.string()
})