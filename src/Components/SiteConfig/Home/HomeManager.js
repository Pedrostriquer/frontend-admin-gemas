import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase/config';
import { v4 as uuidv4 } from 'uuid';
import './HomeManager.css';

const defaultHomeData = {
    banner: { speed: 5000, showArrows: true, width: 1920, height: 550, slides: [] },
    aboutSection: { 
        quemSomosTitle: 'Quem Somos',
        quemSomosText1: '',
        quemSomosText2: '',
        propositoTitle: 'Nosso Propósito',
        propositoText: '',
        oQueFazemosTitle: 'O Que Fazemos',
        oQueFazemosText: '',
        valoresTitle: 'Nossos Valores Essenciais',
        values: [
            { id: 1, icon: "fas fa-medal", title: "Excelência em Curadoria", text: "" },
            { id: 2, icon: "fas fa-shield-alt", title: "Transparência e Credibilidade", text: "" },
            { id: 3, icon: "fas fa-lightbulb", title: "Inovação Acessível", text: "" },
            { id: 4, icon: "fas fa-comments", title: "Atendimento Consultivo", text: "" },
            { id: 5, icon: "fas fa-infinity", title: "Valor Duradouro", text: "" }
        ]
    },
    featureSections: {
        gemas: { title: 'Gemas Brilhantes Selecionadas', text: '', buttonText: 'Saiba Mais', mediaSrc: '', mediaType: 'image' },
        gemcash: { title: 'GemCash: Seu Brilho, Seu Benefício', text: '', buttonText: 'Conheça o GemCash', mediaSrc: '', mediaType: 'image' },
        joias: { title: 'Joias que Contam Histórias', text: '', buttonText: 'Saiba Mais', mediaSrc: '', mediaType: 'image' }
    },
    faq: [],
    reviews: []
};

const HomeManager = () => {
    const [homeData, setHomeData] = useState(null);
    const [footerData, setFooterData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const homeDocRef = doc(db, 'siteContent', 'homePage');
            const footerDocRef = doc(db, 'siteContent', 'footer');

            try {
                const [homeDocSnap, footerDocSnap] = await Promise.all([
                    getDoc(homeDocRef),
                    getDoc(footerDocRef)
                ]);

                // Processa dados da Home
                if (homeDocSnap.exists()) {
                    const firestoreData = homeDocSnap.data();
                    setHomeData({ 
                        banner: { ...defaultHomeData.banner, ...firestoreData.banner },
                        aboutSection: { ...defaultHomeData.aboutSection, ...firestoreData.aboutSection },
                        featureSections: { ...defaultHomeData.featureSections, ...firestoreData.featureSections },
                        faq: firestoreData.faq || defaultHomeData.faq,
                        reviews: firestoreData.reviews || defaultHomeData.reviews
                    });
                } else {
                    setHomeData(defaultHomeData);
                }

                // Processa dados do Rodapé
                if (footerDocSnap.exists()) {
                    setFooterData(footerDocSnap.data());
                } else {
                    setFooterData({ phone: '', email: '', whatsappNumber: '', instagram: '', facebook: '' });
                }

            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                setHomeData(defaultHomeData);
                setFooterData({ phone: '', email: '', whatsappNumber: '', instagram: '', facebook: '' });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleDataChange = (path, value) => {
        setHomeData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            let current = newData;
            for (let i = 0; i < path.length - 1; i++) {
                if (current[path[i]] === undefined) { current[path[i]] = {}; }
                current = current[path[i]];
            }
            current[path[path.length - 1]] = value;
            return newData;
        });
    };
    
    const handleFooterChange = (e) => {
        const { name, value } = e.target;
        setFooterData(prev => ({ ...prev, [name]: value }));
    };

    const handleMediaUpload = async (path, file) => {
        if (!file) return;
        setIsUploading(true);
        try {
            const fileRef = ref(storage, `site_home/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            const newPath = [...path];
            const finalKey = newPath.pop();
            
            let current = { ...homeData };
            let parent = current;
            for (let i = 0; i < newPath.length; i++) { parent = parent[newPath[i]]; }

            parent[finalKey] = downloadURL;
            if (finalKey === 'src' || finalKey === 'mediaSrc') {
                const typeKey = finalKey === 'src' ? 'type' : 'mediaType';
                parent[typeKey] = file.type.startsWith('video') ? 'video' : 'image';
            }
            setHomeData(current);
        } catch (error) {
            alert("Falha no upload.");
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleDynamicListChange = (section, index, field, value) => handleDataChange([section, index, field], value);
    const handleAddListItem = (section, newItem) => handleDataChange([section], [...(homeData[section] || []), newItem]);
    const handleRemoveListItem = (section, indexToRemove) => {
        const path = section.split('.');
        let currentList = homeData;
        for (let i = 0; i < path.length; i++) {
            currentList = currentList[path[i]];
        }
        handleDataChange(path, currentList.filter((_, i) => i !== indexToRemove));
    };
    
    const handleSlideChange = (index, fieldPath, value) => handleDataChange(['banner', 'slides', index, ...fieldPath], value);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const homeDocRef = doc(db, 'siteContent', 'homePage');
            const footerDocRef = doc(db, 'siteContent', 'footer');
            
            await Promise.all([
                setDoc(homeDocRef, homeData, { merge: true }),
                setDoc(footerDocRef, footerData, { merge: true })
            ]);

            alert("Conteúdo da Home e do Rodapé salvos com sucesso!");
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar o conteúdo.");
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading || !homeData || !footerData) return <p className="loading-message">Carregando...</p>;

    return (
        <div className="manage-home-container">
            <div className="manage-home-header"><h1>Gerenciar Página Home e Rodapé</h1></div>

            {/* Banner Editor */}
            <div className="management-section">
                <h3 className="editor-title">Banner Principal</h3>
                <div className="editor-controls-grid">
                    <div className="control-group"><label>Largura (px)</label><input type="number" value={homeData.banner.width} onChange={e => handleDataChange(['banner', 'width'], Number(e.target.value))} /></div>
                    <div className="control-group"><label>Altura (px)</label><input type="number" value={homeData.banner.height} onChange={e => handleDataChange(['banner', 'height'], Number(e.target.value))} /></div>
                    <div className="control-group"><label>Velocidade (ms)</label><input type="number" value={homeData.banner.speed} onChange={e => handleDataChange(['banner', 'speed'], Number(e.target.value))} step="500" /><span>0 para desativar</span></div>
                    <div className="control-group checkbox"><input type="checkbox" id="showArrows" checked={homeData.banner.showArrows} onChange={(e) => handleDataChange(['banner', 'showArrows'], e.target.checked)} /><label htmlFor="showArrows">Exibir setas</label></div>
                </div>
                <h4 className="slides-title">Slides</h4>
                <div className="slides-editor-list">
                    {(homeData.banner.slides || []).map((slide, index) => (
                        <div className="slide-editor-card" key={slide.id || index}>
                            <div className="slide-media-controls">
                                <div className="slide-preview">{slide.src ? (slide.type === 'video' ? <video src={slide.src} muted loop autoPlay playsInline /> : <img src={slide.src} alt="Preview" />) : (<div className="no-media-placeholder">Selecione Mídia</div>)}</div>
                                <div className="slide-inputs">
                                    <input type="file" id={`upload-${slide.id}`} className="hidden-file-input" onChange={(e) => handleMediaUpload(['banner', 'slides', index, 'src'], e.target.files[0])} accept="image/*,video/*"/>
                                    <label htmlFor={`upload-${slide.id}`} className="upload-btn"><i className="fas fa-upload"></i> Mídia</label>
                                    <input type="text" value={slide.link || ''} onChange={(e) => handleSlideChange(index, ['link'], e.target.value)} placeholder="Link de redirecionamento"/>
                                    <button onClick={() => handleRemoveListItem('banner.slides', index)} className="remove-btn">&times;</button>
                                </div>
                            </div>
                            <div className="slide-overlay-controls">
                                <div className="overlay-header"><h5>Conteúdo Sobreposto</h5><div className="control-group checkbox"><input type="checkbox" id={`showOverlay-${slide.id}`} checked={slide.overlay?.show ?? true} onChange={(e) => handleSlideChange(index, ['overlay', 'show'], e.target.checked)} /><label htmlFor={`showOverlay-${slide.id}`}>Exibir</label></div></div>
                                {(slide.overlay?.show ?? true) && (
                                    <div className="overlay-fields">
                                        <input type="text" value={slide.overlay?.title || ''} onChange={(e) => handleSlideChange(index, ['overlay', 'title'], e.target.value)} placeholder="Título (ex: GemCash)" />
                                        <input type="text" value={slide.overlay?.subtitle || ''} onChange={(e) => handleSlideChange(index, ['overlay', 'subtitle'], e.target.value)} placeholder="Subtítulo / Frase" />
                                        <input type="text" value={slide.overlay?.buttonText || ''} onChange={(e) => handleSlideChange(index, ['overlay', 'buttonText'], e.target.value)} placeholder="Texto do Botão" />
                                        <input type="text" value={slide.overlay?.buttonLink || ''} onChange={(e) => handleSlideChange(index, ['overlay', 'buttonLink'], e.target.value)} placeholder="Link do Botão" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="editor-actions">
                    <button onClick={() => handleAddListItem('banner.slides', { id: uuidv4(), type: 'image', src: '', link: '', overlay: { show: true, title: '', subtitle: '', buttonText: '', buttonLink: '' } })} className="add-slide-btn">Adicionar Slide</button>
                </div>
            </div>

            {/* About Section Editor */}
            <div className="management-section">
                <h3 className="editor-title">Seção "Sobre"</h3>
                <div className="sub-section">
                    <h4>Quem Somos</h4>
                    <div className="form-group"><label>Título</label><input type="text" value={homeData.aboutSection.quemSomosTitle} onChange={e => handleDataChange(['aboutSection', 'quemSomosTitle'], e.target.value)} /></div>
                    <div className="form-group"><label>Parágrafo 1</label><textarea value={homeData.aboutSection.quemSomosText1} onChange={e => handleDataChange(['aboutSection', 'quemSomosText1'], e.target.value)} rows="5" /></div>
                    <div className="form-group"><label>Parágrafo 2</label><textarea value={homeData.aboutSection.quemSomosText2} onChange={e => handleDataChange(['aboutSection', 'quemSomosText2'], e.target.value)} rows="5" /></div>
                </div>
                <div className="sub-section columns-grid">
                    <div>
                        <h4>Nosso Propósito</h4>
                        <div className="form-group"><label>Título</label><input type="text" value={homeData.aboutSection.propositoTitle} onChange={e => handleDataChange(['aboutSection', 'propositoTitle'], e.target.value)} /></div>
                        <div className="form-group"><label>Texto</label><textarea value={homeData.aboutSection.propositoText} onChange={e => handleDataChange(['aboutSection', 'propositoText'], e.target.value)} rows="4" /></div>
                    </div>
                    <div>
                        <h4>O Que Fazemos</h4>
                        <div className="form-group"><label>Título</label><input type="text" value={homeData.aboutSection.oQueFazemosTitle} onChange={e => handleDataChange(['aboutSection', 'oQueFazemosTitle'], e.target.value)} /></div>
                        <div className="form-group"><label>Texto</label><textarea value={homeData.aboutSection.oQueFazemosText} onChange={e => handleDataChange(['aboutSection', 'oQueFazemosText'], e.target.value)} rows="4" /></div>
                    </div>
                </div>
                <div className="sub-section">
                    <h4>Nossos Valores Essenciais</h4>
                    <div className="values-editor-grid">
                        {homeData.aboutSection.values.map((value, index) => (
                            <div className="value-editor-card" key={value.id}>
                                <div className="form-group"><label><i className={value.icon}></i> Título do Card</label><input type="text" value={value.title} onChange={e => handleDataChange(['aboutSection', 'values', index, 'title'], e.target.value)} /></div>
                                <div className="form-group"><label>Texto do Card</label><textarea value={value.text} onChange={e => handleDataChange(['aboutSection', 'values', index, 'text'], e.target.value)} rows="4" /></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feature Sections Editor */}
            <div className="management-section">
                <h3 className="editor-title">Seções de Destaque</h3>
                <div className="sections-container">
                    {Object.keys(homeData.featureSections).map(key => (
                        <div key={key} className="feature-editor-card">
                            <h4>Seção "{key.charAt(0).toUpperCase() + key.slice(1)}"</h4>
                            <div className="form-group"><label>Título</label><input type="text" value={homeData.featureSections[key].title} onChange={e => handleDataChange(['featureSections', key, 'title'], e.target.value)} /></div>
                            <div className="form-group"><label>Texto</label><textarea value={homeData.featureSections[key].text} onChange={e => handleDataChange(['featureSections', key, 'text'], e.target.value)} rows="4" /></div>
                            <div className="form-group"><label>Texto do Botão</label><input type="text" value={homeData.featureSections[key].buttonText} onChange={e => handleDataChange(['featureSections', key, 'buttonText'], e.target.value)} /></div>
                            <div className="form-group media-group">
                                <label>Mídia</label>
                                {homeData.featureSections[key].mediaSrc && <div className="media-preview">{homeData.featureSections[key].mediaType === 'video' ? <video src={homeData.featureSections[key].mediaSrc} muted loop autoPlay /> : <img src={homeData.featureSections[key].mediaSrc} alt="Preview"/>}</div>}
                                <input type="file" id={`${key}-media`} className="hidden-file-input" onChange={(e) => handleMediaUpload(['featureSections', key, 'mediaSrc'], e.target.files[0])} accept="image/*,video/*" />
                                <label htmlFor={`${key}-media`} className="upload-btn small">Trocar Mídia</label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Editor */}
            <div className="management-section">
                <h3 className="editor-title">FAQ (Perguntas Frequentes)</h3>
                <div className="faq-items-list">
                    {homeData.faq.map((item, index) => (
                        <div className="faq-editor-item" key={item.id || index}>
                            <input type="text" value={item.question} onChange={(e) => handleDynamicListChange('faq', index, 'question', e.target.value)} placeholder="Pergunta" className="faq-input question" />
                            <textarea value={item.answer} onChange={(e) => handleDynamicListChange('faq', index, 'answer', e.target.value)} placeholder="Resposta" rows="3" className="faq-input answer" />
                            <button onClick={() => handleRemoveListItem('faq', index)} className="remove-faq-btn">&times;</button>
                        </div>
                    ))}
                </div>
                <div className="editor-actions">
                    <button onClick={() => handleAddListItem('faq', { id: uuidv4(), question: '', answer: '' })} className="add-faq-btn">Adicionar Pergunta</button>
                </div>
            </div>

            {/* Reviews Editor */}
            <div className="management-section">
                <h3 className="editor-title">Avaliações de Clientes</h3>
                <div className="reviews-items-list">
                    {homeData.reviews.map((item, index) => (
                        <div className="review-editor-item" key={item.id || index}>
                            <input type="text" value={item.name} onChange={(e) => handleDynamicListChange('reviews', index, 'name', e.target.value)} placeholder="Nome do Cliente" className="review-input name" />
                            <textarea value={item.comment} onChange={(e) => handleDynamicListChange('reviews', index, 'comment', e.target.value)} placeholder="Comentário / Depoimento" rows="3" className="review-input comment" />
                            <button onClick={() => handleRemoveListItem('reviews', index)} className="remove-review-btn">&times;</button>
                        </div>
                    ))}
                </div>
                <div className="editor-actions">
                    <button onClick={() => handleAddListItem('reviews', { id: uuidv4(), name: '', comment: '' })} className="add-review-btn">Adicionar Avaliação</button>
                </div>
            </div>
            
            {/* Footer Editor */}
            <div className="management-section">
                <h3 className="editor-title">Gerenciar Rodapé</h3>
                <div className="footer-editor-form-grid">
                    <div className="form-group">
                        <label htmlFor="phone">Telefone</label>
                        <input type="text" id="phone" name="phone" value={footerData.phone || ''} onChange={handleFooterChange} placeholder="Ex: (11) 99999-8888" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={footerData.email || ''} onChange={handleFooterChange} placeholder="Ex: contato@gemasbrilhantes.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="whatsappNumber">Número do WhatsApp (com código do país)</label>
                        <input type="text" id="whatsappNumber" name="whatsappNumber" value={footerData.whatsappNumber || ''} onChange={handleFooterChange} placeholder="Ex: 5511999998888" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="instagram">Link do Instagram</label>
                        <input type="url" id="instagram" name="instagram" value={footerData.instagram || ''} onChange={handleFooterChange} placeholder="https://www.instagram.com/..." />
                    </div>
                    <div className="form-group">
                        <label htmlFor="facebook">Link do Facebook</label>
                        <input type="url" id="facebook" name="facebook" value={footerData.facebook || ''} onChange={handleFooterChange} placeholder="https://www.facebook.com/..." />
                    </div>
                </div>
            </div>
            
            <button onClick={handleSave} className="save-btn-full" disabled={isSaving || isUploading}>
                {isSaving ? 'Salvando...' : (isUploading ? 'Aguarde o upload...' : 'Salvar Todas as Alterações')}
            </button>
        </div>
    );
};

export default HomeManager;