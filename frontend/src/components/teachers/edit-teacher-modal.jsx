// EmployeeModal.js
import { Modal, Button } from "react-daisyui";
import TeacherForm from "./form/teacher-form";
import { X } from "lucide-react";

const EditTeacherModal = ({ isOpen, onClose, onSubmit, defaultValues }) => {
  return (
    <Modal open={isOpen}>
      <Modal.Header className="font-bold text-lg relative">
        Editar profesor
        <Button
          className="btn-circle absolute right-0"
          size="sm"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>
      </Modal.Header>
      <Modal.Body>
        <TeacherForm onSubmit={onSubmit} defaultValues={defaultValues} />
      </Modal.Body>
    </Modal>
  );
};

export default EditTeacherModal;
