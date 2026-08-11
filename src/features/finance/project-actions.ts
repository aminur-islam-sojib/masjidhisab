// features/finance/project-actions.ts
"use server";

import { revalidatePath } from "next/cache";

import { requireTenant } from "@/lib/auth/guards";
import { UserRole } from "@/types/auth";
import {
  createProjectSchema,
  CreateProjectInput,
} from "@/lib/validations/finance";
import connectDB from "@/lib/db/mongoose";
import { Project } from "@/lib/Model/Project";

export const createProject = requireTenant(
  [UserRole.MOSQUE_ADMIN],
  async ({ session }, input: CreateProjectInput) => {
    const parsed = createProjectSchema.parse(input);
    await connectDB();

    const project = await Project.create({
      ...parsed,
      mosqueId: session.user.mosqueId,
      createdBy: session.user.id,
    });

    revalidatePath("/dashboard/finance");
    return JSON.parse(JSON.stringify(project));
  },
);
