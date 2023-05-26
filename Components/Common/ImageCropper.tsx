import { Box, Dialog, DialogContent } from '@mui/material';
import React, { useState, useCallback, useRef, ChangeEvent, useEffect } from 'react';
// import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop, { Crop } from 'react-image-crop';

interface ImageCropperProps {
  open: boolean;
}

export default function ImageCropper({ open }: ImageCropperProps) {
  const [width, setWidth] = useState()
  const [upImg, setUpImg] = useState<any>(null);
  const imgRef: any = useRef(null);
  const [crop, setCrop] = useState<any>({ unit: '%', width: 100, aspect: 16 / 9 });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setUpImg(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // useEffect(() => console.log('upImg:', upImg), [upImg])

  const onLoad = useCallback((img: HTMLImageElement) => {
    imgRef.current = img;
  }, []);

  const makeClientCrop = useCallback(async (crop: Crop) => {
    if (imgRef.current && crop.width && crop.height) {
      await createCropPreview(imgRef.current, crop, 'newFile.jpeg');
    }
  }, []);

  const createCropPreview = async (image: HTMLImageElement, crop: Crop, fileName: string) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width ?? 0;
    canvas.height = crop.height ?? 0;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(
        image,
        (crop.x ?? 0) * scaleX,
        (crop.y ?? 0) * scaleY,
        (crop.width ?? 0) * scaleX,
        (crop.height ?? 0) * scaleY,
        0,
        0,
        crop.width ?? 0,
        crop.height ?? 0
      );

      return new Promise<void>((resolve, reject) => {
        canvas.toBlob(
          (blob: any) => {
            if (!blob) {
              reject(new Error('Canvas is empty'));
              return;
            }
            blob.name = fileName;
            if (previewUrl) {
              console.log(previewUrl)
              window.URL.revokeObjectURL(previewUrl);
            }
            console.log(previewUrl)
            setPreviewUrl(window.URL.createObjectURL(blob));
            resolve();
          },
          'image/jpeg',
          1
        );
      });
    }
  };


  // GET WIDTH
  const ref: any = useRef(null)

  useEffect(() => {
    if (!ref?.current?.offsetWidth) return
    // when the component gets mounted
    setWidth(ref.current.offsetWidth); 
    // to handle page resize
    const getwidth = ()=>{
      setWidth(ref.current.offsetWidth);
    }
    window.addEventListener("resize", getwidth);
    // remove the event listener before the component gets unmounted
    return ()=>window.removeEventListener("resize", getwidth)
  }, []);

  return (
    <Dialog open={open} fullWidth={true} maxWidth="sm">
      <DialogContent>
        <div>
          <input type="file" accept="image/*" onChange={onSelectFile} />
        </div>
        <Box>
          {upImg && (
            <ReactCrop
              src={upImg}
              onImageLoaded={onLoad}
              crop={crop}
              crossorigin="anonymous"
              onChange={(c: any) => setCrop(c)}
              onComplete={makeClientCrop}
            />
          )}
        </Box>
        {previewUrl && <img
          alt="Crop preview"
          style={{ width: "100%", height: "fit-content", border: "1px solid blue" }}
          src={previewUrl}
        />}

      </DialogContent>
    </Dialog>
  );
}
