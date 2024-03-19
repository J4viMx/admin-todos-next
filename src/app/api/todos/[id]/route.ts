import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

interface Segments {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Segments) {
  const todo = await prisma.todo.findFirst({
    where: {
      id: params.id,
    },
  });
  if (!todo)
    return NextResponse.json({ message: "El id not found" }, { status: 404 });

  return NextResponse.json(todo);
}
