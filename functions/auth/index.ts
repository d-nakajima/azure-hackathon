import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { executeSql } from '../common/db-connecter'
const SqlString = require('sqlString')

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {
    const userName = req.body.name
    const userToken = userName; // super low security
    const user = (await executeSql(SqlString.format("SELECT * FROM users WHERE name = ?", userName), context))[0]
    context.log(`user: ${user}`)
    if (user == null) {
        return createUser(userName, context).then(async newUser => {
            context.res = {
                body: {
                    message: `${userName} is created!`,
                    token: userToken,
                    user: newUser
                },
                headers: {
                    'Set-Cookie': { token: userToken }
                }
            }
            return context
        })
    } else {
        context.res = {
            body: {
                message: `${userName} exists!`,
                token: userToken,
                user: user
            },
            headers: {
                'Set-Cookie': { token: userToken },
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': "X-Requested-With, Origin, X-Csrftoken, Content-Type, Accept"
            }
        }
        return context
    }
};

const createUser = async (userName:string, context:Context) : Promise<any>  => {
    const sql = SqlString.format("INSERT INTO users (name) OUTPUT Inserted.* VALUES (?)", userName)
    return executeSql(sql, context).then(insertedRecords => {
        return insertedRecords[0]
    })
}

export default httpTrigger;
