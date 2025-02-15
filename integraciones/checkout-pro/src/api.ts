import {readFileSync, writeFileSync} from "node:fs";

import {MercadoPagoConfig, Preference} from "mercadopago";

interface Message {
  id: number;
  text: string;
}

type TipoPlantilla = "basica" | "profesional";

interface CVData {
  plantilla: TipoPlantilla;
}

const mercadopago = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN!});

const PRECIOS: Record<TipoPlantilla, number> = {
  basica: 1000,
  profesional: 2000,
};

const NOMBRES_PLANTILLAS: Record<TipoPlantilla, string> = {
  basica: "CV Básico",
  profesional: "CV Profesional Premium",
};

const api = {
  message: {
    async list(): Promise<Message[]> {
      // Leemos el archivo de la base de datos de los mensajes
      const db = readFileSync("db/message.db");

      // Devolvemos los datos como un array de objetos
      return JSON.parse(db.toString());
    },
    async add(message: Message): Promise<void> {
      // Obtenemos los mensajes
      const db = await api.message.list();

      // Si ya existe un mensaje con ese id, lanzamos un error
      if (db.some((_message) => _message.id === message.id)) {
        throw new Error("Message already added");
      }

      // Agregamos el nuevo mensaje
      const draft = db.concat(message);

      // Guardamos los datos
      writeFileSync("db/message.db", JSON.stringify(draft, null, 2));
    },
    async submit(text: Message["text"], cvData: CVData) {
      const precio = PRECIOS[cvData.plantilla];
      const nombrePlantilla = NOMBRES_PLANTILLAS[cvData.plantilla];

      // Creamos la preferencia incluyendo el precio, titulo y metadata
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
          // Configuramos las URLs de redirección a la descarga del PDF
          back_urls: {
            success: `${process.env.NEXT_PUBLIC_BASE_URL}/api/cv/download?status=success`,
            pending: `${process.env.NEXT_PUBLIC_BASE_URL}/api/cv/download?status=pending`,
            failure: `${process.env.NEXT_PUBLIC_BASE_URL}/api/cv/download?status=failure`,
          },
          // Redirigir automáticamente
          auto_return: "approved",
        },
      });

      // Devolvemos el init point (url de pago) para que el usuario pueda pagar
      return preference.init_point!;
    },
  },
};

export default api;
