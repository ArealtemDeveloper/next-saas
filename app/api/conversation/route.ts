import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { OpenAI } from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})


export async function POST(
    req: Request,
) {
    try {
        const { userId } = auth()
        const body = await req.json()
        const { messages } = body
        if(!userId) {
            return new NextResponse("Unauthenticated", {status: 401})
        }
        if(!openai.apiKey) {
            return new NextResponse("OpenAI API not configured", {status: 500})
        }
        if(!messages) {
            return new NextResponse("Messages are required", {status: 400})
        }
        const params = await OpenAI.Chat.ChatCompletionCreateParams({
            model: "gpt-3.5-turbo",
            messages
        })

        return NextResponse.json(response.data.choices[0].message)
    }catch(error) {
        console.log("[CONVERSATION_ERROR]", error)
        return new NextResponse("Internal Server Error", {status: 500})
    }
}
