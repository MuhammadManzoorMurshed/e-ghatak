"use client";

import { auth } from '@/lib/firebase/client';
import { ResetPasswordFormData, resetPasswordSchema } from '@/lib/validations/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const ResetPasswordPage = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    async function onSubmit(data: ResetPasswordFormData) {
        setServerError(null);

        try {
            await sendPasswordResetEmail(auth, data.email);
            setIsSuccess(true);
        } catch (error: unknown) {
            if(error instanceof FirebaseError && error.code === 'auth/user-not-found') {
                setServerError('এই ইমেইল কোনো অ্যাকাউন্ট পাওয়া যায়নি।')
            } else {
                setServerError('কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।');
            }
        }
    }

    if(isSuccess) {
        return (
            <div className="success-box">
                <h2>রিসেট ইমেইল পাঠানো হয়েছে</h2>
                <p>পাসওয়ার্ডের রিসেট করার একটা লিঙ্ক আপনার ইমেইলে পাঠানো হয়েছে। ইমেইল চেক করুন।</p>

                <Link href={'/sign-in'}>সাইন ইন করুন</Link>
            </div>
        )
    }

    return (
        <div className='auth-container'>
            <h1>পাসওয়ার্ড রিসেট করুন</h1>
            <p>আপনার ইমেইল অ্যাড্রেস দিন। সেই ইমেইলে আপনাকে একটি রিসেট লিঙ্ক পাঠানো হবে।</p>

            <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="field">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" {...register('email')} placeholder="example@gmail.com" />

                {
                    errors.email && (
                        <span className='error'>{errors.email.message}</span>
                    )
                }
            </div>

            {/* Server Error */}
            {
                serverError && (
                    <div className="server-error">{serverError}</div>
                )
            }

            {/* Submit Button */}
            <button type='submit' disabled={isSubmitting}>
                {
                    isSubmitting ? 'অপেক্ষা করুন...' : 'রিসেট লিঙ্ক পাঠান'
                }
            </button>
            </form>
            
        </div>
    );
};

export default ResetPasswordPage;