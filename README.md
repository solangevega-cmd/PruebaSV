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
6. **No** configures `VITE_API_URL` con la URL completa de API Gateway (provoca error CORS / "Failed to fetch").
7. **Rewrites and redirects** (Hosting → tu app → App settings): pega el contenido de `amplify-rewrites.json` o agrega manualmente:
   - `/tablasvega` → `https://nunk2bv345.execute-api.us-east-1.amazonaws.com/tablasvega` → status **`200`**
   - `/<*>` → `/index.html` → status **`404-200`** (solo si el archivo no existe; con `200` la página queda en blanco)
8. **Save and deploy** y vuelve a desplegar si ya estaba publicada.

Cada `git push` a `main` volverá a desplegar la app.

### Si ves "Failed to fetch"

La API no envía cabeceras CORS. La app llama a `/tablasvega` en el mismo dominio de Amplify; el **rewrite** hace de proxy hacia API Gateway.

Si sigue fallando: confirma la regla de rewrite y que **no** exista `VITE_API_URL` apuntando a `execute-api.amazonaws.com` en variables de entorno de Amplify.

### Alternativa: CORS en API Gateway

En API Gateway → tu API → **CORS**, permite origen `https://main.dux01m64bkoq8.amplifyapp.com`, métodos GET/POST/OPTIONS y cabecera `Content-Type`. Luego podrías usar la URL directa de la API si lo prefieres.

### URL de la app

Al terminar el build, Amplify muestra una URL como:

`https://main.dxxxxxxxx.amplifyapp.com`
