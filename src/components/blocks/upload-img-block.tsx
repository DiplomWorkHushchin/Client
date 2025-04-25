'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { User } from "lucide-react"
import 'react-image-crop/dist/ReactCrop.css'
import ReactCrop, {
    Crop,
    PixelCrop,
    makeAspectCrop,
    centerCrop
} from 'react-image-crop'

interface UploadImgBlockProps {
    onImageSelect: (file: File | null) => void
    selectedFile: File | null
}

const ASPECT_RATIO = 1
const MIN_DIMENSION = 150

export default function UploadImgBlock({ onImageSelect, selectedFile }: UploadImgBlockProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>()
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
    const imgRef = useRef<HTMLImageElement | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        const file = e.dataTransfer.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleImageClick = () => {
        document.getElementById("file-input")?.click();
    }

    const onImageLoaded = (img: HTMLImageElement) => {
        imgRef.current = img
        const { width, height } = img
        const crop = makeAspectCrop({ unit: '%', height: 100 }, ASPECT_RATIO, width, height)
        setCrop(centerCrop(crop, width, height))
        return false
    }

    const cropImage = async () => {
        const image = imgRef.current
        const crop = completedCrop
        if (!image || !crop?.width || !crop?.height) return

        const canvas = document.createElement('canvas')
        canvas.width = crop.width
        canvas.height = crop.height
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width,
            crop.height
        )

        canvas.toBlob(blob => {
            if (blob) {
                const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' })
                onImageSelect(file)
            }
        }, 'image/jpeg')
    }

    // 👇 Сброс при selectedFile = null
    useEffect(() => {
        if (!selectedFile) {
            setPreviewUrl(null)
            setCrop(undefined)
            setCompletedCrop(undefined)
            imgRef.current = null
        }
    }, [selectedFile])

    useEffect(() => {
        if (completedCrop?.width && completedCrop?.height) {
            cropImage()
        }
    }, [completedCrop])

    return (
        <div className="p-4 flex flex-col gap-4 items-center border-dashed border-2 rounded-lg"
             onDragOver={handleDragOver}
             onDrop={handleDrop}
        >
            {previewUrl ? (
                <ReactCrop
                    crop={crop}
                    onChange={setCrop}
                    onComplete={c => setCompletedCrop(c)}
                    circularCrop
                    aspect={ASPECT_RATIO}
                    minWidth={MIN_DIMENSION}
                >
                    <img
                        src={previewUrl}
                        ref={imgRef}
                        onLoad={(e) => onImageLoaded(e.currentTarget)}
                        alt="Crop me"
                    />
                </ReactCrop>
            ) : (
                <div
                    className="bg-secondary rounded-full max-h-64 w-64 h-64 flex flex-col justify-center items-center cursor-pointer"
                    onClick={handleImageClick}
                >
                    <User className="h-3/5 w-3/5" />
                </div>
            )}
            <Input type="file" accept="image/*" id="file-input" onChange={handleFileChange} className="hidden" />
        </div>
    )
}
