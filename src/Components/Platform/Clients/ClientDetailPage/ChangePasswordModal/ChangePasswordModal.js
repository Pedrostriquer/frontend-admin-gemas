import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './ChangePasswordModalStyle';

const ChangePasswordModal = ({ client, onClose, onSave }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = () => {
        if (!password || password !== confirmPassword) {
            alert('As senhas não coincidem ou estão vazias.');
            return;
        }
        onSave({ password });
    };

    return ReactDOM.createPortal(
        <>
            <style>{styles.globalStyles}</style>
            <div style={styles.modalBackdrop} onClick={onClose}>
                <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
                    <div style={styles.modalHeader}>
                        <h2 style={styles.modalHeaderH2}>Alterar Senha de {client.name}</h2>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Nova Senha</label>
                        <div style={styles.passwordWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.formInput}
                            />
                            <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"}`} style={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}></i>
                        </div>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.formLabel}>Confirmar Nova Senha</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={styles.formInput}
                        />
                    </div>
                    <div style={styles.modalFooter}>
                        <button style={{...styles.actionButton, ...styles.buttonCancel}} onClick={onClose}>Cancelar</button>
                        <button style={{...styles.actionButton, ...styles.buttonSave}} onClick={handleSubmit}>
                            <i className="fa-solid fa-check" style={{marginRight: '8px'}}></i>
                            Salvar Nova Senha
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default ChangePasswordModal;