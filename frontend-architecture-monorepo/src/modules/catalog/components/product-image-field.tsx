import { useEffect, useState, type ChangeEvent } from "react";
import { readFileAsDataUrl, uploadImage } from "@/shared/api/uploads";
import { Button } from "@/shared/ui/button";

interface ProductImageFieldProps {
  imageUrl?: string | null;
  productName: string;
  disabled?: boolean;
  onChange: (value: string | null) => void;
}

export function ProductImageField({ imageUrl, productName, disabled = false, onChange }: ProductImageFieldProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const displayedImageUrl = previewUrl ?? imageUrl;

  useEffect(() => {
    if (!imageUrl) {
      setPreviewUrl(null);
    }
  }, [imageUrl]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setErrorMessage(null);
      setIsUploading(true);
      setPreviewUrl(await readFileAsDataUrl(file));
      const { url } = await uploadImage(file);
      onChange(url);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex h-48 w-48 items-center justify-center overflow-hidden rounded-xl border bg-secondary">
          {displayedImageUrl ? (
            <img src={displayedImageUrl} alt={productName} className="h-full w-full object-cover" />
          ) : (
            <div className="w-full px-4 text-center text-sm text-muted-foreground">No product image uploaded</div>
          )}
        </div>
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            disabled={disabled || isUploading}
            onChange={(event) => void handleFileChange(event)}
            className="block text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || isUploading || !displayedImageUrl}
              onClick={() => {
                setPreviewUrl(null);
                onChange(null);
              }}
            >
              Remove image
            </Button>
          </div>
          {isUploading ? <p className="text-sm text-muted-foreground">Uploading product image...</p> : null}
          {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
        </div>
      </div>
    </div>
  );
}
