import React, {useState} from 'react'
import { Dropdown, FormCheck } from 'react-bootstrap'

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    href=""
    className="rda-selectbox_toggle"
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    {children}
  </a>
));

const CustomMenu = React.forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={`${className} rda-selectbox_menu op-perfect-scroller`}
        aria-labelledby={labeledBy}
      >
        <ul className="list-unstyled m-0">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);

const RdaSelectBox = ({id, value, selections, onChange}) => {
  const [show, setShow] = useState(false);

  const handleSelect = (val) => {
    onChange && onChange({target: {id, value: val}});
  }

  const handleToggle = (isShow) => {
    setShow(isShow);
  }

  const _selected = value && selections ? selections.find(s => s.value == value) : null;

  return (
    <div className="rda-selectbox">
      <Dropdown onSelect={handleSelect} onToggle={handleToggle}>
        <Dropdown.Toggle as={CustomToggle}>
          <input type="text" value={_selected ? _selected.label : ''} readOnly />
        </Dropdown.Toggle>

        <Dropdown.Menu as={CustomMenu}>
          {selections.map((item, index) => 
            <Dropdown.Item key={index} eventKey={item.value} active={item.value === value}>{item.label}</Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>

      {show &&
        <div className="rda-selectbox_popup">
          <div className="popup_wrapper">
            <ul>
            {selections.map((item, index) => 
              <li key={index} onClick={() => handleSelect(item.value)}>
                <span style={{marginTop: 6}}>{item.label}</span>
                <span className={`checkbox ${value === item.value ? 'active' : ''}`}></span>
              </li>
            )}
            </ul>
          </div>
        </div>
      }
    </div>
  )
}

export default RdaSelectBox;