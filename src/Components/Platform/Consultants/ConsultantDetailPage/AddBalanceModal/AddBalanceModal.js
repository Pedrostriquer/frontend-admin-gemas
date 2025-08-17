import React, { useState } from "react";
import ReactDOM from "react-dom";
import styles from "./AddBalanceModalStyle";

function AddBalanceModal({ isOpen, onClose, onSave }) {
  const [amount, setAmount] = useState("");
  if (!isOpen) return null;

  const handleSave = () => {
    if (amount && parseFloat(amount) > 0) {
      onSave({ amount: parseFloat(amount) });
    } else {
      alert("Por favor, insira um valor válido.");
    }
  };

  return ReactDOM.createPortal(
    <div style={styles.modalBackdrop} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>Adicionar Saldo</h3>
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="balance-amount" style={styles.formLabel}>
            Valor a ser adicionado (R$)
          </label>
          <input
            id="balance-amount"
            type="number"
            style={styles.formInput}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
          />
        </div>
        <div style={styles.modalFooter}>
          <button
            style={{ ...styles.button, ...styles.cancelButton }}
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            style={{ ...styles.button, ...styles.saveButton }}
            onClick={handleSave}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AddBalanceModal;
