import type { SVGProps } from 'react';

export function LineIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      {...props}
    >
      <path d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 9.8 11.2 15.5 19.1 9.7L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64zM224.2 288H184V144h40.2v144zm-64-144H120v144h40.2V144zm144.2 0H264v144h40.4V144zm63.8 0h-40.2v144h40.2V144z" />
    </svg>
  );
}
