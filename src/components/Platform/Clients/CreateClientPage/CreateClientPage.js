import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreateClientPageStyle";
import clientServices from "../../../../dbServices/clientServices";

const ProgressBar = ({ currentStep }) => {
  const steps = ["Pessoal", "Endereço", "Acesso"];
  const progressWidth = currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%";

  return (
    <div style={styles.progressBarContainer}>
      <div style={styles.progressLine}></div>
      <div style={{ ...styles.progressLineActive, width: progressWidth }}></div>
      {steps.map((label, index) => (
        <div key={index} style={styles.progressStep}>
          <div style={styles.progressCircle(index + 1 === currentStep, index + 1 < currentStep)}>
            {index + 1 < currentStep ? <i className="fa-solid fa-check"></i> : index + 1}
          </div>
          <div style={styles.progressLabel(index + 1 === currentStep)}>{label}</div>
        </div>
      ))}
    </div>
  );
};

export default function CreateClientPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "", cpfCnpj: "", email: "", password: "", confirmPassword: "", phoneNumber: "", birthDate: "", jobTitle: "",
    cep: "", street: "", number: "", complement: "", neighborhood: "", city: "", state: "", country: "Brasil",
  });
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formatCpfCnpj = (v) => {
    v = v.replace(/\D/g, "");
    if (v.length <= 11) { // CPF
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else { // CNPJ
      v = v.replace(/^(\d{2})(\d)/, "$1.$2");
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
      v = v.replace(/(\d{4})(\d)/, "$1-$2");
    }
    return v.slice(0, 18);
  };
  const formatPhone = (v) => v.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 15);
  const formatCep = (v) => v.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "cpfCnpj") formattedValue = formatCpfCnpj(value);
    else if (name === "phoneNumber") formattedValue = formatPhone(value);
    else if (name === "cep") formattedValue = formatCep(value);
    setFormData({ ...formData, [name]: formattedValue });
  };
  
  const fetchAddressFromCep = useCallback(async (cep) => {
    const cepOnlyNumbers = cep.replace(/\D/g, "");
    if (cepOnlyNumbers.length !== 8) return;
    setCepLoading(true);
    setError("");
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepOnlyNumbers}/json/`);
      const data = await response.json();
      if (data.erro) {
        setError("CEP não encontrado.");
        setFormData((p) => ({...p, street: "", neighborhood: "", city: "", state: ""}));
      } else {
        setFormData((p) => ({...p, street: data.logradouro, neighborhood: data.bairro, city: data.localidade, state: data.uf, country: "Brasil"}));
      }
    } catch (err) {
      setError("Erro ao buscar o CEP.");
    } finally {
      setCepLoading(false);
    }
  }, []);

  useEffect(() => {
    if (formData.cep.replace(/\D/g, "").length === 8)
      fetchAddressFromCep(formData.cep);
  }, [formData.cep, fetchAddressFromCep]);

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.name || !formData.cpfCnpj || !formData.phoneNumber || !formData.birthDate) return "Preencha os campos de dados pessoais.";
    }
    if (currentStep === 2) {
      if (!formData.cep || !formData.street || !formData.number || !formData.neighborhood || !formData.city || !formData.state) return "Preencha todos os campos de endereço.";
    }
    if (currentStep === 3) {
      if (!formData.email || !formData.password) return "Email e senha são obrigatórios.";
      if (formData.password !== formData.confirmPassword) return "As senhas não coincidem!";
    }
    return "";
  };

  const nextStep = () => {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setStep((s) => s + 1);
  };

  const prevStep = () => setStep((s) => s - 1);

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateStep(3);
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError("");
    
    const payload = { ...formData, cpfCnpj: formData.cpfCnpj.replace(/\D/g, ""), phoneNumber: formData.phoneNumber.replace(/\D/g, "") };
    delete payload.confirmPassword;
    delete payload.cep;

    try {
      await clientServices.cadastrar(payload);
      alert("Cliente cadastrado com sucesso!");
      navigate("/clients");
    } catch (err) {
      const apiError = err?.response?.data || err.message || "Ocorreu um erro no cadastro.";
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };
  
  return (
      <div style={styles.pageContainer}>
        <div style={styles.formContainer}>
          <form onSubmit={handleFinalSubmit} noValidate>
            <ProgressBar currentStep={step} />
            <h2 style={styles.formTitle}>Cadastrar Novo Cliente</h2>
            <p style={styles.formSubtitle}>
              {step === 1 && "Informações Pessoais do Cliente"}
              {step === 2 && "Endereço do Cliente"}
              {step === 3 && "Credenciais de Acesso"}
            </p>
            <div style={styles.errorMessage}>{error}</div>

            {step === 1 && (
              <>
                <div style={styles.formRow}><div style={styles.formField}><label style={styles.label}>Nome Completo</label><input name="name" style={styles.input} value={formData.name} onChange={handleInputChange} /></div></div>
                <div style={styles.formRow}>
                  <div style={styles.formField}><label style={styles.label}>CPF ou CNPJ</label><input name="cpfCnpj" style={styles.input} value={formData.cpfCnpj} onChange={handleInputChange} /></div>
                  <div style={styles.formField}><label style={styles.label}>Data de Nascimento/Abertura</label><input type="date" name="birthDate" style={styles.input} value={formData.birthDate} onChange={handleInputChange} /></div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formField}><label style={styles.label}>Contato (com DDD)</label><input name="phoneNumber" placeholder="(00) 00000-0000" style={styles.input} value={formData.phoneNumber} onChange={handleInputChange} /></div>
                  <div style={styles.formField}><label style={styles.label}>Profissão (Opcional)</label><input name="jobTitle" style={styles.input} value={formData.jobTitle} onChange={handleInputChange}/></div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div style={styles.formRow}>
                  <div style={{ ...styles.formField, flex: 0.5 }}>
                    <label style={styles.label}>CEP</label>
                    <div style={{display: 'flex', alignItems: 'center'}}><input name="cep" placeholder="00000-000" style={styles.input} value={formData.cep} onChange={handleInputChange} />{cepLoading && (<i className="fa-solid fa-spinner fa-spin" style={{marginLeft: '10px'}}></i>)}</div>
                  </div>
                  <div style={styles.formField}><label style={styles.label}>Rua / Logradouro</label><input name="street" style={styles.input} value={formData.street} onChange={handleInputChange} /></div>
                </div>
                <div style={styles.formRow}>
                  <div style={{ ...styles.formField, flex: 0.3 }}><label style={styles.label}>Número</label><input name="number" style={styles.input} value={formData.number} onChange={handleInputChange} /></div>
                  <div style={styles.formField}><label style={styles.label}>Bairro</label><input name="neighborhood" style={styles.input} value={formData.neighborhood} onChange={handleInputChange} /></div>
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formField}><label style={styles.label}>Cidade</label><input name="city" style={styles.input} value={formData.city} onChange={handleInputChange} /></div>
                  <div style={{ ...styles.formField, flex: 0.4 }}><label style={styles.label}>Estado</label><input name="state" style={styles.input} value={formData.state} onChange={handleInputChange} /></div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div style={styles.formRow}><div style={styles.formField}><label style={styles.label}>Email</label><input type="email" name="email" style={styles.input} value={formData.email} onChange={handleInputChange} /></div></div>
                <div style={styles.formRow}>
                  <div style={styles.formField}><label style={styles.label}>Senha</label><input type="password" name="password" style={styles.input} value={formData.password} onChange={handleInputChange} /></div>
                  <div style={styles.formField}><label style={styles.label}>Confirmar Senha</label><input type="password" name="confirmPassword" style={styles.input} value={formData.confirmPassword} onChange={handleInputChange} /></div>
                </div>
              </>
            )}

            <div style={styles.formNavigation}>
              {step > 1 ? (<button type="button" style={styles.navButton} onClick={prevStep}>Voltar</button>) : (<div></div>)}
              {step < 3 ? (<button type="button" style={styles.submitButton} onClick={nextStep}>Avançar</button>) : (
                <button type="submit" style={styles.submitButton} disabled={loading}>
                  {loading ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Finalizar Cadastro")}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
  );
}