import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return(
    <header className="absolute top-0 left-0 w-full px-8 py-4">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-3xl font-bold text-gray-800">
	  Assessly
	</Link>
        <div className="flex gap-4">
          <Button asChild className="">
	    <Link href="/login">Login
	    </Link>
	  </Button>
          <Button asChild variant="outline" className="">
	    <Link href="/signup">Sign Up
	    </Link>
	  </Button>
        </div>
      </div>
    </header>
  )
}
