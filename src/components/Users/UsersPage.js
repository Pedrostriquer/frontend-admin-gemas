import React, { useState, useMemo } from 'react';
import './UsersPage.css';

// --- Dados Estáticos ---
const staticUsers = [
    { id: 1, name: 'Bruno', cpf: '000.584.554-77', email: 'suporte@irrigoldemil.com.br', phone: '85784528', permissions: { contracts: ['Acessar Contratos', 'Ver Saques'], ecommerce: ['Gerenciar Produto', 'Gerenciar Promoções'], system: [] } },
    { id: 2, name: 'Ander', cpf: '001.621.789-22', email: 'ander@gmail.com', phone: '9923342234', permissions: { contracts: ['Acessar Contratos'], ecommerce: [], system: [] } },
    { id: 3, name: 'Cauã Brandão de Mello', cpf: '075.411.521-61', email: 'cauabrandao@gmail.com', phone: '17992562727', permissions: { contracts: ['Criar/Editar/Autorizar Contratos', 'Ver Saques'], ecommerce: ['Gerenciar Produto', 'Gerenciar Pedidos'], system: ['Criar Usuários (Admin)'] } },
];
// Permissões Refatoradas
const allPermissions = {
    contracts: ['Editar/Autorizar/Criar Contratos', 'Acessar Contratos', 'Criar/Editar/Autorizar Saques', 'Ver Saques', 'Antecipar Saldo', 'Criar/Editar Cliente', 'Acessar Controlador', 'Extrair Dados', 'Criar/Excluir Notícias', 'Gerenciar Consultores', 'Indicação', 'Gerenciar Mensagens', 'Ver Acessos'],
    ecommerce: ['Gerenciar Produto', 'Gerenciar Promoções', 'Gerenciar Clientes', 'Gerenciar Pedidos'],
    system: ['Criar Usuários (Admin)']
};

// --- Componente do Modal de Detalhes ---
const UserDetailsModal = ({ user, onClose, isClosing }) => (
    <div className={`modal-backdrop-users ${isClosing ? 'closing' : ''}`} onClick={onClose}>
        <div className={`modal-content-users ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="modal-header-users"><h3>Detalhes do Usuário</h3><button onClick={onClose}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="user-details-grid"><p><span>Nome:</span> {user.name}</p><p><span>CPF:</span> {user.cpf}</p><p><span>Email:</span> {user.email}</p><p><span>Celular:</span> {user.phone}</p></div>
            <div className="permissions-display">
                <div className="permission-group"><h4>Permissões de Contratos</h4><div className="tags">{user.permissions.contracts.map(p => <span key={p}>{p}</span>)}</div></div>
                <div className="permission-group"><h4>Permissões de E-commerce</h4><div className="tags">{user.permissions.ecommerce.map(p => <span key={p}>{p}</span>)}</div></div>
                <div className="permission-group"><h4>Permissões do Sistema</h4><div className="tags">{user.permissions.system.map(p => <span key={p}>{p}</span>)}</div></div>
            </div>
        </div>
    </div>
);

// --- Componente do Modal de Criação (VERSÃO FINAL) ---
const CreateUserModal = ({ onClose, isClosing }) => {
    const [selectedPermissions, setSelectedPermissions] = useState(new Set());

    const togglePermission = (permission) => {
        setSelectedPermissions(prev => {
            const newSelection = new Set(prev);
            if (newSelection.has(permission)) {
                newSelection.delete(permission);
            } else {
                newSelection.add(permission);
            }
            return newSelection;
        });
    };

    return (
        <div className={`modal-backdrop-users ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-users large v2 ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-users"><h3>Informações Novo Usuário</h3></div>
                <div className="create-user-grid">
                    {/* Coluna 1: Dados do Usuário */}
                    <div className="form-column">
                        <div className="form-group-users"><label>Nome</label><input type="text" /></div>
                        <div className="form-group-users"><label>CPF</label><input type="text" /></div>
                        <div className="form-group-users"><label>Contato</label><input type="text" /></div>
                        <div className="form-group-users"><label>Email</label><input type="email" /></div>
                        <div className="form-group-users"><label>Senha</label><input type="password" /></div>
                        <div className="form-group-users"><label>Confirme a Senha</label><input type="password" /></div>
                    </div>
                    {/* Coluna 2: Permissões Disponíveis */}
                    <div className="permissions-column">
                        <h4>Permissões Disponíveis</h4>
                        <div className="permission-group"><h5>Contratos</h5><div className="permission-buttons">{allPermissions.contracts.filter(p => !selectedPermissions.has(p)).map(p => <button key={p} onClick={() => togglePermission(p)}>{p}</button>)}</div></div>
                        <div className="permission-group"><h5>E-commerce</h5><div className="permission-buttons">{allPermissions.ecommerce.filter(p => !selectedPermissions.has(p)).map(p => <button key={p} onClick={() => togglePermission(p)}>{p}</button>)}</div></div>
                        <div className="permission-group"><h5>Sistema</h5><div className="permission-buttons">{allPermissions.system.filter(p => !selectedPermissions.has(p)).map(p => <button key={p} onClick={() => togglePermission(p)}>{p}</button>)}</div></div>
                    </div>
                    {/* Coluna 3: Permissões Selecionadas */}
                    <div className="permissions-column selected">
                        <h4>Permissões Adicionadas</h4>
                        <div className="selected-permissions-list">
                            {Array.from(selectedPermissions).length === 0 && <p className="empty-state">Clique em uma permissão para adicioná-la aqui.</p>}
                            {Array.from(selectedPermissions).map(p => <button key={p} className="selected" onClick={() => togglePermission(p)}>{p}</button>)}
                        </div>
                    </div>
                </div>
                <div className="modal-footer-users">
                    <button className="cancel-btn-users" onClick={onClose}>Cancelar</button>
                    <button className="create-btn-users">Criar</button>
                </div>
            </div>
        </div>
    );
};


// --- Componente Principal da Página ---
function UsersPage() {
    const [modal, setModal] = useState({ type: null, data: null });
    const [isClosing, setIsClosing] = useState(false);

    const handleOpenModal = (type, data = null) => { setModal({ type, data }); };
    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setModal({ type: null, data: null });
            setIsClosing(false);
        }, 300);
    };

    return (
        <div className="users-page-container">
            <header className="users-page-header">
                <h1>Usuários do Sistema</h1>
                <button className="add-user-button" onClick={() => handleOpenModal('create')}><i className="fa-solid fa-plus"></i> Adicionar Usuário</button>
            </header>
            <div className="search-box-users"><input type="text" placeholder="Pesquisar por nome ou cargo..." /></div>
            <div className="users-table-card">
                <table className="users-table">
                    <thead><tr><th>Nome</th><th>CPF</th><th>E-mail</th><th>Celular</th><th>Opções</th></tr></thead>
                    <tbody>{staticUsers.map(user => (<tr key={user.id}><td>{user.name}</td><td>{user.cpf}</td><td>{user.email}</td><td>{user.phone}</td><td><button className="options-btn-users" onClick={() => handleOpenModal('details', user)}><i className="fa-solid fa-eye"></i></button></td></tr>))}</tbody>
                </table>
            </div>
            {modal.type === 'details' && <UserDetailsModal user={modal.data} onClose={handleCloseModal} isClosing={isClosing} />}
            {modal.type === 'create' && <CreateUserModal onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default UsersPage;