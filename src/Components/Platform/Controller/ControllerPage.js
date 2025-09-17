import React, { useState, useMemo, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import styles from "./ControllerPageStyle";
import { useAuth } from "../../../Context/AuthContext";
import withdrawServices from "../../../dbServices/withdrawServices";
import contractServices from "../../../dbServices/contractServices";
import indicationService from "../../../dbServices/indicationService";
import valorizationServices from "../../../dbServices/valorizationServices"; // <-- NOVO: Importa o serviço de valorização

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

  // Estados existentes
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
  }); // <-- REMOVIDO: isValuationEnabled
  const [indicationRule, setIndicationRule] = useState({
    percentage: "",
    isActive: true,
  });
  const [visiblePages, setVisiblePages] = useState(initialClientPages);

  // NOVO ESTADO: para a configuração de valorização
  const [valorizationConfig, setValorizationConfig] = useState({
    valorizationTime: "00:00:00",
    valorizationStatus: true,
  });

  // Estados de UI e Carregamento
  const [isLoading, setIsLoading] = useState({
    withdraw: true,
    contractRules: true,
    contractSettings: true,
    indication: true,
    valorization: true,
  }); // <-- Adicionado 'valorization'
  const [isSaving, setIsSaving] = useState({
    withdraw: false,
    contractSettings: false,
    indication: false,
    valorization: false,
  }); // <-- Adicionado 'valorization'
  const [modal, setModal] = useState({ type: null, data: null });
  const [isClosing, setIsClosing] = useState(false);
  const [showRules, setShowRules] = useState(true);
  const [ruleSearch, setRuleSearch] = useState("");
  const [rulePage, setRulePage] = useState(1);

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [
        withdrawData,
        contractRulesData,
        contractSettingsData,
        indicationData,
        valorizationData,
      ] = await Promise.all([
        // <-- Adicionado 'valorizationData'
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
        }), // <-- NOVO: busca a config de valorização
      ]);
      setWithdrawRules((prev) => ({ ...prev, ...withdrawData }));
      setContractRules(contractRulesData);
      setContractSettings((prev) => ({ ...prev, ...contractSettingsData }));
      setIndicationRule((prev) => ({ ...prev, ...indicationData }));
      setValorizationConfig((prev) => ({ ...prev, ...valorizationData })); // <-- NOVO: atualiza o estado de valorização
    } catch (error) {
      console.error("Erro ao buscar configurações iniciais:", error);
    } finally {
      setIsLoading({
        withdraw: false,
        contractRules: false,
        contractSettings: false,
        indication: false,
        valorization: false,
      }); // <-- Atualizado
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handlers de mudança
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
    })); // <-- NOVO

  // Handlers de salvamento
  const handleSaveWithdrawRules = async () => {
    setIsSaving((prev) => ({ ...prev, withdraw: true }));
    try {
      const dataToSave = {
        ...withdrawRules,
        fee: parseFloat(withdrawRules.fee),
        minimumToWithdraw: parseFloat(withdrawRules.minimumToWithdraw),
        day: parseInt(withdrawRules.day, 10),
      };
      await withdrawServices.updateRules(token, dataToSave);
      alert("Regras de saque salvas com sucesso!");
    } catch (error) {
      alert("Falha ao salvar as regras de saque.");
    } finally {
      setIsSaving((prev) => ({ ...prev, withdraw: false }));
    }
  };

  const handleSaveContractSettings = async () => {
    setIsSaving((prev) => ({ ...prev, contractSettings: true }));
    try {
      const dataToSave = {
        ...contractSettings,
        minimumValue: parseFloat(contractSettings.minimumValue),
      };
      await contractServices.updateContractSettings(token, dataToSave);
      alert("Configurações de contrato salvas com sucesso!");
    } catch (error) {
      alert("Falha ao salvar as configurações de contrato.");
    } finally {
      setIsSaving((prev) => ({ ...prev, contractSettings: false }));
    }
  };

  const handleSaveIndicationRule = async () => {
    setIsSaving((prev) => ({ ...prev, indication: true }));
    try {
      const dataToSave = {
        ...indicationRule,
        percentage: parseFloat(indicationRule.percentage),
      };
      await indicationService.updateRule(token, dataToSave);
      alert("Regra de indicação salva com sucesso!");
    } catch (error) {
      alert("Falha ao salvar a regra de indicação.");
    } finally {
      setIsSaving((prev) => ({ ...prev, indication: false }));
    }
  };

  // NOVO HANDLER: para salvar a config de valorização
  const handleSaveValorizationConfig = async () => {
    setIsSaving((prev) => ({ ...prev, valorization: true }));
    try {
      const dataToSave = {
        valorizationTime: valorizationConfig.valorizationTime,
        valorizationStatus: valorizationConfig.valorizationStatus,
      };
      await valorizationServices.updateConfig(token, dataToSave);
      alert("Configuração de valorização salva com sucesso!");
    } catch (error) {
      alert("Falha ao salvar a configuração de valorização.");
    } finally {
      setIsSaving((prev) => ({ ...prev, valorization: false }));
    }
  };

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
      <style>{`
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: 0.4s; border-radius: 24px; }
        .slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: 0.4s; border-radius: 50%; }
        input:checked + .slider { background-color: #3b82f6; }
        input:checked + .slider:before { transform: translateX(20px); }
      `}</style>

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
              onClick={handleSaveWithdrawRules}
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

        {/* NOVO CARD DE VALORIZAÇÃO */}
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
              onClick={handleSaveValorizationConfig}
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
                {/* O TOGGLE DE VALORIZAÇÃO FOI MOVIDO DAQUI */}
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
              onClick={handleSaveContractSettings}
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
              onClick={handleSaveIndicationRule}
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
