import {NextResponse} from "next/server";
import {Preference} from "mercadopago";
import {MercadoPagoConfig} from "mercadopago";

const mercadopago = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN!});

const PRECIOS = {
  basica: 1000,
  profesional: 2000,
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {plantilla} = body;

    const preference = await new Preference(mercadopago).create({
      body: {
        items: [
          {
            title: plantilla === "basica" ? "CV Básico" : "CV Profesional",
            quantity: 1,
            unit_price: PRECIOS[plantilla],
            currency_id: "ARS",
          },
        ],
        metadata: {
          plantilla: plantilla,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
        },
      },
    });

    // Devolvemos el ID de la preferencia y la URL de pago
    return NextResponse.json({
      id: preference.id,
      init_point: preference.init_point,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({error: "Error al procesar la solicitud"}, {status: 500});
  }
}
