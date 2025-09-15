'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CaretDown, Gear, House, TrendUp, MagnifyingGlass, Users, GridFour,
  Warning, Clock, ChartBar, Shield, Sliders, ChartBarHorizontal, Plus, ArrowCircleUp,
  Archive,
  FolderPlus,
  BookOpen
} from 'phosphor-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { DATASET_TAGS, TAG_CATEGORIES } from '@/app/constants/dataset-tags';


const dataCategories = [
  "Internet", "Games", "Technology", "Movies", "Pop Culture", "Television", "Medicine", "Songs"
];

// Pre-defined dataset tags based on Kaggle categories
const datasetTags = [
  // Business & Economics
  "Business",
  "Economics",
  "Finance",
  "Marketing",
  "Real Estate",
  "Retail",
  "Supply Chain",

  // Science & Technology
  "Computer Science",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Deep Learning",
  "Natural Language Processing",
  "Computer Vision",
  "Cybersecurity",
  "Software Engineering",
  "Bioinformatics",
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics",
  "Statistics",

  // Health & Medicine
  "Healthcare",
  "Medicine",
  "Mental Health",
  "Public Health",
  "Nutrition",
  "Fitness",
  "Pharmaceuticals",

  // Social Sciences
  "Psychology",
  "Sociology",
  "Education",
  "Politics",
  "Law",
  "History",
  "Demographics",
  "Survey Data",

  // Entertainment & Media
  "Movies",
  "Television",
  "Music",
  "Games",
  "Books",
  "Art",
  "Photography",
  "Social Media",

  // Environment & Climate
  "Climate",
  "Environment",
  "Weather",
  "Energy",
  "Sustainability",
  "Agriculture",
  "Geology",

  // Transportation & Geography
  "Transportation",
  "Geography",
  "Maps",
  "Travel",
  "Urban Planning",

  // Sports & Recreation
  "Sports",
  "Recreation",
  "Fitness Tracking",

  // Government & Public Data
  "Government",
  "Census",
  "Crime",
  "Elections",
  "Public Policy",

  // Internet & Technology
  "Internet",
  "Web Scraping",
  "APIs",
  "Mobile Apps",
  "E-commerce",

  // Miscellaneous
  "News",
  "Text Mining",
  "Image Processing",
  "Time Series",
  "Geospatial",
  "Sensor Data",
  "IoT",
  "Crowdsourcing"
];


const TextLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center space-x-2 px-5 py-3 rounded-2xl text-figma-lg font-normal transition-all duration-200 group",
        isActive
          ? "bg-card shadow-figma font-bold text-foreground"
          : "text-muted-foreground hover:bg-card hover:shadow-figma hover:text-foreground"
      )}
    >
      {children}
    </Link>
  );
}

// Sidebar for Community Member AND the general pages of Researcher
const GeneralNav = ({ rolePrefix }: { rolePrefix: string }) => {
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [searchTags, setSearchTags] = useState("");

  const usageStats = {
    totalDatasets: 847, totalDownloads: 12456, totalUploads: 234,
    storageUsed: "45.7 GB"
  }
  const toggleCategory = (category: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  // Filter tags based on search
  const filteredTags = DATASET_TAGS.filter(tag =>
    tag.toLowerCase().includes(searchTags.toLowerCase())
  );
  return (
    <>
      {/* Main Navigation Links */}
      <div className="space-y-1 mb-4">
        <TextLink href={`/${rolePrefix}/home`}>
          <House className="h-4 w-4" />
          <span>Home</span>
        </TextLink>
        <TextLink href={`/${rolePrefix}/discover-community`}>
          <MagnifyingGlass className="h-4 w-4" />
          <span>Discover</span>
        </TextLink>

        <TextLink href={`/${rolePrefix}/popular`}>
          <TrendUp className="h-4 w-4" />
          <span>Popular</span>
        </TextLink>
        {
          rolePrefix === 'community-member-wf' && (
            <TextLink href={`/${rolePrefix}/upload-dataset`} >
              <Button size="sm" 
              className="bg-primary hover:bg-primary/90 cursor-pointer">
                <ArrowCircleUp className="h-4 w-4 mr-2" />
                Upload Dataset
              </Button>
            </TextLink>
          )
        }


      </div>
      <hr className="my-6 border-civic-gray-200" />

      {/* Dataset Categories Section */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-5 py-2">
          <h3 className="text-xl font-bold text-muted-foreground uppercase tracking-wider">MY DATA</h3>
        </div>
        {/* Display grouped categories */}
        <div className="max-h-96 overflow-y-auto space-y-1">
          {Object.entries(TAG_CATEGORIES).map(([categoryName, tags]) => {
            const visibleTags = tags.filter(tag =>
              tag.toLowerCase().includes(searchTags.toLowerCase())
            );

            if (visibleTags.length === 0) return null;

            return (
              <div key={categoryName}>
                <button
                  onClick={() => toggleCategory(categoryName)}
                  className="w-full flex items-center justify-between px-5 py-3 rounded-2xl text-figma-lg font-normal transition-all duration-200 text-muted-foreground hover:bg-card hover:shadow-figma hover:text-foreground"
                >
                  <span>{categoryName}</span>
                  <CaretDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    openCategories[categoryName] && "rotate-180"
                  )} />
                </button>
                {openCategories[categoryName] && (
                  <div className="relative">
                    {/* Ladder-style visual connection */}
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                    <div className="pl-6 mt-1 space-y-1">
                      {visibleTags.map((tag, index) => (
                        <div key={tag} className="relative">
                          {/* Horizontal ladder line */}
                          <div className="absolute left-2 top-3 w-4 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                          <Link
                            href={`/${rolePrefix}/category/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block px-6 py-1 text-sm text-foreground hover:bg-muted rounded-md transition-colors ml-2"
                          >
                            {tag}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Optionally, you can add a search input for tags here */}
    </>
  );
};

// ... other role-specific nav components (ResearcherResearchNav, ProjectAdminNav, etc.) ...
const ProjectAdminTextLink = ({ href, children }: { href: string, children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (

    <Link
      href={href}
      className={cn(
        "block text-base font-medium py-2 px-3 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
        isActive && "text-primary font-bold bg-primary/10"
      )}
    >
      {children}
    </Link>
  )
}

const SuperAdminNav = ({ rolePrefix }: { rolePrefix: string }) => {
  return <>
    {/* Dashboard Section */}
    <div className="space-y-1 mb-4">
      <TextLink href={`/${rolePrefix}/dashboard`}>
        <div className="flex items-center space-x-2">
          <GridFour className="h-4 w-4" />
          <span>Dashboard</span>
        </div>
      </TextLink>
    </div>

    {/* Management Section */}
    <div className="space-y-1 mb-4">
      <TextLink href={`/${rolePrefix}/user-management`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>User Management</span>
          </div>
        </div>
      </TextLink>
      <TextLink href={`/${rolePrefix}/content-moderation`}>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Warning className="h-4 w-4" />
            <span>Content Moderation</span>
          </div>
        </div>
      </TextLink>
      <TextLink href={`/${rolePrefix}/analytics-reports`}>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4" />
          <span>Analytics Reports</span>
        </div>
      </TextLink>
      <TextLink href={`/${rolePrefix}/performance-monitoring`}>
        <div className="flex items-center space-x-2">
          <ChartBar className="h-4 w-4" />
          <span>Performance Monitoring</span>
        </div>
      </TextLink>
    </div>
  </>;
};

export function SidebarWf() {
  const pathname = usePathname();
  const isResearcherWf = pathname.startsWith('/researcher-wf');
  const isResearcherResearchSection = pathname.startsWith('/researcher-wf/research');
  const isCommunityMemberWf = pathname.startsWith('/community-member-wf');
  const isProjectAdminWf = pathname.startsWith('/project-admin-wf');
  const isSuperAdminWf = pathname.startsWith('/super-admin-wf');

  // const isResearcherResearchSection = pathname.startsWith('/researcher-wf/overview') || pathname.startsWith('/researcher-wf/get-started');

  // ** FIX for Problem 2: Dynamic Settings Link **
  const getSettingsLink = () => {
    if (isSuperAdminWf) return "/super-admin-wf/settings"; // Add this page if it exists
    if (isProjectAdminWf) return "/project-admin-wf/settings"; // Add this page if it exists
    if (isResearcherWf) return "/researcher-wf/settings";
    if (isCommunityMemberWf) return "/community-member-wf/settings";
    return "/"; // Fallback
  };

  const ResearcherResearchNav = () => {
    const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
    const [searchTags, setSearchTags] = useState("");

    const toggleCategory = (category: string) => {
      setOpenCategories(prev => ({
        ...prev,
        [category]: !prev[category]
      }));
    };

    const filteredTags = datasetTags.filter(tag =>
      tag.toLowerCase().includes(searchTags.toLowerCase())
    );

    const groupedTags = filteredTags.reduce((acc, tag) => {
      const firstLetter = tag[0].toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(tag);
      return acc;
    }, {} as Record<string, string[]>);
    return (
      <>
        {/* Overview & Projects Section */}
        <div className="space-y-1 mb-4">
          <TextLink href="/researcher-wf/research/overview">Overview</TextLink>
          <TextLink href="/researcher-wf/research/get-started">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Get Started</span>
            </div>
          </TextLink>
          {/* <TextLink href="/researcher-wf/research/projects">Projects</TextLink> */}
          <p className='text-sm text-gray-500 ml-2 mt-6'>Project</p>
          <TextLink href="/researcher-wf/research/archive">
            <div className="flex items-center space-x-2">
              <Archive className="h-4 w-4" />
              <span>Archive</span>
            </div>
          </TextLink>

          <TextLink href="/researcher-wf/research/create-project">
            <div className="flex items-center border border-primary rounded-md p-2 w-full space-x-2">
              <FolderPlus className="h-4 w-4" />
              <span>Create Project</span>
            </div>
          </TextLink>

        </div>
        <hr className="my-6 border-border" />

        {/* Dataset Tags Section - Same as GeneralNav */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-3 py-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Dataset Categories</h3>
            <span className="text-xs text-muted-foreground">{filteredTags.length}</span>
          </div>
          {/* Search Tags */}
          <div className="px-3 pb-2">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTags}
              onChange={(e) => setSearchTags(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-border rounded-md bg-background"
            />
          </div>
          {/* Display grouped categories */}
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(TAG_CATEGORIES).map(([categoryName, tags]) => {
              const visibleTags = tags.filter(tag =>
                tag.toLowerCase().includes(searchTags.toLowerCase())
              );

              if (visibleTags.length === 0) return null;

              return (
                <div key={categoryName}>
                  <button
                    onClick={() => toggleCategory(categoryName)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted text-sm font-medium text-left"
                  >
                    <span className="text-muted-foreground">{categoryName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {visibleTags.length}
                      </span>
                      <CaretDown
                        className={cn(
                          "h-4 w-4 transition-transform text-muted-foreground",
                          openCategories[categoryName] && "rotate-180"
                        )}
                      />
                    </div>
                  </button>
                  {openCategories[categoryName] && (
                    <div className="relative">
                      {/* Ladder-style visual connection */}
                      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                      <div className="pl-6 mt-1 space-y-1">
                        {visibleTags.map((tag, index) => (
                          <div key={tag} className="relative">
                            {/* Horizontal ladder line */}
                            <div className="absolute left-2 top-3 w-4 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                            <Link
                              href={`/researcher-wf/research/category/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                              className="block px-6 py-1 text-sm text-foreground hover:bg-muted rounded-md transition-colors ml-2"
                            >
                              {tag}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    )
  };


  const ProjectAdminNav = ({ rolePrefix }: { rolePrefix: string }) => {
    return (
      <>
        {/* Dashboard Section */}
        <div className="space-y-1 mb-4">
          <ProjectAdminTextLink href={`/${rolePrefix}/dashboard`}>
            <div className="flex items-center space-x-2">
              <GridFour className="h-4 w-4" />
              <span>Dashboard</span>
            </div>
          </ProjectAdminTextLink>
        </div>

        {/* Management Section */}
        <div className="space-y-1 mb-4">
          <ProjectAdminTextLink href={`/${rolePrefix}/membership-requests`}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Membership Requests</span>
              </div>
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">240</span>
            </div>
          </ProjectAdminTextLink>
          <ProjectAdminTextLink href={`/${rolePrefix}/post-review`}>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <Warning className="h-4 w-4" />
                <span>Post Review</span>
              </div>
              <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">320</span>
            </div>
          </ProjectAdminTextLink>
          <ProjectAdminTextLink href={`/${rolePrefix}/community-audit-logs`}>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Community Audit Logs</span>
            </div>
          </ProjectAdminTextLink>
          <ProjectAdminTextLink href={`/${rolePrefix}/community-analytics`}>
            <div className="flex items-center space-x-2">
              <ChartBar className="h-4 w-4" />
              <span>Community Analytics</span>
            </div>
          </ProjectAdminTextLink>
        </div>
      </>
    );
  };





  return (
    // The sidebar itself is a flex column that does NOT scroll
    <div className="w-64 bg-background flex flex-col h-full">

      <div className="flex-1 overflow-y-auto p-6">
        {isResearcherWf && isResearcherResearchSection && <ResearcherResearchNav />}
        {isResearcherWf && !isResearcherResearchSection && <GeneralNav rolePrefix="researcher-wf" />}
        {isCommunityMemberWf && <GeneralNav rolePrefix="community-member-wf" />}
        {isProjectAdminWf && <ProjectAdminNav rolePrefix="project-admin-wf" />}
        {isSuperAdminWf && <SuperAdminNav rolePrefix="super-admin-wf" />}
      </div>

      <div className="p-6">
        <TextLink href={getSettingsLink()}>
          <Gear className="h-5 w-5 text-muted-foreground" />
          <span>Settings</span>
        </TextLink>
      </div>
    </div>
  );
}