/* eslint-disable @typescript-eslint/no-explicit-any */

export interface IArticle {
  id?: string;
  newsId?: string;
  newsSlug?: string;
  title: string;
  content: string;
  category: string;
  articleImage: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IPage {
  pageNumber: number;
  image: string;
  thumbnail: string;
  originalWidth: number;
  originalHeight: number;
  articles: IArticle[];
}

export interface IFooterInfo {
  editor: string;
  publisher: string;
  organization: string;
  copyright: string;
}

export interface AddEpaperFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export interface ArticleCardProps {
  pageIndex: number;
  articleIndex: number;
  control: any;
  onRemove: () => void;
  onSelectImage: () => void;
  onOpenCoordinatePicker: () => void;
  onSelectFromNews?: () => void;
}

export interface PageCardProps {
  pageIndex: number;
  pageNumber: number;
  control: any;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  onAddArticle: () => void;
  onRemoveArticle: (articleIndex: number) => void;
  onSelectImage: (type: 'page' | 'thumbnail') => void;
  onSelectArticleImage: (articleIndex: number) => void;
  onUpdateCoordinates: (
    articleIndex: number,
    coordinates: { x: number; y: number; width: number; height: number },
    naturalWidth: number,
    naturalHeight: number
  ) => void;
  onSelectNewsForArticle?: (pageIndex: number, articleIndex: number) => void;
}
export interface ArticleCardProps {
  pageIndex: number;
  articleIndex: number;
  control: any;
  onRemove: () => void;
  onSelectImage: () => void;
  onOpenCoordinatePicker: () => void;
  onSelectFromNews?: () => void;
}

export interface Coords {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CoordinatePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageImage: string;
  onSelect: (
    coords: Coords,
    naturalWidth: number,
    naturalHeight: number,
  ) => void;
  initialCoords?: Coords;
  originalWidth?: number;
  originalHeight?: number;
}