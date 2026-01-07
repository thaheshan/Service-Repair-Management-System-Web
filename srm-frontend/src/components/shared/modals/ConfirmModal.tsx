export default function ConfirmModal({ isOpen, onClose, onConfirm }: any) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50">Confirm Modal</div>;
}
