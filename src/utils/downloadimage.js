import FileSaver from "file-saver";

export const downloadImage = (photo) => {
    console.log(photo);
    FileSaver.saveAs(photo, `downloadmyImage.jpg`)
}