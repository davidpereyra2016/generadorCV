import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { generatePDF } from "@/utils/pdfGenerator";

const mercadopago = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN! });

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentId = searchParams.get('data.id');
    const type = searchParams.get('type');

    console.log('Webhook received:', { paymentId, type });
    console.log('Files in db folder before processing:', readdirSync('db'));

    if (type !== 'payment' || !paymentId) {
      return NextResponse.json(
        { error: "Invalid webhook data" },
        { status: 400 }
      );
    }

    console.log('Fetching payment:', paymentId);
    const payment = await new Payment(mercadopago).get({ id: paymentId });

    if (payment.status !== 200) {
      console.error('Error fetching payment:', payment);
      return NextResponse.json(
        { error: "Error fetching payment", details: payment },
        { status: 500 }
      );
    }

    console.log('Payment status:', payment.response.status);

    // Verificamos si el pago fue aprobado
    if (payment.response.status === 'approved') {
      const preferenceId = payment.response.order.id;
      const plantilla = payment.response.metadata?.plantilla;

      console.log('Using preference ID:', preferenceId);
      console.log('Using plantilla:', plantilla);

      if (!plantilla) {
        console.error('No plantilla in metadata:', payment.response.metadata);
        return NextResponse.json(
          { error: "Plantilla not found in metadata" },
          { status: 400 }
        );
      }

      try {
        // Buscamos el archivo JSON que coincida con el inicio del preferenceId
        const files = readdirSync('db');
        const jsonFile = files.find(f => f.startsWith(preferenceId) && f.endsWith('.json'));
        
        if (!jsonFile) {
          console.error('No matching JSON file found for preference:', preferenceId);
          console.log('Available files:', files);
          return NextResponse.json(
            { error: "CV data not found" },
            { status: 404 }
          );
        }

        console.log('Found JSON file:', jsonFile);
        
        // Leemos los datos del CV
        const cvData = JSON.parse(readFileSync(`db/${jsonFile}`, 'utf-8'));
        console.log('CV data read successfully');
        
        console.log('Generating PDF with plantilla:', plantilla);
        // Generamos el PDF según la plantilla
        const pdfBuffer = await generatePDF({
          ...cvData,
          plantilla
        });
        console.log('PDF generated successfully');

        // Guardamos el PDF con el mismo nombre base que el JSON
        const pdfFile = jsonFile.replace('.json', '.pdf');
        console.log('Saving PDF to:', `db/${pdfFile}`);
        writeFileSync(`db/${pdfFile}`, pdfBuffer);
        console.log('PDF saved successfully');
        
        console.log('Files in db folder after processing:', readdirSync('db'));
        
        return NextResponse.json({ success: true });
      } catch (error) {
        console.error('Error processing PDF:', error);
        return NextResponse.json(
          { error: "Error processing PDF", details: error.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: "Error processing webhook", details: error.message },
      { status: 500 }
    );
  }
}
