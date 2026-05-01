"use client";
import Image from "next/image";
import Link from "next/link";
import logo from "../../../public/assets/dailyTimes24.png";
import { usePathname } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import {
  PlusIcon,
  List,
  ChartNetworkIcon,
  ImageIcon,
  VideoIcon,
  Folder,
  UserRoundCog,
  GalleryThumbnailsIcon,
  ChartLine,
  NotebookIcon,
  DatabaseBackup,
  ArchiveRestore,
} from "lucide-react";
import { useGetCurrentUserQuery } from "@/redux/dailynews/users.api";

const Aside = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
  const pathname = usePathname();

  const { data, isLoading } = useGetCurrentUserQuery();
  const user = data?.data ?? data;
  const role = user?.role || "guest";

  if (isLoading) {
    return <div className="p-4 text-white text-center">Loading sidebar...</div>;
  }

  const allRoutes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: ChartLine,
    },
    {
      href: "/news",
      label: "News",
      icon: ChartNetworkIcon,
      children: [
        { href: "/dashboard/add-news", label: "Add News", icon: PlusIcon },
        { href: "/dashboard/news-category", label: "Category", icon: PlusIcon },
        { href: "/dashboard/list-news", label: "List News", icon: List },
      ],
    },
    {
      href: "/e-paper",
      label: "E-Paper",
      icon: ChartNetworkIcon,
      children: [
        {
          href: "/dashboard/e-paper/add",
          label: "Add E-Paper",
          icon: PlusIcon,
        },
        { href: "/dashboard/e-paper/list", label: "List E-Paper", icon: List },
      ],
    },
    {
      href: "/Add-Photo-News",
      label: "Photo News",
      icon: ImageIcon,
      children: [
        {
          href: "/dashboard/add-photo-news",
          label: "Add Photo News",
          icon: PlusIcon,
        },
        {
          href: "/dashboard/list-photo-news",
          label: "Photo News List",
          icon: List,
        },
      ],
    },
    {
      href: "/video",
      label: "Video News",
      icon: VideoIcon,
      children: [
        { href: "/dashboard/add-video", label: "Add Video", icon: PlusIcon },
        { href: "/dashboard/list-video-news", label: "Video List", icon: List },
        { href: "/dashboard/news-category", label: "Category", icon: PlusIcon },
      ],
    },
    {
      href: "/Advertisement",
      label: "Advertisement",
      icon: NotebookIcon,
      children: [
        {
          href: "/dashboard/add-advertisement",
          label: "Add Advertisement",
          icon: PlusIcon,
        },
        {
          href: "/dashboard/list-advertisement",
          label: "Advertisement List",
          icon: List,
        },
      ],
    },
    {
      href: "/img",
      label: "Stock Photo",
      icon: GalleryThumbnailsIcon,
      children: [
        {
          href: "/dashboard/gallery/all-img",
          label: "All Images",
          icon: ImageIcon,
        },
        { href: "/dashboard/gallery/folder", label: "Folder", icon: Folder },
      ],
    },
    {
      href: "/dashboard/user",
      label: "User Management",
      icon: UserRoundCog,
      restricted: true,
    },
    {
      href: "/dashboard/backup",
      label: "Backup & Settings",
      icon: DatabaseBackup,
      restricted: true,
      children: [
        {
          href: "/dashboard/backup",
          label: "Backup Database",
          icon: DatabaseBackup,
        },
        {
          href: "/dashboard/restore",
          label: "Restore Database",
          icon: ArchiveRestore,
        },
      ],
    },
  ];

  const routes =
    role === "admin"
      ? allRoutes
      : allRoutes.filter((route) => !route.restricted);

  return (
    <div className="w-full h-full overflow-x-hidden">
      <div className="text-center pt-3">
        <Link
          href="/dashboard"
          className="inline-block transition-transform hover:scale-105"
          onClick={toggleSidebar}
        >
          <Image
            src={logo}
            alt="dailytimes24"
            width={130}
            height={100}
            priority
            className="max-w-full h-auto"
          />
        </Link>
      </div>

      <nav className="w-full">
        <Accordion type="single" collapsible className="space-y-4 w-full">
          {routes.map((route, i) => (
            <AccordionItem
              key={i}
              value={route.href}
              className="border-none w-full"
            >
              {route.children ? (
                <>
                  <AccordionTrigger
                    className={cn(
                      "flex items-center justify-between px-4 py-3 text-sm font-medium w-full",
                      "hover:bg-blue-600/20 data-[state=open]:bg-blue-600/20",
                      pathname === route.href && "bg-blue-600/30 text-blue-200",
                    )}
                  >
                    <span className="flex items-center space-x-2 truncate">
                      {route.icon && (
                        <route.icon className="w-5 h-5 flex-shrink-0" />
                      )}
                      <span className="truncate">{route.label}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="w-full">
                    <div className="mt-2 ml-4 space-y-2 w-full">
                      {route.children.map((child, j) => (
                        <Link
                          key={j}
                          href={child.href}
                          className={cn(
                            "flex items-center px-4 py-2 text-sm transition-colors w-full",
                            "hover:bg-blue-600/20",
                            pathname === child.href &&
                              "text-blue-200 border-b-2 border-white",
                          )}
                          onClick={toggleSidebar}
                        >
                          <child.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </>
              ) : (
                <Link
                  href={route.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium transition-colors w-full",
                    "hover:bg-blue-600/20",
                    pathname === route.href &&
                      "text-blue-200 border-b-2 border-white",
                  )}
                  onClick={toggleSidebar}
                >
                  <route.icon className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="truncate">{route.label}</span>
                </Link>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </nav>
    </div>
  );
};

export default Aside;
