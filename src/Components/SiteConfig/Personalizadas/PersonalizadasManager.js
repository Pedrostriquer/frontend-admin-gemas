import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Importações atualizadas
import './PersonalizadasManager.css';

// Estrutura de dados padrão completa para a página, incluindo todos os campos editáveis
const defaultPageData = {
    hero: { title: "Crie a Sua Peça Única", subtitle: "Gemas Brilhantes: Onde o brilho revela valor." },
    intro: { title: "Bem-vindo ao Ateliê da Gemas Brilhantes", text1: "As joias sempre foram reconhecidas...", text2: "Em cada peça que criamos..." },
    benefits: {
        title: "Os Benefícios de Ter Uma Joia Feita Sob Medida",
        items: [
            { id: 1, icon: 'fas fa-arrow-trend-up', title: 'Valorização do Capital', text: 'Ao encomendar uma jóia conosco, você tem acesso...' },
            { id: 2, icon: 'fas fa-shield-halved', title: 'Proteção Contra Crises', text: 'Enquanto ativos financeiros oscilam...' },
            { id: 3, icon: 'fas fa-plane-departure', title: 'Mobilidade e Liquidez', text: 'Uma joia concentra grande valor...' },
            { id: 4, icon: 'fas fa-crown', title: 'Herança de Valor', text: 'Feita para durar gerações...' },
            { id: 5, icon: 'fas fa-gem', title: 'Controle de Materiais', text: 'Escolha metais nobres de maior pureza...' },
            { id: 6, icon: 'fas fa-star', title: 'Exclusividade Incomparável', text: 'Tenha a certeza de possuir uma joia...' }
        ]
    },
    quote: { text: "Uma joia feita sob medida é muito mais do que um símbolo de status..." },
    howItWorks: { title: "Como Funciona Nossa Consultoria Personalizada" },
    form: { title: "Pronto para Começar a Criar Sua Joia?", subtitle: "Preencha o formulário abaixo...", footerText: "Após o envio, um de nossos especialistas..." }
};

const PersonalizadasManager = () => {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchContent = async () => {
            const docRef = doc(db, 'siteContent', 'personalizadasPage');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const firestoreData = docSnap.data();
                setPageData({
                    ...defaultPageData,
                    ...firestoreData,
                    benefits: { ...defaultPageData.benefits, ...firestoreData.benefits }
                });
            } else {
                setPageData(defaultPageData);
            }
            setLoading(false);
        };

        fetchContent();
    }, []);

    const handleChange = (section, field, value, index = null) => {
        setPageData(prev => {
            const newData = JSON.parse(JSON.stringify(prev));
            if (section === 'benefits' && field === 'items') {
                newData.benefits.items[index].text = value;
            } else {
                newData[section][field] = value;
            }
            return newData;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await setDoc(doc(db, 'siteContent', 'personalizadasPage'), pageData, { merge: true });
            alert("Conteúdo salvo com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar o conteúdo.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || !pageData) {
        return <p>Carregando...</p>;
    }

    return (
        <div className="manage-personalizadas-container">
            <h1 className="fonte-principal">Gerenciar Página "Joias"</h1>

            <div className="content-editor">
                <div className="management-section">
                    <h3 className="editor-title">Seção Hero (Banner Superior)</h3>
                    <div className="form-group"> <label>Título</label> <input type="text" value={pageData.hero.title} onChange={e => handleChange('hero', 'title', e.target.value)} /> </div>
                    <div className="form-group"> <label>Subtítulo</label> <input type="text" value={pageData.hero.subtitle} onChange={e => handleChange('hero', 'subtitle', e.target.value)} /> </div>
                </div>
                <div className="management-section">
                    <h3 className="editor-title">Seção de Introdução</h3>
                    <div className="form-group"> <label>Título</label> <input type="text" value={pageData.intro.title} onChange={e => handleChange('intro', 'title', e.target.value)} /> </div>
                    <div className="form-group"> <label>Primeiro Parágrafo</label> <textarea value={pageData.intro.text1} onChange={e => handleChange('intro', 'text1', e.target.value)} rows="4" /> </div>
                    <div className="form-group"> <label>Segundo Parágrafo</label> <textarea value={pageData.intro.text2} onChange={e => handleChange('intro', 'text2', e.target.value)} rows="4" /> </div>
                </div>
                <div className="management-section">
                    <h3 className="editor-title">Seção de Benefícios</h3>
                    <div className="form-group">
                        <label>Título da Seção</label>
                        <input type="text" value={pageData.benefits.title} onChange={e => handleChange('benefits', 'title', e.target.value)} />
                    </div>
                    <div className="benefits-editor-grid">
                        {pageData.benefits.items.map((item, index) => (
                            <div className="benefit-editor-item" key={item.id}>
                                <label><i className={item.icon}></i> {item.title}</label>
                                <textarea
                                    value={item.text}
                                    onChange={e => handleChange('benefits', 'items', e.target.value, index)}
                                    rows="4"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="management-section">
                    <h3 className="editor-title">Seção de Citação</h3>
                    <div className="form-group"> <label>Texto da Citação</label> <textarea value={pageData.quote.text} onChange={e => handleChange('quote', 'text', e.target.value)} rows="4" /> </div>
                </div>
                <div className="management-section">
                    <h3 className="editor-title">Seção "Como Funciona"</h3>
                    <div className="form-group"> <label>Título</label> <input type="text" value={pageData.howItWorks.title} onChange={e => handleChange('howItWorks', 'title', e.target.value)} /> </div>
                </div>
                <div className="management-section">
                    <h3 className="editor-title">Seção do Formulário</h3>
                    <div className="form-group"> <label>Título</label> <input type="text" value={pageData.form.title} onChange={e => handleChange('form', 'title', e.target.value)} /> </div>
                    <div className="form-group"> <label>Subtítulo</label> <textarea value={pageData.form.subtitle} onChange={e => handleChange('form', 'subtitle', e.target.value)} rows="2" /> </div>
                    <div className="form-group"> <label>Texto do Rodapé do Formulário</label> <textarea value={pageData.form.footerText} onChange={e => handleChange('form', 'footerText', e.target.value)} rows="2" /> </div>
                </div>
                <button onClick={handleSave} className="save-btn-full" disabled={isSaving}>
                    {isSaving ? 'Salvando...' : 'Salvar Todo o Conteúdo da Página'}
                </button>
            </div>
        </div>
    );
};

export default PersonalizadasManager;