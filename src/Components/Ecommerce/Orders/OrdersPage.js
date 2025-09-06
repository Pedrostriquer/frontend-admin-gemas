import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import './OrdersPage.css';
import saleServices from '../../../dbServices/saleServices';
import productServices from '../../../dbServices/productServices'; // Importa o serviço de produtos
import { useAuth } from '../../../Context/AuthContext';

const formatCurrency = (value) => (value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleString('pt-BR') : 'N/A';
const ITEMS_PER_PAGE = 10;

const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const useOutsideAlerter = (ref, callback) => { useEffect(() => { function handleClickOutside(event) { if (ref.current && !ref.current.contains(event.target)) { callback(); } } document.addEventListener("mousedown", handleClickOutside); return () => document.removeEventListener("mousedown", handleClickOutside); }, [ref, callback]); }
const CustomDropdown = ({ options, selected, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false); const wrapperRef = useRef(null); useOutsideAlerter(wrapperRef, () => setIsOpen(false));
    return (
        <div className="custom-dropdown-container-ord" ref={wrapperRef}>
            <button type="button" className="dropdown-header-ord" onClick={() => setIsOpen(!isOpen)}>{options.find(opt => opt.value === selected)?.label || placeholder}<i className={`fa-solid fa-chevron-down ${isOpen ? 'open' : ''}`}></i></button>
            {isOpen && (<ul className="dropdown-list-ord">{options.map(option => (<li key={option.value} onClick={() => { onSelect(option.value); setIsOpen(false); }}>{option.label}</li>))}</ul>)}
        </div>
    );
};

const OrderDetailsModal = ({ order, onUpdateStatus, onClose, isClosing }) => {
    const { token } = useAuth();
    const [detailedItems, setDetailedItems] = useState([]);
    const [isLoadingItems, setIsLoadingItems] = useState(true);
    const [currentStatus, setCurrentStatus] = useState(order.status);
    
    useEffect(() => {
        const fetchItemsAndProducts = async () => {
            if (!order.id || !token) return;
            setIsLoadingItems(true);
            try {
                const saleItems = await saleServices.getSaleItems(token, order.id);
                const productPromises = saleItems.map(item => productServices.getProductById(item.productId));
                const products = await Promise.all(productPromises);
                const combinedItems = saleItems.map(item => {
                    const productDetails = products.find(p => p.id === item.productId);
                    return { ...item, product: productDetails };
                });
                setDetailedItems(combinedItems);
            } catch (error) {
                console.error("Falha ao buscar detalhes dos itens da venda:", error);
                setDetailedItems([]);
            } finally {
                setIsLoadingItems(false);
            }
        };
        fetchItemsAndProducts();
    }, [order.id, token]);
    
    if (!order) return null;

    const whatsappLink = `https://wa.me/55${order.client.phoneNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${order.client.name}, sobre seu pedido #${order.id}...`)}`;
    const address = order.shippingAddress;
    const fullAddress = `${address.street}, ${address.number}, ${address.neighborhood} - ${address.city}/${address.state}, CEP: ${address.zipcode}`;

    return (
        <div className={`modal-backdrop-ord ${isClosing ? 'closing' : ''}`} onClick={onClose}>
            <div className={`modal-content-ord ${isClosing ? 'closing' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header-ord"><h3>Pedido #{order.id}</h3><button onClick={onClose}><i className="fa-solid fa-xmark"></i></button></div>
                <div className="order-details-body">
                    <div className="details-grid">
                        <div className="detail-section client-info"><h4><i className="fa-solid fa-user"></i> Cliente</h4><p><strong>ID:</strong> #{order.client.id}</p><p><strong>Nome:</strong> {order.client.name}</p><p><strong>Email:</strong> {order.client.email}</p><p><strong>Telefone:</strong> {order.client.phoneNumber}</p></div>
                        <div className="detail-section shipping-info"><h4><i className="fa-solid fa-truck"></i> Endereço de Entrega</h4><p>{fullAddress}</p></div>
                        {order.consultant && (<div className="detail-section consultant-info"><h4><i className="fa-solid fa-user-tie"></i> Consultor Associado</h4><p><strong>ID:</strong> #{order.consultant.id}</p><p><strong>Nome:</strong> {order.consultant.name}</p></div>)}
                    </div>
                    <div className="detail-section">
                        <h4><i className="fa-solid fa-gem"></i> Produtos</h4>
                        {isLoadingItems ? <p>Carregando produtos...</p> : (
                            <ul className="product-list-ord">
                                {detailedItems.map(item => (
                                    <li key={item.product.id}>
                                        <span className="product-qty">{item.quantity}x</span>
                                        <span className="product-name">{item.product.name}</span>
                                        <span className="product-price">{formatCurrency(item.unitPrice * item.quantity)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="detail-section payment-shipping">
                         <div><h4><i className="fa-solid fa-dollar-sign"></i> Pagamento</h4><p className="total-value"><strong>Total:</strong> {formatCurrency(order.totalValue)}</p></div>
                        <div><h4><i className="fa-solid fa-info-circle"></i> Status do Pedido</h4><select className="status-select-ord" value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)}><option value="PendingPayment">Aguardando Pagamento</option><option value="Processing">Processando</option><option value="Shipped">Enviado</option><option value="Delivered">Entregue</option><option value="Cancelled">Cancelado</option><option value="Refunded">Reembolsado</option></select><button className="update-status-btn" onClick={() => onUpdateStatus(order.id, currentStatus)}>Atualizar Status</button></div>
                    </div>
                </div>
                 <div className="modal-footer-ord">
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="whatsapp-btn-ord">
                        <i className="fab fa-whatsapp"></i> Entrar em Contato
                    </a>
                </div>
            </div>
        </div>
    );
};

function OrdersPage() {
    const { token } = useAuth();
    const [orders, setOrders] = useState([]);
    const [allOrdersForKpi, setAllOrdersForKpi] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isClosing, setIsClosing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({ searchTerm: '', sort: 'desc' });
    const debouncedSearchTerm = useDebounce(filters.searchTerm, 500);

    const fetchOrders = useCallback(async (page, currentFilters) => {
        if (!token) return;
        setIsLoading(true);
        try {
            const data = await saleServices.getAllSales(token, currentFilters, page, ITEMS_PER_PAGE);
            setOrders(data.items || []);
            setTotalPages(data.totalPages || 1);
            if(page === 1 && !currentFilters.searchTerm) {
                 const allData = await saleServices.getAllSales(token, { sort: 'desc' }, 1, 1000);
                 setAllOrdersForKpi(allData.items || []);
            }
        } catch (error) {
            alert("Não foi possível carregar os pedidos.");
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchOrders(currentPage, { ...filters, searchTerm: debouncedSearchTerm });
    }, [debouncedSearchTerm, filters.sort, currentPage, fetchOrders]);

    const handleFilterChange = (name, value) => setFilters(prev => ({ ...prev, [name]: value }));
    const handleOpenModal = (order) => setSelectedOrder(order);
    const handleCloseModal = () => {
        setIsClosing(true);
        setTimeout(() => { setSelectedOrder(null); setIsClosing(false); }, 300);
    };
    
    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await saleServices.updateSaleStatus(token, orderId, newStatus);
            handleCloseModal();
            fetchOrders(currentPage, filters);
        } catch (error) {
            alert("Erro ao atualizar o status do pedido.");
        }
    };
    
    const orderStatusCounts = useMemo(() => {
        return allOrdersForKpi.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});
    }, [allOrdersForKpi]);

    return (
        <div className="orders-page-container">
            <header className="orders-page-header"><h1>Pedidos</h1><p>Gerencie e processe os pedidos da sua loja.</p></header>
            <section className="order-kpi-card">
                <div className="kpi-total"><p>Total de Pedidos</p><span>{allOrdersForKpi.length}</span></div>
                <div className="kpi-divider"></div>
                <div className="kpi-status-breakdown">
                    <div className="status-item"><span>{orderStatusCounts['PendingPayment'] || 0}</span><p>Pag. Pendente</p></div>
                    <div className="status-item"><span>{orderStatusCounts['Processing'] || 0}</span><p>Processando</p></div>
                    <div className="status-item"><span>{orderStatusCounts['Shipped'] || 0}</span><p>Enviados</p></div>
                    <div className="status-item"><span>{orderStatusCounts['Delivered'] || 0}</span><p>Entregues</p></div>
                    <div className="status-item"><span>{orderStatusCounts['Cancelled'] || 0}</span><p>Cancelados</p></div>
                </div>
            </section>

            <div className="table-controls-header-ord">
                <div className="search-box-ord"><i className="fa-solid fa-magnifying-glass"></i><input type="text" placeholder="Buscar por cliente ou ID..." value={filters.searchTerm} onChange={(e) => handleFilterChange('searchTerm', e.target.value)} /></div>
                <div className="filters-ord">
                    <CustomDropdown placeholder="Ordenar por" options={[{ value: 'desc', label: 'Mais Recentes' }, { value: 'asc', label: 'Mais Antigos' }]} selected={filters.sort} onSelect={(value) => handleFilterChange('sort', value)} />
                </div>
            </div>

            <div className="orders-table-card">
                <table className="orders-table">
                    <thead><tr><th>ID do Pedido</th><th>Cliente</th><th>Data</th><th>Total</th><th>Status</th></tr></thead>
                    <tbody>
                        {isLoading ? (<tr><td colSpan="5" className="loading-cell">Buscando pedidos...</td></tr>) 
                        : orders.length > 0 ? (orders.map(order => (
                            <tr key={order.id} onClick={() => handleOpenModal(order)}>
                                <td>#{order.id}</td>
                                <td>{order.client.name}</td>
                                <td>{formatDate(order.saleDate)}</td>
                                <td>{formatCurrency(order.totalValue)}</td>
                                <td><span className={`status-badge-ord status-${order.status.toLowerCase()}`}>{order.status}</span></td>
                            </tr>
                        ))) 
                        : (<tr><td colSpan="5" className="no-results-cell">Nenhum pedido encontrado.</td></tr>)}
                    </tbody>
                </table>
                <div className="pagination-container-ord">
                    <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Anterior</button>
                    <span>Página {currentPage} de {totalPages}</span>
                    <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Próxima</button>
                </div>
            </div>

            {selectedOrder && <OrderDetailsModal order={selectedOrder} onUpdateStatus={handleUpdateStatus} onClose={handleCloseModal} isClosing={isClosing} />}
        </div>
    );
}

export default OrdersPage;