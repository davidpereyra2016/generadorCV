import { NextResponse } from "next/server";
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { generatePDF } from "@/utils/pdfGenerator";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const preferenceId = searchParams.get('preference_id');

    if (!preferenceId) {
      return NextResponse.json(
        { error: "Preference ID is required" },
        { status: 400 }
      );
    }

    const payment = await client.payment.search({
      options: {
        criteria: "desc",
        limit: 1
      },
      qs: {
        external_reference: preferenceId
      }
    });

    if (!payment.results || payment.results.length === 0) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    const paymentInfo = payment.results[0];

    if (paymentInfo.status !== "approved") {
      return NextResponse.json(
        { error: "Payment not approved" },
        { status: 400 }
      );
    }

    const pdfPath = await generatePDF(preferenceId);

    if (!existsSync(pdfPath)) {
      return NextResponse.json(
        { error: "PDF not found" },
        { status: 404 }
      );
    }

    const pdfContent = readFileSync(pdfPath);

    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="cv-${preferenceId}.pdf"`
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
