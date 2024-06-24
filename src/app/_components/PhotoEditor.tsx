"use client";

import React, {useRef, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Slider} from "@/components/ui/slider";
import {Switch} from "@/components/ui/switch";
import {cn} from "@/lib/utils";
import {useToast} from "@/components/ui/use-toast";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";

interface PhotoEditorProps {
    frame?: string;
    image?: File | null;
}

const ZOOM_LEVEL = 1;
const MIN_ZOOM = .2;
const MAX_ZOOM = 2;
const DEFAULT_CROP = {x: 0, y: 0}
const DEFAULT_ROTATION = 0;
const MIN_ROTATE = 0;
const MAX_ROTATE = 360;
const ROTATE_STEP = 1;
const ZOOM_STEP = .1;
const PhotoEditor: React.FC<PhotoEditorProps> = ({frame = 'atinwpsframe.png'}) => {
    const {toast} = useToast();
    const editor = useRef<any>(null);
    const fileInputRef = useRef<any>(null);
    const [image, setImage] = useState<string | null>(null);
    const canvasRef = useRef<any>(null);
    const [loading, setLoading] = useState(false);
    const [rounded, setRounded] = useState(false);
    const [zoomLevel, setZoomLevel] = useState<number>(ZOOM_LEVEL);
    const [crop, setCrop] = useState(DEFAULT_CROP)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [rotation, setRotation] = useState(DEFAULT_ROTATION)

    const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }
    const showCroppedImage = async () => {

    }
    const handleDownload = async () => {
        try {
            setLoading(true);
            const croppedImage: any = await getCroppedImg(
                image,
                croppedAreaPixels,
                rotation
            )
            const img = croppedImage;

            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');

            if (ctx) {
                const mainPhotoUrl = img;
                const frameImageUrl = frame;

                canvas.width = 1000;
                canvas.height = 1000;

                const mainPhoto = new Image();
                mainPhoto.crossOrigin = 'anonymous';
                mainPhoto.onload = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);

                    if (rounded) {
                        ctx.beginPath();
                        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2, true);
                        ctx.closePath();
                        ctx.clip();
                    }

                    ctx.drawImage(mainPhoto, 0, 0, canvas.width, canvas.height);
                    const frameImage = new Image();
                    frameImage.crossOrigin = 'anonymous';
                    frameImage.onload = () => {
                        ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);

                        const imageDataURL = canvas.toDataURL('image/png');
                        const a = document.createElement('a');
                        a.href = imageDataURL;
                        a.download = 'atinwps-' + Date.now() + '.png';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        setLoading(false);
                        toast({
                            title: 'Photo Downloaded',
                            description: 'Thank you for joining this cause! #AtinAngWestPhilippineSea'
                        })
                    };
                    frameImage.src = frameImageUrl;
                };
                mainPhoto.src = mainPhotoUrl;
            }
        } catch (e) {
            console.error(e)
        }

    }

    const handleInputClick = (event: React.MouseEvent<any, MouseEvent>) => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileInputChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                resetChanges();
                setImage(reader.result as string);
                fileInputRef.current.value = null;  // Clear the file input
            };
            reader.readAsDataURL(file);
        }
    };

    const resetChanges = () => {
        setImage(null)
        setZoomLevel(ZOOM_LEVEL);
        setRounded(false);
        setCrop(DEFAULT_CROP);
        setRotation(DEFAULT_ROTATION);
    }

    const handleRemove = () => {
        resetChanges();
    }

    return (
        <div className="flex flex-col w-full items-center mt-8 px-4">
            <div
                className={cn('flex relative w-full h-auto aspect-square border border-border bg-slate-100 mx-auto', rounded ? 'rounded-full overflow-hidden' : '')}
                onClick={image ? () => {
                } : handleInputClick}
            >
                <Cropper
                    objectFit={'cover'}
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
                    zoomWithScroll={true}

                />
                <img src={frame} alt="Selected Frame"
                     className="w-full h-full absolute top-0 left-0 pointer-events-none"/>
            </div>
            <input ref={fileInputRef} type={'file'}
                   style={{display: 'none'}}
                   accept="image/*"
                   onChange={handleFileInputChange}/>


            <div className='flex flex-col mt-2 gap-y-2 w-full'>
                {!image ? <>
                        <Button className={'w-full'} size={'lg'} onClick={handleInputClick}>Choose Photo</Button>
                    </> :
                    <>
                        <div className='flex flex-col gap-y-3 mb-4'>
                            <div className='text-start w-full'>
                                <label className={'block mb-2'} htmlFor="">Zoom</label>
                                <Slider disabled={!image} value={[zoomLevel]}
                                        onValueChange={(val) => setZoomLevel(val[0])}
                                        min={MIN_ZOOM} max={MAX_ZOOM} step={ZOOM_STEP}></Slider>
                            </div>
                            <div className='text-start w-full'>
                                <label className={'block mb-2'} htmlFor="">Rotate</label>
                                <Slider disabled={!image} value={[rotation]}
                                        onValueChange={(val) => setRotation(val[0])}
                                        min={MIN_ROTATE} max={MAX_ROTATE} step={ROTATE_STEP}></Slider>
                            </div>
                            <div className='text-start flex items-center gap-x-2 w-full'>
                                <label className={'block'} htmlFor="">Rounded Frame?</label>
                                <Switch checked={rounded} onCheckedChange={setRounded}></Switch>
                            </div>

                        </div>
                        <Button disabled={loading} loading={loading} size={'lg'} className={'w-full'}
                                onClick={handleDownload}>Download Photo</Button>
                        <Button className={'w-full'} size={'lg'} variant={'outlined'} onClick={handleRemove}>Remove
                            Photo</Button>
                    </>}
            </div>

            <canvas ref={canvasRef}
                    className="mt-4 border border-gray-500 rounded-lg shadow-md h-[500px] w-[500px] hidden"/>
        </div>
    );
};

export default PhotoEditor;
