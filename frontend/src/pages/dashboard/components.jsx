import React from "react";
import Heading from "../../components/common/heading";
import { Button, Modal } from "react-daisyui";

export default function ComponentsTestPage() {
	const { Dialog, handleShow } = Modal.useDialog();
	return (
		<div className="max-w-7xl mx-auto w-full mt-10">
			<Heading
				title="Soy el titulo"
				description="Soy una description"
				action={
					<div>
						<Button onClick={handleShow}>Soy una acción</Button>
						<Dialog>
							<Modal.Header className="font-bold">Hola</Modal.Header>
							<Modal.Body>Soy una Modal</Modal.Body>
							<Modal.Actions>
								<form method="dialog">
									<Button>Cerrar</Button>
								</form>
							</Modal.Actions>
						</Dialog>
					</div>
				}
			/>
		</div>
	);
}
