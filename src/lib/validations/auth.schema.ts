import { z } from "zod";

export const signUpSchema = z.object({
    email: z.string().min(1, 'আপনার ইমেইল দিন').email('বৈধ ইমেইল অ্যাড্রেস দিন'),
    password: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে').max(50, 'পাসওয়ার্ড সর্বোচ্চ ৫০ ক্যারেক্টার হতে পারবে'),
    confirmPassword: z.string().min(6, 'পাসওয়ার্ড কমপক্ষে ৬ ক্যারেক্টার হতে হবে').max(50, 'পাসওয়ার্ড সর্বোচ্চ ৫০ ক্যারেক্টার হতে পারবে'),
}).refine(
    (data) => data.password === data.confirmPassword,

    {
        message: 'পাসওয়ার্ড মিলছে না',
        path: ['confirmPassword'],
    }
);

export const signInSchema = z.object({
    email: z.string().min(1, 'আপনার ইমেইল দিন').email('বৈধ ইমেইল অ্যাড্রেস দিন'),
    password: z.string().min(1, 'আপনার পাসওয়ার্ড দিন'),

});

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;