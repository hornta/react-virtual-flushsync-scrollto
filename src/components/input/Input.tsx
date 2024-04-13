import { useMergeRefs } from "@floating-ui/react";
import {
	IconAlertCircleFilled,
	IconX,
	type TablerIconsProps,
} from "@tabler/icons-react";
import clsx from "clsx";
import {
	type ComponentPropsWithoutRef,
	type ReactElement,
	type ReactNode,
	cloneElement,
	forwardRef,
	useRef,
} from "react";

interface InputProps extends ComponentPropsWithoutRef<"input"> {
	iconLeading?: ReactElement<TablerIconsProps> | undefined;
	iconTrailing?: ReactElement<TablerIconsProps> | undefined;
	inlineAddonLeading?: ReactNode | undefined;
	inlineAddonTrailing?: ReactNode | undefined;
	hintText?: ReactNode | undefined;
	inputWrapperClass?: string | undefined;
	clearable?: boolean | undefined;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{
		className,
		type = "text",
		iconLeading,
		iconTrailing,
		inlineAddonLeading,
		inlineAddonTrailing,
		"aria-invalid": ariaInvalid,
		hintText,
		inputWrapperClass,
		clearable,
		...props
	},
	ref,
) {
	const isError = ariaInvalid === "true" || ariaInvalid === true;
	const actualIconTrailing = isError ? <IconAlertCircleFilled /> : iconTrailing;
	const leftPadding = inlineAddonLeading
		? "pl-0"
		: iconLeading
			? "pl-10"
			: "pl-3";
	const rightPadding = inlineAddonTrailing
		? "pr-0"
		: actualIconTrailing
			? "pr-10"
			: "pr-3";
	const borderClass = isError ? "ring-red-300" : "ring-gray-300";

	const iconProps = {
		size: 20,
		className: isError ? "text-red-500" : "text-gray-500",
	} satisfies TablerIconsProps;

	const showClearableIcon =
		clearable && typeof props.value === "string" && props.value.length > 0;
	const internalRef = useRef<HTMLInputElement | null>(null);
	const inputRef = useMergeRefs([ref, internalRef]);

	return (
		<div className="w-full">
			<div
				className={clsx(
					"relative flex h-9 rounded-md border text-base shadow-sm ring-offset-2 [&:has(:focus-visible)]:ring-2",
					isError && "border-red-200",
					isError ? "text-red-900" : "text-gray-900",
					isError
						? "bg-red-50 [&:has(:focus-visible)]:ring-red-600"
						: "bg-white [&:has(:focus-visible)]:ring-sky-500",
					inputWrapperClass,
				)}
			>
				{iconLeading && (
					<div className="pointer-events-none absolute bottom-0 left-0 top-0 flex items-center pl-3">
						{cloneElement(iconLeading, {
							...iconProps,
							className: clsx(iconProps.className, iconLeading.props.className),
						})}
					</div>
				)}
				{inlineAddonLeading && (
					<span
						className={clsx(
							"flex select-none items-center",
							isError ? "text-red-500" : "text-gray-500",
							iconLeading && "pl-10",
						)}
					>
						{inlineAddonLeading}
					</span>
				)}
				<input
					type={type}
					className={clsx(
						"block w-full truncate border-0 bg-transparent outline-none focus:ring-0",
						isError ? "placeholder:text-red-300" : "placeholder:text-gray-400",
						borderClass,
						leftPadding,
						rightPadding,
						className,
					)}
					{...props}
					ref={inputRef}
				/>
				{(inlineAddonTrailing || showClearableIcon) && (
					<span
						className={clsx(
							"flex select-none items-center",
							isError ? "text-red-500" : "text-gray-500",
							actualIconTrailing && "pr-10",
						)}
					>
						{showClearableIcon ? (
							<button
								onClick={() => {
									if (internalRef.current) {
										const nativeInputValueSetter =
											Object.getOwnPropertyDescriptor(
												window.HTMLInputElement.prototype,
												"value",
											)!.set!;
										nativeInputValueSetter.call(internalRef.current, "");
										internalRef.current.dispatchEvent(
											new Event("input", { bubbles: true }),
										);
									}
								}}
								type="button"
								className="rounded hover:bg-sky-100 p-1 mr-1 transition-colors text-gray-700 "
							>
								<IconX size={18} />
							</button>
						) : (
							inlineAddonTrailing
						)}
					</span>
				)}
				{actualIconTrailing && (
					<div className="pointer-events-none absolute bottom-0 right-0 top-0 flex items-center pr-3">
						{cloneElement(actualIconTrailing, {
							...iconProps,
							className: clsx(
								iconProps.className,
								!isError && iconTrailing?.props.className,
							),
						})}
					</div>
				)}
			</div>
		</div>
	);
});
