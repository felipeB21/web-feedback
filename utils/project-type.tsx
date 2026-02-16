import { Globe, Palette, AppWindow, MoreHorizontal } from "lucide-react";

export const PROJECT_TYPES = {
  website: {
    label: "Website",
    icon: <Globe className="w-4 h-4" />,
  },
  graphic_design: {
    label: "Graphic Design",
    icon: <Palette className="w-4 h-4" />,
  },
  app: {
    label: "App",
    icon: <AppWindow className="w-4 h-4" />,
  },
  other: {
    label: "Other",
    icon: <MoreHorizontal className="w-4 h-4" />,
  },
} as const;
