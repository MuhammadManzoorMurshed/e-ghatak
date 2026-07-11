"use client";

import { auth } from '@/lib/firebase/client';
import { SignInFormData, signInSchema } from '@/lib/validations/auth.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const SignInPage = () => {
    const router = useRouter();
    const [serverError, setserverError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInFormData) => {
        setserverError(null);

        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);

            router.push("/dashboard");
        } catch (error: unknown) {
            if (
                error instanceof FirebaseError &&
                (
                    error.code === 'auth/invalid-credential' ||
                    error.code === 'auth/wrong-password' ||
                    error.code === 'auth/user-not-found'
                )
            ) {
                setserverError('ইমেইল বা পাসওয়ার্ড ভুল আছে।')
            } else {
                setserverError('কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।');
            }
        }
    }

    return (
        <div className='auth-container'>
            <h1>সাইন ইন করুন</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Email */}
                <div className="field">
                    <label htmlFor="email">ইমেইল</label>
                    <input type="email" id="email" {...register('email')} placeholder='exmample@gamil.com' />

                    {
                        errors.email && (
                            <span className='error'>{errors.email.message}</span>
                        )
                    }
                </div>
                {/* Password */}
                <div className="field">
                    <label htmlFor="password">পাসওয়ার্ড</label>
                    <input type="password" id="" {...register('password')} placeholder='Type your password' />

                    {
                        errors.password && (
                            <span className="error">{errors.password.message}</span>
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
                        isSubmitting ? 'অপেক্ষা করুন...' : "সাইন ইন করুন"
                    }
                </button>
            </form>

            <p>পাসওয়ার্ড ভুলে গেছেন?{' '}
                <Link href={"/reset-password"}>রিসেট করুন</Link>
            </p>

            <p>নতুন ব্যবহারকারী?{' '}
                <Link href={"/sign-up"}>অ্যাকাউন্ট তৈরি করুন</Link>
            </p>
        </div>
    );
};

export default SignInPage;