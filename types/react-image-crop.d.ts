import 'react-image-crop/dist/ReactCrop.css';
import { ReactCropProps } from 'react-image-crop';

declare module 'react-image-crop' {
  interface ReactCropProps {
    src: string;
    onImageLoaded?: (image: HTMLImageElement) => void;
    crossorigin: any;
  }
}
