'use client';

import { Suspense } from 'react';
import AuthSuccessContent from './AuthSuccessContent';

export default function AuthSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#c4a882] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthSuccessContent />
    </Suspense>
  );
}
