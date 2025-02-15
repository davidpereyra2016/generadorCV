import {NextResponse} from "next/server";
import {Preference} from "mercadopago";
import {MercadoPagoConfig} from "mercadopago";

// Verificar que tenemos el token de acceso
if (!process.env.MP_ACCESS_TOKEN) {
  throw new Error("MP_ACCESS_TOKEN no está configurado en las variables de entorno");
}

const mercadopago = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN});

const PRECIOS = {
  basica: 1000,
  profesional: 2000,
} as const;

const NOMBRES_PLANTILLAS = {
  basica: "CV Básico",
  profesional: "CV Profesional Premium",
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {text, cvData} = body;

    if (!text || !cvData) {
      return NextResponse.json({error: "Faltan datos requeridos"}, {status: 400});
    }

    if (!cvData.plantilla || !PRECIOS[cvData.plantilla]) {
      return NextResponse.json({error: "Plantilla no válida"}, {status: 400});
    }

    const precio = PRECIOS[cvData.plantilla];
    const nombrePlantilla = NOMBRES_PLANTILLAS[cvData.plantilla];

    const preference = await new Preference(mercadopago).create({
      body: {
        items: [
          {
            id: cvData.plantilla,
            title: nombrePlantilla,
            unit_price: precio,
            quantity: 1,
            currency_id: "ARS",
            description: `Generación de Curriculum Vitae - ${nombrePlantilla}`,
          },
        ],
        metadata: {
          text,
          cvData: JSON.stringify(cvData),
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
        },
      },
    });

    if (!preference.id) {
      return NextResponse.json({error: "Error al crear la preferencia de pago"}, {status: 500});
    }

    return NextResponse.json(preference);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);

    return NextResponse.json(
      {error: "Error al procesar la solicitud: " + (error.message || "Error desconocido")},
      {status: 500},
    );
  }
}
