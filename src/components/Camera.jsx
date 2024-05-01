import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 380,
  facingMode: "environment"
};

const Camera = () => {
  const [openCamera, setOpenCamera] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState("environment"); // Default to back camera
  const webcamRef = useRef(null);
  const [url, setUrl] = useState(null);

  const capturePhoto = useCallback(async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setUrl(imageSrc);
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
              style={{ height: "380px", width: "380px" }}
            />
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <button onClick={capturePhoto}>Capture</button>
              <button onClick={() => setUrl(null)}>Refresh</button>
            </div>
          </div>
        )}
      </div>
      {url && (
        <div>
          <img
            style={{ height: "200px", width: "200px", marginTop: "10px" }}
            src={url}
            alt="Screenshot"
          />
        </div>
      )}
    </>
  );
};

export default Camera;
