import {
	type FloatingContext,
	FloatingFocusManager,
	FloatingPortal,
	type useInteractions,
} from "@floating-ui/react";
import type { Virtualizer } from "@tanstack/react-virtual";
import type { CSSProperties, MutableRefObject, ReactNode } from "react";
import { PopoverContainer } from "../popover/PopoverContainer.tsx";
import { Option } from "../select/Option.tsx";
import type { SelectOption, SelectOptionValue } from "../select/Select.tsx";
import {
	SelectContext,
	type SelectContextValue,
} from "../select/SelectContext.tsx";

export type AutocompleteListProps<V extends SelectOptionValue> = {
	selectContext: SelectContextValue;
	isMounted: boolean;
	floatingContext: FloatingContext;
	floatingStyles: CSSProperties;
	transitionStyles: CSSProperties;
	rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
	items: (SelectOption<V> & { index: number })[];
	getFloatingProps: ReturnType<typeof useInteractions>["getFloatingProps"];
	highlight: string;
	elementsRef: MutableRefObject<(HTMLElement | null)[]>;
	parentRef: MutableRefObject<HTMLDivElement | null>;
	ariaLabelledby?: string | undefined;
	setFloating: (node: HTMLElement | null) => void;
	after?: ReactNode;
	before?: ReactNode;
};

export const AutocompleteList = <V extends SelectOptionValue>({
	selectContext,
	isMounted,
	floatingContext,
	floatingStyles,
	rowVirtualizer,
	transitionStyles,
	items,
	getFloatingProps,
	highlight,
	elementsRef,
	parentRef,
	ariaLabelledby,
	setFloating,
}: AutocompleteListProps<V>) => {
	return (
		<SelectContext.Provider value={selectContext}>
			{isMounted ? (
				<FloatingPortal>
					<FloatingFocusManager
						context={floatingContext}
						initialFocus={-1}
						visuallyHiddenDismiss
						returnFocus={false}
					>
						<div
							ref={setFloating}
							style={floatingStyles}
							{...getFloatingProps({
								className: "z-10 outline-none",
								role: "dialog",
								"aria-labelledby": ariaLabelledby,
							})}
						>
							{items.length > 0 && (
								<PopoverContainer
									ref={parentRef}
									style={transitionStyles}
									className="h-full overflow-auto"
								>
									<div
										className="relative flex flex-col"
										style={{
											height: `${rowVirtualizer.getTotalSize()}px`,
										}}
										role="listbox"
									>
										{rowVirtualizer.getVirtualItems().map((virtualItem) => {
											const item = items[virtualItem.index]!;
											return (
												<Option
													key={item.value}
													label={item.label}
													value={item.value}
													ref={(node) => {
														elementsRef.current[item.index] = node;
													}}
													index={item.index}
													className="absolute left-0 top-0 w-full"
													style={{
														height: virtualItem.size,
														transform: `translateY(${virtualItem.start}px)`,
													}}
													highlight={highlight}
												/>
											);
										})}
									</div>
								</PopoverContainer>
							)}
						</div>
					</FloatingFocusManager>
				</FloatingPortal>
			) : null}
		</SelectContext.Provider>
	);
};
