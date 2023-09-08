/*
    The component responsible for the uploadation of the image

*/

import React,{useRef,useState,useEffect} from "react";


import Button from "./Button";
import './ImageUpload.css';

const ImageUpload = props => {
    const [file,setFile] = useState();
    const [previewUrl,setPreviewUrl] = useState();
    const [isValid ,setIsValid] = useState(false);

    const filePickerRef = useRef();

    useEffect(()=>{
        if(!file){
            return ;
        }

        /*
            if the file exist then we can generate the filePreview url with the
            api build into the browser named FileReader() this is written in 
            browser side javascript
        */

        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        } ;
        fileReader.readAsDataURL(file);//before calling this we need to we need to load a function call

    },[file])

    const pickHandler = (event) => {
        let pickedFile;

        /*
            Note : setIsvalid not immediately change the isValid property it take some time
            so if we pass anywhere the isValid value then also it will take the previous value
            instead of new changed value

        */
       let fileIsValid;

        // files is the property that contain the file that was picked
        if(event.target.files && event.target.files.length === 1){
             pickedFile = event.target.files[0];

             //whenever the file is changed we want to generate the preview
             setFile(pickedFile);
             setIsValid(true);
             fileIsValid=true;
        } 
        else{
            setIsValid(false);
            fileIsValid=false;
        }

        props.onInput(props.id,pickedFile,fileIsValid);

    }

    const pickImageHandler = () => {
        filePickerRef.current.click();
    }

    return (
        <div className="form-control">
            <input 
                id={props.id}
                ref={filePickerRef}
                style={{display:"none"}}
                type="file"
                accept=".jpg,.png,.jpeg"
                onChange={pickHandler}

            />
            <div className={`image-upload ${props.center && 'center'}`}>
                <div className={`image-upload__preview`}>
                   {previewUrl && <img src={previewUrl} alt="Preview" />}
                   {!previewUrl && <p>Please Upload The Image</p>}
                </div>
                <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
            </div>
            {!isValid && <p>{props.errorText}</p>}
        </div>
    );
}

export default ImageUpload;