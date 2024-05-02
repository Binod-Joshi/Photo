import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { MdDownloadForOffline } from "react-icons/md";
import { downloadImage } from "../utils/downloadimage";
import CropImage from "./subcomponent/CropImage";


const Camera = () => {
  const [openCamera, setOpenCamera] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState("environment"); // Default to back camera
  const webcamRef = useRef(null);
  const [url, setUrl] = useState(null);
  const [croped, setCroped] = useState(false);

  const videoConstraints = {
    height: 1280,
    width: 720,
    facingMode: selectedCamera // Default to back camera
  };

  const capturePhoto = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setUrl(imageSrc); // Set the captured image URL
  }, [webcamRef]);


  return (
    <>
      <div>
        <button onClick={() => setOpenCamera(!openCamera)}>
          {openCamera ? "Close Camera" : "Open Camera"}
        </button>
        {openCamera && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <label>
              <input
                type="radio"
                name="camera"
                value="environment"
                checked={selectedCamera === "environment"}
                onChange={() => setSelectedCamera("environment")}
              />
              Back Camera
            </label>
            <label>
              <input
                type="radio"
                name="camera"
                value="user"
                checked={selectedCamera === "user"}
                onChange={() => setSelectedCamera("user")}
              />
              Front Camera
            </label>
            <Webcam
              ref={webcamRef}
              audio={true}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{ height: "380px", width: "380px", margin: "10px 0" }}
            />
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <button onClick={capturePhoto}>Capture</button>
              <button onClick={() => setUrl(null)}>Refresh</button>
            </div>
          </div>
        )}
      </div>
      {(url && !croped) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "10px" }}>
          <img
            style={{ height: "300px", width: "300px", marginTop: "10px" }}
            src={url}
            alt="Captured Photo"
          />
          <button onClick={() => setCroped(true)}>Crop Image</button>
          <button style={{ border: "none", borderRadius: "10px", backgroundColor: "#00b8ff" }} onClick={() => downloadImage(url)}>
            <MdDownloadForOffline style={{ width: "40px", height: "40px" }} />
          </button>
        </div>
      )}
      {(url && croped) && (
        <CropImage imageDataUrl={url} setCroped={setCroped}/>
      )}
    </>
  );
};

export default Camera;
