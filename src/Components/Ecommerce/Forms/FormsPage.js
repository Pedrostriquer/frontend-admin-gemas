import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './FormsPage.css';
import formServices from '../../../dbServices/formServices'; // Ajuste o caminho se necessário
import { useAuth } from '../../../Context/AuthContext'; // Para pegar o token
import { useLoad } from '../../../Context/LoadContext';

const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A';

const FormDetailsModal = ({ form, onClose, isClosing }) => {
    if (!form) return null;

    const whatsappLink = `https://wa.me/55${form.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${form.name}, entramos em contato sobre o seu interesse em: "${form.objective}".`)}`;

    return (
        <div className={`modal-backdrop-form ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-form ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-form">
                    <h3>Detalhes do Contato</h3>
                    <button className="close-btn-form" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body-form">
                    <div className="detail-item"><strong>ID:</strong><span>#{form.id}</span></div>
                    <div className="detail-item"><strong>Data:</strong><span>{formatDate(form.dateCreated)}</span></div>
                    <div className="detail-item"><strong>Nome:</strong><span>{form.name}</span></div>
                    <div className="detail-item"><strong>Email:</strong><span>{form.email}</span></div>
                    <div className="detail-item"><strong>Telefone:</strong><span>{form.phoneNumber}</span></div>
                    <div className="detail-item-full"><strong>Objetivo:</strong><p>{form.objective}</p></div>
                    <div className="detail-item-full"><strong>Descrição:</strong><p>{form.description}</p></div>
                </div>
                <div className="modal-footer-form">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsapp-btn-form">
                        <i className="fab fa-whatsapp"></i> Entrar em Contato
                    </a>
                </div>
            </div>
        </div>
    );
};

function FormsPage() {
    const [allForms, setAllForms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [selectedForm, setSelectedForm] = useState(null);
    const [isClosing, setIsClosing] = useState(false);
    const { token } = useAuth();
  const {startLoading, stopLoading} = useLoad();

    const fetchForms = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            startLoading();
            const data = await formServices.getAllForms(token);
            setAllForms(data || []);
        } catch (error) {
            alert("Não foi possível carregar os formulários.");
            setAllForms([]);
        } finally {
            setIsLoading(false);
            stopLoading();
        }
    }, [token]);

    useEffect(() => {
        fetchForms();
    }, [fetchForms]);

    const handleOpenModal = (form) => {
        setSelectedForm(form);
    };

    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedForm(null);
            setIsClosing(false);
        }, 300);
    };

    const filteredAndSortedForms = useMemo(() => {
        let forms = [...allForms].filter(form => 
            form.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            form.id.toString().includes(searchTerm)
        );

        forms.sort((a, b) => {
            const dateA = new Date(a.dateCreated);
            const dateB = new Date(b.dateCreated);
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
        
        return forms;
    }, [allForms, searchTerm, sortOrder]);

    return (
        <div className="forms-page-container">
            <header className="forms-page-header">
                <h1>Formulários de Contato</h1>
                <p>Visualize e gerencie os envios do formulário de joias personalizadas.</p>
            </header>

            <section className="forms-controls-wrapper">
                <div className="search-box-form">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Buscar por nome ou ID..." onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select className="sort-select-form" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="desc">Mais Recentes</option>
                    <option value="asc">Mais Antigos</option>
                </select>
            </section>
            
            <div className="forms-table-card">
                <table className="forms-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Data</th>
                            <th>Nome</th>
                            <th>Contato</th>
                            <th>Objetivo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="5" className="loading-cell">Buscando formulários...</td></tr>
                        ) : filteredAndSortedForms.length > 0 ? (
                            filteredAndSortedForms.map(form => (
                                <tr key={form.id} onClick={() => handleOpenModal(form)}>
                                    <td>#{form.id}</td>
                                    <td>{formatDate(form.dateCreated)}</td>
                                    <td>{form.name}</td>
                                    <td>{form.phoneNumber}</td>
                                    <td>{form.objective}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="no-results-cell">Nenhum formulário encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {selectedForm && <FormDetailsModal form={selectedForm} onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default FormsPage;