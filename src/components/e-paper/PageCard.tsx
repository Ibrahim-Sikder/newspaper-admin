/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import { ImageUpIcon, MoveDown, MoveUp, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState, useCallback } from "react";
import { useWatch } from "react-hook-form";
import ArticleCard from "./ArticleCard";
import CoordinatePicker from "./CoordinatePicker";
import { PageCardProps } from "@/types/e-paper";

const PageCard: React.FC<PageCardProps> = ({
  pageIndex,
  pageNumber,
  control,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  onAddArticle,
  onRemoveArticle,
  onSelectImage,
  onSelectArticleImage,
  onUpdateCoordinates,
  onSelectNewsForArticle,
}) => {
  const [coordPickerOpen, setCoordPickerOpen] = useState(false);
  const [selectedArticleIndex, setSelectedArticleIndex] = useState<
    number | null
  >(null);

  const pageImage = useWatch({ control, name: `pages.${pageIndex}.image` });
  const pageThumbnail = useWatch({
    control,
    name: `pages.${pageIndex}.thumbnail`,
  });
  const originalWidth = useWatch({
    control,
    name: `pages.${pageIndex}.originalWidth`,
  });
  const originalHeight = useWatch({
    control,
    name: `pages.${pageIndex}.originalHeight`,
  });
  const articles =
    useWatch({ control, name: `pages.${pageIndex}.articles` }) || [];

  const handleOpenCoordinatePicker = useCallback((articleIndex: number) => {
    setSelectedArticleIndex(articleIndex);
    setCoordPickerOpen(true);
  }, []);

  const handleCoordinatesSelect = useCallback(
    (
      coordinates: { x: number; y: number; width: number; height: number },
      naturalWidth: number,
      naturalHeight: number,
    ) => {
      if (selectedArticleIndex !== null) {
        onUpdateCoordinates(
          selectedArticleIndex,
          coordinates,
          naturalWidth,
          naturalHeight,
        );
      }
      setCoordPickerOpen(false);
      setSelectedArticleIndex(null);
    },
    [selectedArticleIndex, onUpdateCoordinates],
  );

  const handleSelectNewsForArticle = useCallback(
    (articleIndex: number) => {
      if (onSelectNewsForArticle) {
        onSelectNewsForArticle(pageIndex, articleIndex);
      }
    },
    [pageIndex, onSelectNewsForArticle],
  );

  const currentArticle =
    selectedArticleIndex !== null ? articles[selectedArticleIndex] : null;
  const currentCoords = currentArticle
    ? {
        x: currentArticle.x || 0,
        y: currentArticle.y || 0,
        width: currentArticle.width || 0,
        height: currentArticle.height || 0,
      }
    : undefined;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4 pb-2 border-b">
        <h2 className="text-lg font-semibold">পৃষ্ঠা {pageNumber}</h2>
        <div className="flex gap-2">
          {!isFirst && (
            <Button type="button" variant="ghost" size="sm" onClick={onMoveUp}>
              <MoveUp size={16} />
            </Button>
          )}
          {!isLast && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onMoveDown}
            >
              <MoveDown size={16} />
            </Button>
          )}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onRemove}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-sm font-medium block mb-2">
            মূল পৃষ্ঠার ছবি
          </label>
          {pageImage ? (
            <div className="relative">
              <Image
                src={pageImage}
                alt={`Page ${pageNumber}`}
                width={200}
                height={300}
                className="rounded-lg object-cover border"
                unoptimized
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => onSelectImage("page")}
              >
                <ImageUpIcon size={14} className="mr-1" /> পরিবর্তন করুন
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => onSelectImage("page")}
            >
              <ImageUpIcon size={16} className="mr-2" /> পৃষ্ঠার ছবি নির্বাচন
              করুন
            </Button>
          )}
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">
            থাম্বনেইল ছবি
          </label>
          {pageThumbnail ? (
            <div className="relative">
              <Image
                src={pageThumbnail}
                alt={`Thumbnail ${pageNumber}`}
                width={100}
                height={150}
                className="rounded-lg object-cover border"
                unoptimized
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => onSelectImage("thumbnail")}
              >
                <ImageUpIcon size={14} className="mr-1" /> পরিবর্তন করুন
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => onSelectImage("thumbnail")}
            >
              <ImageUpIcon size={16} className="mr-2" /> থাম্বনেইল নির্বাচন করুন
            </Button>
          )}
        </div>
      </div>

      {originalWidth && originalHeight && (
        <div className="mb-3 text-xs text-gray-500 bg-gray-100 p-2 rounded">
          📐 ইমেজ আসল সাইজ: {originalWidth} × {originalHeight} pixels
        </div>
      )}

      <div className="mt-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">আর্টিকেল সমূহ</h3>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={onAddArticle}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus size={14} className="mr-1" /> নতুন আর্টিকেল যোগ করুন
          </Button>
        </div>

        <div className="space-y-3">
          {articles.map((article: any, articleIndex: number) => (
            <ArticleCard
              key={article.id || `${pageIndex}-${articleIndex}`}
              pageIndex={pageIndex}
              articleIndex={articleIndex}
              control={control}
              onRemove={() => onRemoveArticle(articleIndex)}
              onSelectImage={() => onSelectArticleImage(articleIndex)}
              onOpenCoordinatePicker={() =>
                handleOpenCoordinatePicker(articleIndex)
              }
              onSelectFromNews={() => handleSelectNewsForArticle(articleIndex)}
            />
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
            <p className="mb-2">কোন আর্টিকেল নেই</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddArticle}
            >
              <Plus size={14} className="mr-1" /> প্রথম আর্টিকেল যোগ করুন
            </Button>
          </div>
        )}
      </div>

      <CoordinatePicker
        open={coordPickerOpen}
        onOpenChange={setCoordPickerOpen}
        pageImage={pageImage || ""}
        onSelect={handleCoordinatesSelect}
        initialCoords={currentCoords}
        originalWidth={originalWidth || 0}
        originalHeight={originalHeight || 0}
      />
    </div>
  );
};

export default PageCard;
