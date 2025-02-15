'use client';

import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import CVPreview from './CVPreview';
import { CVData } from '@/types/cv';

interface CVPdfGeneratorProps {
  cvData: CVData;
  onGenerated: (pdfBlob: Blob) => void;
}

const CVPdfGenerator: React.FC<CVPdfGeneratorProps> = ({ cvData, onGenerated }) => {
  useEffect(() => {
    const generatePdf = async () => {
      // Crear un contenedor temporal para el CV
      const container = document.createElement('div');
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.width = '794px'; // Ancho A4 en px
      document.body.appendChild(container);

      // Renderizar el CV en el contenedor
      const root = document.createElement('div');
      root.style.width = '100%';
      root.style.backgroundColor = 'white';
      container.appendChild(root);

      // Renderizar el componente CVPreview
      const ReactDOM = (await import('react-dom/client')).default;
      const cvRoot = ReactDOM.createRoot(root);
      cvRoot.render(<CVPreview cvData={cvData} />);

      // Esperar a que se carguen las fuentes y las imágenes
      await new Promise(resolve => setTimeout(resolve, 1000));

      try {
        // Convertir el CV a canvas
        const canvas = await html2canvas(root, {
          scale: 2,
          useCORS: true,
          logging: false,
          windowWidth: 794,
        });

        // Crear el PDF
        const pdf = new jsPDF({
          format: "a4",
          unit: "px",
        });

        // Agregar la imagen del canvas al PDF
        const imgData = canvas.toDataURL('image/png');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Convertir a Blob y llamar al callback
        const blob = pdf.output("blob");
        onGenerated(blob);
      } finally {
        // Limpiar
        document.body.removeChild(container);
      }
    };

    generatePdf();
  }, [cvData, onGenerated]);

  return null;
};

export default CVPdfGenerator;
