import React, { useState, useMemo, useRef, useEffect } from 'react';
import './OrdersPage.css';

// --- Dados Estáticos (Expandidos) ---
const staticOrders = [
    { id: '#3456', client: { name: 'Andrei Ferreira', id: 1, cpf: '090.068.089-05' }, date: '2025-08-11', total: 4765.50, status: 'Processando', address: 'Rua Conde D\'Eu, 1620, Caxias do Sul - RS', products: [{ id: 101, name: "Anel de Diamante 'Solitário'", qty: 1, price: 4500.00 }, { id: 105, name: "Pingente de Opala 'Galáxia'", qty: 1, price: 250.00, note: 'Embalar para presente' }], paymentMethod: 'Cartão de Crédito', shipping: 15.50 },
    { id: '#3455', client: { name: 'Juliana Paes', id: 8, cpf: '111.222.333-44' }, date: '2025-08-10', total: 3220.00, status: 'Pagamento Aprovado', address: 'Rua do Projac, 1, Rio de Janeiro - RJ', products: [{ id: 102, name: "Colar de Esmeralda 'Gota'", qty: 1, price: 3200.00 }], paymentMethod: 'PIX', shipping: 20.00 },
    { id: '#3454', client: { name: 'Fabiano Baldasso', id: 7, cpf: '000.000.000-00' }, date: '2025-08-10', total: 2862.50, status: 'Enviado', address: 'Av. Paulista, 1000, São Paulo - SP', products: [{ id: 103, name: "Brincos de Safira 'Azul Real'", qty: 1, price: 2850.00 }], paymentMethod: 'Boleto Bancário', shipping: 12.50 },
    { id: '#3453', client: { name: 'Fernanda Montenegro', id: 9, cpf: '333.444.555-66' }, date: '2025-08-09', total: 7118.00, status: 'Entregue', address: 'Rua das Estrelas, 100, Rio de Janeiro - RJ', products: [{ id: 104, name: "Pulseira de Rubi 'Eterna'", qty: 2, price: 3550.00 }], paymentMethod: 'Cartão de Crédito', shipping: 18.00 },
    { id: '#3452', client: { name: 'Golden Treinamento', id: 3, cpf: '612.096.820-55' }, date: '2025-08-09', total: 1800.00, status: 'Cancelado', address: 'Av. da Inovação, 2000, São Paulo - SP', products: [{ id: 105, name: "Pingente de Opala 'Galáxia'", qty: 1, price: 1800.00 }], paymentMethod: 'PIX', shipping: 0.00 },
    { id: '#3451', client: { name: 'Eduardo Lopes Cardoso', id: 2, cpf: '046.690.486-00' }, date: '2025-08-08', total: 4500.00, status: 'Processando', address: 'Rua dos Testes, 123, Curitiba - PR', products: [{ id: 101, name: "Anel de Diamante 'Solitário'", qty: 1, price: 4500.00 }], paymentMethod: 'Cartão de Crédito', shipping: 0.00 },
];

const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const ITEMS_PER_PAGE = 5;

// --- Hook e Componente de Dropdown Customizado ---
const useOutsideAlerter = (ref, callback) => { useEffect(() => { function handleClickOutside(event) { if (ref.current && !ref.current.contains(event.target)) { callback(); } } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [ref, callback]); }
const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false); const wrapperRef = useRef(null); useOutsideAlerter(wrapperRef, () => setIsOpen(false));
    return (
        <div className="custom-dropdown-container-ord" ref={wrapperRef}>
            <button className="dropdown-header-ord" onClick={() => setIsOpen(!isOpen)}>{options.find(opt => opt.value === selected)?.label || placeholder}<i className={`fa-solid fa-chevron-down ${isOpen ? 'open' : ''}`}></i></button>
            {isOpen && (<ul className="dropdown-list-ord">{options.map(option => (<li key={option.value} onClick={() => { onSelect(option.value); setIsOpen(false); }}>{option.label}</li>))}</ul>)}
        </div>
    );
};

// --- Componente do Modal de Detalhes ---
const OrderDetailsModal = ({ order, onClose, isClosing }) => (
    <div className={`modal-backdrop-ord ${isClosing ? 'closing' : ''}`} onClick={onClose}>
        <div className={`modal-content-ord ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="modal-header-ord"><h3>Pedido {order.id}</h3><button onClick={onClose}><i className="fa-solid fa-xmark"></i></button></div>
            <div className="order-details-body">
                <div className="detail-section"><h4>Cliente</h4><p><strong>Nome:</strong> {order.client.name}</p><p><strong>CPF:</strong> {order.client.cpf}</p><p><strong>Endereço de Entrega:</strong> {order.address}</p></div>
                <div className="detail-section"><h4>Produtos</h4><ul className="product-list-ord">{order.products.map(p => (<li key={p.id}><span className="product-qty">{p.qty}x</span><span className="product-name">{p.name}</span><span className="product-price">{formatCurrency(p.price * p.qty)}</span></li>))}</ul></div>
                <div className="detail-section payment-shipping">
                     <div><h4>Pagamento</h4><p>{order.paymentMethod}</p><p><strong>Frete:</strong> {formatCurrency(order.shipping)}</p><p className="total-value"><strong>Total:</strong> {formatCurrency(order.total)}</p></div>
                    <div><h4>Status do Pedido</h4><select className="status-select-ord" defaultValue={order.status}><option>Aguardando Pagamento</option><option>Pagamento Aprovado</option><option>Processando</option><option>Enviado</option><option>Entregue</option><option>Cancelado</option></select><button className="update-status-btn">Atualizar Status</button></div>
                </div>
            </div>
        </div>
    </div>
);

// --- Componente Principal da Página ---
function OrdersPage() {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isClosing, setIsClosing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState({ searchTerm: '', status: 'Todos', sort: 'date_desc' });

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };
    
    const handleOpenModal = (order) => { setSelectedOrder(order); };
    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setSelectedOrder(null);
            setIsClosing(false);
        }, 300);
    };

    const orderStatusCounts = useMemo(() => {
        return staticOrders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});
    }, []);

    const filteredOrders = useMemo(() => {
        let orders = staticOrders
            .filter(order => 
                order.client.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                order.client.cpf.includes(filters.searchTerm) ||
                order.id.toLowerCase().includes(filters.searchTerm.toLowerCase())
            )
            .filter(order => filters.status === 'Todos' || order.status === filters.status);

        orders.sort((a, b) => {
            switch(filters.sort) {
                case 'value_desc': return b.total - a.total;
                case 'value_asc': return a.total - b.total;
                case 'date_asc': return new Date(a.date) - new Date(b.date);
                default: return new Date(b.date) - new Date(a.date);
            }
        });
        return orders;
    }, [filters]);

    const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="orders-page-container">
            <header className="orders-page-header">
                <h1>Pedidos</h1>
                <p>Gerencie e processe os pedidos da sua loja.</p>
            </header>

            <section className="order-kpi-card">
                <div className="kpi-total">
                    <p>Total de Pedidos</p>
                    <span>{staticOrders.length}</span>
                </div>
                <div className="kpi-divider"></div>
                <div className="kpi-status-breakdown">
                    <div className="status-item"><span>{orderStatusCounts['Processando'] || 0}</span><p>Processando</p></div>
                    <div className="status-item"><span>{orderStatusCounts['Pagamento Aprovado'] || 0}</span><p>Aprovados</p></div>
                    <div className="status-item"><span>{orderStatusCounts['Enviado'] || 0}</span><p>Enviados</p></div>
                    <div className="status-item"><span>{orderStatusCounts['Entregue'] || 0}</span><p>Entregues</p></div>
                    <div className="status-item"><span>{orderStatusCounts['Cancelado'] || 0}</span><p>Cancelados</p></div>
                </div>
            </section>

            <div className="table-controls-header-ord">
                <div className="search-box-ord">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Buscar por cliente, CPF ou ID do pedido..." onChange={(e) => handleFilterChange('searchTerm', e.target.value)} />
                </div>
                <div className="filters-ord">
                    <CustomDropdown 
                        placeholder="Status"
                        options={[
                            { value: 'Todos', label: 'Todos os Status' },
                            { value: 'Processando', label: 'Processando' },
                            { value: 'Pagamento Aprovado', label: 'Pagamento Aprovado' },
                            { value: 'Enviado', label: 'Enviado' },
                            { value: 'Entregue', label: 'Entregue' },
                            { value: 'Cancelado', label: 'Cancelado' },
                        ]}
                        selected={filters.status}
                        onSelect={(value) => handleFilterChange('status', value)}
                    />
                    <CustomDropdown 
                        placeholder="Ordenar por"
                        options={[
                            { value: 'date_desc', label: 'Mais Recentes' },
                            { value: 'date_asc', label: 'Mais Antigos' },
                            { value: 'value_desc', label: 'Maior Valor' },
                            { value: 'value_asc', label: 'Menor Valor' },
                        ]}
                        selected={filters.sort}
                        onSelect={(value) => handleFilterChange('sort', value)}
                    />
                </div>
            </div>

            <div className="orders-table-card">
                <table className="orders-table">
                    <thead><tr><th>ID do Pedido</th><th>Cliente</th><th>Data</th><th>Total</th><th>Status</th></tr></thead>
                    <tbody>
                        {paginatedOrders.map(order => (
                            <tr key={order.id} onClick={() => handleOpenModal(order)}>
                                <td>{order.id}</td>
                                <td>{order.client.name}</td>
                                <td>{new Date(order.date).toLocaleDateString('pt-BR')}</td>
                                <td>{formatCurrency(order.total)}</td>
                                <td><span className={`status-badge-ord status-${order.status.replace(/\s+/g, '-').toLowerCase()}`}>{order.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination-container-ord">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Anterior</button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Próxima</button>
                </div>
            </div>

            {selectedOrder && <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default OrdersPage;