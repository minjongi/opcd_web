import React, {useEffect, useRef, useState} from 'react'
import { useHistory } from 'react-router-dom';

import { encodeStr } from '../../helpers/utils';

const TagItem = ({text}) => {
  const history = useHistory();
  const tagRef = useRef();
  const [status, setStatus] = useState('');
  if(!text) return null;

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if(!entries || !entries.length){
        setStatus('');
        return;
      }

      const section = entries[0].intersectionRatio;
      if(section === 1) setStatus('show')
      else if(section > 0) setStatus('truncated')
      else setStatus('')
    }, {root: null, rootMargin: "0px", threshold: 1.0})

    if(tagRef?.current) observer.observe(tagRef.current)

    return () => {
      if(tagRef.current) observer.unobserve(tagRef.current)
    }
  }, [tagRef])

  return (
    <div ref={tagRef} className={`relative d-inline-block pr-2 ${status === 'truncated' ? 'truncated_tag' : ''}`} >
      <span
        className="cursor-pointer back-primary px-1"
        style={{visibility: status === 'show' ? 'visible' : 'hidden'}}
        onClick={(e) => {
          e.preventDefault();
          history.push(`/search?kword=${encodeStr(text)}`)
        }}
      >
        {text}
      </span>
    </div>
  )
}

export default TagItem