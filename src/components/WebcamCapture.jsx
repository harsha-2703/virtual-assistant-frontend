import { useRef, useCallback, useState, forwardRef, useImperativeHandle } from "react";
import Webcam from "react-webcam";

const WebcamCapture = forwardRef(({ isVisible }, ref) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  useImperativeHandle(ref, () => ({
    getScreenshot: () => webcamRef.current?.getScreenshot(),capture,
  }));

  if (!isVisible) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-xl overflow-hidden w-[350px] lg:w-[400px] h-auto">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{
            width: 1280,
            height: 720
          }}
          className="transform scale-x-[-1] w-full h-auto"
        />
      </div>

      {image && (
        <div className="mt-4">
          <p className="text-sm mb-2">Captured Image:</p>
          <img src={image} alt="captured" className="rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
});

export default WebcamCapture;