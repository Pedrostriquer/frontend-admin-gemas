import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './AddBalanceModalStyle';

const AddBalanceModal = ({ client, onClose, onSave }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = () => {
        if (!amount || parseFloat(amount) <= 0) {
            alert('Por favor, insira um valor válido.');
            return;
        }
        onSave({ amount: parseFloat(amount), description });
    };

    return ReactDOM.createPortal(
        <>
            <style>{styles.globalStyles}</style>
            <div style={styles.modalBackdrop} onClick={onClose}>
                <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                    <div style={styles.modalHeader}>
                        <h2 style={styles.modalHeaderH2}>Adicionar Saldo para {client.name}</h2>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Valor (R$)</label>
                        <input
                            type="number"
                            placeholder="0,00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={styles.formInput}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Descrição (Opcional)</label>
                        <input
                            type="text"
                            placeholder="Ex: Aporte Bônus"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={styles.formInput}
                        />
                    </div>
                    <div style={styles.modalFooter}>
                        <button style={{...styles.actionButton, ...styles.buttonCancel}} onClick={onClose}>Cancelar</button>
                        <button style={{...styles.actionButton, ...styles.buttonSave}} onClick={handleSubmit}>
                            <i className="fa-solid fa-check" style={{marginRight: '8px'}}></i>
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default AddBalanceModal;