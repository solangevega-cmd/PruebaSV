/**
 * Ejemplo de ruta PATCH para tu Lambda + Express + DynamoDB.
 * Copia este bloque en tu handler existente y habilita PATCH en API Gateway.
 *
 * Body esperado:
 * { "tablasvega": "uuid", "Nombre": "...", "Valor Venta": 100, "Stock": 5 }
 */

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const {
  DynamoDBDocumentClient,
  UpdateCommand,
} = require('@aws-sdk/lib-dynamodb')

const TABLE_NAME = process.env.TABLE_NAME || 'tablasvega'
const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

async function actualizarProductoEnDynamo(item) {
  const { tablasvega, Nombre, Stock, 'Valor Venta': valorVenta } = item

  if (!tablasvega) {
    const err = new Error('tablasvega es obligatorio')
    err.statusCode = 400
    throw err
  }

  const updatedAt = new Date().toISOString()

  await docClient.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { tablasvega },
      UpdateExpression:
        'SET Nombre = :nombre, Stock = :stock, #valor = :valor, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#valor': 'Valor Venta',
      },
      ExpressionAttributeValues: {
        ':nombre': Nombre,
        ':stock': Number(Stock),
        ':valor': Number(valorVenta),
        ':updatedAt': updatedAt,
      },
      ConditionExpression: 'attribute_exists(tablasvega)',
    }),
  )

  return { tablasvega, Nombre, Stock, 'Valor Venta': valorVenta, updatedAt }
}

// En tu app Express:
// app.patch('/tablasvega', async (req, res) => {
//   try {
//     const item = await actualizarProductoEnDynamo(req.body)
//     res.status(200).json(item)
//   } catch (err) {
//     const status = err.statusCode || (err.name === 'ConditionalCheckFailedException' ? 404 : 500)
//     res.status(status).json({ error: err.message })
//   }
// })

module.exports = { actualizarProductoEnDynamo }
