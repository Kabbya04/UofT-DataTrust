'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { PlayCircle, Image as ImageIcon } from "phosphor-react";
import { useCommunity } from "@/app/components/contexts/community-context";
import ExpandableContentCard from "../../../components/dashboard/expandable-content-card"
import Image from "next/image";
import { getCommunityImage, getUserAvatar, getDatasetThumbnail } from "@/app/utils/image-mapping";
export default function CommunityMemberHomePage() {
  const router = useRouter();
  const { communities, loading, error } = useCommunity();

  const posts = [
    {
      id: "1",
      title: "Title Goes Here",
      author: {
        name: "Jhon Doe",
        avatar: getUserAvatar("jhon-doe"),
        username: "jhondoe",
      },
      timestamp: "1 hour ago",
      content:
        "urna ex enim, commodo amet, faucibus tincidunt urna tortor, luctus odio sed elit, amet, consectetur risus est. ipsum Praesent Nullam leo. tortor, laoreet nulla, commodo nisl lacus faucibus non. eu quam eu orci nec quis elit amet, turpis. Quisque felis, Nunc in lobortis, facilisis ullamcorper ipsum Ut hendrerit laoreet varius luctus odio dolor lacus laoreet sit tincidunt elit risus dui. sodales. venenatis felis, non convallis. ipsum venenatis viverra est. commodo elit. Sed",
      videoThumbnail: getDatasetThumbnail("home-post-1"),
    },
    {
      id: "2",
      title: "Another Post Title",
      author: {
        name: "Jane Smith",
        avatar: getUserAvatar("jane-smith"),
        username: "janesmith",
      },
      timestamp: "2 hours ago",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      videoThumbnail: getDatasetThumbnail("home-post-2"),
    },
    {
      id: "3",
      title: "Another Post Title",
      author: {
        name: "Jane Smith",
        avatar: getUserAvatar("jane-smith"),
        username: "janesmith",
      },
      timestamp: "2 hours ago",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      videoThumbnail: getDatasetThumbnail("home-post-3"),
    },
  ]

  const topGridItems = [
    { title: "Intro to Data Sharing", type: "video" },
    { title: "Latest Community Datasets", type: "image" },
    { title: "How to Join a Project", type: "video" },
  ];


  // Sort communities by member count (descending) and take top 3
  const popularCommunities = communities
    .sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0))
    .slice(0, 3);

  return (
    <div className="">
      {/* Main Content */}
      <div className=" space-y-8">
        <h2 className="text-2xl font-bold mb-4">Trending Now</h2>
        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ExpandableContentCard key={post.id} {...post} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Section */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Latest Contents</h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <ExpandableContentCard key={post.id} {...post} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Popular Communities</h2>
            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="text-muted-foreground text-sm">Loading communities...</div>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center py-4">
                <div className="text-red-500 text-sm">Error: {error}</div>
              </div>
            )}
            {!loading && !error && popularCommunities.length === 0 && (
              <div className="flex items-center justify-center py-4">
                <div className="text-muted-foreground text-sm">No communities found.</div>
              </div>
            )}
            {!loading && !error && popularCommunities.length > 0 && (
              <div className="space-y-4">
                {popularCommunities.map((community, i) => (
                  <Card key={community.id}
                    onClick={() => router.push(`/community-member-wf/community-details/${community.id}`)}
                    className=" w-full h-32 flex flex-row gap-2 cursor-pointer">
                    <>
                      {/* <Image
                        src={community.coverImage || "/placeholder.svg?height=200&width=400"}
                        alt={community.name || "Community cover image"}
                        width={400}
                        height={200}
                        style={{ width: "100%", height: "auto" }}
                      /> */}
                      <div className="relative w-[40%]  bg-gray-200 rounded-lg overflow-hidden">
                        <Image
                          src={community.coverImage || getCommunityImage(community.id)}
                          alt={community.name}
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                      <CardContent className=" w-[60%] p-0">
                        <h3 className="font-semibold text-lg ">{community.name}</h3>
                        <ul className="text-xs text-muted-foreground list-disc ml-3 ">
                          <li>{community.memberCount || 0} members</li>
                          <li>{Math.floor(Math.random() * 20) + 5} datasets</li>
                          <li>{community.community_category?.name || 'General'} data & research</li>
                        </ul>
                        {/* <div className="flex items-center gap-1 ">
                          <Button variant="outline" className="w-fit text-xs" onClick={() => router.push(`/community-member-wf/community-details/${community.id}`)}>View Details</Button>
                          <Button className="w-fit text-xs" onClick={() => router.push(`/community-member-wf/join-community?communityId=${community.id}`)}>Join Community</Button>
                        </div> */}
                      </CardContent>
                    </>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>


      </div>


    </div>
  );
}