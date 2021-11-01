import React, {useState} from 'react'

import TagItem from './TagItem'

const TagContainer = ({tags}) => {
  return (
    <div className="overflow-hidden">
      {tags.map((t, index) => 
        <TagItem
          key={index}
          lastChild={index + 1 === tags.length}
          text={t}/>  
      )}
    </div>
  )
}

export default TagContainer