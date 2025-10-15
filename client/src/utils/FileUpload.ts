//it send the file to the server using fetch API
export async function selectAndUploadFile(uploadUrl: string): Promise<{
  success: boolean;
  fileName?: string;
  error?: string;
}> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.style.display = 'none';
    document.body.appendChild(input);

    input.onchange = async () => {
      if (!input.files || input.files.length === 0) {
        document.body.removeChild(input);
        return resolve({ success: false, error: 'No file selected' });
      }

      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch(uploadUrl, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        resolve({ success: true, fileName: file.name });
      } catch {
        resolve({ success: false });
      } finally {
        document.body.removeChild(input);
      }
    };

    input.click();
  });
}
