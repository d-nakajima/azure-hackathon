import { executeSql } from "../common/db-connecter"
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
const SqlString = require('sqlString')

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const userId = req.params.userId || 1
    if (!userId) {
        context.res = { headers: { status: 400 } };
    } else {
        const ownSmileSql = SqlString.format("SELECT SUM(happiness) AS point FROM emotions WHERE user_id = ? GROUP BY user_id", userId || 1)
        const smilerMakerSql = SqlString.format(" \
            SELECT SUM(other_emotions.happiness) AS point FROM emotions AS my_emotions\
            JOIN emotions AS other_emotions \
                ON my_emotions.executed_timestamp = other_emotions.executed_timestamp \
                AND my_emotions.user_id = other_emotions.user_id \
            WHERE other_emotions.user_id != ? \
        ", userId)
        const [happinessSummary, smileMakerPoint] = await Promise.all([executeSql(ownSmileSql), executeSql(smilerMakerSql)])
        
        context.res = {
            body: {
                own_smile_point: happinessSummary[0].point,
                smile_maker_point: smileMakerPoint[0].point
            }
        };
    }
};

export default httpTrigger;