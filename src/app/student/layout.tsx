'use client';

import React from 'react';

// Simple passthrough layout — auth is handled per-page
// This avoids redirect loops that happen when layout guards /student/login itself
export default function StudentLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
