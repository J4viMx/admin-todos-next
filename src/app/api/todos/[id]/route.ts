import prisma from "@/lib/prisma";
import { Todo } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { boolean, object, string } from "yup";

interface Segments {
  params: {
    id: string;
  };
}

const getTodo = async (id: string): Promise<Todo | null> => {
  return await prisma.todo.findFirst({ where: { id } });
};

export async function GET(request: Request, { params }: Segments) {
  const todo = await getTodo(params.id);
  if (!todo)
    return NextResponse.json({ message: "Id not found" }, { status: 404 });

  return NextResponse.json(todo);
}

const putSchema = object({
  complete: boolean().optional(),
  description: string().optional(),
});

export async function PUT(request: Request, { params }: Segments) {
  const todo = await getTodo(params.id);
  if (!todo)
    return NextResponse.json({ message: "El id not found" }, { status: 404 });

  try {
    const { complete, description } = await putSchema.validate(
      await request.json()
    );

    const updatedTodo = await prisma.todo.update({
      where: { id: params.id },
      data: { complete, description },
    });

    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json(error, { status: 400 });
  }
}
