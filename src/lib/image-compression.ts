const MAX_IMAGE_DIMENSION = 1600
const WEBP_QUALITY = 0.84

export async function compressImage(file: File): Promise<Blob> {
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file

  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)

    const context = canvas.getContext("2d")
    if (!context) return file

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    return await new Promise<Blob>((resolve) => {
      canvas.toBlob((compressedImage) => resolve(compressedImage ?? file), "image/webp", WEBP_QUALITY)
    })
  } catch {
    return file
  }
}
