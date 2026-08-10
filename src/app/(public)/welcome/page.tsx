import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function page() {
  return (
    <div>
      <h1>Hi from the welcome page</h1>
      <Button>
        <Link href={"/dashboard"}>Dashboard</Link>
      </Button>
      <Button>
        <Link href={"/explore"}>Explore</Link>
      </Button>
    </div>
  );
}
