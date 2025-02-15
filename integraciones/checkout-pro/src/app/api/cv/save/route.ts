import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Asegurarnos que existe la carpeta db
    if (!existsSync("db")) {
      mkdirSync("db");
    }

    const cvData = await request.json();
    const { payment_id: preferenceId } = cvData;

    if (!preferenceId) {
      return NextResponse.json(
        { error: "Preference ID is required" },
        { status: 400 }
      );
    }

    // Solo guardamos los datos del CV en JSON
    writeFileSync(
      `db/${preferenceId}.json`,
      JSON.stringify(cvData, null, 2)
    );

    // Devolvemos el ID para referencia
    return NextResponse.json({ id: preferenceId });
  } catch (error) {
    console.error("Error saving CV:", error);
    return NextResponse.json(
      { error: "Error saving CV: " + (error.message || 'Unknown error') },
      { status: 500 }
    );
  }
}
