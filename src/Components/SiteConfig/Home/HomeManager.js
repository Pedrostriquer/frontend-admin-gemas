import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../../firebase/config';
import { v4 as uuidv4 } from 'uuid';
import './HomeManager.css';

const defaultHomeData = {
    banner: { speed: 5000, width: 1920, height: 550, slides: [], showBanner: true },
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
        gemas: { title: 'Gemas Brilhantes Selecionadas', text: '', buttonText: 'Saiba Mais', mediaSrc: '', mediaType: 'image', isVisible: true, order: 1 },
        gemcash: { title: 'GemCash: Seu Brilho, Seu Benefício', text: '', buttonText: 'Conheça o GemCash', mediaSrc: '', mediaType: 'image', isVisible: true, order: 2 },
        joias: { title: 'Joias que Contam Histórias', text: '', buttonText: 'Saiba Mais', mediaSrc: '', mediaType: 'image', isVisible: true, order: 3 }
    },
    faq: [],
    reviews: []
};

const defaultFooterData = {
    phones: [
        { number: '', label: '' },
        { number: '', label: '' }
    ],
    email: '',
    whatsappNumber: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    youtube: '',
    addresses: []
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

                if (homeDocSnap.exists()) {
                    const firestoreData = homeDocSnap.data();
                    const globalShowArrows = firestoreData.banner?.showArrows ?? true;
                    const migratedSlides = (firestoreData.banner?.slides || []).map(slide => ({
                        ...slide,
                        showArrows: slide.showArrows ?? globalShowArrows,
                        isVisible: slide.isVisible ?? true
                    }));

                    setHomeData({
                        banner: {
                            ...defaultHomeData.banner,
                            ...firestoreData.banner,
                            slides: migratedSlides
                        },
                        aboutSection: { ...defaultHomeData.aboutSection, ...firestoreData.aboutSection },
                        featureSections: {
                            gemas: { ...defaultHomeData.featureSections.gemas, ...firestoreData.featureSections?.gemas },
                            gemcash: { ...defaultHomeData.featureSections.gemcash, ...firestoreData.featureSections?.gemcash },
                            joias: { ...defaultHomeData.featureSections.joias, ...firestoreData.featureSections?.joias }
                        },
                        faq: firestoreData.faq || defaultHomeData.faq,
                        reviews: firestoreData.reviews || defaultHomeData.reviews
                    });
                } else {
                    setHomeData(defaultHomeData);
                }

                if (footerDocSnap.exists()) {
                    const firestoreData = footerDocSnap.data();
                    let phones = firestoreData.phones || [{ number: firestoreData.phone || '', label: '' }];
                    while (phones.length < 2) {
                        phones.push({ number: '', label: '' });
                    }
                    let addresses = firestoreData.addresses || [];
                    if (!firestoreData.addresses && firestoreData.addressLink) {
                        addresses.push({
                            id: uuidv4(),
                            title: firestoreData.addressTitle || 'Nosso Endereço',
                            link: firestoreData.addressLink,
                            show: true
                        });
                    }
                    setFooterData({ ...defaultFooterData, ...firestoreData, phones: phones.slice(0, 2), addresses });
                } else {
                    setFooterData(defaultFooterData);
                }

            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                setHomeData(defaultHomeData);
                setFooterData(defaultFooterData);
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

    const handlePhoneChange = (index, field, value) => {
        setFooterData(prev => {
            const newPhones = JSON.parse(JSON.stringify(prev.phones || defaultFooterData.phones));
            newPhones[index] = { ...newPhones[index], [field]: value };
            return { ...prev, phones: newPhones };
        });
    };

    const handleAddressChange = (index, field, value) => {
        setFooterData(prev => {
            const newAddresses = [...prev.addresses];
            newAddresses[index] = { ...newAddresses[index], [field]: value };
            return { ...prev, addresses: newAddresses };
        });
    };

    const handleAddAddress = () => {
        setFooterData(prev => ({
            ...prev,
            addresses: [
                ...(prev.addresses || []),
                { id: uuidv4(), title: '', link: '', show: true }
            ]
        }));
    };

    const handleRemoveAddress = (indexToRemove) => {
        setFooterData(prev => ({
            ...prev,
            addresses: prev.addresses.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleMediaUpload = async (path, file) => {
        if (!file) return;
        setIsUploading(true);
        try {
            const fileRef = ref(storage, `site_home/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            handleDataChange(path, downloadURL);
            const finalKey = path[path.length - 1];
            if (finalKey === 'src' || finalKey === 'mediaSrc') {
                const typePath = [...path];
                typePath[path.length - 1] = finalKey === 'src' ? 'type' : 'mediaType';
                const mediaType = file.type.startsWith('video') ? 'video' : 'image';
                handleDataChange(typePath, mediaType);
            }
        } catch (error) {
            alert("Falha no upload.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDynamicListChange = (section, index, field, value) => handleDataChange([section, index, field], value);

    const handleAddListItem = (section, newItem) => {
        if (section === 'banner.slides') {
            const newSlide = {
                id: uuidv4(), type: 'image', src: '', link: '',
                overlay: { show: true, title: '', subtitle: '', buttonText: '', buttonLink: '' },
                duration: 5000,
                playUntilEnd: false,
                loopVideo: true, // NOVO: Adiciona a propriedade de loop por padrão
                showArrows: true,
                isVisible: true
            };
            const currentSlides = homeData.banner.slides || [];
            handleDataChange(['banner', 'slides'], [...currentSlides, newSlide]);
        } else {
            handleDataChange([section], [...(homeData[section] || []), newItem]);
        }
    };

    const handleRemoveListItem = (sectionPath, indexToRemove) => {
        setHomeData(prevData => {
            const newData = JSON.parse(JSON.stringify(prevData));
            const path = sectionPath.split('.');
            let parent = newData;
            for (let i = 0; i < path.length - 1; i++) {
                parent = parent[path[i]];
            }
            const listKey = path[path.length - 1];
            parent[listKey].splice(indexToRemove, 1);
            return newData;
        });
    };

    const handleSlideChange = (index, field, value) => handleDataChange(['banner', 'slides', index, field], value);
    const handleOverlayChange = (index, field, value) => handleDataChange(['banner', 'slides', index, 'overlay', field], value);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const homeDocRef = doc(db, 'siteContent', 'homePage');
            const footerDocRef = doc(db, 'siteContent', 'footer');

            const finalHomeData = JSON.parse(JSON.stringify(homeData));
            if (finalHomeData.banner) {
                delete finalHomeData.banner.showArrows;
            }

            const finalFooterData = JSON.parse(JSON.stringify(footerData));
            if (finalFooterData.phones && finalFooterData.phones[1] && !finalFooterData.phones[1].number && !finalFooterData.phones[1].label) {
                finalFooterData.phones.pop();
            }
            delete finalFooterData.phone;
            delete finalFooterData.addressLink;
            delete finalFooterData.addressTitle;

            await Promise.all([
                setDoc(homeDocRef, finalHomeData, { merge: true }),
                setDoc(footerDocRef, finalFooterData, { merge: true })
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
            <div className="manage-home-header">
                <h1>Gerenciar Página Home e Rodapé</h1>
            </div>

            {/* Banner Editor */}
            <div className="management-section">
                <h3 className="editor-title">Banner Principal</h3>
                <div className="editor-controls-grid">
                    <div className="control-group"><label>Largura (px)</label><input type="number" value={homeData.banner.width} onChange={e => handleDataChange(['banner', 'width'], Number(e.target.value))} /></div>
                    <div className="control-group"><label>Altura (px)</label><input type="number" value={homeData.banner.height} onChange={e => handleDataChange(['banner', 'height'], Number(e.target.value))} /></div>
                    <div className="control-group checkbox">
                        <input
                            type="checkbox"
                            id="showBanner"
                            checked={homeData.banner.showBanner ?? true}
                            onChange={(e) => handleDataChange(['banner', 'showBanner'], e.target.checked)}
                        />
                        <label htmlFor="showBanner">Exibir banner no site</label>
                    </div>
                </div>
                <h4 className="slides-title">Slides</h4>
                <div className="slides-editor-list">
                    {(homeData.banner.slides || []).map((slide, index) => (
                        <div className="slide-editor-card" key={slide.id || index}>
                            <div className="slide-media-controls">
                                <div className="slide-preview">{slide.src ? (slide.type === 'video' ? <video src={slide.src} muted loop autoPlay playsInline /> : <img src={slide.src} alt="Preview" />) : (<div className="no-media-placeholder">Mídia</div>)}</div>
                                <div className="slide-inputs">
                                    <input type="file" id={`upload-${slide.id}`} className="hidden-file-input" onChange={(e) => handleMediaUpload(['banner', 'slides', index, 'src'], e.target.files[0])} accept="image/*,video/*"/>
                                    <label htmlFor={`upload-${slide.id}`} className="btn-secondary"><i className="fas fa-upload"></i> Trocar</label>
                                    <input type="text" value={slide.link || ''} onChange={(e) => handleSlideChange(index, 'link', e.target.value)} placeholder="Link de redirecionamento do slide"/>
                                    <button onClick={() => handleRemoveListItem('banner.slides', index)} className="btn-remove"><i className="fas fa-trash"></i></button>
                                </div>
                            </div>
                            <div className="slide-timing-controls">
                                <div className="control-group">
                                    <label htmlFor={`duration-${slide.id}`}>Duração (ms)</label>
                                    <input
                                        type="number"
                                        id={`duration-${slide.id}`}
                                        value={slide.duration ?? ''}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            handleSlideChange(index, 'duration', value === '' ? '' : Number(value));
                                        }}
                                        step="500"
                                        disabled={slide.playUntilEnd || false}
                                    />
                                </div>
                                {slide.type === 'video' && (
                                    <>
                                        <div className="control-group checkbox">
                                            <input
                                                type="checkbox"
                                                id={`playUntilEnd-${slide.id}`}
                                                checked={slide.playUntilEnd || false}
                                                onChange={(e) => handleSlideChange(index, 'playUntilEnd', e.target.checked)}
                                            />
                                            <label htmlFor={`playUntilEnd-${slide.id}`}>Exibir vídeo até o final</label>
                                        </div>
                                        {/* NOVO CHECKBOX DE LOOP */}
                                        <div className="control-group checkbox">
                                            <input
                                                type="checkbox"
                                                id={`loopVideo-${slide.id}`}
                                                checked={slide.loopVideo ?? false}
                                                onChange={(e) => handleSlideChange(index, 'loopVideo', e.target.checked)}
                                            />
                                            <label htmlFor={`loopVideo-${slide.id}`}>Ficar em loop (repetir)</label>
                                        </div>
                                    </>
                                )}
                                <div className="control-group checkbox">
                                    <input
                                        type="checkbox"
                                        id={`showArrows-${slide.id}`}
                                        checked={slide.showArrows ?? true}
                                        onChange={(e) => handleSlideChange(index, 'showArrows', e.target.checked)}
                                    />
                                    <label htmlFor={`showArrows-${slide.id}`}>Exibir setas de navegação</label>
                                </div>
                                <div className="control-group checkbox">
                                    <input
                                        type="checkbox"
                                        id={`isVisible-${slide.id}`}
                                        checked={slide.isVisible ?? true}
                                        onChange={(e) => handleSlideChange(index, 'isVisible', e.target.checked)}
                                    />
                                    <label htmlFor={`isVisible-${slide.id}`}>Exibir este slide</label>
                                </div>
                            </div>
                            <div className="slide-overlay-controls">
                                <div className="overlay-header"><h5>Conteúdo Sobreposto</h5><div className="control-group checkbox"><input type="checkbox" id={`showOverlay-${slide.id}`} checked={slide.overlay?.show ?? true} onChange={(e) => handleOverlayChange(index, 'show', e.target.checked)} /><label htmlFor={`showOverlay-${slide.id}`}>Exibir</label></div></div>
                                {(slide.overlay?.show ?? true) && (
                                    <div className="overlay-fields">
                                        <input type="text" value={slide.overlay?.title || ''} onChange={(e) => handleOverlayChange(index, 'title', e.target.value)} placeholder="Título (ex: GemCash)" />
                                        <input type="text" value={slide.overlay?.subtitle || ''} onChange={(e) => handleOverlayChange(index, 'subtitle', e.target.value)} placeholder="Subtítulo / Frase" />
                                        <input type="text" value={slide.overlay?.buttonText || ''} onChange={(e) => handleOverlayChange(index, 'buttonText', e.target.value)} placeholder="Texto do Botão" />
                                        <input type="text" value={slide.overlay?.buttonLink || ''} onChange={(e) => handleOverlayChange(index, 'buttonLink', e.target.value)} placeholder="Link do Botão" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="editor-actions">
                    <button onClick={() => handleAddListItem('banner.slides')} className="btn-primary">Adicionar Slide</button>
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
                <div className="feature-sections-grid">
                    {Object.keys(homeData.featureSections).map(key => (
                        <div key={key} className="feature-editor-card">
                            <h4>Seção "{key.charAt(0).toUpperCase() + key.slice(1)}"</h4>
                            <div className="editor-controls-grid" style={{ marginBottom: '1rem', gridTemplateColumns: '1fr 100px' }}>
                                <div className="control-group checkbox">
                                    <input
                                        type="checkbox"
                                        id={`feature-visible-${key}`}
                                        checked={homeData.featureSections[key].isVisible ?? true}
                                        onChange={e => handleDataChange(['featureSections', key, 'isVisible'], e.target.checked)}
                                    />
                                    <label htmlFor={`feature-visible-${key}`}>Exibir esta seção</label>
                                </div>
                                <div className="control-group">
                                    <label>Ordem</label>
                                    <input
                                        type="number"
                                        value={homeData.featureSections[key].order || ''}
                                        onChange={e => handleDataChange(['featureSections', key, 'order'], Number(e.target.value))}
                                        style={{ maxWidth: '80px' }}
                                    />
                                </div>
                            </div>
                            <div className="form-group"><label>Título</label><input type="text" value={homeData.featureSections[key].title} onChange={e => handleDataChange(['featureSections', key, 'title'], e.target.value)} /></div>
                            <div className="form-group"><label>Texto</label><textarea value={homeData.featureSections[key].text} onChange={e => handleDataChange(['featureSections', key, 'text'], e.target.value)} rows="4" /></div>
                            <div className="form-group"><label>Texto do Botão</label><input type="text" value={homeData.featureSections[key].buttonText} onChange={e => handleDataChange(['featureSections', key, 'buttonText'], e.target.value)} /></div>
                            <div className="form-group media-group">
                                <label>Mídia</label>
                                {homeData.featureSections[key].mediaSrc && <div className="media-preview">{homeData.featureSections[key].mediaType === 'video' ? <video src={homeData.featureSections[key].mediaSrc} muted loop autoPlay /> : <img src={homeData.featureSections[key].mediaSrc} alt="Preview"/>}</div>}
                                <input type="file" id={`${key}-media`} className="hidden-file-input" onChange={(e) => handleMediaUpload(['featureSections', key, 'mediaSrc'], e.target.files[0])} accept="image/*,video/*" />
                                <label htmlFor={`${key}-media`} className="btn-secondary small">Trocar Mídia</label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* FAQ Editor */}
            <div className="management-section">
                <h3 className="editor-title">FAQ (Perguntas Frequentes)</h3>
                <div className="dynamic-list">
                    {(homeData.faq || []).map((item, index) => (
                        <div className="dynamic-list-item" key={item.id || index}>
                            <div className="item-inputs">
                                <input type="text" value={item.question} onChange={(e) => handleDynamicListChange('faq', index, 'question', e.target.value)} placeholder="Pergunta" className="item-input-title" />
                                <textarea value={item.answer} onChange={(e) => handleDynamicListChange('faq', index, 'answer', e.target.value)} placeholder="Resposta" rows="3" />
                            </div>
                            <button onClick={() => handleRemoveListItem('faq', index)} className="btn-remove"><i className="fas fa-trash"></i></button>
                        </div>
                    ))}
                </div>
                <div className="editor-actions">
                    <button onClick={() => handleAddListItem('faq', { id: uuidv4(), question: '', answer: '' })} className="btn-primary">Adicionar Pergunta</button>
                </div>
            </div>

            {/* Reviews Editor */}
            <div className="management-section">
                <h3 className="editor-title">Avaliações de Clientes</h3>
                <div className="dynamic-list">
                    {(homeData.reviews || []).map((item, index) => (
                        <div className="dynamic-list-item" key={item.id || index}>
                            <div className="item-inputs">
                                <input type="text" value={item.name} onChange={(e) => handleDynamicListChange('reviews', index, 'name', e.target.value)} placeholder="Nome do Cliente" className="item-input-title" />
                                <textarea value={item.comment} onChange={(e) => handleDynamicListChange('reviews', index, 'comment', e.target.value)} placeholder="Comentário" rows="3" />
                            </div>
                            <button onClick={() => handleRemoveListItem('reviews', index)} className="btn-remove"><i className="fas fa-trash"></i></button>
                        </div>
                    ))}
                </div>
                <div className="editor-actions">
                    <button onClick={() => handleAddListItem('reviews', { id: uuidv4(), name: '', comment: '' })} className="btn-primary">Adicionar Avaliação</button>
                </div>
            </div>

            {/* Footer Editor */}
            <div className="management-section">
                <h3 className="editor-title">Gerenciar Rodapé</h3>
                <div className="footer-editor-form-grid">
                    <div className="form-group-compound">
                        <label>Telefone Principal</label>
                        <div className="input-group">
                            <input
                                type="text"
                                value={footerData?.phones[0]?.number || ''}
                                onChange={(e) => handlePhoneChange(0, 'number', e.target.value)}
                                placeholder="Nº Principal. Ex: (11) 99999-8888"
                            />
                            <input
                                type="text"
                                value={footerData?.phones[0]?.label || ''}
                                onChange={(e) => handlePhoneChange(0, 'label', e.target.value)}
                                placeholder="Texto opcional. Ex: WhatsApp"
                            />
                        </div>
                    </div>
                    <div className="form-group-compound">
                        <label>Telefone Opcional</label>
                        <div className="input-group">
                            <input
                                type="text"
                                value={footerData?.phones[1]?.number || ''}
                                onChange={(e) => handlePhoneChange(1, 'number', e.target.value)}
                                placeholder="Nº Opcional"
                            />
                            <input
                                type="text"
                                value={footerData?.phones[1]?.label || ''}
                                onChange={(e) => handlePhoneChange(1, 'label', e.target.value)}
                                placeholder="Texto opcional"
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" name="email" value={footerData.email || ''} onChange={handleFooterChange} placeholder="Ex: contato@gemasbrilhantes.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="whatsappNumber">Nº WhatsApp (para o botão)</label>
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
                    <div className="form-group">
                        <label htmlFor="tiktok">Link do TikTok</label>
                        <input type="url" id="tiktok" name="tiktok" value={footerData.tiktok || ''} onChange={handleFooterChange} placeholder="https://www.tiktok.com/@..." />
                    </div>
                    <div className="form-group">
                        <label htmlFor="youtube">Link do YouTube</label>
                        <input type="url" id="youtube" name="youtube" value={footerData.youtube || ''} onChange={handleFooterChange} placeholder="https://www.youtube.com/c/..." />
                    </div>
                </div>

                <div className="sub-section">
                    <h4 className="editor-title">Endereços</h4>
                    <div className="dynamic-list">
                        {(footerData.addresses || []).map((address, index) => (
                            <div className="dynamic-list-item" key={address.id || index}>
                                <div className="item-inputs">
                                    <input
                                        type="text"
                                        value={address.title}
                                        onChange={(e) => handleAddressChange(index, 'title', e.target.value)}
                                        placeholder="Título do Endereço (Ex: Loja São Paulo)"
                                        className="item-input-title"
                                    />
                                    <input
                                        type="url"
                                        value={address.link}
                                        onChange={(e) => handleAddressChange(index, 'link', e.target.value)}
                                        placeholder="Link do Google Maps"
                                    />
                                    <div className="control-group checkbox" style={{ marginTop: '10px' }}>
                                        <input
                                            type="checkbox"
                                            id={`showAddress-${address.id}`}
                                            checked={address.show}
                                            onChange={(e) => handleAddressChange(index, 'show', e.target.checked)}
                                        />
                                        <label htmlFor={`showAddress-${address.id}`}>Exibir este endereço no site</label>
                                    </div>
                                </div>
                                <button onClick={() => handleRemoveAddress(index)} className="btn-remove"><i className="fas fa-trash"></i></button>
                            </div>
                        ))}
                    </div>
                    <div className="editor-actions">
                        <button onClick={handleAddAddress} className="btn-primary">Adicionar Endereço</button>
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