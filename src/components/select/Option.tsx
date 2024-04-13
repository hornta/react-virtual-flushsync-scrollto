import clsx from "clsx";
import {
	type CSSProperties,
	Fragment,
	forwardRef,
	useContext,
	useMemo,
} from "react";
import type { SelectOptionValue } from "./Select.tsx";
import { SelectContext } from "./SelectContext.tsx";

export const Option = forwardRef<
	HTMLDivElement,
	{
		label: string;
		value: SelectOptionValue;
		index: number;
		className?: string;
		style?: CSSProperties;
		highlight: string;
	}
>(function Option({ label, value, index, className, style, highlight }, ref) {
	const { activeIndex, selectedIndex, getItemProps, handleSelect } =
		useContext(SelectContext);

	const isActive = activeIndex === index;
	const isSelected = selectedIndex === index;
	const parts = useMemo(() => {
		if (
			highlight.length > 0 &&
			label.toLocaleLowerCase().includes(highlight.toLocaleLowerCase())
		) {
			const parts = Array.from(label.matchAll(new RegExp(highlight, "ig")));
			const splits = parts.flatMap((part, index, list) => {
				if (part.index === undefined) {
					return [];
				}
				const nextMatch = list[index + 1];
				const startSlice = part.index + part[0].length;
				const endSlice = nextMatch ? nextMatch.index : undefined;
				return [
					{ highlight: true, text: part[0] },
					{ highlight: false, text: label.slice(startSlice, endSlice) },
				];
			});
			const [firstPart] = parts;
			if (firstPart?.index && firstPart.index > 0) {
				splits.unshift({
					highlight: false,
					text: label.slice(0, firstPart.index),
				});
			}

			return splits;
		}
		return label;
	}, [highlight, label]);

	return (
		<div
			ref={ref}
			role="option"
			id={`${value}`}
			aria-selected={isActive && isSelected}
			className={clsx(
				"cursor-pointer px-3 py-1",
				isActive && "bg-gray-100",
				isSelected && "bg-sky-500 text-white",
				className,
			)}
			{...getItemProps({
				onClick: () => handleSelect(index),
			})}
			style={style}
		>
			<div className="truncate">
				{typeof parts === "string"
					? label
					: parts.map((part, index) => {
							if (part.highlight) {
								return (
									// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
									<span key={index} className="underline">
										{part.text}
									</span>
								);
							}
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							return <Fragment key={index}>{part.text}</Fragment>;
						})}
			</div>
		</div>
	);
});
