import clsx from "clsx";
import { type ComponentProps, forwardRef } from "react";

export const PopoverContainer = forwardRef<
	HTMLDivElement,
	ComponentProps<"div">
>(function PopoverContainer({ children, className, ...rest }, ref) {
	return (
		<div
			{...rest}
			className={clsx(
				"rounded-[8px] border border-gray-300 bg-white shadow",
				className,
			)}
			ref={ref}
		>
			{children}
		</div>
	);
});
