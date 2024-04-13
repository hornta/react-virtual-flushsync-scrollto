import {
	type ChangeEventHandler,
	type ComponentPropsWithoutRef,
	forwardRef,
} from "react";
import type { Except } from "type-fest";
import { Input } from "../input/Input.tsx";
import type { SelectOption } from "../select/Select.tsx";
import { AutocompleteList } from "./AutocompleteList.tsx";
import { useAutocomplete } from "./useAutocomplete.tsx";

export const Autocomplete = forwardRef<
	HTMLInputElement,
	{
		value: string;
		options: SelectOption<string>[];
		onChange: (value: string, picked: boolean) => void;
		clearable?: boolean | undefined;
		onlyMatching?: boolean | undefined;
		minWidth?: number | undefined;
	} & Except<ComponentPropsWithoutRef<typeof Input>, "onChange" | "value">
>(function Autocomplete(
	{
		options,
		onChange,
		value,
		"aria-labelledby": ariaLabelledby,
		disabled = false,
		onlyMatching = false,
		minWidth,
		...props
	},
	ref,
) {
	const { getReferenceProps, listProps } = useAutocomplete({
		value,
		options,
		onChange,
		disabled,
		ref,
		ariaLabelledby,
		onlyMatching,
		minWidth,
	});

	const { onChange: inputOnChange, ...referenceProps } =
		getReferenceProps(props);

	return (
		<>
			<Input
				value={value}
				onChange={(event) => {
					onChange(event.target.value, false);
					(inputOnChange as ChangeEventHandler<HTMLInputElement>)(event);
				}}
				{...referenceProps}
			/>

			<AutocompleteList {...listProps} />
		</>
	);
});
