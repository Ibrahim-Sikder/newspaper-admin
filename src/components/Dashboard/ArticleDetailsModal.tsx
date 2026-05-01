// components/epaper/ArticleDetailsModal.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Article, Epaper, Page } from "@/types/e-paper";

interface ArticleDetailsModalProps {
  epaper: Epaper | null;
  onClose: () => void;
}

const ArticleDetailsModal: React.FC<ArticleDetailsModalProps> = ({
  epaper,
  onClose,
}) => {
  const [selectedPage, setSelectedPage] = useState<number>(0);

  if (!epaper) return null;

  const currentPage: Page | undefined = epaper.pages?.[selectedPage];
  const articles: Article[] = currentPage?.articles || [];

  const totalArticles =
    epaper.pages?.reduce(
      (sum: number, page: Page) => sum + (page.articles?.length || 0),
      0,
    ) || 0;

  return (
    <Dialog open={!!epaper} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {epaper.title} - {epaper.date}
          </DialogTitle>
          {epaper.edition && (
            <p className="text-sm text-gray-600 mt-1">
              Edition: {epaper.edition}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Total Pages: {epaper.pages?.length || 0} | Total Articles:{" "}
            {totalArticles}
          </p>
        </DialogHeader>

        {/* Page Navigation */}
        {epaper.pages && epaper.pages.length > 1 && (
          <div className="flex gap-2 mb-4 border-b pb-4 overflow-x-auto">
            {epaper.pages.map((page: Page, index: number) => (
              <Button
                key={index}
                variant={selectedPage === index ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPage(index)}
                className="whitespace-nowrap"
              >
                Page {page.pageNumber || index + 1}
              </Button>
            ))}
          </div>
        )}

        {/* Page Image */}
        {currentPage?.image && (
          <div className="mb-6">
            <img
              src={currentPage.image}
              alt={`Page ${currentPage.pageNumber || selectedPage + 1}`}
              className="w-full rounded-lg shadow-md"
            />
          </div>
        )}

        {/* Articles Section */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-4">
            Articles ({articles.length})
          </h3>

          {articles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No articles found on this page
            </p>
          ) : (
            <div className="grid gap-6">
              {articles.map((article: Article, index: number) => (
                <div
                  key={article.id || index}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-wrap gap-4">
                    {article.articleImage && (
                      <div className="flex-shrink-0">
                        <img
                          src={article.articleImage}
                          alt={article.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                        <h4 className="text-lg font-semibold text-blue-600">
                          {article.title}
                        </h4>
                        {article.category && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full whitespace-nowrap">
                            {article.category}
                          </span>
                        )}
                      </div>

                      {article.content && (
                        <p className="text-gray-700 mt-2">{article.content}</p>
                      )}

                      {/* Article Position Info */}
                      {(article.x !== undefined || article.y !== undefined) && (
                        <div className="mt-3 text-xs text-gray-500 flex flex-wrap gap-3">
                          {article.x !== undefined && (
                            <span>X: {article.x}px</span>
                          )}
                          {article.y !== undefined && (
                            <span>Y: {article.y}px</span>
                          )}
                          {article.width && (
                            <span>Width: {article.width}px</span>
                          )}
                          {article.height && (
                            <span>Height: {article.height}px</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        {epaper.footerInfo && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-semibold mb-2">Footer Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              {epaper.footerInfo.organization && (
                <div>
                  <span className="font-medium">Organization:</span>{" "}
                  {epaper.footerInfo.organization}
                </div>
              )}
              {epaper.footerInfo.publisher && (
                <div>
                  <span className="font-medium">Publisher:</span>{" "}
                  {epaper.footerInfo.publisher}
                </div>
              )}
              {epaper.footerInfo.editor && (
                <div>
                  <span className="font-medium">Editor:</span>{" "}
                  {epaper.footerInfo.editor}
                </div>
              )}
              {epaper.footerInfo.copyright && (
                <div>
                  <span className="font-medium">Copyright:</span>{" "}
                  {epaper.footerInfo.copyright}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ArticleDetailsModal;
