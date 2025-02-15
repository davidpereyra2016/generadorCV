export interface ExperienciaLaboral {
  empresa: string;
  cargo: string;
  fechaInicio: Date;
  fechaFin: Date;
  descripcion: string;
}

export interface Educacion {
  institucion: string;
  titulo: string;
  fechaInicio: Date;
  fechaFin: Date;
  descripcion: string;
}

export interface CVData {
  nombreCompleto: string;
  titulo: string;
  email: string;
  telefono: number;
  direccion: string;
  fechaNacimiento: Date;
  dni: number;
  edad: number;
  foto: string;
  resumen: string;
  experiencia: ExperienciaLaboral[];
  educacion: Educacion[];
  habilidades: string[];
  plantilla: "basica" | "profesional";
}
