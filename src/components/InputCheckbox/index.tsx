import classNames from "classnames"
import { useRef } from "react"
import { InputCheckboxComponent } from "./types"

export const InputCheckbox: InputCheckboxComponent = ({ id, checked = false, disabled, onChange }) => {
  const { current: inputId } = useRef(`RampInputCheckbox-${id}`)
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Pass the new checked status to the parent component's onChange handler
    onChange(event.target.checked);
  };

  return (
    <div className="RampInputCheckbox--container" data-testid={inputId}>
      <label
      htmlFor={inputId}
        className={classNames("RampInputCheckbox--label", {
          "RampInputCheckbox--label-checked": checked,
          "RampInputCheckbox--label-disabled": disabled,
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
  )
}
