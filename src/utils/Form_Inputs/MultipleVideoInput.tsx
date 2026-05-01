import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Delete, PlusIcon } from "lucide-react";

type Video = {
  videoURL: string;
  videoJournalistName: string;
  tagLine: string;
};

type VideoInputProps = {
  videos: Video[];
  setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
};

const MultipleVideoInput = ({ videos, setVideos }: VideoInputProps) => {
  const handleAddVideo = () => {
    setVideos([
      ...videos,
      { videoURL: "", videoJournalistName: "", tagLine: "" },
    ]);
  };

  const handleRemoveVideo = (index: number) => {
    if (videos.length === 1) return;
    setVideos(videos.filter((_, i) => i !== index));
  };

  const handleVideoChange = (
    index: number,
    field: keyof Video,
    value: string
  ) => {
    const updatedVideos = [...videos];
    updatedVideos[index] = { ...updatedVideos[index], [field]: value };
    setVideos(updatedVideos);
  };

  return (
    <div
      className="flex flex-col gap-6 w-full max-h-[300px]   lg:max-h-[400px]   overflow-y-auto 
    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      {videos.map((video, index) => (
        <div key={index}>
          <div className="grid items-center  lg:grid-cols-2 gap-4">
            <div className="col-span-2 lg:col-span-1">
              <Input
                type="text"
                placeholder="ভিডিও লিঙ্ক"
                className="bg-white"
                value={video.videoURL}
                onChange={(e) =>
                  handleVideoChange(index, "videoURL", e.target.value)
                }
              />
            </div>
            <div className="col-span-2 lg:col-span-1">
              <Input
                type="text"
                placeholder="ভিডিও সাংবাদিকের নাম"
                className="bg-white"
                value={video.videoJournalistName}
                onChange={(e) =>
                  handleVideoChange(
                    index,
                    "videoJournalistName",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="col-span-2">
              <Input
                type="text"
                 placeholder="ইমেজ ট্যাগ লাইন"
                className="bg-white"
                value={video.tagLine}
                onChange={(e) =>
                  handleVideoChange(index, "tagLine", e.target.value)
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-4  mt-2">
            {videos.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveVideo(index)}
                aria-label="Remove video"
              >
                <Delete className="w-4 h-4" />
              </Button>
            )}
            {index === videos.length - 1 && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleAddVideo}
                aria-label="Add new video"
              >
                <PlusIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MultipleVideoInput;
