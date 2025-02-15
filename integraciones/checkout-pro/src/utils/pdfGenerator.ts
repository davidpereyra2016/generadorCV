import puppeteer from "puppeteer";
import {CVData} from "@/types/cv";
import { capitalizeWords, capitalizeFirstLetter } from "@/utils/text";

const styles = {
  basica: `
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    .header {
      text-align: left;
      margin-bottom: 20px;
    }
    .header h1 {
      margin: 0 0 8px 0;
      font-size: 24px;
      color: #1a4f7c;
    }
    .header h2 {
      margin: 0 0 16px 0;
      font-size: 18px;
      color: #2d3748;
    }
    .personal-info {
      margin-bottom: 16px;
    }
    .personal-info p {
      margin: 4px 0;
      font-size: 14px;
    }
    .contact-info {
      margin-bottom: 16px;
    }
    .contact-info p {
      margin: 4px 0;
      font-size: 14px;
    }
    .info-label {
      font-weight: 600;
      margin-right: 8px;
      color: #4a5568;
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      border-bottom: 2px solid #1a4f7c;
      margin-bottom: 10px;
      padding-bottom: 5px;
      color: #1a4f7c;
      font-size: 18px;
    }
    .experience-item, .education-item {
      margin-bottom: 24px;
      position: relative;
    }
    .experience-item h3, .education-item h3 {
      margin: 0 0 4px 0;
      font-size: 16px;
      color: #2d3748;
    }
    .company, .institution {
      color: #4a5568;
      font-size: 14px;
      margin: 0 0 4px 0;
    }
    .date {
      color: #718096;
      font-size: 14px;
      position: absolute;
      top: 0;
      right: 0;
    }
    .description {
      color: #2d3748;
      font-size: 14px;
      margin: 8px 0;
    }
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .skill-item {
      background: #1a4f7c;
      color: white;
      padding: 4px 12px;
      border-radius: 15px;
      font-size: 14px;
    }
  `,
  profesional: `
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      color: #2d3748;
      background-color: white;
      min-height: 297mm;
      width: 210mm;
    }
    .header {
      background-color: #1a4f7c;
      padding: 32px;
      color: white;
      position: relative;
    }
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .header-text {
      flex: 1;
    }
    .header h1 {
      font-size: 24px;
      font-weight: bold;
      margin: 0 0 8px 0;
    }
    .header h2 {
      font-size: 20px;
      font-weight: 300;
      margin: 0 0 16px 0;
    }
    .personal-info {
      margin-bottom: 16px;
    }
    .personal-info p {
      font-size: 14px;
      margin: 4px 0;
    }
    .contact-info {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }
    .contact-info p {
      font-size: 14px;
      margin: 4px 0;
    }
    .info-label {
      font-weight: 600;
      margin-right: 8px;
    }
    .header-image {
      margin-left: 16px;
    }
    .header-image img {
      width: 128px;
      height: 128px;
      border-radius: 50%;
      border: 4px solid white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      object-fit: cover;
    }
    .main-content {
      padding: 32px;
    }
    .section {
      margin-bottom: 24px;
    }
    .section-title {
      color: #1a4f7c;
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 12px;
      padding-bottom: 4px;
      border-bottom: 2px solid #2c7da0;
    }
    .experience-item, .education-item {
      margin-bottom: 24px;
      position: relative;
    }
    .experience-item h3, .education-item h3 {
      color: #2d3748;
      font-size: 16px;
      margin: 0 0 4px 0;
    }
    .company, .institution {
      color: #4a5568;
      font-size: 14px;
      margin: 0 0 4px 0;
    }
    .date {
      color: #718096;
      font-size: 14px;
      position: absolute;
      top: 0;
      right: 0;
    }
    .description {
      color: #2d3748;
      font-size: 14px;
      text-align: justify;
    }
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .skill-item {
      background: #2c7da0;
      color: white;
      padding: 4px 12px;
      border-radius: 15px;
      font-size: 14px;
    }
  `
};

export async function generatePDF(cvData: CVData): Promise<Buffer> {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>CV - ${cvData.nombreCompleto}</title>
      <style>
        ${styles[cvData.plantilla]}
      </style>
    </head>
    <body>
      ${cvData.plantilla === 'profesional' ? `
        <header class="header">
          <div class="header-content">
            <div class="header-text">
              <h1>${capitalizeWords(cvData.nombreCompleto)}</h1>
              <h2>${capitalizeWords(cvData.titulo)}</h2>
              <div class="personal-info">
                ${cvData.dni ? `
                  <p><span class="info-label">DNI:</span>${cvData.dni.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>
                ` : ''}
                ${cvData.fechaNacimiento ? `
                  <p><span class="info-label">Fecha de Nacimiento:</span>${new Date(cvData.fechaNacimiento).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  })}</p>
                ` : ''}
                ${cvData.edad ? `
                  <p><span class="info-label">Edad:</span>${cvData.edad} años</p>
                ` : ''}
              </div>
              <div class="contact-info">
                <div>
                  <p><span class="info-label">Email:</span>${cvData.email}</p>
                </div>
                <div>
                  <p><span class="info-label">Teléfono:</span>${cvData.telefono.toString().replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2-$3')}</p>
                </div>
                <div>
                  <p><span class="info-label">Dirección:</span>${capitalizeWords(cvData.direccion)}</p>
                </div>
              </div>
            </div>
            ${cvData.foto ? `
              <div class="header-image">
                <img src="${cvData.foto}" alt="Foto de perfil" />
              </div>
            ` : ''}
          </div>
        </header>
        <main class="main-content">
      ` : `
        <div class="header">
          <h1>${capitalizeWords(cvData.nombreCompleto)}</h1>
          <h2>${capitalizeWords(cvData.titulo)}</h2>
          <div class="personal-info">
            ${cvData.dni ? `
              <p><span class="info-label">DNI:</span>${cvData.dni.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</p>
            ` : ''}
            ${cvData.fechaNacimiento ? `
              <p><span class="info-label">Fecha de Nacimiento:</span>${new Date(cvData.fechaNacimiento).toLocaleDateString('es-AR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}</p>
            ` : ''}
            ${cvData.edad ? `
              <p><span class="info-label">Edad:</span>${cvData.edad} años</p>
            ` : ''}
          </div>
          <div class="contact-info">
            <p><span class="info-label">Email:</span>${cvData.email}</p>
            <p><span class="info-label">Teléfono:</span>${cvData.telefono.toString().replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2-$3')}</p>
            <p><span class="info-label">Dirección:</span>${capitalizeWords(cvData.direccion)}</p>
          </div>
        </div>
      `}

      ${
        cvData.resumen
          ? `
        <div class="section">
          <h2 class="section-title">PERFIL PROFESIONAL</h2>
          <p class="description">${capitalizeFirstLetter(cvData.resumen)}</p>
        </div>
      `
          : ""
      }

      ${
        cvData.experiencia.length > 0
          ? `
        <div class="section">
          <h2 class="section-title">EXPERIENCIA LABORAL</h2>
          ${cvData.experiencia
            .map(
              (exp) => `
            <div class="experience-item">
              <h3>${capitalizeWords(exp.cargo)}</h3>
              <p class="company">${capitalizeWords(exp.empresa)}</p>
              <p class="date">${exp.fechaInicio} - ${exp.fechaFin || "Presente"}</p>
              <p class="description">${capitalizeFirstLetter(exp.descripcion)}</p>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      ${
        cvData.educacion.length > 0
          ? `
        <div class="section">
          <h2 class="section-title">EDUCACIÓN</h2>
          ${cvData.educacion
            .map(
              (edu) => `
            <div class="education-item">
              <h3>${capitalizeWords(edu.titulo)}</h3>
              <p class="institution">${capitalizeWords(edu.institucion)}</p>
              <p class="date">${edu.fechaInicio} - ${edu.fechaFin || "Presente"}</p>
              <p class="description">${capitalizeFirstLetter(edu.descripcion)}</p>
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }

      ${
        cvData.habilidades.length > 0
          ? `
        <div class="section">
          <h2 class="section-title">HABILIDADES</h2>
          <div class="skills">
            ${cvData.habilidades
              .map(
                (skill) => `
              <span class="skill-item">${skill}</span>
            `
              )
              .join("")}
          </div>
        </div>
      `
          : ""
      }

      ${cvData.plantilla === 'profesional' ? `</main>` : ''}
    </body>
    </html>
  `;

  await page.setContent(html);

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true, 
    margin: {
      top: "0",
      right: "0",
      bottom: "0",
      left: "0",
    },
  });

  await browser.close();

  return pdf;
}
