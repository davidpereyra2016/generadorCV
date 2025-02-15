import React from "react";

import {CVData} from "../types/cv";
import {capitalizeWords, capitalizeFirstLetter} from "../utils/text";

interface CVPreviewProps {
  cvData: CVData;
}

const CVPreview: React.FC<CVPreviewProps> = ({cvData}) => {
  // Paleta de colores profesional
  const colors = {
    primary: "#1a4f7c", // Azul profesional oscuro
    secondary: "#f5f5f5", // Gris muy claro
    accent: "#2c7da0", // Azul medio para detalles
    text: "#2d3748", // Gris oscuro para texto
    textLight: "#4a5568", // Gris medio para texto secundario
  };

  return (
    <div
      className="mx-auto max-h-[calc(100vh-12rem)] w-full max-w-[210mm] origin-top scale-[0.85] overflow-auto bg-white shadow-lg"
      style={{fontFamily: "Arial, sans-serif"}}
    >
      {" "}
      {/* Encabezado */}
      <header className="relative p-8 text-white" style={{backgroundColor: colors.primary}}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="mb-2 text-3xl font-bold">{capitalizeWords(cvData.nombreCompleto)}</h1>
            <h2 className="mb-4 text-xl font-light">{capitalizeWords(cvData.titulo)}</h2>
            
            {/* Información Personal en Columna */}
            <div className="mb-4 space-y-2 text-sm">
              {cvData.dni && (
                <p className="flex items-center">
                  <span className="font-semibold mr-2">DNI:</span> 
                  {cvData.dni.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                </p>
              )}
              {cvData.fechaNacimiento && (
                <p className="flex items-center">
                  <span className="font-semibold mr-2">Fecha de Nacimiento:</span>
                  {new Date(cvData.fechaNacimiento).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </p>
              )}
              {cvData.edad && (
                <p className="flex items-center">
                  <span className="font-semibold mr-2">Edad:</span>
                  {cvData.edad} años
                </p>
              )}
            </div>

            {/* Información de Contacto en Fila */}
            <div className="grid grid-cols-1 gap-2 text-sm border-t pt-3 overflow-x-auto">
              <div className="flex flex-nowrap min-w-max gap-6">
                {cvData.email && (
                  <p className="flex items-center whitespace-nowrap">
                    <span className="font-semibold mr-2">Email:</span>
                    {cvData.email}
                  </p>
                )}
                {cvData.telefono && (
                  <p className="flex items-center whitespace-nowrap">
                    <span className="font-semibold mr-2">Teléfono:</span>
                    {cvData.telefono.toString().replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2-$3')}
                  </p>
                )}
                {cvData.direccion && (
                  <p className="flex items-center whitespace-nowrap">
                    <span className="font-semibold mr-2">Dirección:</span>
                    {capitalizeWords(cvData.direccion)}
                  </p>
                )}
              </div>
            </div>
          </div>
          {cvData.foto && (
            <div className="ml-4">
              <img
                alt="Foto de perfil"
                className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
                src={cvData.foto}
              />
            </div>
          )}
        </div>
      </header>
      <main className="space-y-6 p-8">
        {/* Resumen */}
        {cvData.resumen && (
          <section>
            <h3
              className="mb-3 border-b-2 pb-1 text-lg font-bold"
              style={{color: colors.primary, borderColor: colors.accent}}
            >
              PERFIL PROFESIONAL
            </h3>
            <p className="text-justify" style={{color: colors.text}}>
              {capitalizeFirstLetter(cvData.resumen)}
            </p>
          </section>
        )}

        {/* Experiencia */}
        {cvData.experiencia.length > 0 && (
          <section>
            <h3
              className="mb-3 border-b-2 pb-1 text-lg font-bold"
              style={{color: colors.primary, borderColor: colors.accent}}
            >
              EXPERIENCIA LABORAL
            </h3>
            <div className="space-y-4">
              {cvData.experiencia.map((exp, index) => (
                <div
                  key={index}
                  className="relative border-l-2 pl-4"
                  style={{borderColor: colors.accent}}
                >
                  <div className="mb-1 flex justify-between items-start">
                    <div>
                      <h4 className="font-bold" style={{color: colors.primary}}>
                        {capitalizeWords(exp.empresa)}
                      </h4>
                      <p className="text-sm font-semibold" style={{color: colors.textLight}}>
                        {capitalizeWords(exp.cargo)}
                      </p>
                    </div>
                    <p className="text-sm italic" style={{color: colors.textLight}}>
                      {exp.fechaInicio} - {exp.fechaFin || "Presente"}
                    </p>
                  </div>
                  <p className="text-justify text-sm" style={{color: colors.text}}>
                    {capitalizeFirstLetter(exp.descripcion)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Educación */}
        {cvData.educacion.length > 0 && (
          <section>
            <h3
              className="mb-3 border-b-2 pb-1 text-lg font-bold"
              style={{color: colors.primary, borderColor: colors.accent}}
            >
              EDUCACIÓN
            </h3>
            <div className="space-y-4">
              {cvData.educacion.map((edu, index) => (
                <div
                  key={index}
                  className="relative border-l-2 pl-4"
                  style={{borderColor: colors.accent}}
                >
                  <div className="mb-1 flex justify-between items-start">
                    <div>
                      <h4 className="font-bold" style={{color: colors.primary}}>
                        {capitalizeWords(edu.institucion)}
                      </h4>
                      <p className="text-sm font-semibold" style={{color: colors.textLight}}>
                        {capitalizeWords(edu.titulo)}
                      </p>
                    </div>
                    <p className="text-sm italic" style={{color: colors.textLight}}>
                      {edu.fechaInicio} - {edu.fechaFin || "Presente"}
                    </p>
                  </div>
                  <p className="text-justify text-sm" style={{color: colors.text}}>
                    {capitalizeFirstLetter(edu.descripcion)}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Habilidades */}
        {cvData.habilidades.length > 0 && (
          <section>
            <h3
              className="mb-3 border-b-2 pb-1 text-lg font-bold"
              style={{color: colors.primary, borderColor: colors.accent}}
            >
              HABILIDADES
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {cvData.habilidades.map((habilidad, index) => (
                <div
                  key={index}
                  className="flex items-center rounded p-2"
                  style={{backgroundColor: colors.secondary}}
                >
                  <span className="text-sm" style={{color: colors.text}}>
                    {capitalizeFirstLetter(habilidad)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CVPreview;
