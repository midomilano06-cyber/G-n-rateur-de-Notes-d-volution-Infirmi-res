
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { sectionsData, painFieldsData, initialPainState, scenariosData, defaultLayoutSettings } from './constants';
import type { FormState, PainState, Option, SavedState, LayoutSettings } from './types';
import CollapsibleSection from './components/CollapsibleSection';
import RadioGroup from './components/RadioGroup';
import CheckboxGroup from './components/CheckboxGroup';
import PainSection from './components/PainSection';
import GeneratedNote from './components/GeneratedNote';
import Header from './components/Header';
import Footer from './components/Footer';
import ParticularitesSection from './components/ParticularitesSection';
import AccessCodeScreen from './components/AccessCodeScreen';
import ChangePasswordModal from './components/ChangePasswordModal';
import QuickScenarios from './components/QuickScenarios';
import AdmissionSection from './components/AdmissionSection';
import SaveLoad from './components/SaveLoad';

const App: React.FC = () => {
  const [accessCode, setAccessCode] = useState<string>(() => localStorage.getItem('APP_ACCESS_CODE') || '19960213');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessError, setAccessError] = useState<string | null>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
        return localStorage.getItem('theme') as 'light' | 'dark';
    }
    return 'light'; // Default theme
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const initialFormState: FormState = useMemo(() => ({
    quart: '',
    gender: '',
    // Admission
    admissionCheckboxes: [],
    orientation: [],
    autonomie: '',
    effetsPersonnels: '',
    accesVeineux: false,
    accesVeineux_gauge: '',
    accesVeineux_site: '',
    piccLine: false,
    piccLine_site: '',
    drains: [],
    sondes: [],
    // Sections
    position: [],
    etatEveil: '',
    signesVitaux: '',
    signesNeuro: '',
    respiratoire: [],
    respiratoire_medicament: '',
    respiratoire_interventions: [],
    respiratoire_o2_litres: '',
    digestif: [],
    digestif_medicament: '',
    digestif_interventions: [],
    urinaire: [],
    urinaire_medicament: '',
    urinaire_interventions: [],
    tegumentaire: [],
    tegumentaire_medicament: '',
    tegumentaire_interventions: [],
    geriatrie: [],
    douleur: initialPainState,
    observations: [],
    visites: '',
    particularites: '',
  }), []);

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [aiNote, setAiNote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const [savedStates, setSavedStates] = useState<Record<string, SavedState>>({});
  
  const [settings, setSettings] = useState<LayoutSettings>(() => {
    try {
        const savedSettings = localStorage.getItem('noteLayoutSettings');
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            // One-time migration for old fontSize format (multiplier) to new format (points)
            if (parsed.fontSize && parsed.fontSize < 7) {
                parsed.fontSize = parsed.fontSize * 5;
            }
            return { ...defaultLayoutSettings, ...parsed };
        }
        return defaultLayoutSettings;
    } catch (e) {
        console.error("Failed to parse layout settings from localStorage", e);
        return defaultLayoutSettings;
    }
  });

  useEffect(() => {
    localStorage.setItem('noteLayoutSettings', JSON.stringify(settings));
  }, [settings]);

    useEffect(() => {
        const loadedSaves: Record<string, SavedState> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith('nurse-note-save-')) {
                try {
                    const savedData = JSON.parse(localStorage.getItem(key)!);
                    const name = key.replace('nurse-note-save-', '');
                     if (savedData.formState) {
                        loadedSaves[name] = {
                            formState: savedData.formState,
                            aiNote: savedData.aiNote || '',
                            layoutSettings: savedData.layoutSettings || defaultLayoutSettings,
                        };
                    } else {
                        loadedSaves[name] = { formState: savedData as FormState, aiNote: '', layoutSettings: defaultLayoutSettings };
                    }
                } catch (e) {
                    console.error(`Failed to parse saved state for key: ${key}`, e);
                }
            }
        }
        setSavedStates(loadedSaves);
    }, []);


  const handleSectionToggle = useCallback((sectionId: string) => {
    setOpenSectionId(prevId => (prevId === sectionId ? null : sectionId));
  }, []);

  const isAdmissionSectionFilled = useMemo((): boolean => {
    const { admissionCheckboxes, orientation, autonomie, effetsPersonnels, accesVeineux, piccLine, drains, sondes, accesVeineux_site, piccLine_site } = formState;
    return admissionCheckboxes.length > 0 || orientation.length > 0 || autonomie !== '' || effetsPersonnels.trim() !== '' || accesVeineux || piccLine || drains.length > 0 || sondes.length > 0 || accesVeineux_site.trim() !== '' || piccLine_site.trim() !== '';
  }, [formState]);


  const isSectionFilled = useCallback((sectionId: keyof FormState | 'douleur' | 'particularites', state: FormState): boolean => {
    if (sectionId === 'douleur') {
      const { p, q, r, s, t, u, site, medicament, interventionsNonPharma } = state.douleur;
      return p.length > 0 || q.length > 0 || r.length > 0 || s !== '' || t.length > 0 || u.length > 0 || site.trim() !== '' || medicament.trim() !== '' || interventionsNonPharma.length > 0;
    }
    if (sectionId === 'particularites') {
      return state.particularites.trim() !== '';
    }
    const value = state[sectionId as keyof FormState];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    return false;
  }, []);

  const handleRadioChange = useCallback((sectionId: keyof FormState, value: string) => {
    setFormState(prevState => ({ ...prevState, [sectionId]: value }));
  }, []);

  const handleCheckboxChange = useCallback((sectionId: keyof FormState, value: string) => {
    setFormState(prevState => {
      const currentValues = prevState[sectionId] as string[];
      const newValues = currentValues.includes(value) ? currentValues.filter(item => item !== value) : [...currentValues, value];
      return { ...prevState, [sectionId]: newValues };
    });
  }, []);

  const handlePainCheckboxChange = useCallback((field: keyof PainState, value: string) => {
    setFormState(prevState => {
      const currentValues = prevState.douleur[field] as string[];
      const newValues = currentValues.includes(value) ? currentValues.filter(item => item !== value) : [...currentValues, value];
      return { ...prevState, douleur: { ...prevState.douleur, [field]: newValues } };
    });
  }, []);

  const handlePainRadioChange = useCallback((field: keyof PainState, value: string) => {
      setFormState(prevState => ({ ...prevState, douleur: { ...prevState.douleur, [field]: value } }));
  }, []);

  const handlePainSiteChange = useCallback((value: string) => {
    setFormState(prevState => ({ ...prevState, douleur: { ...prevState.douleur, site: value } }));
  }, []);

  const handleParticularitesChange = useCallback((value: string) => {
    setFormState(prevState => ({ ...prevState, particularites: value }));
  }, []);

  const handleMedicamentChange = useCallback((sectionId: string, value: string) => {
    const key = `${sectionId}_medicament` as keyof FormState;
    setFormState(prevState => ({ ...prevState, [key]: value }));
  }, []);

  const handleInterventionChange = useCallback((sectionId: string, value: string) => {
    const key = `${sectionId}_interventions` as keyof FormState;
    setFormState(prevState => {
      const currentValues = prevState[key] as string[];
      const newValues = currentValues.includes(value) ? currentValues.filter(item => item !== value) : [...currentValues, value];
      return { ...prevState, [key]: newValues };
    });
  }, []);

  const handlePainMedicamentChange = useCallback((value: string) => {
    setFormState(prevState => ({ ...prevState, douleur: { ...prevState.douleur, medicament: value } }));
  }, []);

  const handlePainNonPharmaChange = useCallback((value: string) => {
    setFormState(prevState => {
      const currentValues = prevState.douleur.interventionsNonPharma;
      const newValues = currentValues.includes(value) ? currentValues.filter(item => item !== value) : [...currentValues, value];
      return { ...prevState, douleur: { ...prevState.douleur, interventionsNonPharma: newValues } };
    });
  }, []);

  const handleRespiratoireO2LitresChange = useCallback((value: string) => {
    setFormState(prevState => ({ ...prevState, respiratoire_o2_litres: value }));
  }, []);

  const handleAdmissionChange = useCallback((field: keyof FormState, value: string | boolean | string[]) => {
      setFormState(prevState => ({...prevState, [field]: value}));
  }, [])

  const resetForm = useCallback(() => {
    setFormState(initialFormState);
    setAiNote('');
    setGenerationError(null);
    setIsGenerating(false);
  }, [initialFormState]);

  const handleScenarioSelect = useCallback((scenarioState: Partial<FormState>) => {
    setFormState(prevState => ({ ...initialFormState, quart: prevState.quart, gender: prevState.gender, ...scenarioState }));
    setOpenSectionId(null);
  }, [initialFormState]);

  const isFormEmpty = useMemo(() => {
    const { quart, gender, ...restOfForm } = formState;
    const { quart: initialQuart, gender: initialGender, ...restOfInitialForm } = initialFormState;
    return JSON.stringify(restOfForm) === JSON.stringify(restOfInitialForm);
  }, [formState, initialFormState]);
  
  const buildClinicalData = (state: FormState): string => {
    const parts: string[] = [];
    const { douleur, particularites, quart, gender } = state;
    
    if (quart) parts.push(`Contexte: note rédigée durant le quart de ${quart}.`);
    if (gender) parts.push(`Genre du patient: ${gender}.`);

    // Section Admission
    const admissionDetails = [];
    if (state.admissionCheckboxes.length > 0) admissionDetails.push(...state.admissionCheckboxes);
    if (state.orientation.length > 0) admissionDetails.push(`Orientation: ${state.orientation.join(', ')}.`);
    else admissionDetails.push("Orientation: Non évaluée ou non orienté(e).");
    if (state.autonomie) admissionDetails.push(`Autonomie fonctionnelle: ${state.autonomie}.`);
    if (state.effetsPersonnels.trim()) admissionDetails.push(`Effets personnels: ${state.effetsPersonnels.trim()}.`);
    
    if (state.accesVeineux) {
        let accesVeineuxText = `Accès veineux (CVP) fonctionnel`;
        if (state.accesVeineux_gauge) accesVeineuxText += `, calibre ${state.accesVeineux_gauge}`;
        if (state.accesVeineux_site) accesVeineuxText += ` au ${state.accesVeineux_site}`;
        admissionDetails.push(accesVeineuxText + '.');
    }
    if (state.piccLine) {
        let piccLineText = 'PICC Line en place et fonctionnel';
        if (state.piccLine_site) piccLineText += ` au ${state.piccLine_site}`;
        admissionDetails.push(piccLineText + '.');
    }
    
    if (state.drains.length > 0) admissionDetails.push(`Drains en place: ${state.drains.join(', ')}.`);
    if (state.sondes.length > 0) admissionDetails.push(`Sondes en place: ${state.sondes.join(', ')}.`);
    
    if (admissionDetails.length > 0) {
        parts.push(`- Admission : ${admissionDetails.join(' ')}`);
    }

    sectionsData.forEach(section => {
        const content = [];
        const selection = state[section.id as keyof FormState];
        
        if (Array.isArray(selection) && selection.length > 0) {
            let processedSelection = selection;
            if (section.id === 'respiratoire' && selection.includes('Utilisation d’O₂') && state.respiratoire_o2_litres) {
                processedSelection = selection.map(item => item === 'Utilisation d’O₂' ? `Utilisation d’O₂ (${state.respiratoire_o2_litres} L/min)` : item);
            }
            content.push(processedSelection.join(', '));
        } else if (typeof selection === 'string' && selection) {
            content.push(section.title.startsWith('Signes vitaux') || section.title.startsWith('Signes neurologiques') ? `${selection}, voir feuille spéciale` : selection);
        }
        
        if (section.hasIntervention) {
            const medicament = state[`${section.id}_medicament` as keyof FormState] as string;
            if (medicament) content.push(`médicament administré: ${medicament}`);
            const interventions = state[`${section.id}_interventions` as keyof FormState] as string[];
            if (interventions?.length > 0) content.push(`interventions: ${interventions.join(', ')}`);
        }
        
        if (content.length > 0) parts.push(`- ${section.title} : ${content.join('; ')}.`);
    });

    const { p, q, r, s, t, u, site, medicament: painMedicament, interventionsNonPharma } = douleur;
    const painDetails = Object.entries({p, q, r, s, t, u})
        .map(([key, value]) => {
            const fieldLabel = painFieldsData.find(f => f.id === key)?.label || key.toUpperCase();
            if (key === 'r') {
                const rValues = Array.isArray(value) ? value : [];
                if (rValues.length === 0 && !site) return null;
                let rText = rValues.join(', ');
                if (site) rText += `${rText ? '; ' : ''}Site: ${site}`;
                return `  - ${fieldLabel} : ${rText}`;
            }
            if ((Array.isArray(value) && value.length > 0) || (typeof value === 'string' && value)) {
                return `  - ${fieldLabel} : ${Array.isArray(value) ? value.join(', ') : value}`;
            }
            return null;
        }).filter(Boolean);

    if (painDetails.length > 0 || painMedicament || (interventionsNonPharma?.length > 0)) {
        let painString = "- Douleur (PQRSTU) :";
        if (painDetails.length > 0) painString += `\n${painDetails.join('\n')}`;
        if (painMedicament) painString += `\n  - Intervention pharmacologique (Médicament) : ${painMedicament}`;
        if (interventionsNonPharma?.length > 0) painString += `\n  - Interventions non pharmacologiques : ${interventionsNonPharma.join(', ')}`;
        parts.push(painString);
    }
      
    if (particularites.trim()) parts.push(`- Particularités / Événements notables : ${particularites.trim()}`);
      
    return parts.filter(Boolean).join('\n');
  };

  const handleGenerateNote = useCallback(async () => {
    if (isFormEmpty) return;
    setIsGenerating(true);
    setGenerationError(null);
    setAiNote('');

    const clinicalData = buildClinicalData(formState);
    if (!clinicalData.trim()) {
      setGenerationError("Le formulaire est vide.");
      setIsGenerating(false);
      return;
    }

    const prompt = `RÔLE : Tu es un infirmier ou une infirmière rédigeant une note d'évolution pour le dossier d'un patient, conformément aux standards du système de santé québécois.
TÂCHE : Rédige une note narrative professionnelle, fluide et concise en français. La note doit intégrer toutes les données cliniques fournies dans un ou deux paragraphes cohérents.
IMPORTANT :
- Ne commence PAS la note par "Note d'évolution :".
- N'inclus PAS la date ou l'heure dans le corps de la note. Ces informations sont gérées séparément.
- Accorde IMPÉRATIVEMENT le genre de la note (pronoms, adjectifs) en fonction du "Genre du patient" spécifié. 'Masculin' -> "le patient", "il". 'Féminin' -> "la patiente", "elle".

DONNÉES CLINIQUES :
${clinicalData}

Réponds IMPÉRATIVEMENT au format JSON en respectant le schéma fourni.`;

    try {
      // @ts-ignore
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: { note: { type: Type.STRING, description: "La note d'évolution infirmière narrative et complète, correctement accordée en genre." } },
                required: ['note']
            }
        }
      });
      
      const jsonString = response.text.trim();
      const parsedResponse = JSON.parse(jsonString);
      setAiNote(parsedResponse.note || "La note n'a pas pu être générée.");
    } catch (error) {
      console.error("Erreur lors de la génération de la note :", error);
      setGenerationError("Une erreur est survenue. L'IA a peut-être renvoyé une réponse inattendue. Veuillez réessayer.");
    } finally {
      setIsGenerating(false);
    }
  }, [formState, isFormEmpty]);
  
  const handleAccessSubmit = (code: string) => {
    if (code === accessCode) {
      setIsAuthenticated(true);
      setAccessError(null);
    } else {
      setAccessError("Code d'accès incorrect. Veuillez réessayer.");
    }
  };

  const handleChangePassword = ({ currentCode, newCode }: { currentCode: string, newCode: string }): { success: boolean, message: string } => {
    if (currentCode !== accessCode) return { success: false, message: "Le code d'accès actuel est incorrect." };
    if (!newCode || newCode.length < 4) return { success: false, message: "Le nouveau code doit contenir au moins 4 caractères." };
    setAccessCode(newCode);
    localStorage.setItem('APP_ACCESS_CODE', newCode);
    return { success: true, message: "Code d'accès mis à jour avec succès !" };
  };

    const handleSaveState = useCallback((name: string) => {
        if (!name.trim()) return;
        const key = `nurse-note-save-${name.trim()}`;
        const stateToSave: SavedState = { formState, aiNote, layoutSettings: settings };
        localStorage.setItem(key, JSON.stringify(stateToSave));
        setSavedStates(prev => ({ ...prev, [name.trim()]: stateToSave }));
        alert(`Note enregistrée sous le nom : "${name.trim()}"`);
    }, [formState, aiNote, settings]);

    const handleLoadState = useCallback((name: string) => {
        const stateToLoad = savedStates[name];
        if (stateToLoad) {
            setFormState(stateToLoad.formState);
            setAiNote(stateToLoad.aiNote || '');

            let loadedSettings = stateToLoad.layoutSettings || defaultLayoutSettings;
            // One-time migration for old fontSize format in saved states
            if (loadedSettings.fontSize && loadedSettings.fontSize < 7) {
                loadedSettings = { ...loadedSettings, fontSize: loadedSettings.fontSize * 5 };
            }
            setSettings(loadedSettings);
            
            alert(`Note "${name}" chargée.`);
        }
    }, [savedStates]);

    const handleDeleteState = useCallback((name: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer la note "${name}" ?`)) {
            const key = `nurse-note-save-${name}`;
            localStorage.removeItem(key);
            setSavedStates(prev => {
                const newStates = { ...prev };
                delete newStates[name];
                return newStates;
            });
        }
    }, []);

  if (!isAuthenticated) {
    return <AccessCodeScreen onAccessGranted={handleAccessSubmit} error={accessError} />;
  }
  
  const quartOptions: Option[] = [
    { value: 'Jour', label: 'Jour' },
    { value: 'Soir', label: 'Soir' },
    { value: 'Nuit', label: 'Nuit' },
  ];

  const genderOptions: Option[] = [
    { value: 'Masculin', label: 'Masculin' },
    { value: 'Féminin', label: 'Féminin' },
  ];

  const painSectionIndex = sectionsData.findIndex(sec => sec.id === 'digestif');


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 flex flex-col">
      <Header 
        onOpenChangePassword={() => setIsChangePasswordModalOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      <main className="flex-grow container mx-auto p-4 lg:p-8">
        <div className="grid grid-cols-1 gap-8">
          
          <div className="flex flex-col gap-6">
            <QuickScenarios onScenarioSelect={handleScenarioSelect} />

            <SaveLoad
                savedStates={Object.keys(savedStates)}
                onSave={handleSaveState}
                onLoad={handleLoadState}
                onDelete={handleDeleteState}
            />

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-4">Contexte de la Note</h2>
                <div className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Genre du patient</label>
                        <RadioGroup name="gender" options={genderOptions} selectedValue={formState.gender} onChange={(value) => handleRadioChange('gender', value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Quart de travail</label>
                        <RadioGroup name="quart" options={quartOptions} selectedValue={formState.quart} onChange={(value) => handleRadioChange('quart', value)} />
                    </div>
                </div>
            </div>

            <AdmissionSection
                isOpen={openSectionId === 'admission'}
                onToggle={() => handleSectionToggle('admission')}
                isFilled={isAdmissionSectionFilled}
                state={formState}
                onChange={handleAdmissionChange}
            />


            {sectionsData.slice(0, painSectionIndex).map(section => (
              <CollapsibleSection 
                key={section.id} 
                title={section.title}
                isOpen={openSectionId === section.id}
                onToggle={() => handleSectionToggle(section.id)}
                isFilled={isSectionFilled(section.id, formState)}
              >
                {section.type === 'radio' && <RadioGroup name={section.id} options={section.options} selectedValue={formState[section.id] as string} onChange={(value) => handleRadioChange(section.id, value)} />}
                {section.type === 'checkbox' && <CheckboxGroup sectionId={section.id} options={section.options} selectedValues={formState[section.id] as string[]} onChange={(value) => handleCheckboxChange(section.id, value)} />}
                {section.id === 'respiratoire' && formState.respiratoire.includes('Utilisation d’O₂') && (
                    <div className="mt-4">
                        <label htmlFor="respiratoire_o2_litres" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Débit d'oxygène (L/min)</label>
                        <input type="number" id="respiratoire_o2_litres" value={formState.respiratoire_o2_litres} onChange={(e) => handleRespiratoireO2LitresChange(e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors" placeholder="Ex: 2" min="0" step="0.5" />
                    </div>
                )}
                {section.hasIntervention && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                        <div>
                            <label htmlFor={`${section.id}-medicament`} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Médicament administré</label>
                            <input type="text" id={`${section.id}-medicament`} value={formState[`${section.id}_medicament` as keyof FormState] as string} onChange={(e) => handleMedicamentChange(section.id as string, e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors" placeholder="Ex: Nom, dosage, voie..." />
                        </div>
                        {section.interventions && (
                           <div>
                                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Interventions Associées</h3>
                                <CheckboxGroup sectionId={`${section.id}_interventions`} options={section.interventions} selectedValues={formState[`${section.id}_interventions` as keyof FormState] as string[]} onChange={(value) => handleInterventionChange(section.id, value)} />
                           </div>
                        )}
                    </div>
                )}
              </CollapsibleSection>
            ))}

            <CollapsibleSection
              title="Douleur – Méthode PQRSTU"
              isOpen={openSectionId === 'douleur'}
              onToggle={() => handleSectionToggle('douleur')}
              isFilled={isSectionFilled('douleur', formState)}
            >
              <PainSection
                data={painFieldsData}
                painState={formState.douleur}
                onCheckboxChange={handlePainCheckboxChange}
                onRadioChange={handlePainRadioChange}
                onSiteChange={handlePainSiteChange}
                onMedicamentChange={handlePainMedicamentChange}
                onNonPharmaChange={handlePainNonPharmaChange}
              />
            </CollapsibleSection>

            {sectionsData.slice(painSectionIndex).map(section => (
              <CollapsibleSection 
                key={section.id} 
                title={section.title}
                isOpen={openSectionId === section.id}
                onToggle={() => handleSectionToggle(section.id)}
                isFilled={isSectionFilled(section.id, formState)}
              >
                {section.type === 'radio' && <RadioGroup name={section.id} options={section.options} selectedValue={formState[section.id] as string} onChange={(value) => handleRadioChange(section.id, value)} />}
                {section.type === 'checkbox' && <CheckboxGroup sectionId={section.id} options={section.options} selectedValues={formState[section.id] as string[]} onChange={(value) => handleCheckboxChange(section.id, value)} />}
                 {section.hasIntervention && (
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                        <div>
                            <label htmlFor={`${section.id}-medicament`} className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Médicament administré</label>
                            <input type="text" id={`${section.id}-medicament`} value={formState[`${section.id}_medicament` as keyof FormState] as string} onChange={(e) => handleMedicamentChange(section.id as string, e.target.value)} className="w-full p-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors" placeholder="Ex: Nom, dosage, voie..." />
                        </div>
                        {section.interventions && (
                           <div>
                                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Interventions Associées</h3>
                                <CheckboxGroup sectionId={`${section.id}_interventions`} options={section.interventions} selectedValues={formState[`${section.id}_interventions` as keyof FormState] as string[]} onChange={(value) => handleInterventionChange(section.id, value)} />
                           </div>
                        )}
                    </div>
                )}
              </CollapsibleSection>
            ))}

             <CollapsibleSection
                title="Particularités / Événements notables"
                isOpen={openSectionId === 'particularites'}
                onToggle={() => handleSectionToggle('particularites')}
                isFilled={isSectionFilled('particularites', formState)}
             >
                <ParticularitesSection 
                    value={formState.particularites}
                    onChange={handleParticularitesChange}
                />
             </CollapsibleSection>
          </div>

          <div>
            <GeneratedNote 
              noteText={aiNote}
              isGenerating={isGenerating}
              error={generationError}
              isFormEmpty={isFormEmpty}
              onGenerate={handleGenerateNote}
              onReset={resetForm}
              settings={settings}
              setSettings={setSettings}
              onSave={handleSaveState}
            />
          </div>
        </div>
      </main>
      <Footer />
       {isChangePasswordModalOpen && <ChangePasswordModal onClose={() => setIsChangePasswordModalOpen(false)} onSubmit={handleChangePassword} />}
    </div>
  );
};

export default App;
