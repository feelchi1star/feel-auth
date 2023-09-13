import Image from "next/image";
import { ENV } from "@web/server/config/env";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {ENV.NODE_ENV}
    </main>
  );
}
