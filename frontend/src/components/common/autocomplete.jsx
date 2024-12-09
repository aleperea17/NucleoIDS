import { useState, useRef, useEffect } from "react";
import { Input, Dropdown, Button } from "react-daisyui";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { useController } from "react-hook-form";
import { XIcon } from "lucide-react";

const Autocomplete = ({
	options,
	placeholder = "Escribe aquí...",
	className,
	item,
	name,
	control,
	disabled = false,
	value: defaultValue,
}) => {
	const {
		field: { onChange, value },
	} = useController({
		name,
		control,
		defaultValue: defaultValue ? defaultValue.value : null,
	});

	const [filteredOptions, setFilteredOptions] = useState([]);
	const [showOptions, setShowOptions] = useState(false);
	const [inputValue, setInputValue] = useState(
		defaultValue ? defaultValue.label : "",
	);

	useEffect(() => {
		if (
			(defaultValue && defaultValue.value !== value) ||
			(defaultValue && defaultValue.label !== inputValue)
		) {
			setInputValue(defaultValue.label);
			onChange(defaultValue.value);
		}
	}, [defaultValue]);

	const inputRef = useRef(null);

	const handleChange = (e) => {
		const userInput = e.target.value;
		setInputValue(userInput);

		const filtered = options.filter((option) =>
			option.label.toLowerCase().includes(userInput.toLowerCase()),
		);

		setFilteredOptions(filtered);
		setShowOptions(true);
	};

	const handleClick = (option) => {
		setInputValue(option.label);
		setFilteredOptions([]);
		setShowOptions(false);
		console.log(option);
		onChange(option.value); // Update form state with the entire selected option object
	};

	const renderDropdown = () => {
		if (!showOptions || !inputValue) return null;

		const { bottom, left, width } = inputRef.current.getBoundingClientRect();
		const modalContainer = document.querySelector(".modal.modal-open");

		if (!modalContainer) return null; // Ensure that the container exists

		return ReactDOM.createPortal(
			<Dropdown.Menu
				className="absolute bg-white shadow-lg rounded-lg max-h-48 overflow-y-auto w-full z-10 overflow-x-hidden"
				style={{
					top: bottom + window.scrollY,
					left: left + window.scrollX,
					width: `${width}px`,
				}}
			>
				{filteredOptions.length > 0 ? (
					filteredOptions.map((option, index) => (
						<Dropdown.Item
							key={option.value}
							onClick={() => handleClick(option)}
							className="cursor-pointer px-4 py-2"
						>
							{option.label}
						</Dropdown.Item>
					))
				) : (
					<Dropdown.Item className="cursor-default px-4 py-2">
						No hay opciones
					</Dropdown.Item>
				)}
			</Dropdown.Menu>,
			modalContainer,
		);
	};

	return (
		<div className={`relative w-full ${className} flex items-center gap-2`}>
			<Input
				defaultValue={defaultValue ? defaultValue.label : undefined}
				ref={inputRef}
				type="text"
				disabled={disabled}
				placeholder={placeholder}
				value={inputValue}
				onChange={handleChange}
				className="w-full"
			/>

			{value && !disabled && (
				<Button
					color="error"
					className="px-1"
					size="sm"
					onClick={() => {
						onChange(null);
						setInputValue("");
					}}
				>
					<XIcon />
				</Button>
			)}
			{renderDropdown()}
		</div>
	);
};

Autocomplete.propTypes = {
	options: PropTypes.arrayOf(
		PropTypes.shape({
			value: PropTypes.string.isRequired,
			label: PropTypes.string.isRequired,
		}),
	).isRequired,
	placeholder: PropTypes.string,
	className: PropTypes.string,
	item: PropTypes.node, // Assuming `item` is an optional node
	control: PropTypes.object.isRequired,
	name: PropTypes.string.isRequired,
};

Autocomplete.defaultProps = {
	placeholder: "Escribe aquí...",
	className: "",
	item: null,
};

export default Autocomplete;
