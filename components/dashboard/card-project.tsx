"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Calendar,
  EllipsisVertical,
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type CardProjectProps = {
  project: {
    type: string;
    id: string;
    name: string;
    description?: string | null;
    url?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
};

export default function CardProject({ project }: CardProjectProps) {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Link href={`/dashboard/project/${project.id}`} className="flex-1">
            <CardTitle className="font-heading hover:underline underline-offset-4 cursor-pointer">
              {project.name}
            </CardTitle>
            <p className="text-xs">{project.type}</p>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="-mr-2 -mt-2">
                  <EllipsisVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              }
            />

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                render={
                  <Link href={`/dashboard/project/${project.id}`}>
                    <ExternalLink className="mr-2 h-4 w-4" /> View
                  </Link>
                }
              />

              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {project.description && (
          <CardDescription className="line-clamp-2">
            {project.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent />

      <CardFooter>
        <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
        <p className="text-xs text-muted-foreground">
          Created{" "}
          {formatDistanceToNow(new Date(project.createdAt), {
            addSuffix: true,
          })}
        </p>
      </CardFooter>
    </Card>
  );
}
