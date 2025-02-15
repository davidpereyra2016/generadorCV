'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SuccessPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const downloadCV = async () => {
      try {
        const preferenceId = searchParams.get('preference_id');
        if (!preferenceId) return;

        // Iniciamos la descarga del PDF
        window.location.href = `/api/cv/download?preference_id=${preferenceId}`;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    downloadCV();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">¡Pago Exitoso!</h1>
        <p className="text-gray-600">Tu CV se está descargando automáticamente...</p>
        <p className="text-gray-600 mt-4">Si la descarga no comienza automáticamente, haz click <a href={`/api/cv/download?preference_id=${searchParams.get('preference_id')}`} className="text-blue-500 hover:text-blue-700">aquí</a></p>
      </div>
    </div>
  );
}
