/**
 * Componente Encabezado - Heading
 **/

import React from "react";

import PropTypes from "prop-types";

export default function Heading({ title, description, action }) {
	return (
		<heading className="flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-6">
			<div>
				<h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
				<p className="text-sm text-gray-600">{description} </p>
			</div>
			{action}
		</heading>
	);
}

Heading.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	action: PropTypes.element,
};
