"use client";

import { auth } from '@/lib/firebase/client';
import { SignUpFormData, signUpSchema } from '@/lib/validations/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const SignUpPage = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    async function onSubmit(data: SignUpFormData) {
        setServerError(null);

        try {
            // Create user in Firebase
            const userCredentials = await createUserWithEmailAndPassword(auth, data.email, data.password);

            // Send email verification
            await sendEmailVerification(userCredentials.user);

            // Get token from firebase
            const token = await userCredentials.user.getIdToken();

            // Sync user data in MongoDB
            const response = await fetch('/api/v1/auth/sync-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firebaseUid: userCredentials.user.uid,
                    email: userCredentials.user.email,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।');
            }

            setIsSuccess(true);
        } catch (error: unknown) {
            if(error instanceof FirebaseError && error.code == 'auth/email-already-in-use') {
                setServerError('এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট তৈরি হয়েছে।');
            } else {
                setServerError('কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।');
            }
        }
    }

    if(isSuccess) {
        return (
            <div className="success-box">
                <h2>ইমেইল চেক করুন।</h2>
                <p>আপনার ইমেইলে একটি ভেরিফিক্যাশন লিঙ্ক পাঠানো হয়েছে। ইমেইল চেক করে ভেরিফাই করুন, তারপর সাইন ইন করুন।</p>

                <Link href={'/sign-in'}>সাইন ইন করুন</Link>
            </div>
        )
    }

    return (
        <div>
            <h1>অ্যাকাউন্ট তৈরি করুন</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
                <div className="field">
                    <label htmlFor="email">ইমেইল অ্যাড্রেস</label>
                    <input type="email" id="email" {...register('email')} placeholder='example@gmail.com' />

                    {
                        errors.email && (
                            <span className='error'>{errors.email.message}</span>
                        )
                    }
                </div>

                {/* Password */}
                <div className="field">
                    <label htmlFor="password">পাসওয়ার্ড</label>
                    <input type="password" id="password" {...register('password')} placeholder='কমপক্ষে ৬ ক্যারেক্টার' />

                    {
                        errors.password && (
                            <span className='error'>{errors.password.message}</span>
                        )
                    }
                </div>

                {/* Confirm Password */}
                <div className="field">
                    <label htmlFor="confirm-password">পাসওয়ার্ড নিশ্চিত করুন</label>
                    <input type="password" id="confirm-password" {...register('confirmPassword')} placeholder='পাসওয়ার্ডটি আবার লিখুন' />

                    {
                        errors.confirmPassword && (
                            <span className='error'>{errors.confirmPassword.message}</span>
                        )
                    }
                </div>

                {/* Server Error */}
                {
                    serverError && (
                        <div className='server-error'>{serverError}</div>
                    )
                }

                {/* Submit */}
                <button type='submit' disabled={isSubmitting}>
                    {
                        isSubmitting ? 'অপেক্ষা করুন...' : 'অ্যাকাউন্ট তৈরি করুন'
                    }
                </button>
            </form>

            <p>আগেই অ্যাকাউন্ট আছে?{' '}<Link href={'/sign-in'}>সাইন ইন করুন</Link></p>
        </div>
    );
};

export default SignUpPage;