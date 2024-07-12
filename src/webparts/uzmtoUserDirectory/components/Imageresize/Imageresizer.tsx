import * as React from 'react';
import { useState, useEffect } from 'react';

interface ImageResizerProps {
  username?: string;
  baseUrl?: string;
}

const ImageResizer: React.FC<ImageResizerProps> = ({ username, baseUrl = 'https://eneraseg.sharepoint.com/sites/UZMTO2' }) => {

  const [resizedImageSrc, setResizedImageSrc] = useState<string | null>(null);

  useEffect(() => {

    const fetchResizedImage = async () => {

      try {

        const version = username?.substring(0, 10); // Get the first 10 characters of the username as the version
        const response = await fetch(`${baseUrl}/foto_employees/${username}/big_pic.jpg?version=${version}`);
        const blob = await response.blob();

        // Resize the image
        const resizedBlob = await resizeImage(blob, 500, 350, 1); // 10 times smaller
        const resizedUri = URL.createObjectURL(resizedBlob);

        setResizedImageSrc(resizedUri);
      } catch (error) {
        console.error('Error fetching or resizing image:', error);
      }
    };

    fetchResizedImage();
  }, [username, baseUrl]);

  // Check if there's a photo, render the image; otherwise, render initials
  return (

    <div>
      {resizedImageSrc ? (
        <img src={resizedImageSrc} alt="User" />
      ) : (
        username && <InitialsContainer username={username} />
      )}
    </div>

  );
};

interface InitialsContainerProps {
  username: string;
}

const InitialsContainer: React.FC<InitialsContainerProps> = ({ username }) => (

  <div className="initialsStyle" style={{ backgroundColor: getRandomColor() }}>
    {getInitials(username)}
  </div>

);

// Function to resize the image
const resizeImage = (blob: Blob, maxWidth: number, maxHeight: number, quality: number): Promise<Blob> => {

  return new Promise((resolve) => {

    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = () => {

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      const targetWidth = Math.min(maxWidth, img.width);
      const targetHeight = Math.min(maxHeight, img.height);

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob((resizedBlob) => {
        resolve(resizedBlob!);
      }, 'image/jpeg', quality);

    };
  });
};

const getInitials = (name: string = ''): string => {

  const nameParts = name.split(' ');
  const initials = nameParts.map((part) => part.charAt(0)).join('').toUpperCase();
  return initials;

};

const getRandomColor = (): string => {

  // Generate a random hex color
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  
};

export default ImageResizer;
