import React, { useState, useRef } from 'react';
import classNames from 'classnames';
import { InputCheckboxComponent } from './types';

export const InputCheckbox: InputCheckboxComponent = ({ id, checked: initialChecked = false, disabled, onChange }) => {
  const [checked, setChecked] = useState(initialChecked);
  const { current: inputId } = useRef(`RampInputCheckbox-${id}`);

  const handleInputChange = () => {
    const newChecked = !checked;
    setChecked(newChecked);
    if (onChange) {
      onChange(newChecked);
    }
  };

  return (
    <div className="RampInputCheckbox--container" data-testid={inputId}>
      <label
        htmlFor={inputId}
        className={classNames('RampInputCheckbox--label', {
          'RampInputCheckbox--label-checked': checked,
          'RampInputCheckbox--label-disabled': disabled,
        })}
      />
      <input
        id={inputId}
        type="checkbox"
        className="RampInputCheckbox--input"
        checked={checked}
        disabled={disabled}
        onChange={handleInputChange}
      />
    </div>
  );
};
