import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import styles from './CancelContractModalStyle';
import { useAuth } from '../../../../../Context/AuthContext';
import contractServices from '../../../../../dbServices/contractServices';

function CancelContractModal({ isOpen, onClose, contract }) {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [withdrawMoney, setWithdrawMoney] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleConfirmCancel = async () => {
    if (!contract) return;
    setIsSubmitting(true);
    setError('');

    try {
      await contractServices.cancelContract(contract.id, withdrawMoney);
      alert('Contrato cancelado com sucesso!');
      onClose();
      navigate('/platform/contracts');
    } catch (err) {
      const errorMessage = err?.message || 'Ocorreu um erro. Verifique se você tem permissão para esta ação.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <i className="fa-solid fa-triangle-exclamation" style={styles.headerIcon}></i>
          <h2 style={styles.modalTitle}>Cancelar Contrato</h2>
        </div>
        <div style={styles.modalBody}>
          <p>
            Você está prestes a cancelar o contrato <strong style={styles.strong}>#{contract?.id}</strong> do cliente <strong style={styles.strong}>{contract?.client?.name}</strong>.
          </p>
          <p>Esta ação é irreversível. Por favor, confirme sua decisão.</p>
        </div>
        <div style={styles.optionsContainer}>
          <label style={styles.optionLabel}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={withdrawMoney}
              onChange={(e) => setWithdrawMoney(e.target.checked)}
            />
            <span>Remover valor disponível do contrato para o cliente</span>
          </label>
          <p style={styles.optionDescription}>
            Se marcado, o valor atual de lucro do contrato será removido do saldo disponível do cliente.
          </p>
        </div>
        {error && <div style={styles.errorMessage}>{error}</div>}
        <div style={styles.modalFooter}>
          <button style={{ ...styles.button, ...styles.cancelButton }} onClick={onClose} disabled={isSubmitting}>
            Voltar
          </button>
          <button
            style={isSubmitting ? { ...styles.button, ...styles.confirmButtonDisabled } : { ...styles.button, ...styles.confirmButton }}
            onClick={handleConfirmCancel}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cancelando...' : 'Confirmar Cancelamento'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default CancelContractModal;