import { executeSql } from "../common/db-connecter"
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
const SqlString = require('sqlString')

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const userId = req.params.userId || req.query.userId
    if (!userId) {
        context.res = { headers: { status: 400 } };
    } else {
        const ownSmileSql = SqlString.format("SELECT SUM(happiness) AS point FROM emotions WHERE userId = ? GROUP BY userId", userId)
        const smilerMakerSql = SqlString.format(" \
            SELECT SUM(other_emotions.happiness) AS point FROM emotions AS my_emotions\
            JOIN emotions AS other_emotions \
                ON my_emotions.pictureTimestamp = other_emotions.pictureTimestamp \
                AND my_emotions.userId != other_emotions.userId \
            WHERE my_emotions.userId = ? \
        ", userId)
        const [happinessSummary, smileMakerPoint] = await Promise.all([executeSql(ownSmileSql, context), executeSql(smilerMakerSql, context)])
        
        context.res = {
            body: {
                own_smile_point: happinessSummary[0]?.point || 0,
                smile_maker_point: smileMakerPoint[0]?.point || 0
            }
        };
    }
};

export default httpTrigger;