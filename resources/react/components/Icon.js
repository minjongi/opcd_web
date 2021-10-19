import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faCheckSquare, faDotCircle, faFileAlt, faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import {
    faSearch,
    faChevronLeft,
    faChevronRight,
    faCaretUp,
    faCaretRight,
    faPlayCircle,
    faEdit,
    faPlay,
    faTimes,
    faBars,
    faPlus,
    faTrashAlt,
    faPlusCircle,
    faCaretSquareDown,
    faCaretSquareUp,
    faFont,
    faEllipsisH,
    faCog,
    faDownload
} from "@fortawesome/free-solid-svg-icons";

const iconList = {
    search: faSearch,
    edit: faEdit,
    leftArrow: faChevronLeft,
    rightArrow: faChevronRight,
    caretUp: faCaretUp,
    caretRight: faCaretRight,
    playCircle: faPlayCircle,
    play: faPlay,
    close: faTimes,
    burger: faBars,
    plus: faPlus,
    plusCircle: faPlusCircle,
    remove: faTrashAlt,
    caretUp: faCaretSquareUp,
    caretDown: faCaretSquareDown,
    text: faFont,
    check: faCheckSquare,
    radio: faDotCircle,
    file: faFileAlt,
    question: faQuestionCircle,
    dotH: faEllipsisH,
    corg: faCog,
    download: faDownload
}
const Icon = ({name, className, color = '#fff', onClick}) => {
    const icon = iconList[name];
    if(!icon) return null;

    return (
        <FontAwesomeIcon className={className} icon={icon} color={color} onClick={onClick}/>
    )
}

export default Icon;