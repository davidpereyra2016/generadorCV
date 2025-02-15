import {readFileSync, writeFileSync, existsSync, readdirSync} from "node:fs";

import {NextResponse} from "next/server";
import {MercadoPagoConfig, Payment} from "mercadopago";

import {generatePDF} from "@/utils/pdfGenerator";

// Configuración de Mercado Pago
const mercadopago = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN!});

export async function GET(request: Request) {
  try {
    const {searchParams} = new URL(request.url);
    const preferenceId = searchParams.get("preference_id");

    console.log("Download requested for preference:", preferenceId);

    if (!preferenceId) {
      return NextResponse.json({error: "Preference ID is required"}, {status: 400});
    }

    // Buscamos el archivo JSON que coincida con el preferenceId
    const files = readdirSync("db");
    const jsonFile = files.find((f) => f.startsWith(preferenceId) && f.endsWith(".json"));
    const pdfFile = jsonFile?.replace(".json", ".pdf");

    if (!jsonFile) {
      return NextResponse.json({error: "CV data not found"}, {status: 404});
    }

    console.log("Found JSON file:", jsonFile);
    console.log("PDF file would be:", pdfFile);

    // Si el PDF no existe, lo generamos
    if (!existsSync(`db/${pdfFile}`)) {
      console.log("PDF does not exist, generating...");
      try {
        // Leemos los datos del CV
        const cvData = JSON.parse(readFileSync(`db/${jsonFile}`, "utf-8"));

        // Verificamos el estado del pago para obtener la plantilla
        const payment = await new Payment(mercadopago).search({
          external_reference: preferenceId,
          sort: "date_created:desc",
          limit: 1
        });

        if (!payment.results || payment.results.length === 0) {
          return NextResponse.json({error: "Payment not found"}, {status: 404});
        }

        // Obtenemos la plantilla del pago o usamos una por defecto
        const plantilla = payment.results[0].metadata?.plantilla || cvData.plantilla || "basica";

        console.log("Using plantilla:", plantilla);

        // Generamos el PDF
        const pdfBuffer = await generatePDF({
          ...cvData,
          plantilla,
        });

        // Guardamos el PDF
        writeFileSync(`db/${pdfFile}`, pdfBuffer);
        console.log("PDF generated and saved successfully");
      } catch (error) {
        console.error("Error generating PDF:", error);

        return NextResponse.json(
          {error: "Error generating PDF", details: error.message},
          {status: 500},
        );
      }
    }

    try {
      // Leemos el PDF
      const pdfBuffer = readFileSync(`db/${pdfFile}`);

      // Devolvemos el PDF
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${pdfFile}"`,
        },
      });
    } catch (error) {
      console.error("Error reading PDF:", error);

      return NextResponse.json({error: "Error reading PDF"}, {status: 500});
    }
  } catch (error) {
    console.error("Error downloading CV:", error);

    return NextResponse.json({error: "Error downloading CV"}, {status: 500});
  }
}
