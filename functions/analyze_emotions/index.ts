import { executeSql } from "../common/db-connecter";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from "axios"

//  { 'userId': {'anger': 0.0, 'contempt': 0.001, 'disgust': 0.0, 'fear': 0.0, 'happiness': 0.001, 'neutral': 0.708, 'sadness': 0.0, 'surprise': 0.289} }
const buildEmotionUpdateSql = (emotionObjects) => {
    const executed_timestamp = Math.floor(Date.now() / 1000)
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
        return `(${userId}, ${executed_timestamp}, ${anger}, ${contempt}, ${disgust}, ${fear}, ${happiness}, ${neutral}, ${sadness}, ${surprise})`
    }).join(',')
    
    return `INSERT INTO emotions(
        user_id, executed_timestamp, anger, contempt, disgust, fear, happiness, neutral, sadness, surprise
    ) VALUES ${insertingValues}`
}

const dummyEmotionJson = {
    '1': {'anger': 0.0, 'contempt': 0.001, 'disgust': 0.0, 'fear': 0.0, 'happiness': 0.001, 'neutral': 0.708, 'sadness': 0.0, 'surprise': 0.289},
    '2': {'anger': 0.0, 'contempt': 0.0, 'disgust': 0.0, 'fear': 0.0, 'happiness': 0.447, 'neutral': 0.552, 'sadness': 0.0, 'surprise': 0.001},
}

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const requestBody = { person_group: "social_residence", image: req.body?.image }
    const res = await axios.post(`${process.env.IMAGE_API_ENDPOINT}/Emotion_analysis?code=${process.env.EMOTION_ANALYSIS_TOKEN}`, requestBody).catch(() => {
        return {
            data: {
                emotionJson: dummyEmotionJson
            }
        }
    })

    await executeSql(buildEmotionUpdateSql(res.data.emotionJson))
    context.res = {
        body: 'success!'
    };
};

export default httpTrigger;