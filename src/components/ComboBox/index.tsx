import { Fragment, useEffect, useState, forwardRef, Ref } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { InputView, Title } from "@components/styled";
import { ComboType } from "@lib/types";

interface ComboProps {
  label: string;
  data: ComboType[] | [];
  value?: number | string;
  error?: string;
  disabled?: boolean;
  showTopLabel?: boolean;
  placeholder?: string;
  inputClass?: string;
  divClass?: string;
  onChange?: (value: number | string) => void;
}

const Combo = forwardRef<HTMLInputElement, ComboProps>(
  (
    {
      label,
      data = [],
      value,
      error = "",
      showTopLabel = true,
      disabled = false,
      placeholder = "",
      inputClass = "",
      divClass = "",
      onChange,
    },
    ref
  ) => {
    const [selected, setSelected] = useState<ComboType>();
    const [query, setQuery] = useState("");

    const filteredData =
      query === ""
        ? data
        : data.filter((r) =>
            r.caption
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(query.toLowerCase().replace(/\s+/g, ""))
          );

    useEffect(() => {
      if (onChange && selected && selected.value) {
        return onChange(selected.value);
      }
    }, [selected]);

    useEffect(() => {
      if (value && value !== selected?.value) {
        setSelected(
          data.filter((f) => f.value === value || f.caption === value)[0]
        );
      } else if (!value) {
        setSelected({ value: 0, caption: "" });
      }
    }, [value]);
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
          <Combobox
            ref={ref}
            value={selected}
            onChange={setSelected}
            disabled={disabled}
          >
            <div>
              <Combobox.Input
                className="py-3 px-4 block w-full rounded-md h-10 text-sm focus:ring-blue-500"
                displayValue={(r: ComboType) => {
                  return r.caption;
                }}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholder ? placeholder : `Informe o ${label}`}
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </Combobox.Button>

              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
              >
                <Combobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                  {filteredData.length === 0 ? (
                    <li
                      className={`flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm  ${"bg-white text-gray-800"}  focus:ring-2 focus:ring-blue-500`}
                    >
                      Nada encontrado.
                    </li>
                  ) : (
                    filteredData.map((r) => (
                      /* Use the `active` state to conditionally style the active option. */
                      /* Use the `selected` state to conditionally style the selected option. */
                      <Combobox.Option key={r.value} value={r} as={Fragment}>
                        {({ active, selected }) => (
                          <li
                            className={`flex items-center gap-x-3.5 py-2 px-3 rounded-md text-sm  ${
                              active
                                ? "bg-slate-800 text-white"
                                : "bg-white text-gray-800"
                            }  focus:ring-2 focus:ring-blue-500`}
                          >
                            {r.caption}
                          </li>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
        </InputView>
        {error && <p className="text-sm text-red-600 mt-0">{error}</p>}
      </div>
    );
  }
);

Combo.displayName = "ComboBox";

export default Combo;
