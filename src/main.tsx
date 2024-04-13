
import "./css/fonts.css";
import "./css/index.css";
import { useState, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Autocomplete } from "./components/autocomplete/Autocomplete.tsx";


const unitOptions = [
	{ label: "pcs", value: "pcs" },
	{ value: "hours", label: "hours" },
	{ value: "months", label: "months" },
	{ value: "weeks", label: "weeks" },
	{ value: "days", label: "days" },
	{ value: "kg", label: "kg" },
	{ value: "liter", label: "liter" },
	{ value: "meter", label: "meter" },
	{ value: "square meter", label: "square meter" },
	{ value: "cubic meter", label: "cubic meter" },
	{ value: "foot", label: "foot" },
	{ value: "square foot", label: "square foot" },
	{ value: "cubic foot", label: "cubic foot" },
	{ value: "inch", label: "inch" },
	{ value: "square inch", label: "square inch" },
	{ value: "cubic inch", label: "cubic inch" },
	{ value: "lb", label: "lb" },
	{ value: "oz", label: "oz" },
	{ value: "doz", label: "doz" },
];

const Test = () => {
	const [val, setVal] = useState("");
	return (
		<Autocomplete
			value={val}
			options={unitOptions}
			onChange={(val) => {
				setVal(val);
			}}
		/>
	);
};


createRoot(document.getElementById("root")!).render(
  <StrictMode><Test /></StrictMode>,
);