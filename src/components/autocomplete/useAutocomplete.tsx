import {
	autoUpdate,
	flip,
	offset,
	shift,
	size,
	useClick,
	useDismiss,
	useFloating,
	useFocus,
	useInteractions,
	useListNavigation,
	useMergeRefs,
	useRole,
	useTransitionStyles,
} from "@floating-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
	type ChangeEvent,
	type Ref,
	useCallback,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type { SelectOption, SelectOptionValue } from "../select/Select.tsx";
import type { SelectContextValue } from "../select/SelectContext.tsx";
import type { AutocompleteListProps } from "./AutocompleteList.tsx";

export type UseAutocompletePropsGeneric<
	T extends HTMLElement,
	V extends SelectOptionValue,
> = {
	options: SelectOption<V>[];
	disabled?: boolean | undefined;
	ariaLabelledby?: string | undefined;
	ref: Ref<T>;
	onlyMatching?: boolean | undefined;
};

export type UseAutocompleteProps<
	T extends HTMLElement,
	V extends SelectOptionValue,
> = {
	value: V | null;
	onChange: (value: V, picked: boolean) => void;
	minWidth?: number | undefined;
} & UseAutocompletePropsGeneric<T, V>;

export const useAutocomplete = <V extends SelectOptionValue>({
	value,
	options,
	onChange,
	disabled = false,
	ariaLabelledby,
	ref,
	onlyMatching,
	minWidth,
}: UseAutocompleteProps<HTMLElement, V>) => {
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState<number | null>(0);
	const selectedIndex = useMemo(() => {
		const index = options.findIndex((option) => option.value === value);
		if (index === -1) {
			return null;
		}
		return index;
	}, [options, value]);

	const { refs, floatingStyles, context } = useFloating<HTMLInputElement>({
		placement: "bottom-start",
		open: isOpen,
		onOpenChange: setIsOpen,
		whileElementsMounted: autoUpdate,
		middleware: [
			shift(),
			flip(),
			offset({ mainAxis: 4 }),
			size({
				apply({ rects, elements, availableHeight, availableWidth }) {
					Object.assign(elements.floating.style, {
						width: `${Math.min(
							minWidth ?? rects.reference.width,
							availableWidth,
						)}px`,
						height: `${Math.min(300, availableHeight)}px`,
					});
				},
			}),
		],
	});

	const elementsRef = useRef<Array<HTMLElement | null>>([]);

	const handleSelect = useCallback(
		(index: number | null) => {
			onChange(options[index!]!.value ?? null, true);
			setIsOpen(false);
		},
		[onChange, options],
	);

	const listNav = useListNavigation(context, {
		listRef: elementsRef,
		activeIndex,
		selectedIndex,
		onNavigate: setActiveIndex,
		virtual: true,
		loop: true,
		scrollItemIntoView: { block: "center" },
		enabled: !disabled,
		focusItemOnOpen: false,
	});
	const focus = useFocus(context, { enabled: !disabled });
	const click = useClick(context, { enabled: !disabled });
	const dismiss = useDismiss(context, {
		enabled: !disabled,
		escapeKey: false,
	});
	const role = useRole(context, { role: "combobox", enabled: !disabled });

	const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
		[focus, listNav, click, dismiss, role],
	);

	const selectContext = useMemo(
		(): SelectContextValue => ({
			activeIndex,
			selectedIndex,
			getItemProps,
			handleSelect,
		}),
		[activeIndex, selectedIndex, getItemProps, handleSelect],
	);

	const { styles: transitionStyles, isMounted } = useTransitionStyles(context, {
		duration: 200,
		initial({ side }) {
			return {
				opacity: 0,
				transform: `translate3d(0, ${(side === "top" ? 1 : -1) * 8}px, 0)`,
			};
		},
	});

	const items = useMemo(() => {
		return options
			.map((option, index) => {
				return { ...option, index };
			})
			.filter((option) => {
				if (value !== null && onlyMatching) {
					return option.label
						.toLocaleLowerCase()
						.includes(`${value}`.toLocaleLowerCase());
				}
				return true;
			});
	}, [onlyMatching, options, value]);

	const parentRef = useRef<HTMLDivElement | null>(null);

	const rowVirtualizer = useVirtualizer({
		count: items.length,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 32,
	});

	useLayoutEffect(() => {
		if (selectedIndex && isOpen) {
			rowVirtualizer.scrollToIndex(selectedIndex, { align: "center" });
		}
	}, [selectedIndex, isOpen, rowVirtualizer]);

	const referenceRef = useMergeRefs([ref, refs.setReference]);

	return {
		getReferenceProps: useCallback(
			(
				userProps: Parameters<
					ReturnType<typeof useInteractions>["getReferenceProps"]
				>[0],
			) => {
				return getReferenceProps({
					ref: referenceRef,
					"aria-labelledby": ariaLabelledby,
					"aria-disabled": disabled,
					"aria-autocomplete": "list",
					autoComplete: "off",
					onChange: (event: ChangeEvent<HTMLInputElement>) => {
						const value = event.target.value;
						if (!value) {
							setActiveIndex(0);
							setIsOpen(true);
						} else {
							const matchingItem = items.find((item) => {
								return item.label
									.toLocaleLowerCase()
									.includes(value.toLocaleLowerCase());
							});
							if (matchingItem) {
								setActiveIndex(matchingItem.index);
								setIsOpen(true);
							} else {
								setActiveIndex(0);
							}
						}
					},
					onKeyDown(event) {
						if (
							event.key === "Enter" &&
							activeIndex != null &&
							items[activeIndex]
						) {
							onChange(items[activeIndex]!.value, true);
							setActiveIndex(0);
							setIsOpen(false);
							event.preventDefault();
						}
					},
					...userProps,
				});
			},
			[
				activeIndex,
				ariaLabelledby,
				disabled,
				getReferenceProps,
				items,
				onChange,
				referenceRef,
			],
		),
		listProps: useMemo((): AutocompleteListProps<V> => {
			return {
				rowVirtualizer,
				isMounted,
				floatingContext: context,
				floatingStyles,
				selectContext,
				transitionStyles,
				items,
				getFloatingProps,
				highlight: value === null ? "" : `${value}`,
				ariaLabelledby,
				parentRef,
				elementsRef,
				setFloating: refs.setFloating,
			};
		}, [
			ariaLabelledby,
			context,
			floatingStyles,
			getFloatingProps,
			isMounted,
			items,
			refs.setFloating,
			rowVirtualizer,
			selectContext,
			transitionStyles,
			value,
		]),
	};
};
