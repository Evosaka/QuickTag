import React, {
  useState,
  ChangeEvent,
  useEffect,
  forwardRef,
  Ref,
} from "react";
import { InputView, Title } from "@components/styled";
import {
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnUndo,
  BtnRedo,
  Editor,
  EditorProvider,
  Separator,
  Toolbar,
} from "react-simple-wysiwyg";

import Icon from "@utils/Icons";
import Datepicker from "react-tailwindcss-datepicker";

interface InputProps {
  label: string;
  value?: string | number;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  showTopLabel?: boolean;
  maxDate?: Date;
  type:
    | "email"
    | "password"
    | "calendar"
    | "calendarSimple"
    | "text"
    | "dropdown"
    | "counter"
    | "image"
    | "richedit";
  mask?: string;
  placeholder?: string;
  inputClass?: string;
  divClass?: string;
  onCounterChange?: (newValue: number) => void;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      value,
      error = "",
      disabled = false,
      readOnly = false,
      required = true,
      showTopLabel = true,
      type,
      maxDate,
      mask,
      placeholder = "",
      inputClass = "",
      divClass = "",
      onChange,
      onCounterChange,
    },
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const [html, setHtml] = useState("my <b>HTML</b>"); //temporário

    const getStartOfMonth = () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), 1);
    };

    const getEndOfMonth = () => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth() + 1, 0);
    };

    const [dateValue, setDateValue] = useState({
      startDate: type === "calendarSimple" ? new Date() : getStartOfMonth(),
      endDate: getEndOfMonth(),
    });

    const handleValueChange = (newValue: any) => {
      setDateValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    };

    const toggleVisibility = () => {
      setVisible(!visible);
    };

    function onChangeRich(e: any) {
      console.log("e(inside): ", e);
      onChange ? onChange(e) : null;
      setHtml(e.target.value);
    }

    useEffect(() => {
      if (value && typeof value === "string" && type === "richedit") {
        setHtml(value);
      }
    }, [type, value]);

    return (
      <div className={`input-wrapper ${divClass}`}>
        {showTopLabel && (
          <Title className="input-label text-base text-slate-600 font-medium">
            {label}
          </Title>
        )}
        <InputView
          className={`relative ${showTopLabel ? "mt-2" : ""} ${inputClass}`}
          $error={error}
        >
          {type === "calendar" ? (
            <Datepicker
              configs={{
                shortcuts: {
                  today: "Hoje",
                  yesterday: "Ontem",
                  past: (period) => `Ultimos ${period}  dias`,
                  currentMonth: "Mês atual",
                  pastMonth: "Mês passado",
                },
                footer: {
                  cancel: "Cancelar",
                  apply: "Aplicar",
                },
              }}
              value={dateValue}
              onChange={handleValueChange}
              showFooter
              showShortcuts
              primaryColor="blue"
              inputClassName={`py-3 px-16 pl-4 w-[17rem] border shadow-sm rounded-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 ${inputClass}`}
              separator="/"
              displayFormat="DD/MM/YYYY"
              i18n="pt-BR"
              disabled={disabled}
            />
          ) : type === "calendarSimple" ? (
            <Datepicker
              asSingle={true}
              value={dateValue}
              onChange={handleValueChange}
              primaryColor="blue"
              maxDate={maxDate}
              separator="/"
              displayFormat="DD/MM/YYYY"
              i18n="pt-BR"
              disabled={disabled}
            />
          ) : type === "counter" ? (
            <div className="relative flex items-center ">
              <button
                type="button"
                tabIndex={-1}
                id="decrement-button"
                data-input-counter-decrement="quantity-input"
                className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                onClick={() => {
                  const currentValue = Number(value) || 0;
                  onCounterChange &&
                    onCounterChange(
                      currentValue - 1 < 0 ? 0 : currentValue - 1
                    );
                }}
              >
                <svg
                  className="w-3 h-3 text-gray-900 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 2"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h16"
                  />
                </svg>
              </button>
              <input
                className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                pattern="\d*"
                placeholder=""
                readOnly={readOnly}
                value={value}
                ref={ref}
                onChange={(e) => {
                  // Converte o valor do input para número. Se o valor for NaN, define como 0.
                  const newValue = Number(e.target.value) || 0;
                  // Chama a função onCounterChange com o novo valor.
                  if (onCounterChange) {
                    onCounterChange(newValue);
                  }
                }}
                required={required}
              />
              <button
                type="button"
                tabIndex={-1}
                id="increment-button"
                data-input-counter-increment="quantity-input"
                className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                onClick={() => {
                  const currentValue = Number(value) || 0;
                  onCounterChange && onCounterChange(currentValue + 1);
                }}
              >
                <svg
                  className="w-3 h-3 text-gray-900 dark:text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 18 18"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 1v16M1 9h16"
                  />
                </svg>
              </button>
            </div>
          ) : type === "image" ? (
            <div className="flex border border-dashed lg:h-10 w-full p-3 items-center">
              <p className="text-gray-400 text-sm">
                Arraste seu arquivo e solte aqui ou{" "}
                <a href="#" className="text-[#0149D9]">
                  clique para buscar
                </a>
              </p>
            </div>
          ) : type === "richedit" ? (
            <EditorProvider>
              <Editor
                value={html}
                onChange={onChangeRich}
                containerProps={{ style: { height: "600px", width: "auto" } }}
                disabled={disabled}
              >
                <Toolbar>
                  <BtnBold />
                  <BtnItalic />
                  <BtnUnderline />
                  <BtnStrikeThrough />
                  <Separator />
                  <BtnUndo />
                  <BtnRedo />
                </Toolbar>
              </Editor>
            </EditorProvider>
          ) : (
            <input
              type={type === "password" && !visible ? "password" : "text"}
              id={type}
              name={type}
              disabled={disabled}
              value={value}
              className="py-3 px-4 block w-full rounded-md h-10 text-sm focus:ring-blue-500"
              placeholder={placeholder === "label" ? label : placeholder}
              onChange={onChange}
              ref={ref}
            />
          )}
          {type === "password" && (
            <button
              type="button"
              tabIndex={-1}
              className="absolute inset-y-0 right-0 flex items-center pr-4"
              onClick={toggleVisibility}
              disabled={disabled}
            >
              {!visible ? <Icon name="eye-slash" /> : <Icon name="eye" />}
            </button>
          )}
        </InputView>
        {error && <p className="text-sm text-red-600 mt-0">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
