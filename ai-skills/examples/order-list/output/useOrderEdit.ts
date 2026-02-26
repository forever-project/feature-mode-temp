// src/features/order/hooks/useOrderEdit.ts

import { useState } from 'react';

import { updateOrder } from '../services';
import type { Order } from '../types';

export interface ModalInfo {
  type: 'add' | 'edit';
  record: Order | null;
}

interface UseOrderEditOptions {
  onSuccess?: () => void;
}

export const useOrderEdit = (options: UseOrderEditOptions = {}) => {
  const { onSuccess } = options;

  const [modalInfo, setModalInfo] = useState<ModalInfo | null>(null);

  const openModal = (type: 'add' | 'edit', record?: Order) => {
    setModalInfo({ type, record: record || null });
  };

  const closeModal = () => {
    setModalInfo(null);
  };

  const submit = async (values: Partial<Order>) => {
    await updateOrder({
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
