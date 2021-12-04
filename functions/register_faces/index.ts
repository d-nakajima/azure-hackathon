import { executeSql } from "../common/db-connecter";
import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import axios from 'axios'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const userId = req.body.user_id
    const requestBody = { person_group: "social_residence", images: req.body.data, user_id: userId }
    await axios.post(`${process.env.IMAGE_API_ENDPOINT}/Register_training?code=${process.env.REGISTER_TRAINING_TOKEN}`, requestBody).catch(() => {})
    await executeSql(`UPDATE users SET faceRegistered = 1 WHERE id = ${userId}`)
    context.res = {
        body: 'success!'
    };
};

export default httpTrigger;