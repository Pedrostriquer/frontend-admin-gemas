import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import styles from './UsersPageStyle';

// --- Dados Estáticos ---
const staticUsers = [
    { id: 1, name: 'Bruno', cpf: '000.584.554-77', email: 'suporte@irrigoldemil.com.br', phone: '85784528', permissions: { contracts: ['Acessar Contratos', 'Ver Saques'], ecommerce: ['Gerenciar Produto', 'Gerenciar Promoções'], system: [] } },
    { id: 2, name: 'Ander', cpf: '001.621.789-22', email: 'ander@gmail.com', phone: '9923342234', permissions: { contracts: ['Acessar Contratos'], ecommerce: [], system: [] } },
    { id: 3, name: 'Cauã Brandão de Mello', cpf: '075.411.521-61', email: 'cauabrandao@gmail.com', phone: '17992562727', permissions: { contracts: ['Criar/Editar/Autorizar Contratos', 'Ver Saques'], ecommerce: ['Gerenciar Produto', 'Gerenciar Pedidos'], system: ['Criar Usuários (Admin)'] } },
];
const allPermissions = {
    contracts: ['Editar/Autorizar/Criar Contratos', 'Acessar Contratos', 'Criar/Editar/Autorizar Saques', 'Ver Saques', 'Antecipar Saldo', 'Criar/Editar Cliente', 'Acessar Controlador', 'Extrair Dados', 'Criar/Excluir Notícias', 'Gerenciar Consultores', 'Indicação', 'Gerenciar Mensagens', 'Ver Acessos'],
    ecommerce: ['Gerenciar Produto', 'Gerenciar Promoções', 'Gerenciar Clientes', 'Gerenciar Pedidos'],
    system: ['Criar Usuários (Admin)']
};

// --- Estilos Globais para Animações ---
const GlobalStyles = () => (
    <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes scaleDown { from { transform: scale(1); opacity: 1; } to { transform: scale(0.95); opacity: 0; } }
    `}</style>
);

// --- Componente do Modal de Detalhes ---
const UserDetailsModal = ({ user, onClose, isClosing }) => (
    ReactDOM.createPortal(
        <div style={{...styles.modalBackdrop, ...(isClosing && styles.modalBackdropClosing)}}>
            <GlobalStyles />
            <div style={{...styles.modalContent, ...(isClosing && styles.modalContentClosing)}} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}><h3 style={styles.modalHeaderH3}>Detalhes do Usuário</h3><button style={styles.modalHeaderButton} onClick={onClose}><i className="fa-solid fa-xmark"></i></button></div>
                <div style={styles.userDetailsGrid}><p style={styles.userDetailsP}><span style={styles.userDetailsPSpan}>Nome:</span> {user.name}</p><p style={styles.userDetailsP}><span style={styles.userDetailsPSpan}>CPF:</span> {user.cpf}</p><p style={styles.userDetailsP}><span style={styles.userDetailsPSpan}>Email:</span> {user.email}</p><p style={styles.userDetailsP}><span style={styles.userDetailsPSpan}>Celular:</span> {user.phone}</p></div>
                <div style={styles.permissionsDisplay}>
                    <div style={styles.permissionGroup}><h4 style={styles.permissionGroupH4}>Permissões de Contratos</h4><div style={styles.tags}>{user.permissions.contracts.map(p => <span key={p} style={styles.tagSpan}>{p}</span>)}</div></div>
                    <div style={styles.permissionGroup}><h4 style={styles.permissionGroupH4}>Permissões de E-commerce</h4><div style={styles.tags}>{user.permissions.ecommerce.map(p => <span key={p} style={styles.tagSpan}>{p}</span>)}</div></div>
                    <div style={styles.permissionGroup}><h4 style={styles.permissionGroupH4}>Permissões do Sistema</h4><div style={styles.tags}>{user.permissions.system.map(p => <span key={p} style={styles.tagSpan}>{p}</span>)}</div></div>
                </div>
            </div>
        </div>, document.body
    )
);

// --- Componente do Modal de Criação ---
const CreateUserModal = ({ onClose, isClosing }) => {
    const [selectedPermissions, setSelectedPermissions] = useState(new Set());

    const togglePermission = (permission) => {
        setSelectedPermissions(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(permission)) { newSelection.delete(permission); } else { newSelection.add(permission); }
            return newSelection;
        });
    };

    return ReactDOM.createPortal(
        <div style={{...styles.modalBackdrop, ...(isClosing && styles.modalBackdropClosing)}}>
            <GlobalStyles />
            <div style={{...styles.modalContent, ...styles.modalContentLarge, ...(isClosing && styles.modalContentClosing)}} onClick={e => e.stopPropagation()}>
                <div style={styles.modalHeader}><h3 style={styles.modalHeaderH3}>Informações Novo Usuário</h3></div>
                <div style={styles.createUserGrid}>
                    <div style={styles.formColumn}>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Nome</label><input type="text" style={styles.formInput} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>CPF</label><input type="text" style={styles.formInput} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Contato</label><input type="text" style={styles.formInput} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Email</label><input type="email" style={styles.formInput} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Senha</label><input type="password" style={styles.formInput} /></div>
                        <div style={styles.formGroup}><label style={styles.formLabel}>Confirme a Senha</label><input type="password" style={styles.formInput} /></div>
                    </div>
                    <div style={styles.permissionsColumn}>
                        <h4 style={styles.permissionsColumnH4}>Permissões Disponíveis</h4>
                        <div style={styles.permissionGroup}><h5 style={styles.permissionGroupH5}>Contratos</h5><div style={styles.permissionButtons}>{allPermissions.contracts.filter(p => !selectedPermissions.has(p)).map(p => <button key={p} style={styles.permissionButton} onClick={() => togglePermission(p)}>{p}</button>)}</div></div>
                        <div style={styles.permissionGroup}><h5 style={styles.permissionGroupH5}>E-commerce</h5><div style={styles.permissionButtons}>{allPermissions.ecommerce.filter(p => !selectedPermissions.has(p)).map(p => <button key={p} style={styles.permissionButton} onClick={() => togglePermission(p)}>{p}</button>)}</div></div>
                        <div style={styles.permissionGroup}><h5 style={styles.permissionGroupH5}>Sistema</h5><div style={styles.permissionButtons}>{allPermissions.system.filter(p => !selectedPermissions.has(p)).map(p => <button key={p} style={styles.permissionButton} onClick={() => togglePermission(p)}>{p}</button>)}</div></div>
                    </div>
                    <div style={{...styles.permissionsColumn, ...styles.permissionsColumnSelected}}>
                        <h4 style={styles.permissionsColumnH4}>Permissões Adicionadas</h4>
                        <div style={styles.selectedPermissionsList}>
                            {Array.from(selectedPermissions).length === 0 && <p style={styles.emptyState}>Clique em uma permissão para adicioná-la aqui.</p>}
                            {Array.from(selectedPermissions).map(p => <button key={p} style={{...styles.permissionButton, ...styles.permissionButtonSelected}} onClick={() => togglePermission(p)}>{p}</button>)}
                        </div>
                    </div>
                </div>
                <div style={styles.modalFooter}>
                    <button style={styles.cancelBtn} onClick={onClose}>Cancelar</button>
                    <button style={styles.createBtn}>Criar</button>
                </div>
            </div>
        </div>, document.body
    );
};


// --- Componente Principal da Página ---
function UsersPage() {
    const [modal, setModal] = useState({ type: null, data: null });
    const [isClosing, setIsClosing] = useState(false);
    const [hoveredRow, setHoveredRow] = useState(null);

    const handleOpenModal = (type, data = null) => { setModal({ type, data }); };
    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setModal({ type: null, data: null });
            setIsClosing(false);
        }, 300);
    };

    return (
        <div style={styles.usersPageContainer}>
            <header style={styles.usersPageHeader}>
                <h1 style={styles.headerH1}>Usuários do Sistema</h1>
                <button style={styles.addUserButton} onClick={() => handleOpenModal('create')}><i className="fa-solid fa-plus"></i> Adicionar Usuário</button>
            </header>
            <div style={styles.searchBox}><input type="text" placeholder="Pesquisar por nome ou cargo..." style={styles.searchInput} /></div>
            <div style={styles.usersTableCard}>
                <table style={styles.usersTable}>
                    <thead><tr><th style={{...styles.tableCell, ...styles.tableHeader}}>Nome</th><th style={{...styles.tableCell, ...styles.tableHeader}}>CPF</th><th style={{...styles.tableCell, ...styles.tableHeader}}>E-mail</th><th style={{...styles.tableCell, ...styles.tableHeader}}>Celular</th><th style={{...styles.tableCell, ...styles.tableHeader}}>Opções</th></tr></thead>
                    <tbody>{staticUsers.map(user => (<tr key={user.id} onMouseEnter={() => setHoveredRow(user.id)} onMouseLeave={() => setHoveredRow(null)} style={{...styles.tableRow, ...(hoveredRow === user.id && styles.tableRowHover)}}>
                        <td style={styles.tableCell}>{user.name}</td>
                        <td style={styles.tableCell}>{user.cpf}</td>
                        <td style={styles.tableCell}>{user.email}</td>
                        <td style={styles.tableCell}>{user.phone}</td>
                        <td style={styles.tableCell}><button style={styles.optionsBtn} onClick={() => handleOpenModal('details', user)}><i className="fa-solid fa-eye"></i></button></td>
                    </tr>))}</tbody>
                </table>
            </div>
            {modal.type === 'details' && <UserDetailsModal user={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'create' && <CreateUserModal onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default UsersPage;