"use client";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { api } from "@/lib/api";

const projectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters")
    .max(100, "Project name is too long"),
  description: z
    .string()
    .max(200, "Description cannot exceed 200 characters")
    .optional()
    .or(z.literal("")),
  type: z.enum(["website", "graphic_design", "app", "other"], {
    message: "Please select a project type",
  }),
  url: z
    .string()
    .url("Please enter a valid URL (e.g. https://...)")
    .optional()
    .or(z.literal("")),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const items = [
  { value: "website", label: "Website" },
  { value: "graphic_design", label: "Graphic Design" },
  { value: "app", label: "App" },
  { value: "other", label: "Other" },
];

export default function NewProject() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "website",
      url: "",
    },
  });

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    try {
      const { data: project, error } = await api.project.post(data);

      if (error) {
        console.error(error);
        return;
      }

      console.log("Created:", project);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="my-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Project Name"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Project Type</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => {
              const selectedItem = items.find(
                (item) => item.value === field.value,
              );

              return (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className={errors.type ? "border-red-500" : ""}
                  >
                    <SelectValue>{selectedItem?.label}</SelectValue>
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Options</SelectLabel>
                      {items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              );
            }}
          />
          {errors.type && (
            <p className="text-red-500 text-xs">{errors.type.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Optional description"
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description && (
          <p className="text-red-500 text-xs">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="url" className="my-2">
          Project URL (optional)
        </Label>
        <Input
          id="url"
          {...register("url")}
          placeholder="https://..."
          className={errors.url ? "border-red-500" : ""}
        />
        {errors.url && (
          <p className="text-red-500 text-xs">{errors.url.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full mt-5">
        {isSubmitting ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
}
