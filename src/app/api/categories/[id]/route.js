import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { getSession, isadmin } from "@/libs/auth";

/* export async function GET(request, { params }) {
  const task = await prisma.task.findUnique({ where: { id: Number(params.id) } });
  return NextResponse.json(task);
}
 */
/* export async function PUT(request, { params }) {
  try {
    const data = await request.json();
    const task = await prisma.task.update({
      where: { id: Number(params.id) },
      data: data,
    });
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({});
  }
} */

export async function DELETE(request, { params }) {
  // Comprobamos que esté autorizado
  const session = await getSession();
  if (!(session && session.user && session.user.email && isadmin(session.user.email))) {
    return NextResponse.json({ error: "No estás autorizado" });
  }
  try {
    const categoryRemoved = await prisma.category.delete({ where: { id: Number(params.id) } });

    return NextResponse.json(categoryRemoved);
  } catch (error) {
    return NextResponse.json(error.message);
  }
}
