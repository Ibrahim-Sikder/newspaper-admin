import React from "react";
import { CalendarDays, Clock, Tag, Camera, User } from "lucide-react";
import Image from "next/image";
import tranding_image from "@public/assets/tranding/tranding-image-1.jpg";

const mockNewsData = {
  reporterType: "প্রধান প্রতিবেদক",
  reporterName: "রহিম উদ্দিন",
  newsArea: "জাতীয়",
  reportedDateAndTime: "2024-12-30T14:30:00",
  selectedImage: tranding_image,
  photoJournalistName: "করিম আহমেদ",
  news_type: "প্রধান সংবাদ",
  publishedDate: "2024-12-30",
  newsTitle: "দেশের অর্থনীতিতে নতুন মাত্রা যোগ করলো ডিজিটাল প্রযুক্তি",
  description: `বাংলাদেশের অর্থনৈতিক পরিদৃশ্যে এক নতুন অধ্যায়ের সূচনা হতে চলেছে। ডিজিটাল প্রযুক্তির ব্যাপক ব্যবহার দেশের অর্থনীতিকে নতুন উচ্চতায় নিয়ে যাচ্ছে। বিশেষজ্ঞরা মনে করছেন, এই পরিবর্তন টেকসই উন্নয়নের জন্য অত্যন্ত গুরুত্বপূর্ণ।
  গত কয়েক বছরে মোবাইল ব্যাংকিং, ডিজিটাল পেমেন্ট এবং ই-কমার্সের ব্যাপক বিস্তার ঘটেছে। এর ফলে গ্রামীণ অর্থনীতিতেও ইতিবাচক প্রভাব পড়ছে। কৃষকরা এখন সহজেই তাদের উৎপাদিত পণ্যের বাজার মূল্য জানতে পারছেন এবং সরাসরি ক্রেতাদের সাথে যোগাযোগ করতে পারছেন।`,
  newsTags: [
    { tagLine: "অর্থনীতি", photoJournalistName: "করিম আহমেদ" },
    { tagLine: "ডিজিটাল বাংলাদেশ", photoJournalistName: "করিম আহমেদ" },
    { tagLine: "প্রযুক্তি", photoJournalistName: "করিম আহমেদ" },
  ],
};

const Page = () => {
  const newsData = mockNewsData;

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
      <div className="space-y-6 py-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {newsData.news_type}
            </span>
            <span>•</span>
            <span>{newsData.newsArea}</span>
          </div>

          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
            {newsData.newsTitle}
          </h1>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <User size={16} />
              <span>{newsData.reporterName}</span>
              <span className="text-gray-400">({newsData.reporterType})</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays size={16} />
              <span>
                {new Date(newsData.publishedDate).toLocaleDateString("bn-BD")}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>
                {new Date(newsData.reportedDateAndTime).toLocaleTimeString(
                  "bn-BD"
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="relative">
            <Image
              src={newsData.selectedImage}
              alt={newsData.newsTitle}
              placeholder="blur"
              width={1200}
              height={675}
              className="w-full h-auto"
              priority
            />
          </div>
          <div className="p-3 bg-gray-50 text-sm text-gray-600 flex items-center gap-2">
            <Camera size={16} />
            <span>ছবি: {newsData.photoJournalistName}</span>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {newsData.description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-4">
          {newsData.newsTags.map((tag, index) => (
            <div
              key={index}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 transition-colors px-3 py-1 rounded-full text-sm text-gray-600"
            >
              <Tag size={14} />
              <span>{tag.tagLine}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
