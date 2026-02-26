import { useState } from 'react';

import { updateUser } from '../services';
import type { User } from '../types';

export interface ModalInfo {
  type: 'add' | 'edit';
  record: User | null;
}

interface UseUserEditOptions {
  onSuccess?: () => void;
}

export const useUserEdit = (options: UseUserEditOptions = {}) => {
  const { onSuccess } = options;

  const [modalInfo, setModalInfo] = useState<ModalInfo | null>(null);

  const openModal = (type: 'add' | 'edit', record?: User) => {
    setModalInfo({ type, record: record || null });
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  const submit = async (values: Partial<User>) => {
    await updateUser({
      ...modalInfo?.record,
      ...values,
    });
    closeModal();
    onSuccess?.();
  };

  return {
    modalInfo,
    openModal,
    closeModal,
    submit,
  };
};
