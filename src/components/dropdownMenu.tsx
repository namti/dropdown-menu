import React, { useState, useEffect, useMemo, useDeferredValue, useRef, SyntheticEvent } from "react";
import style from './dropdownMenu.module.css';
import { ContinentCode, CountryCode } from "../types/api";
import classNames from 'classnames';
import check from './images/check.svg';

export type Option = {
	value: ContinentCode | CountryCode | String | null,
	label: String | undefined,
}

export interface DropdownMenu {
	values?: Array<Option>;
	selected?: String | null;
	disabled?: Boolean;
	error?: Boolean;
	errorMessage?: String;
	onChange?: (value: String | null | undefined) => void;
	className?: String | null;
	placeholder?: String | null;
}

const DropdownMenu: React.FC<DropdownMenu> = (props) => {
	const [isOpen, setIsOpen] = useState<Boolean>(false);
	const [selected, setSelected] = useState<Option | null>(null);
	const buttonRef = useRef(null);
	const menuRef = useRef(null);
	const deferredSelected = useDeferredValue(selected);

	useEffect(() => {
    const item = (props.values || []).find(
      (item) => item.value === props.selected
    );
		setSelected(item || null);
  }, [props.selected]);

	useEffect(() => {
		if (props.onChange instanceof Function) {
			props.onChange(selected?.value);
		}
	}, [ deferredSelected ])

	const toggleMenu = (): void => {
		setIsOpen(!isOpen);
	}

	const onSelect = (e: SyntheticEvent, selectedItem: Option): void => {
		e.preventDefault();
		setSelected(selectedItem);
		setIsOpen(false);
	}

	return (
    <div className={`${style.dropdownContainer} ${props.className || ""}`}>
      <button
				className={classNames({
					[style.dropdownButton]: true,
					[style.error]: props.error,
				})}
        onClick={toggleMenu}
        role="button"
        ref={buttonRef}
        {...(props.disabled && { disabled: true })}
        {...(props.error && { error: true })}
      >
        <span
          className={classNames({
            [style.muted]: !selected?.label,
          })}
        >
          {selected?.label || props.placeholder || "Select"}
        </span>
      </button>

			{props.error && props.errorMessage && <div className={style.errorMessage}>{props.errorMessage}</div>}

      {isOpen && (
        <ul className={style.dropdownMenu} ref={menuRef}>
          {(props.values || []).map((item, key) => (
            <li
              key={`item_${key}`}
              className={classNames({
                [style.dropdownMenuItem]: true,
                [style.selected]: selected?.value === item.value,
              })}
            >
              <a href="#" role="button" onClick={(e) => onSelect(e, item)}>
                <span>{item.label}</span>
                {selected?.value === item.value && (
                  <img src={check} className={style.check} />
                )}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DropdownMenu;