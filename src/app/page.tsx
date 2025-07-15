import ChatPromptBox from "@/components/ChatBox";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 pt-20 px-4">
        <h1 className="text-3xl font-bold text-gray-800">Ready to tackle your next assessment?</h1>
	{/*What's on the agenda today? - dynamic*/}
	<ChatPromptBox />
      </div>
    </div>
  )
}
