import Link from 'next/link';
import React from 'react';

const VerifyEmailPage = () => {
    return (
        <div className='auth-container'>
            <h1>ইমেইল ভেরিফিকেশন</h1>
            <p>আপনার ইমেইল সফলভাবে ভেরিফাই করা হয়েছে। এখন সাইন ইন করে আপনার অ্যাকাউন্ট ব্যবহার করতে পারবেন।</p>
            <Link href={'/sign-in'}>সাইন ইন করুন</Link>
        </div>
    );
};

export default VerifyEmailPage;