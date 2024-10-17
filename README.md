# Integración de Mercado Pago en Next.js

En este respositorio vamos a aprender a integrar Mercado Pago en una aplicación de comentarios utilizando Next.js con App Router. El fin de la aplicación es poder agregar mensajes a una lista de mensajes.

## Indice

Vamos a tener diferentes carpetas y aplicaciones para cada tipo de integración, así mantenemos el código simple y podemos enfocarnos en lo que nos interesa.

1. Prerequisitos
    1. [Configuración de Mercado Pago](./configuracion/configuracion-mercadopago/README.md): Crear una [integración](https://www.mercadopago.com.ar/developers/panel/app) en Mercado Pago, crear las cuentas de prueba y las integraciones en las cuentas de prueba. Esto es requerido (o al menos recomendado) en todas las integraciones, así que completá esto antes de seguir con una integración.
    2. [Exponer el puerto](./configuracion/exponer-puerto/README.md): Para que Mercado Pago pueda enviarnos notificaciones sobre los pagos o suscripciones, es necesario exponer nuestro puerto a internet.
2. Integraciones
    1. [Checkout Pro](./checkout-pro/README.md): Los usuarios van a tener que pagar para poder agregar un mensaje a la lista. Usamos [Checkout Pro](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/landing) para crear una preferencia de pago y redirigir al usuario a Mercado Pago para que pueda pagar. Configuramos un webhook para recibir notificaciones del pago y verificar la autenticidad de la notificación.
    2. [Suscripciones](./suscripciones/README.md): Los usuarios van a tener que suscribirse para poder agregar un mensaje a la lista. Usamos [Suscripciones sin plan asociado con pago pendiente](https://www.mercadopago.com.ar/developers/es/docs/subscriptions/integration-configuration/subscription-no-associated-plan/pending-payments). Configuramos un webhook para recibir notificaciones de suscripción y verificar la autenticidad de la notificación.
    3. [Checkout Bricks](./checkout-bricks/README.md): Los usuarios van a tener que pagar para poder agregar un mensaje a la lista. Usamos [Checkout Bricks](https://www.mercadopago.com.ar/developers/es/docs/checkout-bricks/landing) para tomar los datos de pago dentro de nuestra aplicación.
    4. [Marketplace](./marketplace/README.md): Vamos a ser el intermediario entre un usuario de nuestra aplicación que quiere recibir mensajes en su muro y un usuario que quiere pagar para escribir en ese muro. Vamos a usar Checkout Pro con la integración de [Marketplace](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/how-tos/integrate-marketplace) para quedarnos con una ganancia por cada mensaje.

## Consideraciones

- Por simplicidad, nuestras aplicaciónes no usan una base de datos real, sino que usa archivos (llamados `db/message.db`, `db/user.db`, etc). Escribir al file system no está permitido en muchos proveedores de hosting, por ende, en un ambiente de producción deberíamos usar una base de datos real, pero para nuestro caso es más que suficiente.
- Las cuentas de prueba no se pueden borrar y son válidas para todas las aplicaciones.
- Los errores en Mercado Pago muchas veces son crípticos y la estabilidad de la API es discutible. Si algo no te anda, intentá más tarde o probá de buscar en el [Discord de Mercado Pago Developers](https://discord.gg/yth5bMKhdn).

---

Si te gusta mi contenido, seguime en [Twitter](https://twitter.gonzalopozzo.com), en [Twitch](https://twitch.gonzalopozzo.com), en [YouTube](https://youtube.gonzalopozzo.com), doname un [Cafecito](https://cafecito.gonzalopozzo.com) o volvete [sponsor en github](https://github.com/sponsors/goncy) ✨
