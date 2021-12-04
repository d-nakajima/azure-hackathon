import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios";
import { executeSql } from '../common/db-connecter'
const SqlString = require('sqlString')

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<any> {
    const res = await axios.get('https://google.com')
    context.log(res)
    const userName = req.body.name || "daishi"
    const userToken = userName; // super low security
    const user = (await executeSql(SqlString.format("SELECT * FROM users WHERE name = ?", userName)))[0]
    if (user == null) {
        return createUser(userName).then(async newUser => {
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

const createUser = async (userName:string) : Promise<any>  => {
    const sql = SqlString.format("INSERT INTO users (name, updatedAt) OUTPUT Inserted.* VALUES (?, CURRENT_TIMESTAMP)", userName)
    return executeSql(sql).then(insertedRecords => {
        return insertedRecords[0]
    })
}

export default httpTrigger;
