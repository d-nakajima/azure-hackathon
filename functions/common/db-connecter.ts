import { Context } from "@azure/functions"
import { Connection, Request } from "tedious"

const config = {
  authentication: {
    options: {
      userName: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD 
    },
    type: "default"
  },
  server: process.env.DB_SERVER ,
  options: {
    database: process.env.DB_NAME,
    encrypt: true,
    rowCollectionOnRequestCompletion: true
  }
};

export const executeSql = async function (sql:string, context:Context) : Promise<Array<any>> {
  const connection = new Connection(config);

  const res = new Promise<Array<any>>((resolve, reject) => {
    connection.on("connect", error => {
      if (error) {
        context.log('Error occuerd on connection', error)
        reject(error)
      } else {
        const request = new Request(sql, (err, _rowCount, rows) => {
          if (err) {
            context.log('Error occured on requesting', err)
            context.log(err.message);
            reject(err)
          } else {
            resolve(
              rows.map(row => {
                const formattedRow = {}
                row.forEach(column => {
                  formattedRow[column.metadata.colName] = column.value
                })
                return formattedRow
              })
            )
          }
        })
        connection.execSql(request)
      }
    })
  })

  connection.connect()
  return res
}
