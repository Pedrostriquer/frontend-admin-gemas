import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateConsultantPageStyle";
import { useAuth } from "../../../../Context/AuthContext";
import consultantService from "../../../../dbServices/consultantService";
import formatServices from "../../../../formatServices/formatServices";

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

function CreateConsultantPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [consultantData, setConsultantData] = useState({
    name: "",
    email: "",
    password: "",
    cpfCnpj: "",
    phoneNumber: "",
    birthDate: "",
    commissionPercentage: "",
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    if (name === "cpfCnpj") {
      value = formatServices.formatCpfCnpj(value);
    } else if (name === "phoneNumber") {
      value = formatServices.formatPhone(value);
    }
    setConsultantData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!consultantData.name) newErrors.name = "Nome é obrigatório";
    if (!validateEmail(consultantData.email))
      newErrors.email = "Email inválido";
    if (consultantData.password.length < 6)
      newErrors.password = "A senha deve ter no mínimo 6 caracteres";
    if (!consultantData.cpfCnpj) newErrors.cpfCnpj = "CPF/CNPJ é obrigatório";
    if (!consultantData.phoneNumber)
      newErrors.phoneNumber = "Telefone é obrigatório";
    if (!consultantData.birthDate)
      newErrors.birthDate = "Data de nascimento é obrigatória";
    if (!consultantData.commissionPercentage) {
      newErrors.commissionPercentage = "Comissão é obrigatória";
    } else if (isNaN(consultantData.commissionPercentage)) {
      newErrors.commissionPercentage = "Comissão deve ser um número";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    setIsSaving(true);
    try {
      const dataToSend = {
        ...consultantData,
        cpfCnpj: consultantData.cpfCnpj.replace(/\D/g, ""),
        phoneNumber: consultantData.phoneNumber.replace(/\D/g, ""),
        commissionPercentage: parseFloat(consultantData.commissionPercentage),
      };
      const created = await consultantService.createConsultant(
        dataToSend
      );
      alert(`Consultor ${created.name} criado com sucesso!`);
      navigate(`/platform/consultants/${created.id}`);
    } catch (error) {
      alert(
        "Falha ao criar o consultor. Verifique se o email ou CPF já não estão em uso."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <button
          style={styles.backButton}
          onClick={() => navigate(-1)}
          title="Voltar"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 style={styles.headerTitle}>Novo Consultor</h1>
      </header>

      <div style={styles.formCard}>
        <div style={styles.formGrid}>
          <div style={{ ...styles.formGroup, ...styles.fullWidth }}>
            <label style={styles.formLabel}>Nome Completo</label>
            <input
              type="text"
              name="name"
              value={consultantData.name}
              onChange={handleInputChange}
              style={styles.formInput}
            />
            {errors.name && <p style={styles.errorText}>{errors.name}</p>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Email</label>
            <input
              type="email"
              name="email"
              value={consultantData.email}
              onChange={handleInputChange}
              style={styles.formInput}
            />
            {errors.email && <p style={styles.errorText}>{errors.email}</p>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Senha Provisória</label>
            <input
              type="password"
              name="password"
              value={consultantData.password}
              onChange={handleInputChange}
              style={styles.formInput}
            />
            {errors.password && (
              <p style={styles.errorText}>{errors.password}</p>
            )}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>CPF / CNPJ</label>
            <input
              type="text"
              name="cpfCnpj"
              value={consultantData.cpfCnpj}
              onChange={handleInputChange}
              maxLength="18"
              style={styles.formInput}
            />
            {errors.cpfCnpj && <p style={styles.errorText}>{errors.cpfCnpj}</p>}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Telefone</label>
            <input
              type="text"
              name="phoneNumber"
              value={consultantData.phoneNumber}
              onChange={handleInputChange}
              maxLength="15"
              style={styles.formInput}
            />
            {errors.phoneNumber && (
              <p style={styles.errorText}>{errors.phoneNumber}</p>
            )}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Data de Nascimento</label>
            <input
              type="date"
              name="birthDate"
              value={consultantData.birthDate}
              onChange={handleInputChange}
              style={styles.formInput}
            />
            {errors.birthDate && (
              <p style={styles.errorText}>{errors.birthDate}</p>
            )}
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Comissão (%)</label>
            <input
              type="number"
              name="commissionPercentage"
              value={consultantData.commissionPercentage}
              onChange={handleInputChange}
              style={styles.formInput}
            />
            {errors.commissionPercentage && (
              <p style={styles.errorText}>{errors.commissionPercentage}</p>
            )}
          </div>
        </div>
        <div style={styles.formFooter}>
          <button
            onClick={handleSave}
            style={{
              ...styles.saveButton,
              ...(isSaving && styles.disabledButton),
            }}
            disabled={isSaving}
          >
            {isSaving ? (
              "Salvando..."
            ) : (
              <>
                <i className="fa-solid fa-save"></i> Salvar Consultor
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateConsultantPage;
