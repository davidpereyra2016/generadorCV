"use client";

import React, {useState} from "react";
import {PlusCircle, MinusCircle, Upload} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {CVData, ExperienciaLaboral, Educacion} from "../types/cv";

import CVPreview from "./CVPreview";
import CVPreviewBasic from "./CVPreviewBasic";

const CVForm: React.FC = () => {
  const [cvData, setCVData] = useState<CVData>({
    nombreCompleto: "",
    fechaNacimiento: "",
    dni: "",
    edad: "",
    titulo: "",
    email: "",
    telefono: "",
    direccion: "",
    foto: "",
    resumen: "",
    experiencia: [],
    educacion: [],
    habilidades: [],
    plantilla: "profesional",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setCVData({...cvData, foto: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const agregarExperiencia = () => {
    setCVData({
      ...cvData,
      experiencia: [
        ...cvData.experiencia,
        {
          cargo: "",
          empresa: "",
          fechaInicio: "",
          fechaFin: "",
          descripcion: "",
        },
      ],
    });
  };

  const agregarEducacion = () => {
    setCVData({
      ...cvData,
      educacion: [
        ...cvData.educacion,
        {
          titulo: "",
          institucion: "",
          fechaInicio: "",
          fechaFin: "",
          descripcion: "",
        },
      ],
    });
  };

  const handleExperienciaChange = (index: number, field: string, value: string) => {
    const experiencia = [...cvData.experiencia];

    experiencia[index] = {
      ...experiencia[index],
      [field]: value,
    };
    setCVData({...cvData, experiencia});
  };

  const handleEducacionChange = (index: number, field: string, value: string) => {
    const educacion = [...cvData.educacion];

    educacion[index] = {
      ...educacion[index],
      [field]: value,
    };
    setCVData({...cvData, educacion});
  };

  const eliminarExperiencia = (index: number) => {
    setCVData({
      ...cvData,
      experiencia: cvData.experiencia.filter((_, i) => i !== index),
    });
  };

  const eliminarEducacion = (index: number) => {
    setCVData({
      ...cvData,
      educacion: cvData.educacion.filter((_, i) => i !== index),
    });
  };

  const generatePDF = async () => {
    const cvElement = document.getElementById("cv-preview");

    if (!cvElement) return null;

    try {
      // Configuración de tamaño A4
      const a4Width = 210; // mm
      const a4Height = 297; // mm
      const mmToPx = 3.779528; // Factor de conversión de mm a px

      // Configurar html2canvas con opciones mejoradas
      const canvas = await html2canvas(cvElement, {
        scale: 2, // Mayor calidad
        useCORS: true, // Permitir imágenes de otros dominios
        logging: false, // Desactivar logs
        windowWidth: a4Width * mmToPx,
        windowHeight: a4Height * mmToPx,
        backgroundColor: "#ffffff", // Fondo blanco
        onclone: (document) => {
          // Asegurarnos que los estilos se apliquen correctamente en el PDF
          const element = document.getElementById("cv-preview");

          if (element) {
            element.style.width = `${a4Width}mm`;
            element.style.height = "auto";
            element.style.margin = "0";
            element.style.padding = "0";
          }
        },
      });

      // Crear PDF en formato A4
      const pdf = new jsPDF({
        format: "a4",
        unit: "mm",
        orientation: "portrait",
      });

      // Obtener dimensiones
      const imgWidth = a4Width;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Agregar la imagen al PDF con máxima calidad
      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

      return pdf.output("blob");
    } catch (error) {
      console.error("Error generating PDF:", error);

      return null;
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Creamos la preferencia de pago
      const response = await fetch("/api/cv/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plantilla: cvData.plantilla,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al procesar la solicitud de pago");
      }

      const paymentData = await response.json();

      // Guardamos el CV con el ID de la preferencia
      const saveResponse = await fetch("/api/cv/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...cvData,
          payment_id: paymentData.id, // Usamos el ID de la preferencia
        }),
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();

        throw new Error(errorData.error || "Error al guardar el CV");
      }

      // Redirigimos al usuario a la URL de pago de MercadoPago
      if (paymentData.init_point) {
        window.location.href = paymentData.init_point;
      } else {
        throw new Error("No se recibió la URL de pago");
      }
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Selector de Plantilla al inicio */}
      <div className="mx-auto mb-8 max-w-3xl">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-800">Selecciona el Estilo de tu CV</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <button
              className={`rounded-lg border-2 p-6 text-center transition-all hover:shadow-md ${
                cvData.plantilla === "basica"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-blue-500"
              }`}
              onClick={() => setCVData({...cvData, plantilla: "basica"})}
            >
              <h3 className="mb-2 text-lg font-semibold">Plantilla Básica</h3>
              <p className="mb-2 text-sm text-gray-600">
                Diseño clásico y minimalista, perfecto para un CV tradicional
              </p>
              <p className="text-lg font-bold text-blue-600">$1000 ARS</p>
            </button>
            <button
              className={`rounded-lg border-2 p-6 text-center transition-all hover:shadow-md ${
                cvData.plantilla === "profesional"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-blue-500"
              }`}
              onClick={() => setCVData({...cvData, plantilla: "profesional"})}
            >
              <h3 className="mb-2 text-lg font-semibold">Plantilla Profesional</h3>
              <p className="mb-2 text-sm text-gray-600">
                Diseño moderno y elegante, ideal para destacar tu perfil
              </p>
              <p className="text-lg font-bold text-blue-600">$2000 ARS</p>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Información Personal</h2>
            <div className="space-y-4">
              <div className="mb-6 flex flex-col items-center">
                <div className="mb-4 h-32 w-32 overflow-hidden rounded-full bg-gray-100">
                  {cvData.foto ? (
                    <img
                      alt="Foto de perfil"
                      className="h-full w-full object-cover"
                      src={cvData.foto}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                      <Upload size={32} />
                    </div>
                  )}
                </div>
                <label className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
                  <span className="flex items-center gap-2">
                    <Upload size={16} />
                    Subir Foto
                  </span>
                  <input
                    accept="image/*"
                    className="hidden"
                    type="file"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nombre Completo
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Juan Pérez González"
                  type="text"
                  value={cvData.nombreCompleto}
                  onChange={(e) => setCVData({...cvData, nombreCompleto: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">DNI</label>
                  <input
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 12.345.678"
                    type="number"
                    value={cvData.dni}
                    onChange={(e) => setCVData({...cvData, dni: e.target.value})}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Fecha de Nacimiento
                  </label>
                  <input
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Juan Pérez González"
                    type="date"
                    value={cvData.fechaNacimiento}
                    onChange={(e) => setCVData({...cvData, fechaNacimiento: e.target.value})}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Edad</label>
                  <input
                    className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 25"
                    type="number"
                    value={cvData.edad}
                    onChange={(e) => setCVData({...cvData, edad: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Título Profesional
                </label>
                <input
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Ingeniero de Software"
                  type="text"
                  value={cvData.titulo}
                  onChange={(e) => setCVData({...cvData, titulo: e.target.value})}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                <input
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: juan@ejemplo.com"
                  type="email"
                  value={cvData.email}
                  onChange={(e) => setCVData({...cvData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: +54 11 1234-5678"
                  type="tel"
                  value={cvData.telefono}
                  onChange={(e) => setCVData({...cvData, telefono: e.target.value})}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Dirección</label>
                <input
                  className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Ciudad, País"
                  type="text"
                  value={cvData.direccion}
                  onChange={(e) => setCVData({...cvData, direccion: e.target.value})}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Perfil Profesional
                </label>
                <textarea
                  className="h-32 w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Experiencias, Habilidades, Objetivos, etc..."
                  value={cvData.resumen}
                  onChange={(e) => setCVData({...cvData, resumen: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Experiencia Laboral */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Experiencia Laboral</h2>
              <button
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                onClick={agregarExperiencia}
              >
                <PlusCircle size={20} /> Agregar
              </button>
            </div>
            <div className="space-y-6">
              {cvData.experiencia.map((exp, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-2 flex justify-end">
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => eliminarExperiencia(index)}
                    >
                      <MinusCircle size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <input
                      className="w-full rounded-md border border-gray-300 p-2"
                      placeholder="Empresa"
                      type="text"
                      value={exp.empresa}
                      onChange={(e) => handleExperienciaChange(index, "empresa", e.target.value)}
                    />
                    <input
                      className="w-full rounded-md border border-gray-300 p-2"
                      placeholder="Cargo"
                      type="text"
                      value={exp.cargo}
                      onChange={(e) => handleExperienciaChange(index, "cargo", e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        className="w-full rounded-md border border-gray-300 p-2"
                        placeholder="Fecha Inicio"
                        type="date"
                        value={exp.fechaInicio}
                        onChange={(e) =>
                          handleExperienciaChange(index, "fechaInicio", e.target.value)
                        }
                      />
                      <input
                        className="w-full rounded-md border border-gray-300 p-2"
                        placeholder="Fecha Fin"
                        type="date"
                        value={exp.fechaFin}
                        onChange={(e) => handleExperienciaChange(index, "fechaFin", e.target.value)}
                      />
                    </div>
                    <textarea
                      className="h-24 w-full rounded-md border border-gray-300 p-2"
                      placeholder="Descripción de responsabilidades..."
                      value={exp.descripcion}
                      onChange={(e) =>
                        handleExperienciaChange(index, "descripcion", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Educación */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Educación</h2>
              <button
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                onClick={agregarEducacion}
              >
                <PlusCircle size={20} /> Agregar
              </button>
            </div>
            <div className="space-y-6">
              {cvData.educacion.map((edu, index) => (
                <div key={index} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-2 flex justify-end">
                    <button
                      className="text-red-500 hover:text-red-600"
                      onClick={() => eliminarEducacion(index)}
                    >
                      <MinusCircle size={20} />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <input
                      className="w-full rounded-md border border-gray-300 p-2"
                      placeholder="Institución"
                      type="text"
                      value={edu.institucion}
                      onChange={(e) => handleEducacionChange(index, "institucion", e.target.value)}
                    />
                    <input
                      className="w-full rounded-md border border-gray-300 p-2"
                      placeholder="Título"
                      type="text"
                      value={edu.titulo}
                      onChange={(e) => handleEducacionChange(index, "titulo", e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        className="w-full rounded-md border border-gray-300 p-2"
                        placeholder="Fecha Inicio"
                        type="date"
                        value={edu.fechaInicio}
                        onChange={(e) =>
                          handleEducacionChange(index, "fechaInicio", e.target.value)
                        }
                      />
                      <input
                        className="w-full rounded-md border border-gray-300 p-2"
                        placeholder="Fecha Fin"
                        type="date"
                        value={edu.fechaFin}
                        onChange={(e) => handleEducacionChange(index, "fechaFin", e.target.value)}
                      />
                    </div>
                    <textarea
                      className="h-24 w-full rounded-md border border-gray-300 p-2"
                      placeholder="Descripción..."
                      value={edu.descripcion}
                      onChange={(e) => handleEducacionChange(index, "descripcion", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Habilidades */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Habilidades</h2>
              <button
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                onClick={() => setCVData({...cvData, habilidades: [...cvData.habilidades, ""]})}
              >
                <PlusCircle size={20} /> Agregar
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {cvData.habilidades.map((habilidad, index) => (
                <div
                  key={index}
                  className="flex items-center overflow-hidden rounded-lg bg-gray-100"
                >
                  <input
                    className="bg-black px-3 py-2 focus:outline-none"
                    placeholder="Nueva habilidad"
                    type="text"
                    value={habilidad}
                    onChange={(e) => {
                      const habilidades = [...cvData.habilidades];

                      habilidades[index] = e.target.value;
                      setCVData({...cvData, habilidades});
                    }}
                  />
                  <button
                    className="px-2 py-2 text-red-500 hover:text-red-700"
                    onClick={() => {
                      const habilidades = [...cvData.habilidades];

                      habilidades.splice(index, 1);
                      setCVData({...cvData, habilidades});
                    }}
                  >
                    <MinusCircle size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Botón de Generar CV */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <form onSubmit={handleSubmit}>
              <button
                className="w-full rounded-md bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting
                  ? "Generando..."
                  : `Generar CV ${cvData.plantilla === "basica" ? "Básico" : "Profesional"} - ${cvData.plantilla === "basica" ? "$1000" : "$2000"} ARS`}
              </button>
              {error && <p className="mt-2 text-red-500">{error}</p>}
            </form>
          </div>
        </div>

        {/* Vista Previa */}
        <div className="lg:block">
          <div className="rounded-lg bg-white p-6 shadow-lg lg:sticky lg:top-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Vista Previa</h2>
            <div className="max-h-[calc(100vh-12rem)] overflow-auto" id="cv-preview">
              <div className="origin-top scale-[1] transform">
                {cvData.plantilla === "basica" ? (
                  <CVPreviewBasic cvData={cvData} />
                ) : (
                  <CVPreview cvData={cvData} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVForm;
