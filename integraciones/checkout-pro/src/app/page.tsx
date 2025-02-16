'use client';

import { DocumentTextIcon } from '@heroicons/react/24/outline';
import CVForm from '@/components/CVForm';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <DocumentTextIcon className="text-gray-800 w-8 h-8" />
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
