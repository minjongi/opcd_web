import React, { useEffect, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';

const SmartEditor = React.forwardRef(({id, rows, content, onLoadEditor}, ref) => {
    const { width, ref: resizeRef } = useResizeDetector();
    const [cols, setCols] = useState(50);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if(nhn){
            let oEditors = [];
            nhn.husky.EZCreator.createInIFrame({
                oAppRef: oEditors,
                elPlaceHolder: id || "ir1",
                sSkinURI: "/seditor/SmartEditor2Skin.html",
                fCreator: "createSEditor2",
                htParams : {
                    bUseToolbar : true,				// 툴바 사용 여부 (true:사용/ false:사용하지 않음)
                    bUseVerticalResizer : true,		// 입력창 크기 조절바 사용 여부 (true:사용/ false:사용하지 않음)
                    bUseModeChanger : true,			// 모드 탭(Editor | HTML | TEXT) 사용 여부 (true:사용/ false:사용하지 않음)
                    bSkipXssFilter : true,		// client-side xss filter 무시 여부 (true:사용하지 않음 / 그외:사용)
                    //aAdditionalFontList : aAdditionalFontSet,		// 추가 글꼴 목록
                    fOnBeforeUnload : function(){
                        //alert("완료!");
                    },
                    I18N_LOCALE : "ko_KR"
                },
            });

            setTimeout(() => setLoaded(true), 500);
            onLoadEditor && onLoadEditor(oEditors);
        }
    }, []);

    useEffect(() => {
        let _cols = Math.floor(165 * width/1200);
        _cols && setCols(Math.min(165, _cols)); 
    }, [width]);

    return (
        <div
            ref={resizeRef}
            style={{
                backgroundColor: '#fff',
                maxHeight: loaded ? 'none': 250,
                overflow: 'hidden'
            }}
        >
            <textarea name={id || "ir1"} id={id || "ir1"} rows={rows || '5'} cols={cols || '50'} defaultValue={content}/>
        </div>
    )
});

export default SmartEditor;