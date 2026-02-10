import { NextResponse } from "next/server";

export default function middleware(req: Request) {
  // Middleware logic can be added here in the future
  console.log("Middleware executed for:", req.url);
  return NextResponse.next();
}
