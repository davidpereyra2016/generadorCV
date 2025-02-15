'use client';

import { FileText } from 'lucide-react';
import CVForm from '@/components/CVForm';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <FileText className="text-gray-800" size={32} />
            <h1 className="text-2xl font-bold text-gray-800">Generador de Curriculum Vitae</h1>
          </div>
        </div>
      </header>
      <main className="pb-16">
        <CVForm />
      </main>
    </div>
  )
}
