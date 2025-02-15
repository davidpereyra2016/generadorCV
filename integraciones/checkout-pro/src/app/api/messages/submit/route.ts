import { NextResponse } from "next/server";
import { Preference } from "mercadopago";
import { MercadoPagoConfig } from "mercadopago";

const mercadopago = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    const preference = await new Preference(mercadopago).create({
      body: {
        items: [
          {
            id: text,
            title: "Mensaje",
            quantity: 1,
            unit_price: 2000,
            currency_id: "ARS",
          },
        ],
        metadata: {
          text,
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
        },
      },
    });

    return NextResponse.json(preference);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 });
  }
}
