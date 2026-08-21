export interface UploadAvatarResponse {
  url: string;
}

export async function readFileAsDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
        return;
      }

      reject(new Error("Unable to read image file"));
    };
    reader.onerror = () => reject(new Error("Unable to read image file"));
    reader.readAsDataURL(file);
  });
}

export async function uploadImage(file: File) {
  const dataUrl = await readFileAsDataUrl(file);

  const response = await fetch("/api/uploads/image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dataUrl,
      fileName: file.name,
    }),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? "Avatar upload failed");
  }

  return (await response.json()) as UploadAvatarResponse;
}

export async function uploadAvatar(file: File) {
  return uploadImage(file);
}
