import React from 'react';
import { CVData } from '../types/cv';
import { capitalizeWords, capitalizeFirstLetter } from '../utils/text';

interface CVPreviewProps {
  cvData: CVData;
}

const CVPreviewBasic: React.FC<CVPreviewProps> = ({ cvData }) => {
  return (
    <div className="w-full max-w-[800px] mx-auto bg-white p-8 shadow-sm text-gray-800">
      {/* Encabezado */}
      <div className="mb-6 text-left">
        <h1 className="text-2xl font-bold mb-2 text-[#1a4f7c]">{capitalizeWords(cvData.nombreCompleto)}</h1>
        <h2 className="text-lg text-[#2d3748] mb-4">{capitalizeWords(cvData.titulo)}</h2>
        
        {/* Información Personal */}
        <div className="mb-4 space-y-2 text-sm">
          {cvData.dni && (
            <p className="flex items-center">
              <span className="font-semibold text-[#4a5568] mr-2">DNI:</span>
              {cvData.dni.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </p>
          )}
          {cvData.fechaNacimiento && (
            <p className="flex items-center">
              <span className="font-semibold text-[#4a5568] mr-2">Fecha de Nacimiento:</span>
              {new Date(cvData.fechaNacimiento).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </p>
          )}
          {cvData.edad && (
            <p className="flex items-center">
              <span className="font-semibold text-[#4a5568] mr-2">Edad:</span>
              {cvData.edad} años
            </p>
          )}
        </div>

        {/* Información de Contacto */}
        <div className="grid grid-cols-1 gap-2 text-sm border-t border-gray-200 pt-3 overflow-x-auto">
          <div className="flex flex-nowrap min-w-max gap-6">
            {cvData.email && (
              <p className="flex items-center whitespace-nowrap">
                <span className="font-semibold text-[#4a5568] mr-2">Email:</span>
                {cvData.email}
              </p>
            )}
            {cvData.telefono && (
              <p className="flex items-center whitespace-nowrap">
                <span className="font-semibold text-[#4a5568] mr-2">Teléfono:</span>
                {cvData.telefono.toString().replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2-$3')}
              </p>
            )}
            {cvData.direccion && (
              <p className="flex items-center whitespace-nowrap">
                <span className="font-semibold text-[#4a5568] mr-2">Dirección:</span>
                {capitalizeWords(cvData.direccion)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Resumen */}
      {cvData.resumen && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#1a4f7c] border-b-2 border-[#1a4f7c] pb-1 mb-3">
            PERFIL PROFESIONAL
          </h2>
          <p className="text-sm text-[#2d3748]">{capitalizeFirstLetter(cvData.resumen)}</p>
        </div>
      )}

      {/* Experiencia */}
      {cvData.experiencia.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#1a4f7c] border-b-2 border-[#1a4f7c] pb-1 mb-3">
            EXPERIENCIA LABORAL
          </h2>
          {cvData.experiencia.map((exp, index) => (
            <div key={index} className="mb-6 relative">
              <h3 className="text-base font-semibold text-[#2d3748] mb-1">{capitalizeWords(exp.cargo)}</h3>
              <p className="text-sm text-[#4a5568] mb-1">{capitalizeWords(exp.empresa)}</p>
              <p className="text-sm text-[#718096] absolute top-0 right-0">
                {exp.fechaInicio} - {exp.fechaFin || "Presente"}
              </p>
              <p className="text-sm text-[#2d3748] mt-2">{capitalizeFirstLetter(exp.descripcion)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Educación */}
      {cvData.educacion.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#1a4f7c] border-b-2 border-[#1a4f7c] pb-1 mb-3">
            EDUCACIÓN
          </h2>
          {cvData.educacion.map((edu, index) => (
            <div key={index} className="mb-6 relative">
              <h3 className="text-base font-semibold text-[#2d3748] mb-1">{capitalizeWords(edu.titulo)}</h3>
              <p className="text-sm text-[#4a5568] mb-1">{capitalizeWords(edu.institucion)}</p>
              <p className="text-sm text-[#718096] absolute top-0 right-0">
                {edu.fechaInicio} - {edu.fechaFin || "Presente"}
              </p>
              <p className="text-sm text-[#2d3748] mt-2">{capitalizeFirstLetter(edu.descripcion)}</p>
            </div>
          ))}
        </div>
      )}

      {/* Habilidades */}
      {cvData.habilidades.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-[#1a4f7c] border-b-2 border-[#1a4f7c] pb-1 mb-3">
            HABILIDADES
          </h2>
          <div className="flex flex-wrap gap-2">
            {cvData.habilidades.map((habilidad, index) => (
              <span key={index} className="text-sm text-white bg-[#1a4f7c] px-3 py-1 rounded-full">
                {capitalizeFirstLetter(habilidad)}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CVPreviewBasic;
