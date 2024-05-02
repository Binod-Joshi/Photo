import React, { useState, useRef, useCallback } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { downloadImage } from "../../utils/downloadimage";
import { MdDownloadForOffline } from "react-icons/md";

function CropImage({ imageDataUrl,setCroped }) {
  console.log(imageDataUrl);
  const [crop, setCrop] = useState({ aspect: 4 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [filteredImageUrl, setFilteredImageUrl] = useState(null);
  const imgRef = useRef(null);

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const applyFilter = (filter) => {
    if (imgRef.current) {
      imgRef.current.style.filter = filter;
    }
  };

  const resetFilter = () => {
    if (imgRef.current) {
      imgRef.current.style.filter = "none";
    }
  };

  const getCroppedImg = async (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    if (imgRef.current.style.filter !== "none") {
      ctx.filter = imgRef.current.style.filter;
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  };

  const handleDone = async () => {
    if (imgRef.current && completedCrop?.width && completedCrop?.height) {
      try {
        const croppedImage = await getCroppedImg(imgRef.current, completedCrop);

        setCroppedImageUrl(croppedImage);

        setFilteredImageUrl(croppedImage);

        toast.success("Image cropped successfully! 🎉");
      } catch (error) {
        toast.error("Error cropping image! 😵");
        // console.error("Error cropping image:", error);
      }
    }
  };

  const handleFilterChange = (filter) => {
    resetFilter();
    applyFilter(filter);

    setFilteredImageUrl(null);
  };

  return (
    <div className="flex flex-col items-center">
      {!croppedImageUrl ? (
        <>
          <div className="text-4xl font-semibold italic font-sans text-center">
            Crop your Image
          </div>

          <div className="mt-4"></div>
          <ReactCrop
            src={filteredImageUrl || imageDataUrl}
            crop={crop}
            onImageLoaded={onLoad}
            onComplete={(c) => setCompletedCrop(c)}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            aspect={undefined}
            minHeight={100}
          >
            <img
              ref={imgRef}
              alt="Crop me"
              src={filteredImageUrl || imageDataUrl}
            />
          </ReactCrop>

          <div className="flex mt-4">
            <button
              onClick={() => handleFilterChange("none")}
              className="bg-blue-500 text-white font-semibold m-2 px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
            >
              Original
            </button>

            <button
              onClick={() =>
                handleFilterChange(
                  "brightness(1.3) contrast(1.25) saturate(1.3) "
                )
              }
              className="bg-blue-500 text-white font-semibold m-2 px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
            >
              Light Color
            </button>

            <button
              onClick={() =>
                handleFilterChange("grayscale(1.4) contrast(1.3) saturate(1.2)")
              }
              className="bg-blue-500 text-white font-semibold m-2 px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
            >
              Grayscale
            </button>
          </div>

          <button
            onClick={handleDone}
            className="bg-blue-500 text-white font-semibold m-4 px-4 py-2 rounded-md mt-4 hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-400"
          >
            Done
          </button>
        </>
      ) : (
        <>
          <div className="text-4xl font-semibold italic font-sans text-center">
            Final Output
          </div>
          <div className="mt-4"></div>

          {/* Display the filtered image, if a filter is applied */}
          {filteredImageUrl && (
           <div style={{display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"10px"}}>
            <img
              alt="Filtered Cropped Version"
              src={filteredImageUrl}
              style={{ width: "40%", height: "50vh", filter: "none" }}
            />
            <button style={{ border: "none", borderRadius: "10px", backgroundColor: "#00b8ff",width:"100px" }} onClick={() => downloadImage(filteredImageUrl)}>
            <MdDownloadForOffline style={{ width: "40px", height: "40px" }} />
          </button>
           </div>
          )}
        </>
      )}
      <ToastContainer />
      <button
            onClick={() => setCroped(false)}
            style={{marginTop:"10px"}}
          >
            Back to Camera
          </button>
    </div>
  );
}

export default CropImage;
