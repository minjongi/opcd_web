import React from 'react';

import TextInput from './TextInput';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomInput = React.forwardRef(
    ({ value, onClick, ...props }, ref) => (
        <TextInput
            value={value}
            onChange={() => {}}
            onClick={onClick}
            ref={ref}
            {...props}/>
    )
);

const OPDatePicker = ({inputClassName, placeholder, ...props}) => {
    
    

    return (
        <DatePicker
            // customInput={<CustomInput className={inputClassName} placeholder={placeholder || ''}/>}
            {...props}
        />
    )
}

export default OPDatePicker;

