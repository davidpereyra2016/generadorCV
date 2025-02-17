import { readFileSync } from "node:fs";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { paymentId: string } }
): Promise<NextResponse> {
  try {
    // Buscamos el mensaje asociado al pago
    const db = JSON.parse(readFileSync("db/message.db").toString());
    const message = db.find((msg: any) => msg.id === Number(params.paymentId));

    if (!message) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    // Extraemos el ID del CV del texto del mensaje
    const cvId = message.text.split("ID: ")[1];
    // Leemos los datos del CV
    const cvData = JSON.parse(readFileSync(`db/cv_${cvId}.json`).toString());

    return NextResponse.json(cvData);
  } catch (error) {
    console.error("Error fetching CV:", error);
    return NextResponse.json(
      { 
        error: "Error fetching CV: " + 
        (error instanceof Error ? error.message : 'Unknown error') 
      },
      { status: 500 }
    );
  }
}
