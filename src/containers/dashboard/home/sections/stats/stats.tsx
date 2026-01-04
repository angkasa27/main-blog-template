import { FileText, Eye, FilePen } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatsCardsProps {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
}

export function StatsCards({
  totalPosts,
  publishedPosts,
  draftPosts,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Posts",
      value: totalPosts,
      icon: FileText,
      description: "All posts in your blog",
    },
    {
      title: "Published",
      value: publishedPosts,
      icon: Eye,
      description: "Live posts on your site",
    },
    {
      title: "Drafts",
      value: draftPosts,
      icon: FilePen,
      description: "Unpublished posts",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
