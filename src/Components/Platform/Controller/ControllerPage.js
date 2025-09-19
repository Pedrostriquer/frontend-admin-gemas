import React, { useState, useMemo, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import styles from "./ControllerPageStyle";
import { useAuth } from "../../../Context/AuthContext";
import withdrawServices from "../../../dbServices/withdrawServices";
import contractServices from "../../../dbServices/contractServices";
import indicationService from "../../../dbServices/indicationService";
import valorizationServices from "../../../dbServices/valorizationServices";
import depositAccountService from "../../../dbServices/depositAccountService";

const initialClientPages = [
  {
    id: 1,
    name: "Dashboard",
    icon: "fa-solid fa-house",
    path: "/dashboard",
    enabled: true,
  },
  {
    id: 2,
    name: "Contratos",
    icon: "fa-solid fa-file-signature",
    path: "/contracts",
    enabled: true,
  },
  {
    id: 3,
    name: "Wallet",
    icon: "fa-solid fa-wallet",
    path: "/wallet",
    enabled: true,
  },
];

const ToggleSwitch = ({ label, enabled, onChange }) => {
  return (
    <div style={styles.toggleSwitchContainer}>
      <label style={styles.toggleSwitch}>
        <input
          type="checkbox"
          checked={enabled}
          onChange={onChange}
          style={styles.toggleSwitchInput}
        />
        <span className="slider"></span>
      </label>
      {label && <span style={styles.toggleSwitchContainerSpan}>{label}</span>}
    </div>
  );
};

const DepositAccountModal = ({ account, onClose, onSave, isClosing }) => {
  const isEditing = !!account?.id;
  const [formData, setFormData] = useState({
    bankName: account?.bankName || "",
    agencyNumber: account?.agencyNumber || "",
    accountNumber: account?.accountNumber || "",
    pixKeyType: account?.pixKeyType || "",
    pixKey: account?.pixKey || "",
    beneficiaryName: account?.beneficiaryName || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({ id: account?.id, ...formData });
      onClose();
    } catch (error) {
      console.error("Falha ao salvar conta de depósito:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return ReactDOM.createPortal(
    <div
      style={{
        ...styles.modalBackdrop,
        animation: isClosing
          ? "fadeOut 0.3s ease forwards"
          : "fadeIn 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...styles.modalContent,
          animation: isClosing
            ? "scaleDown 0.3s ease forwards"
            : "scaleUp 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeaderCtrl}>
          <h3 style={styles.modalHeaderCtrlH3}>
            {isEditing ? "Editar Conta de Depósito" : "Criar Nova Conta"}
          </h3>
        </div>
        <div style={styles.createRuleForm}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nome do Beneficiário</label>
            <input
              type="text"
              name="beneficiaryName"
              value={formData.beneficiaryName}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nome do Banco</label>
            <input
              type="text"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroupRow}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Agência</label>
              <input
                type="text"
                name="agencyNumber"
                value={formData.agencyNumber}
                onChange={handleChange}
                style={styles.formInput}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Número da Conta</label>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                style={styles.formInput}
              />
            </div>
          </div>
          <div style={styles.formGroupRow}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Tipo de Chave PIX</label>
              <input
                type="text"
                name="pixKeyType"
                value={formData.pixKeyType}
                onChange={handleChange}
                style={styles.formInput}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Chave PIX</label>
              <input
                type="text"
                name="pixKey"
                value={formData.pixKey}
                onChange={handleChange}
                style={styles.formInput}
              />
            </div>
          </div>
        </div>
        <div style={styles.modalFooterCtrl}>
          <button
            style={styles.cancelBtnCtrl}
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            style={styles.saveCardButton}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar Conta"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const RuleModal = ({ rule, onClose, onSave, isClosing }) => {
  const isEditing = !!rule?.id;
  const [formData, setFormData] = useState({
    id: rule?.id || 0,
    name: rule?.name || "",
    months: rule?.months || "",
    monthlyPercentage: rule?.monthlyPercentage || "",
    withGem: rule?.withGem !== undefined ? rule.withGem : true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error("Falha ao salvar regra:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return ReactDOM.createPortal(
    <div
      style={{
        ...styles.modalBackdrop,
        animation: isClosing
          ? "fadeOut 0.3s ease forwards"
          : "fadeIn 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...styles.modalContent,
          animation: isClosing
            ? "scaleDown 0.3s ease forwards"
            : "scaleUp 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeaderCtrl}>
          <h3 style={styles.modalHeaderCtrlH3}>
            {isEditing ? "Editar Regra de Contrato" : "Criar Nova Regra"}
          </h3>
        </div>
        <div style={styles.createRuleForm}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nome da Regra</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Meses (Duração)</label>
            <input
              type="number"
              name="months"
              value={formData.months}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Valorização Mensal (%)</label>
            <input
              type="number"
              name="monthlyPercentage"
              value={formData.monthlyPercentage}
              onChange={handleChange}
              style={styles.formInput}
            />
          </div>
          <div style={{ ...styles.formGroup, ...styles.formGroupCentered }}>
            <ToggleSwitch
              label={formData.withGem ? "Com Gema" : "Sem Gema"}
              enabled={formData.withGem}
              onChange={() =>
                setFormData((p) => ({ ...p, withGem: !p.withGem }))
              }
            />
          </div>
        </div>
        <div style={styles.modalFooterCtrl}>
          <button
            style={styles.cancelBtnCtrl}
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </button>
          <button
            style={styles.saveCardButton}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar Regra"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const PageModal = ({ page, onClose, isClosing }) => {
  const isEditing = !!page;
  return ReactDOM.createPortal(
    <div
      style={{
        ...styles.modalBackdrop,
        animation: isClosing
          ? "fadeOut 0.3s ease forwards"
          : "fadeIn 0.3s ease",
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...styles.modalContent,
          animation: isClosing
            ? "scaleDown 0.3s ease forwards"
            : "scaleUp 0.3s ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={styles.modalHeaderCtrl}>
          <h3 style={styles.modalHeaderCtrlH3}>
            {isEditing ? "Editar Botão" : "Criar Novo Botão"}
          </h3>
        </div>
        <div style={styles.createRuleForm}>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Nome do Botão</label>
            <input
              type="text"
              placeholder="Ex: Minha Carteira"
              defaultValue={isEditing ? page.name : ""}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Ícone (Font Awesome)</label>
            <input
              type="text"
              placeholder="Ex: fa-solid fa-wallet"
              defaultValue={isEditing ? page.icon : ""}
              style={styles.formInput}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.formLabel}>Caminho (URL)</label>
            <input
              type="text"
              placeholder="Ex: /minha-carteira"
              defaultValue={isEditing ? page.path : ""}
              style={styles.formInput}
            />
          </div>
        </div>
        <div style={styles.modalFooterCtrl}>
          <button style={styles.cancelBtnCtrl} onClick={onClose}>
            Cancelar
          </button>
          <button style={styles.saveCardButton}>Salvar</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

function ControllerPage() {
  const { token } = useAuth();

  const [withdrawRules, setWithdrawRules] = useState({
    minimumToWithdraw: "",
    fee: "",
    day: "",
    startHour: "00:00:00",
    stopHour: "00:00:00",
    isActive: true,
  });
  const [contractRules, setContractRules] = useState([]);
  const [contractSettings, setContractSettings] = useState({
    minimumValue: "",
    isReinvestmentEnabled: true,
  });
  const [indicationRule, setIndicationRule] = useState({
    percentage: "",
    isActive: true,
  });
  const [visiblePages, setVisiblePages] = useState(initialClientPages);
  const [valorizationConfig, setValorizationConfig] = useState({
    valorizationTime: "00:00:00",
    valorizationStatus: true,
  });
  const [depositAccounts, setDepositAccounts] = useState([]);

  const [isLoading, setIsLoading] = useState({
    withdraw: true,
    contractRules: true,
    contractSettings: true,
    indication: true,
    valorization: true,
    depositAccounts: true,
  });
  const [isSaving, setIsSaving] = useState({
    withdraw: false,
    contractSettings: false,
    indication: false,
    valorization: false,
  });
  const [modal, setModal] = useState({ type: null, data: null });
  const [isClosing, setIsClosing] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [ruleSearch, setRuleSearch] = useState("");
  const [rulePage, setRulePage] = useState(1);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading((prev) => ({
      ...prev,
      withdraw: true,
      contractRules: true,
      contractSettings: true,
      indication: true,
      valorization: true,
      depositAccounts: true,
    }));
    try {
      const [
        withdrawData,
        contractRulesData,
        contractSettingsData,
        indicationData,
        valorizationData,
        depositAccountsData,
      ] = await Promise.all([
        withdrawServices.getRules(token).catch((e) => {
          console.error("Falha ao buscar regras de saque", e);
          return {};
        }),
        contractServices.getContractRules(token).catch((e) => {
          console.error("Falha ao buscar regras de contrato", e);
          return [];
        }),
        contractServices.getContractSettings(token).catch((e) => {
          console.error("Falha ao buscar configs de contrato", e);
          return {};
        }),
        indicationService.getRule(token).catch((e) => {
          console.error("Falha ao buscar regra de indicação", e);
          return {};
        }),
        valorizationServices.getConfig(token).catch((e) => {
          console.error("Falha ao buscar config de valorização", e);
          return {};
        }),
        depositAccountService.getAll(token).catch((e) => {
          console.error("Falha ao buscar contas de depósito", e);
          return [];
        }),
      ]);
      setWithdrawRules((prev) => ({ ...prev, ...withdrawData }));
      setContractRules(contractRulesData);
      setContractSettings((prev) => ({ ...prev, ...contractSettingsData }));
      setIndicationRule((prev) => ({ ...prev, ...indicationData }));
      setValorizationConfig((prev) => ({ ...prev, ...valorizationData }));
      setDepositAccounts(depositAccountsData);
    } catch (error) {
      console.error("Erro ao buscar configurações iniciais:", error);
    } finally {
      setIsLoading({
        withdraw: false,
        contractRules: false,
        contractSettings: false,
        indication: false,
        valorization: false,
        depositAccounts: false,
      });
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleWithdrawRuleChange = (e) =>
    setWithdrawRules((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleContractSettingsChange = (e) =>
    setContractSettings((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  const handleIndicationRuleChange = (e) =>
    setIndicationRule((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleValorizationConfigChange = (e) =>
    setValorizationConfig((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  const createSaveHandler =
    (serviceCall, stateKey, successMsg, errorMsg) => async (data) => {
      setIsSaving((prev) => ({ ...prev, [stateKey]: true }));
      try {
        await serviceCall(token, data);
        alert(successMsg);
        await fetchData();
      } catch (error) {
        console.error(errorMsg, error);
        alert(errorMsg);
      } finally {
        setIsSaving((prev) => ({ ...prev, [stateKey]: false }));
      }
    };

  const handleSaveWithdrawRules = createSaveHandler(
    (token, data) =>
      withdrawServices.updateRules(token, {
        ...data,
        fee: parseFloat(data.fee),
        minimumToWithdraw: parseFloat(data.minimumToWithdraw),
        day: parseInt(data.day, 10),
      }),
    "withdraw",
    "Regras de saque salvas!",
    "Falha ao salvar regras de saque."
  );

  const handleSaveContractSettings = createSaveHandler(
    (token, data) =>
      contractServices.updateContractSettings(token, {
        ...data,
        minimumValue: parseFloat(data.minimumValue),
      }),
    "contractSettings",
    "Configurações de contrato salvas!",
    "Falha ao salvar configurações de contrato."
  );

  const handleSaveIndicationRule = createSaveHandler(
    (token, data) =>
      indicationService.updateRule(token, {
        ...data,
        percentage: parseFloat(data.percentage),
      }),
    "indication",
    "Regra de indicação salva!",
    "Falha ao salvar regra de indicação."
  );

  const handleSaveValorizationConfig = createSaveHandler(
    valorizationServices.updateConfig,
    "valorization",
    "Configuração de valorização salva!",
    "Falha ao salvar configuração de valorização."
  );

  const handleSaveContractRule = async (ruleData) => {
    const dataToSave = {
      ...ruleData,
      months: parseInt(ruleData.months, 10),
      monthlyPercentage: parseFloat(ruleData.monthlyPercentage),
    };
    try {
      if (dataToSave.id) {
        await contractServices.updateContractRule(
          token,
          dataToSave.id,
          dataToSave
        );
      } else {
        await contractServices.createContractRule(token, dataToSave);
      }
      await fetchData();
      handleCloseModal();
    } catch (error) {
      alert("Falha ao salvar a regra.");
      throw error;
    }
  };

  const handleDeleteContractRule = async (ruleId) => {
    if (window.confirm("Tem certeza que deseja desativar esta regra?")) {
      try {
        await contractServices.deleteContractRule(token, ruleId);
        await fetchData();
      } catch (error) {
        alert("Falha ao desativar a regra.");
      }
    }
  };

  const handleSaveDepositAccount = async (accountData) => {
    try {
      if (accountData.id) {
        await depositAccountService.update(token, accountData.id, accountData);
      } else {
        await depositAccountService.create(token, accountData);
      }
      await fetchData();
    } catch (error) {
      alert("Falha ao salvar a conta de depósito.");
      throw error;
    }
  };

  const handleDeleteDepositAccount = async (accountId) => {
    if (
      window.confirm("Tem certeza que deseja excluir esta conta de depósito?")
    ) {
      try {
        await depositAccountService.delete(token, accountId);
        await fetchData();
      } catch (error) {
        alert("Falha ao excluir a conta de depósito.");
      }
    }
  };

  const handleOpenModal = (type, data = null) => setModal({ type, data });
  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setModal({ type: null, data: null });
      setIsClosing(false);
    }, 300);
  };

  const handlePageToggle = (pageId) => {
    setVisiblePages((prev) =>
      prev.map((p) => (p.id === pageId ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const filteredRules = useMemo(
    () =>
      contractRules.filter((r) =>
        r.name.toLowerCase().includes(ruleSearch.toLowerCase())
      ),
    [contractRules, ruleSearch]
  );
  const paginatedRules = filteredRules.slice((rulePage - 1) * 3, rulePage * 3);
  const totalRulePages = Math.ceil(filteredRules.length / 3);

  return (
    <div style={styles.controllerPageContainer}>
      <style>{`.slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:24px}.slider:before{position:absolute;content:"";height:18px;width:18px;left:3px;bottom:3px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.slider{background-color:#3b82f6}input:checked+.slider:before{transform:translateX(20px)}`}</style>

      <header style={styles.controllerPageHeader}>
        <h1 style={styles.headerH1}>Controlador</h1>
        <p style={styles.headerP}>
          Gerencie as regras de negócio e a visibilidade de páginas para seus
          clientes.
        </p>
      </header>
      <div style={styles.layoutFinal}>
        <div style={styles.controllerCard}>
          <div style={styles.cardHeader}>
            <i
              className="fa-solid fa-landmark"
              style={styles.cardHeaderIcon}
            ></i>
            <h3 style={styles.cardHeaderH3}>Contas para Depósito</h3>
          </div>
          <div style={styles.cardBody}>
            {isLoading.depositAccounts ? (
              <p style={{ textAlign: "center", color: "#6b7280" }}>
                Carregando...
              </p>
            ) : (
              <ul style={styles.rulesListUl}>
                {depositAccounts.length > 0 ? (
                  depositAccounts.map((account) => (
                    <li key={account.id} style={styles.rulesListItem}>
                      <span style={styles.ruleName}>
                        {account.beneficiaryName} ({account.bankName})
                      </span>
                      <div style={styles.ruleActions}>
                        <button
                          style={styles.ruleActionButton}
                          onClick={() =>
                            handleOpenModal("deposit_account", account)
                          }
                        >
                          <i className="fa-solid fa-pencil"></i>
                        </button>
                        <button
                          style={{
                            ...styles.ruleActionButton,
                            ...styles.ruleActionButtonDanger,
                          }}
                          onClick={() => handleDeleteDepositAccount(account.id)}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <p style={{ textAlign: "center", color: "#6b7280" }}>
                    Nenhuma conta cadastrada.
                  </p>
                )}
              </ul>
            )}
          </div>
          <div style={styles.cardFooter}>
            <button
              style={styles.saveCardButton}
              onClick={() => handleOpenModal("deposit_account")}
            >
              <i className="fa-solid fa-plus"></i> Criar Nova Conta
            </button>
          </div>
        </div>

        <div style={styles.controllerCard}>
          <div style={styles.cardHeader}>
            <i
              className="fa-solid fa-money-bill-transfer"
              style={styles.cardHeaderIcon}
            ></i>
            <h3 style={styles.cardHeaderH3}>Saque</h3>
          </div>
          <div style={styles.cardBody}>
            {isLoading.withdraw ? (
              <p style={{ textAlign: "center", color: "#6b7280" }}>
                Carregando...
              </p>
            ) : (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Valor Mínimo (R$)</label>
                  <input
                    type="number"
                    name="minimumToWithdraw"
                    value={withdrawRules.minimumToWithdraw}
                    onChange={handleWithdrawRuleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Taxa de Saque (%)</label>
                  <input
                    type="number"
                    name="fee"
                    value={withdrawRules.fee}
                    onChange={handleWithdrawRuleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Dia do Mês para Saque</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    name="day"
                    value={withdrawRules.day}
                    onChange={handleWithdrawRuleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.formGroupRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Horário de Início</label>
                    <input
                      type="time"
                      name="startHour"
                      value={withdrawRules.startHour}
                      onChange={handleWithdrawRuleChange}
                      style={styles.formInput}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Horário de Fim</label>
                    <input
                      type="time"
                      name="stopHour"
                      value={withdrawRules.stopHour}
                      onChange={handleWithdrawRuleChange}
                      style={styles.formInput}
                    />
                  </div>
                </div>
                <div style={styles.toggleWrapper}>
                  <ToggleSwitch
                    label={
                      withdrawRules.isActive
                        ? "Saques Ativados"
                        : "Saques Desativados"
                    }
                    enabled={withdrawRules.isActive}
                    onChange={() =>
                      setWithdrawRules((p) => ({ ...p, isActive: !p.isActive }))
                    }
                  />
                </div>
              </>
            )}
          </div>
          <div style={styles.cardFooter}>
            <button
              style={styles.saveCardButton}
              onClick={() => handleSaveWithdrawRules(withdrawRules)}
              disabled={isSaving.withdraw}
            >
              {isSaving.withdraw ? (
                "Salvando..."
              ) : (
                <>
                  <i className="fa-solid fa-save"></i> Salvar
                </>
              )}
            </button>
          </div>
        </div>

        <div style={styles.controllerCard}>
          <div style={styles.cardHeader}>
            <i
              className="fa-solid fa-clock-rotate-left"
              style={styles.cardHeaderIcon}
            ></i>
            <h3 style={styles.cardHeaderH3}>Valorização Diária</h3>
          </div>
          <div style={styles.cardBody}>
            {isLoading.valorization ? (
              <p style={{ textAlign: "center", color: "#6b7280" }}>
                Carregando...
              </p>
            ) : (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Horário da Execução</label>
                  <input
                    type="time"
                    step="1"
                    name="valorizationTime"
                    value={valorizationConfig.valorizationTime}
                    onChange={handleValorizationConfigChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.toggleWrapper}>
                  <ToggleSwitch
                    label="Valorização Automática Ativada"
                    enabled={valorizationConfig.valorizationStatus}
                    onChange={() =>
                      setValorizationConfig((p) => ({
                        ...p,
                        valorizationStatus: !p.valorizationStatus,
                      }))
                    }
                  />
                </div>
              </>
            )}
          </div>
          <div style={styles.cardFooter}>
            <button
              style={styles.saveCardButton}
              onClick={() => handleSaveValorizationConfig(valorizationConfig)}
              disabled={isSaving.valorization}
            >
              {isSaving.valorization ? (
                "Salvando..."
              ) : (
                <>
                  <i className="fa-solid fa-save"></i> Salvar
                </>
              )}
            </button>
          </div>
        </div>

        <div style={styles.controllerCard}>
          <div style={styles.cardHeader}>
            <i
              className="fa-solid fa-file-signature"
              style={styles.cardHeaderIcon}
            ></i>
            <h3 style={styles.cardHeaderH3}>Contrato</h3>
          </div>
          <div style={styles.cardBody}>
            {isLoading.contractSettings ? (
              <p style={{ textAlign: "center", color: "#6b7280" }}>
                Carregando...
              </p>
            ) : (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Valor Mínimo (R$)</label>
                  <input
                    type="number"
                    name="minimumValue"
                    value={contractSettings.minimumValue}
                    onChange={handleContractSettingsChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.toggleWrapperSeparated}>
                  <ToggleSwitch
                    label="Reinvestimento Ativado"
                    enabled={contractSettings.isReinvestmentEnabled}
                    onChange={() =>
                      setContractSettings((p) => ({
                        ...p,
                        isReinvestmentEnabled: !p.isReinvestmentEnabled,
                      }))
                    }
                  />
                </div>
              </>
            )}
            <div style={styles.rulesManagementSection}>
              <button
                style={{
                  ...styles.rulesBtn,
                  ...styles.rulesBtnView,
                  ...(showRules && styles.rulesBtnViewActive),
                }}
                onClick={() => setShowRules(!showRules)}
              >
                <i className="fa-solid fa-eye"></i> Ver Regras
              </button>
              <button
                style={{ ...styles.rulesBtn, ...styles.rulesBtnCreate }}
                onClick={() => handleOpenModal("contract_rule")}
              >
                <i className="fa-solid fa-plus"></i> Criar Nova Regra
              </button>
            </div>
            <div
              style={{
                ...styles.rulesListWrapper,
                ...(showRules && styles.rulesListWrapperOpen),
              }}
            >
              <div style={styles.rulesList}>
                <h4 style={styles.rulesListH4}>Regras Salvas</h4>
                <input
                  type="text"
                  style={styles.rulesSearch}
                  placeholder="Buscar regra por nome..."
                  value={ruleSearch}
                  onChange={(e) => setRuleSearch(e.target.value)}
                />
                {isLoading.contractRules ? (
                  <p style={{ textAlign: "center", color: "#6b7280" }}>
                    Carregando...
                  </p>
                ) : (
                  <>
                    <ul style={styles.rulesListUl}>
                      {paginatedRules.map((rule) => (
                        <li key={rule.id} style={styles.rulesListItem}>
                          <span style={styles.ruleName}>{rule.name}</span>
                          <div style={styles.ruleDetails}>
                            <span>{rule.months}m</span>
                            <span>{rule.monthlyPercentage}%</span>
                            <span>{rule.withGem ? "C/ Gema" : "S/ Gema"}</span>
                          </div>
                          <div style={styles.ruleActions}>
                            <button
                              style={styles.ruleActionButton}
                              onClick={() =>
                                handleOpenModal("contract_rule", rule)
                              }
                            >
                              <i className="fa-solid fa-pencil"></i>
                            </button>
                            <button
                              style={{
                                ...styles.ruleActionButton,
                                ...styles.ruleActionButtonDanger,
                              }}
                              onClick={() => handleDeleteContractRule(rule.id)}
                            >
                              <i className="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div style={styles.paginationContainerRules}>
                      <button
                        onClick={() => setRulePage((p) => Math.max(p - 1, 1))}
                        disabled={rulePage === 1}
                        style={styles.paginationRulesButton}
                      >
                        &lt;
                      </button>
                      <span style={styles.paginationRulesSpan}>
                        {rulePage} de {totalRulePages || 1}
                      </span>
                      <button
                        onClick={() =>
                          setRulePage((p) => Math.min(p + 1, totalRulePages))
                        }
                        disabled={rulePage >= totalRulePages}
                        style={styles.paginationRulesButton}
                      >
                        &gt;
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <div style={styles.cardFooter}>
            <button
              style={styles.saveCardButton}
              onClick={() => handleSaveContractSettings(contractSettings)}
              disabled={isSaving.contractSettings}
            >
              {isSaving.contractSettings ? (
                "Salvando..."
              ) : (
                <>
                  <i className="fa-solid fa-save"></i> Salvar
                </>
              )}
            </button>
          </div>
        </div>

        <div style={styles.controllerCard}>
          <div style={styles.cardHeader}>
            <i
              className="fa-solid fa-share-nodes"
              style={styles.cardHeaderIcon}
            ></i>
            <h3 style={styles.cardHeaderH3}>Indicação</h3>
          </div>
          <div style={styles.cardBody}>
            {isLoading.indication ? (
              <p style={{ textAlign: "center", color: "#6b7280" }}>
                Carregando...
              </p>
            ) : (
              <>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>
                    Percentual de Comissão (%)
                  </label>
                  <input
                    type="number"
                    name="percentage"
                    value={indicationRule.percentage}
                    onChange={handleIndicationRuleChange}
                    style={styles.formInput}
                  />
                </div>
                <div style={styles.toggleWrapper}>
                  <ToggleSwitch
                    label="Indicações Ativadas"
                    enabled={indicationRule.isActive}
                    onChange={() =>
                      setIndicationRule((p) => ({
                        ...p,
                        isActive: !p.isActive,
                      }))
                    }
                  />
                </div>
              </>
            )}
          </div>
          <div style={styles.cardFooter}>
            <button
              style={styles.saveCardButton}
              onClick={() => handleSaveIndicationRule(indicationRule)}
              disabled={isSaving.indication}
            >
              {isSaving.indication ? (
                "Salvando..."
              ) : (
                <>
                  <i className="fa-solid fa-save"></i> Salvar
                </>
              )}
            </button>
          </div>
        </div>

        <div style={styles.controllerCard}>
          <div style={styles.cardHeader}>
            <i className="fa-solid fa-eye" style={styles.cardHeaderIcon}></i>
            <h3 style={styles.cardHeaderH3}>Páginas Visíveis</h3>
          </div>
          <div style={styles.cardBody}>
            <ul style={styles.visiblePagesList}>
              {visiblePages.map((page) => (
                <li key={page.id} style={styles.visiblePagesListItem}>
                  <div style={styles.pageInfo}>
                    <i className={page.icon} style={styles.pageInfoIcon}></i>
                    <span style={styles.pageInfoSpan}>{page.name}</span>
                  </div>
                  <div style={styles.pageActions}>
                    <button
                      style={styles.pageActionButton}
                      onClick={() => handleOpenModal("edit_page", page)}
                    >
                      <i className="fa-solid fa-pencil"></i>
                    </button>
                    <ToggleSwitch
                      enabled={page.enabled}
                      onChange={() => handlePageToggle(page.id)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div style={styles.cardFooter}>
            <button style={styles.saveCardButton}>
              <i className="fa-solid fa-save"></i> Salvar
            </button>
          </div>
        </div>
      </div>
      {modal.type === "deposit_account" && (
        <DepositAccountModal
          account={modal.data}
          onClose={handleCloseModal}
          onSave={handleSaveDepositAccount}
          isClosing={isClosing}
        />
      )}
      {modal.type === "contract_rule" && (
        <RuleModal
          rule={modal.data}
          onClose={handleCloseModal}
          onSave={handleSaveContractRule}
          isClosing={isClosing}
        />
      )}
      {(modal.type === "create_page" || modal.type === "edit_page") && (
        <PageModal
          page={modal.data}
          onClose={handleCloseModal}
          isClosing={isClosing}
        />
      )}
    </div>
  );
}

export default ControllerPage;
