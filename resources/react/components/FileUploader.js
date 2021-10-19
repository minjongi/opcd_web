import React from 'react';
import { Icon } from '../components';

const FileUploader = ({accept, multiple, fluid, allows,  onChange}) => {
    
    const handleChangeFile = (e) => {
      const { files } = e.target;
  
      if(!files.length) return;
  
      onChange(files);
    }
  
    return (
      <>
        <label htmlFor="uploader" className={`file-uploader ${fluid ? 'fluid' : ''}`}>
          <input type="file" accept={accept || '*'} multiple={!!multiple} id="uploader" hidden onChange={handleChangeFile}/>
          <div className="frame">
            <Icon name="plus"/>
          </div>
        </label>
          
      </>
    );
  }
  
  export default FileUploader;