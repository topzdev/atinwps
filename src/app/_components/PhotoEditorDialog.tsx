import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PreviewFrame from "@/app/_components/PreviewFrame";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import getCroppedImg from "@/lib/cropImage";

type Props = {
  children?: React.ReactNode;
  dialog: boolean;
  setDialog: (open: boolean) => void;
  frame: string;
  image: null | string;
  setFinalImage: (image: string) => void;
};

const ZOOM_LEVEL = 1;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2;
const DEFAULT_CROP = { x: 0, y: 0 };
const DEFAULT_ROTATION = 0;
const MIN_ROTATE = 0;
const MAX_ROTATE = 360;
const ROTATE_STEP = 1;
const ZOOM_STEP = 0.1;

const PhotoEditorDialog = ({
  dialog,
  setDialog,
  frame,
  setFinalImage,
  image,
}: Props) => {
  const canvasRef = useRef<any>(null);
  const [rounded, setRounded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(ZOOM_LEVEL);
  const [crop, setCrop] = useState(DEFAULT_CROP);
  const [loading, setLoading] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [rotation, setRotation] = useState(DEFAULT_ROTATION);

  useEffect(() => {
    if (image) {
      resetChanges();
    }
  }, [image]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const croppedImage: any = await getCroppedImg(
        image as string,
        croppedAreaPixels,
        rotation,
      );
      const img = croppedImage;

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (ctx) {
        const mainPhotoUrl = img;
        const frameImageUrl = frame;

        canvas.width = 1000;
        canvas.height = 1000;

        const mainPhoto = new Image();
        mainPhoto.crossOrigin = "anonymous";
        mainPhoto.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (rounded) {
            ctx.beginPath();
            ctx.arc(
              canvas.width / 2,
              canvas.height / 2,
              canvas.width / 2,
              0,
              Math.PI * 2,
              true,
            );
            ctx.closePath();
            ctx.clip();
          }

          ctx.drawImage(mainPhoto, 0, 0, canvas.width, canvas.height);
          const frameImage = new Image();
          frameImage.crossOrigin = "anonymous";
          frameImage.onload = () => {
            ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
            const imageDataURL = canvas.toDataURL("image/png");
            setFinalImage(imageDataURL);
            setDialog(false);
            setLoading(false);
          };
          frameImage.src = frameImageUrl;
        };
        mainPhoto.src = mainPhotoUrl;
      }
    } catch (e) {
      console.error(e);
    }
  };
  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const resetChanges = () => {
    setZoomLevel(ZOOM_LEVEL);
    setRounded(false);
    setCrop(DEFAULT_CROP);
    setRotation(DEFAULT_ROTATION);
  };

  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <DialogContent className={"max-md:px-3"}>
        <DialogHeader>
          <DialogTitle>Crop Photo</DialogTitle>
          <DialogDescription>
            Hold and pinch to zoom, move, or rotate the photo.
          </DialogDescription>
        </DialogHeader>
        <PreviewFrame rounded={rounded} frame={frame}>
          <Cropper
            objectFit={"cover"}
            image={image as string}
            rotation={rotation}
            crop={crop}
            restrictPosition={false}
            zoom={zoomLevel}
            minZoom={MIN_ZOOM}
            maxZoom={MAX_ZOOM}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoomLevel}
            onCropComplete={onCropComplete}
            onRotationChange={setRotation}
          />
        </PreviewFrame>

        <div className="flex flex-col gap-y-3 w-full mb-2">
          {/*<div className="text-start w-full">*/}
          {/*  <label className={"block mb-2"} htmlFor="">*/}
          {/*    Zoom*/}
          {/*  </label>*/}
          {/*  <Slider*/}
          {/*    disabled={!image}*/}
          {/*    value={[zoomLevel]}*/}
          {/*    onValueChange={(val) => setZoomLevel(val[0])}*/}
          {/*    min={MIN_ZOOM}*/}
          {/*    max={MAX_ZOOM}*/}
          {/*    step={ZOOM_STEP}*/}
          {/*  ></Slider>*/}
          {/*</div>*/}
          {/*<div className="text-start w-full">*/}
          {/*  <label className={"block mb-2"} htmlFor="">*/}
          {/*    Rotate*/}
          {/*  </label>*/}
          {/*  <Slider*/}
          {/*    disabled={!image}*/}
          {/*    value={[rotation]}*/}
          {/*    onValueChange={(val) => setRotation(val[0])}*/}
          {/*    min={MIN_ROTATE}*/}
          {/*    max={MAX_ROTATE}*/}
          {/*    step={ROTATE_STEP}*/}
          {/*  ></Slider>*/}
          {/*</div>*/}
          <div className="text-start flex items-center gap-x-2 w-full">
            <label className={"block"} htmlFor="">
              Rounded Frame?
            </label>
            <Switch checked={rounded} onCheckedChange={setRounded}></Switch>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          className="border border-gray-500 rounded-lg shadow-md h-[500px] w-[500px] hidden"
        />
        <DialogFooter className={"gap-2"}>
          {/*<Button size={"lg"} className={"w-full"} variant={"outlined"}>*/}
          {/*  Close*/}
          {/*</Button>*/}
          <Button
            disabled={loading}
            loading={loading}
            size={"lg"}
            className={"w-full"}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoEditorDialog;
