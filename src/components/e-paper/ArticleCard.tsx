/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ImageUpIcon,
  Trash2,
  Crosshair,
  ExternalLink,
  Newspaper,
  Edit,
} from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import TextInput from "@/utils/Form_Inputs/TextInput";
import SelectInput from "@/utils/Form_Inputs/SelectInput";
import DailyTimesEditor from "@/utils/Form_Inputs/JodiEditor";
import { categoryOptions } from "@/options/category";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { ArticleCardProps } from "@/types/e-paper";

const ArticleCard: React.FC<ArticleCardProps> = ({
  pageIndex,
  articleIndex,
  control,
  onRemove,
  onSelectImage,
  onOpenCoordinatePicker,
  onSelectFromNews,
}) => {
  const methods = useFormContext();
  const [isManualMode, setIsManualMode] = useState(false);

  const articleImage = useWatch({
    control,
    name: `pages.${pageIndex}.articles.${articleIndex}.articleImage`,
  });

  const newsId = useWatch({
    control,
    name: `pages.${pageIndex}.articles.${articleIndex}.newsId`,
  });

  const newsSlug = useWatch({
    control,
    name: `pages.${pageIndex}.articles.${articleIndex}.newsSlug`,
  });

  const x = useWatch({
    control,
    name: `pages.${pageIndex}.articles.${articleIndex}.x`,
  });
  const y = useWatch({
    control,
    name: `pages.${pageIndex}.articles.${articleIndex}.y`,
  });
  const width = useWatch({
    control,
    name: `pages.${pageIndex}.articles.${articleIndex}.width`,
  });
  const height = useWatch({
    control,
    name: `pages.${pageIndex}.articles.${articleIndex}.height`,
  });

  const hasCoordinates = Boolean(
    x &&
    y &&
    width &&
    height &&
    x !== 0 &&
    y !== 0 &&
    width > 10 &&
    height > 10,
  );

  const hasNewsConnected = Boolean(newsId);

  const handleRemoveNewsId = () => {
    methods.setValue(`pages.${pageIndex}.articles.${articleIndex}.newsId`, "");
    methods.setValue(
      `pages.${pageIndex}.articles.${articleIndex}.newsSlug`,
      "",
    );
    setIsManualMode(true);
  };

  const handleSwitchToNewsMode = () => {
    if (onSelectFromNews) {
      onSelectFromNews();
    }
  };

  return (
    <Card className="border border-gray-200 mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-md">আর্টিকেল {articleIndex + 1}</h4>
            {hasNewsConnected && (
              <Badge
                variant="secondary"
                className="gap-1 bg-blue-100 text-blue-700"
              >
                <Newspaper size={12} />
                <Link
                  href={`/dashboard/list-news/view-details/${newsId}`}
                  target="_blank"
                  className="flex items-center gap-1 text-xs"
                >
                  নিউজ লিংক <ExternalLink size={12} />
                </Link>
              </Badge>
            )}
            {!hasNewsConnected && isManualMode && (
              <Badge variant="outline" className="gap-1">
                <Edit size={12} />
                ম্যানুয়াল
              </Badge>
            )}
            {hasCoordinates && (
              <Badge
                variant="outline"
                className="gap-1 bg-green-50 text-green-700"
              >
                <Crosshair size={12} />
                কো-অর্ডিনেট সেট করা আছে
              </Badge>
            )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onRemove}
          >
            <Trash2 size={14} className="mr-1" /> মুছুন
          </Button>
        </div>

        <div className="flex gap-2 mb-4 flex-wrap">
          {!hasNewsConnected ? (
            <>
              <Button
                type="button"
                variant={!isManualMode ? "default" : "outline"}
                size="sm"
                onClick={handleSwitchToNewsMode}
                className="gap-2"
              >
                <Newspaper size={14} />
                নিউজ থেকে সিলেক্ট করুন
              </Button>
              <Button
                type="button"
                variant={isManualMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsManualMode(true)}
                className="gap-2"
              >
                <Edit size={14} />
                ম্যানুয়ালি লিখুন
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveNewsId}
              className="gap-2 text-red-600 hover:text-red-700"
            >
              <Edit size={14} />
              নিউজ সংযোগ সরান ও ম্যানুয়ালি লিখুন
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            {hasNewsConnected && (
              <div className="bg-gray-50 p-2 rounded-md">
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  সংযুক্ত নিউজ আইডি
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">
                    {newsId}
                  </code>
                  {newsSlug && (
                    <span className="text-xs text-gray-500">
                      (slug: {newsSlug})
                    </span>
                  )}
                </div>
              </div>
            )}

            <TextInput
              control={control}
              name={`pages.${pageIndex}.articles.${articleIndex}.title`}
              label="আর্টিকেল শিরোনাম"
              placeholder="আর্টিকেলের শিরোনাম লিখুন"
              rules={{ required: "শিরোনাম প্রয়োজন" }}
            />

            <SelectInput
              control={control}
              name={`pages.${pageIndex}.articles.${articleIndex}.category`}
              label="ক্যাটাগরি"
              placeholder="ক্যাটাগরি নির্বাচন করুন"
              options={categoryOptions}
              rules={{ required: "ক্যাটাগরি প্রয়োজন" }}
            />

            <div>
              <label className="text-sm font-medium block mb-2">
                আর্টিকেল ইমেজ <span className="text-red-500">*</span>
              </label>
              {articleImage ? (
                <div>
                  <Image
                    src={articleImage as string}
                    alt="Article"
                    width={150}
                    height={150}
                    className="rounded-lg object-cover border"
                    unoptimized
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={onSelectImage}
                  >
                    <ImageUpIcon size={14} className="mr-1" /> পরিবর্তন করুন
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onSelectImage}
                  className="w-full"
                >
                  <ImageUpIcon size={16} className="mr-2" />
                  আর্টিকেল ইমেজ নির্বাচন করুন
                </Button>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium block mb-2">
              কো-অর্ডিনেট <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 mb-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
              <div>📍 X: {(x as number) || 0}</div>
              <div>📍 Y: {(y as number) || 0}</div>
              <div>📏 Width: {(width as number) || 0}</div>
              <div>📏 Height: {(height as number) || 0}</div>
            </div>
            <Button
              type="button"
              variant={hasCoordinates ? "outline" : "default"}
              size="sm"
              onClick={onOpenCoordinatePicker}
              className="w-full gap-2"
            >
              <Crosshair size={14} />
              {hasCoordinates
                ? "কো-অর্ডিনেট পরিবর্তন করুন"
                : "কো-অর্ডিনেট সেট করুন"}
            </Button>
            {!hasCoordinates && (
              <p className="text-red-500 text-xs mt-1">
                * আর্টিকেলের অবস্থান নির্ধারণ করতে কো-অর্ডিনেট সেট করুন
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">
            আর্টিকেল বিবরণ <span className="text-red-500">*</span>
          </label>
          <DailyTimesEditor
            name={`pages.${pageIndex}.articles.${articleIndex}.content`}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
