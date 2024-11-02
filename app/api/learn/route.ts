import { NextResponse } from 'next/server';
// import { Configuration, OpenAIApi } from 'openai-edge'; // runtime = 'edge'



interface Interviewer {
  id: number
  name: string
  expertise: string
  experience: string
  price: number
  avatar: string
  rating: number
}

const mockInterviewers: Interviewer[] = [
  { id: 1, name: "MMAlice Johnson", expertise: "Frontend Development", experience: "5 years", price: 50, avatar: "/placeholder.svg?height=50&width=50", rating: 4.8 },
  { id: 2, name: "Bob Smith", expertise: "Backend Development", experience: "8 years", price: 65, avatar: "/placeholder.svg?height=50&width=50", rating: 4.9 },
  { id: 3, name: "Carol Williams", expertise: "Full Stack Development", experience: "6 years", price: 55, avatar: "/placeholder.svg?height=50&width=50", rating: 4.7 },
  { id: 4, name: "David Brown", expertise: "DevOps", experience: "7 years", price: 70, avatar: "/placeholder.svg?height=50&width=50", rating: 4.6 },
  { id: 5, name: "Eva Martinez", expertise: "Mobile Development", experience: "4 years", price: 45, avatar: "/placeholder.svg?height=50&width=50", rating: 4.5 },
]



// export async function GET(req: NextRequest) {
export async function GET(req: Request) {
  const url = new URL(req.url);
  console.log(url)
  const queryParamValue = url.searchParams.get('search') as string;
  console.log(queryParamValue)

  // read from db

  const interviewers = await prisma.interviewer.findMany({
    where: {
      name: {
        contains: queryParamValue
      }
    }
  })
  console.log(interviewers)

  return NextResponse.json({ "mockInterviewers": interviewers })

}



