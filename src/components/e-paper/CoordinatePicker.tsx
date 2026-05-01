/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CoordinatePickerProps } from "@/types/e-paper";

const CoordinatePicker: React.FC<CoordinatePickerProps> = ({
  open,
  onOpenChange,
  pageImage,
  onSelect,
  initialCoords,
  originalWidth = 0,
  originalHeight = 0,
}) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState<{
    start: { x: number; y: number };
    end: { x: number; y: number };
  }>({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
  const [naturalSize, setNaturalSize] = useState({
    width: originalWidth || 1200,
    height: originalHeight || 1800,
  });

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (open) {
      setIsSelecting(false);
      setSelection({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
    }
  }, [open]);

  const handleImageLoad = useCallback(() => {
    const img = imageRef.current;
    if (!img) return;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    if (nw > 0 && nh > 0) {
      setNaturalSize({ width: nw, height: nh });
    }
  }, []);
  const toNatural = useCallback(
    (displayX: number, displayY: number) => {
      const img = imageRef.current;
      if (!img) return { x: Math.round(displayX), y: Math.round(displayY) };
      const rect = img.getBoundingClientRect();
      const scaleX = naturalSize.width / rect.width;
      const scaleY = naturalSize.height / rect.height;
      return {
        x: Math.round(Math.max(0, Math.min(displayX, rect.width)) * scaleX),
        y: Math.round(Math.max(0, Math.min(displayY, rect.height)) * scaleY),
      };
    },
    [naturalSize],
  );
  const toDisplay = useCallback(
    (naturalX: number, naturalY: number) => {
      const img = imageRef.current;
      if (!img) return { x: 0, y: 0 };
      const rect = img.getBoundingClientRect();
      return {
        x: (naturalX / naturalSize.width) * rect.width,
        y: (naturalY / naturalSize.height) * rect.height,
      };
    },
    [naturalSize],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const img = imageRef.current;
      if (!img) return;
      const rect = img.getBoundingClientRect();
      const natural = toNatural(e.clientX - rect.left, e.clientY - rect.top);
      setIsSelecting(true);
      setSelection({ start: natural, end: natural });
      e.preventDefault();
    },
    [toNatural],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isSelecting) return;
      const img = imageRef.current;
      if (!img) return;
      const rect = img.getBoundingClientRect();
      const natural = toNatural(e.clientX - rect.left, e.clientY - rect.top);
      setSelection((prev) => ({ ...prev, end: natural }));
    },
    [isSelecting, toNatural],
  );

  const handleMouseUp = useCallback(() => setIsSelecting(false), []);
  const selectionDisplayRect = () => {
    const s = toDisplay(selection.start.x, selection.start.y);
    const e = toDisplay(selection.end.x, selection.end.y);
    return {
      left: Math.min(s.x, e.x),
      top: Math.min(s.y, e.y),
      width: Math.abs(e.x - s.x),
      height: Math.abs(e.y - s.y),
    };
  };
  const initialDisplayRect = () => {
    if (!initialCoords || !initialCoords.width || !initialCoords.height)
      return null;
    const tl = toDisplay(initialCoords.x, initialCoords.y);
    const br = toDisplay(
      initialCoords.x + initialCoords.width,
      initialCoords.y + initialCoords.height,
    );
    return { left: tl.x, top: tl.y, width: br.x - tl.x, height: br.y - tl.y };
  };

  const handleConfirm = () => {
    const x = Math.min(selection.start.x, selection.end.x);
    const y = Math.min(selection.start.y, selection.end.y);
    const w = Math.abs(selection.end.x - selection.start.x);
    const h = Math.abs(selection.end.y - selection.start.y);
    if (w < 10 || h < 10) {
      alert("অনুগ্রহ করে একটি বড় এরিয়া সিলেক্ট করুন (কমপক্ষে 10×10 px)");
      return;
    }
    onSelect(
      { x, y, width: w, height: h },
      naturalSize.width,
      naturalSize.height,
    );
    onOpenChange(false);
  };

  const selNW = Math.abs(selection.end.x - selection.start.x);
  const selNH = Math.abs(selection.end.y - selection.start.y);
  const selDisp = selectionDisplayRect();
  const initDisp = initialDisplayRect();

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            ক্লিকেবল এরিয়া সিলেক্ট করুন
          </DialogTitle>
        </DialogHeader>

        <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm">
          <p className="font-medium mb-1">📖 কিভাবে ব্যবহার করবেন:</p>
          <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
            <li>ইমেজের উপর ক্লিক করে ড্র্যাগ করুন</li>
            <li>নীল বক্স = আপনার সিলেক্ট করা এরিয়া</li>
            <li>
              ইমেজ আসল সাইজ:{" "}
              <strong>
                {naturalSize.width} × {naturalSize.height} px
              </strong>
            </li>
            {selNW > 0 && selNH > 0 && (
              <li>
                বর্তমান সিলেকশন:{" "}
                <strong>
                  {selNW} × {selNH} px
                </strong>
              </li>
            )}
          </ul>
        </div>
        <div
          className="relative border-2 border-gray-300 rounded-lg overflow-hidden select-none"
          style={{ cursor: "crosshair" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={pageImage}
            alt="Select clickable area"
            className="w-full h-auto block pointer-events-none"
            onLoad={handleImageLoad}
            draggable={false}
          />
          {!isSelecting && initDisp && initDisp.width > 0 && (
            <div
              className="absolute border-2 border-green-500 bg-green-200/30 pointer-events-none"
              style={{
                left: initDisp.left,
                top: initDisp.top,
                width: initDisp.width,
                height: initDisp.height,
              }}
            >
              <div className="absolute -top-6 left-0 bg-green-600 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                পূর্বের সিলেকশন
              </div>
            </div>
          )}
          {selNW > 0 && selNH > 0 && (
            <div
              className="absolute border-2 border-blue-500 bg-blue-200/30 pointer-events-none"
              style={{
                left: selDisp.left,
                top: selDisp.top,
                width: selDisp.width,
                height: selDisp.height,
              }}
            >
              <div className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                {selNW} × {selNH}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            বাতিল করুন
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={selNW < 10 || selNH < 10}
          >
            কনফার্ম করুন
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoordinatePicker;
