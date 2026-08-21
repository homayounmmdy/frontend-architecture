import { useEffect, useState, type ChangeEvent } from "react";
import { readFileAsDataUrl, uploadAvatar } from "@commerceos/shared/api/uploads";
import { Button } from "@commerceos/ui/button";

interface AvatarFieldProps {
  avatarUrl?: string | null;
  initials: string;
  disabled?: boolean;
  isUploading?: boolean;
  onChange: (value: string | null) => void;
}

export function AvatarField({ avatarUrl, initials, disabled = false, isUploading = false, onChange }: AvatarFieldProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploadingLocal, setIsUploadingLocal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const uploadInProgress = isUploading || isUploadingLocal;
  const displayedAvatarUrl = previewUrl ?? avatarUrl;

  useEffect(() => {
    if (!avatarUrl) {
      setPreviewUrl(null);
    }
  }, [avatarUrl]);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setErrorMessage(null);
      setIsUploadingLocal(true);
      setPreviewUrl(await readFileAsDataUrl(file));
      const { url } = await uploadAvatar(file);
      onChange(url);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Avatar upload failed");
    } finally {
      setIsUploadingLocal(false);
      event.target.value = "";
    }
  }

  return (
    <div className="flex items-center gap-4">
      {displayedAvatarUrl ? (
        <img src={displayedAvatarUrl} alt="User avatar" className="h-20 w-20 rounded-full border object-cover" />
      ) : (
        <div className="flex h-20 w-20 items-center justify-center rounded-full border bg-secondary text-lg font-semibold">
          {initials}
        </div>
      )}
      <div className="space-y-2">
        <input
          type="file"
          accept="image/*"
          disabled={disabled || uploadInProgress}
          onChange={(event) => void handleFileChange(event)}
          className="block text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-sm file:font-medium"
        />
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || uploadInProgress || !displayedAvatarUrl}
            onClick={() => {
              setPreviewUrl(null);
              onChange(null);
            }}
          >
            Remove avatar
          </Button>
        </div>
        {uploadInProgress ? <p className="text-sm text-muted-foreground">Uploading avatar...</p> : null}
        {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
      </div>
    </div>
  );
}
