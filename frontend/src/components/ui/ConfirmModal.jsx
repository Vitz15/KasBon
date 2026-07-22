import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Tindakan',
  message,
  confirmLabel = 'Hapus',
  loading = false
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-rose-50 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="h-4.5 w-4.5 text-rose-600" />
        </div>
        <p className="text-[13px] text-slate-600 leading-relaxed pt-1">{message}</p>
      </div>

      <div className="flex justify-end gap-2.5 mt-6">
        <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={loading}>
          Batal
        </Button>
        <Button type="button" variant="danger" size="sm" loading={loading} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
