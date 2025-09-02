import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import './GemCashManager.css';

const defaultGemCashData = {
    intro: { title: "GemCash: Seu Brilho, Seu Benefício Mensal.", subtitle: "Adquira gemas de alto padrão certificadas e transforme seu patrimônio em remuneração financeira exclusiva, com total autonomia." },
    problemSolution: {
        mainTitle: "O Futuro dos Ativos Reais",
        subtitle: "Em um mundo de investimentos voláteis e digitais, a segurança de um ativo físico e valioso é inigualável. Veja por que GemCash redefine o conceito de investimento seguro.",
        traditionalTitle: "Ativos Tradicionais",
        traditionalPoints: [
            { id: 1, title: "Volatilidade Alta", description: "Mercados que flutuam com notícias e especulações, colocando seu patrimônio em risco constante." },
            { id: 2, title: "Intangível e Abstrato", description: "Você possui números em uma tela, sem a segurança de um bem físico que pode guardar ou tocar." },
            { id: 3, title: "Taxas Ocultas", description: "Corretagens, taxas de administração e impostos que corroem seus lucros silenciosamente." }
        ],
        solutionTitle: "GemCash",
        solutionPoints: [
            { id: 1, title: "Valor Estável e Crescente", description: "Gemas preciosas são reservas de valor milenares, com valorização consistente e baixa volatilidade." },
            { id: 2, title: "Posse Física Real", description: "O ativo é seu. Receba em casa ou mantenha em custódia segura, com a garantia de posse total." },
            { id: 3, title: "Transparência Total", description: "Sem taxas surpresa. Você sabe exatamente o valor do seu ativo e os lucros que ele gera." }
        ]
    },
    howItWorks: {
        mainTitle: "GemCash em Detalhes: Seu Patrimônio Brilhante e Lucrativo",
        details: [
            { id: 1, title: "Gemas Certificadas", characteristic: "Aquisição de diamantes e gemas de alto padrão (turmalinas, safiras, rubis, esmeraldas, tanzanitas).", benefit: "Autenticidade e valor de mercado garantidos por certificações globais (GIA, IGI, IGL entre outros)." },
            { id: 2, title: "Posse Autônoma", characteristic: "Escolha entre receber a gema fisicamente (com seguro) ou mantê-la sob custódia.", benefit: "Total controle sobre seu patrimônio e flexibilidade de uso." },
            { id: 3, title: "Remuneração Mensal", characteristic: "Receba um benefício financeiro mensal sobre o valor da aquisição por 12 meses (com opções de prazos estendidos).", benefit: "Um fluxo de renda constante que agrega valor ao seu patrimônio." },
            { id: 4, title: "Flexibilidade no Recebimento", characteristic: "Decida mensalmente entre sacar (modelo simples) ou acumular (modelo composto) a remuneração.", benefit: "Adapte seus ganhos, potencializando retornos ou obtendo liquidez imediata." },
            { id: 5, title: "Transparência Online", characteristic: "Acesse sua Área do Cliente para acompanhar remunerações e gerenciar sua compra.", benefit: "Controle e visibilidade total, com processo transparente." },
            { id: 6, title: "Liberdade Final", characteristic: "Ao final do período, devolva a gema e reaveja o valor integral, ou mantenha-a.", benefit: "Máxima autonomia na decisão do destino do seu ativo." }
        ]
    }
};

const GemCashManager = () => {
    const [gemCashData, setGemCashData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const docRef = doc(db, 'siteContent', 'gemCashPage');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const firestoreData = docSnap.data();
                setGemCashData({
                    intro: { ...defaultGemCashData.intro, ...firestoreData.intro },
                    problemSolution: { ...defaultGemCashData.problemSolution, ...firestoreData.problemSolution },
                    howItWorks: { ...defaultGemCashData.howItWorks, ...firestoreData.howItWorks }
                });
            } else {
                setGemCashData(defaultGemCashData);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleChange = (section, field, value, index = null, pointType = null) => {
        setGemCashData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            if (section === 'problemSolution' && pointType) {
                newData.problemSolution[pointType][index][field] = value;
            } else if (section === 'howItWorks' && index !== null) {
                newData.howItWorks.details[index][field] = value;
            } else {
                newData[section][field] = value;
            }
            return newData;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const docRef = doc(db, 'siteContent', 'gemCashPage');
            await setDoc(docRef, gemCashData, { merge: true });
            alert("Página GemCash salva com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Falha ao salvar a página.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !gemCashData) return <p className="loading-message">Carregando gerenciador da GemCash...</p>;

    return (
        <div className="manage-gemcash-container">
            <div className="manage-page-header">
                <h1 className="fonte-principal">Gerenciar Página GemCash</h1>
                <button onClick={handleSave} className="save-btn" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar Todas as Alterações'}
                </button>
            </div>
            <div className="management-section">
                <h3 className="editor-title">Seção de Introdução</h3>
                <div className="form-group">
                    <label>Título Principal</label>
                    <input type="text" value={gemCashData.intro.title} onChange={e => handleChange('intro', 'title', e.target.value)} />
                </div>
                <div className="form-group">
                    <label>Subtítulo</label>
                    <textarea value={gemCashData.intro.subtitle} onChange={e => handleChange('intro', 'subtitle', e.target.value)} rows="3" />
                </div>
            </div>
            <div className="management-section">
                <h3 className="editor-title">Seção "Problema & Solução"</h3>
                <div className="form-group">
                    <label>Título da Seção</label>
                    <input type="text" value={gemCashData.problemSolution.mainTitle} onChange={e => handleChange('problemSolution', 'mainTitle', e.target.value)} />
                </div>
                 <div className="form-group">
                    <label>Subtítulo da Seção</label>
                    <textarea value={gemCashData.problemSolution.subtitle} onChange={e => handleChange('problemSolution', 'subtitle', e.target.value)} rows="3"/>
                 </div>
                 <div className="ps-editor-grid">
                    <div className="ps-column">
                        <input type="text" className="column-title-input" value={gemCashData.problemSolution.traditionalTitle} onChange={e => handleChange('problemSolution', 'traditionalTitle', e.target.value)} />
                        {gemCashData.problemSolution.traditionalPoints.map((point, index) => (
                            <div className="ps-point-editor" key={point.id}>
                                <input type="text" value={point.title} onChange={e => handleChange('problemSolution', 'title', e.target.value, index, 'traditionalPoints')} placeholder="Título do Ponto"/>
                                <textarea value={point.description} onChange={e => handleChange('problemSolution', 'description', e.target.value, index, 'traditionalPoints')} rows="3" placeholder="Descrição do Ponto"/>
                            </div>
                        ))}
                    </div>
                    <div className="ps-column">
                       <input type="text" className="column-title-input" value={gemCashData.problemSolution.solutionTitle} onChange={e => handleChange('problemSolution', 'solutionTitle', e.target.value)} />
                         {gemCashData.problemSolution.solutionPoints.map((point, index) => (
                            <div className="ps-point-editor" key={point.id}>
                                <input type="text" value={point.title} onChange={e => handleChange('problemSolution', 'title', e.target.value, index, 'solutionPoints')} placeholder="Título do Ponto"/>
                                <textarea value={point.description} onChange={e => handleChange('problemSolution', 'description', e.target.value, index, 'solutionPoints')} rows="3" placeholder="Descrição do Ponto"/>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
             <div className="management-section">
                <h3 className="editor-title">Seção "Como Funciona / Detalhes"</h3>
                <div className="form-group">
                    <label>Título da Seção</label>
                    <input type="text" value={gemCashData.howItWorks.mainTitle} onChange={e => handleChange('howItWorks', 'mainTitle', e.target.value)} />
                </div>
                <div className="hiw-details-grid">
                    {gemCashData.howItWorks.details.map((item, index) => (
                        <div className="hiw-detail-editor" key={item.id}>
                            <div className="form-group">
                                <label>Título do Item</label>
                                <input type="text" value={item.title} onChange={e => handleChange('howItWorks', 'title', e.target.value, index)} />
                            </div>
                            <div className="form-group">
                                <label>Característica</label>
                                <textarea value={item.characteristic} onChange={e => handleChange('howItWorks', 'characteristic', e.target.value, index)} rows="3"/>
                            </div>
                            <div className="form-group">
                                <label>Benefício</label>
                                <textarea value={item.benefit} onChange={e => handleChange('howItWorks', 'benefit', e.target.value, index)} rows="3"/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GemCashManager;