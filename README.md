# Tablas Vega — React + API Gateway

Aplicación React (Vite + TypeScript) que consume la API de inventario:

`https://nunk2bv345.execute-api.us-east-1.amazonaws.com/tablasvega`

- **GET**: listar productos
- **POST**: crear producto (`Nombre`, `Valor Venta`, `Stock`)

## Desarrollo local

```bash
npm install
npm run dev
```

Opcional: copia `.env.example` a `.env` y ajusta `VITE_API_URL`.

## Despliegue en AWS Amplify Hosting

El repositorio incluye `amplify.yml` para compilar y publicar automáticamente desde GitHub.

### Pasos en la consola de AWS

1. Entra a [AWS Amplify Console](https://console.aws.amazon.com/amplify/home) (región **us-east-1**, la misma de tu API).
2. **Create new app** → **Host web app**.
3. Elige **GitHub** y autoriza el acceso a tu cuenta.
4. Selecciona el repositorio **solangevega-cmd/PruebaSV** y la rama **main**.
5. Amplify detectará Vite/React. Verifica:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - (O deja que use `amplify.yml` automáticamente.)
6. En **Environment variables** (opcional), agrega:
   - `VITE_API_URL` = `https://nunk2bv345.execute-api.us-east-1.amazonaws.com/tablasvega`
7. **Save and deploy**.

Cada `git push` a `main` volverá a desplegar la app.

### CORS en API Gateway

Si en producción ves errores de CORS, en tu API Gateway agrega el dominio de Amplify (`https://main.xxxxx.amplifyapp.com`) a los orígenes permitidos del método OPTIONS/GET/POST.

### URL de la app

Al terminar el build, Amplify muestra una URL como:

`https://main.dxxxxxxxx.amplifyapp.com`
