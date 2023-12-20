import redis from '@/lib/redis';
import { getUserDateRemaining, incrAfterChat } from '@/lib/usage/usage';
import { DateRemaining } from '@/types/usage';
import { RedisUserId } from '@/types/user';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextRequest } from 'next/server';
// import { Configuration, OpenAIApi } from 'openai-edge'; // runtime = 'edge'
import OpenAI from 'openai';

// runtime = 'edge'
// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(config);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge for best performance
// export const runtime = 'edge'; // runtime = 'edge'

export async function POST(req: NextRequest) {
  // 判断referer
  // Check the referer
  const headers = req.headers
  const referer: string | null = headers.get('referer')
  if (!referer || !referer.includes(process.env.REFERER_MAIN_URL as string)) {
    const errorText = 'Invalid referer.'
    return new StreamingTextResponse(errorText as any);
  }
  // 判断token是否存在
  // Verify if token exists
  const token = headers.get('token')
  if (!token) {
    const errorText = 'Token validation failed. Please login again.'
    return new StreamingTextResponse(errorText as any);
  }

  // 判断当日可用次数
  // Determine the available count for the day
  const userId: RedisUserId = await redis.get(token) + ''
  if (!userId) {
    const errorText = 'Your account was not found'
    return new StreamingTextResponse(errorText as any);
  }
  const remainingInfo: DateRemaining = await getUserDateRemaining({ userId })
  if (remainingInfo.userDateRemaining <= 0) {
    const errorText = '0 credit remaining today.'
    return new StreamingTextResponse(errorText as any);
  }

  const { language, prompt } = await req.json();
  // Ask OpenAI for a streaming completion given the prompt
  // const response = await openai.createChatCompletion({ // runtime = 'edge'
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: [
      {
        role: 'user',
        content: `${process.env.PREFIX_PROMPT}${prompt}. ${process.env.SUFFIX_PROMPT} 
        ${process.env.USING_CONTENT_FORMATTING} 
        ${process.env.LANGUAGE_TIP} ${language}. 
        ${process.env.THANK_YOU}`
      },
    ],
  });
  incrAfterChat({ userId, remainingInfo })
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}

