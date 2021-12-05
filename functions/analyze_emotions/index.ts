import { executeSql } from "../common/db-connecter";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios"

//  { 'userId': {'anger': 0.0, 'contempt': 0.001, 'disgust': 0.0, 'fear': 0.0, 'happiness': 0.001, 'neutral': 0.708, 'sadness': 0.0, 'surprise': 0.289} }
const buildEmotionUpdateSql = (emotionObjects) => {
    const pictureTimestamp = Math.floor(Date.now() / 1000)
    const insertingValues = Object.keys(emotionObjects).map(userId => {
        const {
            anger,
            contempt,
            disgust,
            fear,
            happiness,
            neutral,
            sadness,
            surprise
        } = emotionObjects[userId]
        return `(${userId}, ${pictureTimestamp}, ${anger}, ${contempt}, ${disgust}, ${fear}, ${happiness}, ${neutral}, ${sadness}, ${surprise})`
    }).join(',')
    
    return `INSERT INTO emotions(
        userId, pictureTimestamp, anger, contempt, disgust, fear, happiness, neutral, sadness, surprise
    ) VALUES ${insertingValues}`
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const requestBody = { person_group: "social_residence", image: req.body?.image }
    context.log(requestBody)
    context.log(req.body)
    const res = await axios.post(`${process.env.IMAGE_API_ENDPOINT}/Emotion_analysis?code=${process.env.EMOTION_ANALYSIS_TOKEN}`, requestBody)
    await executeSql(buildEmotionUpdateSql(res.data), context)
    context.res = {
        body: 'success!'
    };
};

export default httpTrigger;