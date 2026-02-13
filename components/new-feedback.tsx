import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Send } from "lucide-react";

export default function NewFeedback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-10 font-sans">
      <h1 className="text-4xl">WebFeedBack</h1>
      <form>
        <div className="flex items-center gap-5">
          <div className="w-full">
            <Label htmlFor="name" className="mb-2">
              Name
            </Label>
            <Input id="name" placeholder="Your name" />
          </div>
          <div className="w-full">
            <Label htmlFor="role" className="mb-2">
              Role
            </Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Role</SelectLabel>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Label htmlFor="feedback" className="my-2">
          Feedback
        </Label>
        <Textarea id="feedback" placeholder="Your feedback" />
        <Button type="submit" className="mt-4 w-full">
          Submit Feedback <Send />
        </Button>
      </form>
    </div>
  );
}
