export type SelectOptionValue = string | number;

export type SelectOption<V extends SelectOptionValue> = {
	label: string;
	value: V;
	disabled?: boolean;
};
