import type { SectionData, PainField, Option, PainState, FormState, LayoutSettings } from './types';

export const initialPainState: PainState = {
  p: [], q: [], r: [], site: '', s: '', t: [], u: [], medicament: '', interventionsNonPharma: []
};

export const defaultLayoutSettings: LayoutSettings = {
  lineHeight: 2.03,
  fontSize: 10.5,
  textTopPosition: 7.3,
  textLeftPosition: 1.5,
  textBlockWidth: 18.5,
  letterSpacing: 0,
  fontWeight: 700,
  fontFamily: 'courier',
  textOpacity: 1,
};

export const fontOptions: { value: string, label: string }[] = [
    { value: 'courier', label: 'Courier' },
    { value: 'helvetica', label: 'Helvetica' },
    { value: 'times', label: 'Times New Roman' },
];


// Nouvelles constantes pour la section Admission détaillée
export const admissionBaseOptions: Option[] = [
    { value: 'Bracelet d\'identification vérifié et conforme', label: 'Bracelet d\'identification vérifié' },
    { value: 'Allergies vérifiées et signalées au dossier', label: 'Allergies vérifiées' },
    { value: 'Enseignement sur le fonctionnement de l\'unité et l\'appel infirmier effectué', label: 'Enseignement patient effectué' },
    { value: 'Évaluation initiale de la douleur effectuée', label: 'Évaluation douleur initiale' },
];
export const orientationOptions: Option[] = [
    { value: 'Temps', label: 'Temps' },
    { value: 'Lieu', label: 'Lieu' },
    { value: 'Personne', label: 'Personne' },
];
export const autonomieOptions: Option[] = [
    { value: 'Autonome', label: 'Autonome' },
    { value: 'Aide x 1', label: 'Aide x 1' },
    { value: 'Aide x 2', label: 'Aide x 2' },
    { value: 'Aide totale', label: 'Aide totale' },
];
export const accesVeineuxGaugeOptions: Option[] = [
    { value: '#18', label: '#18' },
    { value: '#20', label: '#20' },
    { value: '#22', label: '#22' },
    { value: '#24', label: '#24' },
];
export const drainsOptions: Option[] = [
    { value: 'Jackson-Pratt (JP)', label: 'Jackson-Pratt (JP)' },
    { value: 'Hemovac', label: 'Hemovac' },
    { value: 'Penrose', label: 'Penrose' },
    { value: 'Drain thoracique', label: 'Drain thoracique' },
    { value: 'Pigtail', label: 'Pigtail' },
];
export const sondesOptions: Option[] = [
    { value: 'Sonde urinaire (Foley)', label: 'Sonde urinaire (Foley)' },
    { value: 'Sonde naso-gastrique (SNG)', label: 'Sonde naso-gastrique (SNG)' },
    { value: 'Sonde de gastrostomie (PEG)', label: 'Sonde de gastrostomie (PEG)' },
    { value: 'Étui pénien', label: 'Étui pénien' },
];
export const siteMembreOptions: Option[] = [
    { value: 'bras droit (BD)', label: 'Bras droit (BD)' },
    { value: 'bras gauche (BG)', label: 'Bras gauche (BG)' },
    { value: 'avant-bras droit (ABD)', label: 'Avant-bras droit (ABD)' },
    { value: 'avant-bras gauche (ABG)', label: 'Avant-bras gauche (ABG)' },
];


export const sectionsData: SectionData[] = [
  {
    id: 'position',
    title: 'Position du patient',
    type: 'checkbox',
    options: [
        { value: 'Décubitus dorsal', label: 'Décubitus dorsal' },
        { value: 'Décubitus latéral', label: 'Décubitus latéral' },
        { value: 'Décubitus ventral', label: 'Décubitus ventral' },
        { value: 'Position semi-assise', label: 'Position semi-assise' },
        { value: 'Assis(e) au fauteuil', label: 'Assis(e) au fauteuil' },
        { value: 'Debout', label: 'Debout' },
    ],
  },
  {
    id: 'etatEveil',
    title: 'État d’éveil',
    type: 'radio',
    options: [
      { value: 'Alerte', label: 'Alerte' },
      { value: 'Somnolent', label: 'Somnolent' },
      { value: 'Léthargique', label: 'Léthargique' },
      { value: 'Stuporeux', label: 'Stuporeux' },
      { value: 'Comateux', label: 'Comateux' },
      { value: 'Non évaluable', label: 'Non évaluable' },
    ],
  },
  {
    id: 'signesNeuro',
    title: 'Signes neurologiques (SN)',
    type: 'radio',
    options: [
      { value: 'Normal', label: 'Normal' },
      { value: 'Anormal', label: 'Anormal' },
    ],
  },
  {
    id: 'respiratoire',
    title: 'Système respiratoire',
    type: 'checkbox',
    options: [
      { value: 'Respiration régulière', label: 'Respiration régulière' },
      { value: 'Aucun signe de détresse', label: 'Aucun signe de détresse' },
      { value: 'Dyspnée au repos', label: 'Dyspnée au repos' },
      { value: 'Dyspnée à l’effort', label: 'Dyspnée à l’effort' },
      { value: 'Toux sèche', label: 'Toux sèche' },
      { value: 'Toux productive', label: 'Toux productive' },
      { value: 'Sécrétions abondantes', label: 'Sécrétions abondantes' },
      { value: 'Utilisation d’O₂', label: 'Utilisation d’O₂' },
    ],
    hasIntervention: true,
    interventions: [
        { value: 'Surveillance de la saturation en O₂', label: 'Surveillance de la saturation en O₂' },
        { value: 'Auscultation pulmonaire', label: 'Auscultation pulmonaire' },
        { value: 'Aspiration des sécrétions si besoin', label: 'Aspiration des sécrétions' },
        { value: 'Position semi-assise', label: 'Position semi-assise' },
        { value: 'Administration d\'O₂ selon prescription', label: 'Administration d\'O₂' },
    ]
  },
  {
    id: 'signesVitaux',
    title: 'Signes vitaux (SV)',
    type: 'radio',
    options: [
      { value: 'Normal', label: 'Normal' },
      { value: 'Anormal', label: 'Anormal' },
    ],
  },
  {
    id: 'digestif',
    title: 'Système digestif',
    type: 'checkbox',
    options: [
      { value: 'Appétit conservé', label: 'Appétit conservé' },
      { value: 'Appétit diminué', label: 'Appétit diminué' },
      { value: 'Alimentation bien tolérée', label: 'Alimentation bien tolérée' },
      { value: 'Nausées', label: 'Nausées' },
      { value: 'Vomissements', label: 'Vomissements' },
      { value: 'Selles normales', label: 'Selles normales' },
      { value: 'Constipation', label: 'Constipation' },
      { value: 'Diarrhée', label: 'Diarrhée' },
    ],
    hasIntervention: true,
    interventions: [
        { value: 'Surveillance des nausées/vomissements', label: 'Surveillance N/V' },
        { value: 'Administration d\'antiémétiques si prescrits', label: 'Admin. antiémétiques' },
        { value: 'Surveillance du transit intestinal', label: 'Surveillance du transit' },
        { value: 'Encourager l\'hydratation', label: 'Encourager l\'hydratation' },
        { value: 'Conseils diététiques', label: 'Conseils diététiques' },
    ]
  },
  {
    id: 'urinaire',
    title: 'Système urinaire',
    type: 'checkbox',
    options: [
      { value: 'Diurèse normale', label: 'Diurèse normale' },
      { value: 'Diurèse diminuée', label: 'Diurèse diminuée' },
      { value: 'Anurie', label: 'Anurie' },
      { value: 'Urine claire', label: 'Urine claire' },
      { value: 'Urine foncée', label: 'Urine foncée' },
      { value: 'Sonde urinaire', label: 'Sonde urinaire' },
      { value: 'Absence de signe d’infection', label: 'Absence de signe d’infection' },
    ],
    hasIntervention: true,
    interventions: [
        { value: 'Surveillance de la diurèse', label: 'Surveillance de la diurèse' },
        { value: 'Soins de sonde urinaire', label: 'Soins de sonde urinaire' },
        { value: 'Encourager les apports hydriques', label: 'Encourager les apports hydriques' },
        { value: 'Surveillance des signes d\'infection', label: 'Surveillance signes d\'infection' },
        { value: 'Aide à la mobilisation pour la miction', label: 'Aide à la miction' },
    ]
  },
  {
    id: 'tegumentaire',
    title: 'Tégumentaire (peau)',
    type: 'checkbox',
    options: [
      { value: 'Peau intacte', label: 'Peau intacte' },
      { value: 'Rougeur', label: 'Rougeur' },
      { value: 'Lésion/plaie', label: 'Lésion/plaie' },
      { value: 'Escarre', label: 'Escarre' },
      { value: 'Pansement propre', label: 'Pansement propre' },
      { value: 'Pansement souillé', label: 'Pansement souillé' },
      { value: 'Changement de pansement effectué', label: 'Changement de pansement effectué' },
    ],
    hasIntervention: true,
    interventions: [
        { value: 'Réfection du pansement selon protocole', label: 'Réfection du pansement' },
        { value: 'Surveillance de l\'état de la plaie', label: 'Surveillance de la plaie' },
        { value: 'Prévention d\'escarres', label: 'Prévention d\'escarres' },
        { value: 'Application de crème protectrice', label: 'Application de crème' },
        { value: 'Évaluation de la douleur de la plaie', label: 'Évaluation douleur plaie' },
    ]
  },
  {
    id: 'geriatrie',
    title: 'Évaluation gériatrique',
    type: 'checkbox',
    options: [
      { value: 'Confus(e) / désorienté(e)', label: 'Confus(e) / désorienté(e)' },
      { value: 'Agitation', label: 'Agitation' },
      { value: 'Apathie / Lenteur', label: 'Apathie / Lenteur' },
      { value: 'Marche avec aide technique', label: 'Marche avec aide technique' },
      { value: 'Risque de chute élevé', label: 'Risque de chute élevé' },
      { value: 'Alité(e)', label: 'Alité(e)' },
      { value: 'Aide nécessaire pour les transferts', label: 'Aide nécessaire pour les transferts' },
      { value: 'Risque de dénutrition', label: 'Risque de dénutrition' },
      { value: 'Risque de déshydratation', label: 'Risque de déshydratation' },
      { value: 'Aide au repas nécessaire', label: 'Aide au repas nécessaire' },
      { value: 'Troubles de déglutition / Fausses routes', label: 'Troubles de déglutition / Fausses routes' },
    ],
  },
  {
    id: 'observations',
    title: 'Observations générales',
    type: 'checkbox',
    options: [
        { value: 'Calme et coopérant(e)', label: 'Calme et coopérant(e)' },
        { value: 'Anxieux/Anxieuse', label: 'Anxieux/Anxieuse' },
        { value: 'Agité(e)', label: 'Agité(e)' },
        { value: 'Sueurs / Diaphorèse', label: 'Sueurs / Diaphorèse' },
        { value: 'Sommeil réparateur', label: 'Sommeil réparateur' },
        { value: 'Sommeil perturbé', label: 'Sommeil perturbé' },
        { value: 'Mobilisation bien tolérée', label: 'Mobilisation bien tolérée' },
        { value: 'Bonne compréhension des soins', label: 'Bonne compréhension des soins' },
        { value: 'Suivi médical en cours', label: 'Suivi médical en cours' },
    ]
  },
  {
    id: 'visites',
    title: 'Visites de la famille / proches',
    type: 'radio',
    options: [
        { value: 'Oui', label: 'Oui' },
        { value: 'Non', label: 'Non' },
        { value: 'Non applicable', label: 'Non applicable' },
    ]
  }
];

export const painFieldsData: PainField[] = [
    { 
      id: 'p', 
      label: 'P - Provocation / Palliation', 
      type: 'checkbox',
      options: [
        { value: 'Mouvement', label: 'Mouvement' },
        { value: 'Repos', label: 'Repos' },
        { value: 'Pression', label: 'Pression' },
        { value: 'Changement de position', label: 'Changement de position' },
        { value: 'Médication', label: 'Médication' },
      ]
    },
    { 
      id: 'q', 
      label: 'Q - Qualité', 
      type: 'checkbox',
      options: [
        { value: 'Brûlure', label: 'Brûlure' },
        { value: 'Lancinante', label: 'Lancinante' },
        { value: 'Sourde', label: 'Sourde' },
        { value: 'Écrasement', label: 'Écrasement' },
        { value: 'Coup de poignard', label: 'Coup de poignard' },
        { value: 'Picotement', label: 'Picotement' },
      ] 
    },
    { 
      id: 'r', 
      label: 'R - Région / Rayonnement', 
      type: 'checkbox',
      options: [
        { value: 'Localisée', label: 'Localisée' },
        { value: 'Irradiation', label: 'Irradiation' },
        { value: 'Diffuse', label: 'Diffuse' },
      ]
    },
    { 
      id: 's', 
      label: 'S - Sévérité / Intensité', 
      type: 'radio',
      options: [
        { value: 'Légère (1-3/10)', label: 'Légère (1-3/10)' },
        { value: 'Modérée (4-6/10)', label: 'Modérée (4-6/10)' },
        { value: 'Sévère (7-10/10)', label: 'Sévère (7-10/10)' },
        { value: 'Non évaluable', label: 'Non évaluable' },
      ]
    },
    { 
      id: 't', 
      label: 'T - Temps', 
      type: 'checkbox',
      options: [
        { value: 'Continue', label: 'Continue' },
        { value: 'Intermittente', label: 'Intermittente' },
        { value: 'Apparition brutale', label: 'Apparition brutale' },
        { value: 'Apparition progressive', label: 'Apparition progressive' },
      ]
    },
    { 
      id: 'u', 
      label: 'U - Symptômes associés', 
      type: 'checkbox',
      options: [
        { value: 'Nausées', label: 'Nausées' },
        { value: 'Vertiges', label: 'Vertiges' },
        { value: 'Sueurs', label: 'Sueurs' },
        { value: 'Anxiété', label: 'Anxiété' },
        { value: 'Fatigue', label: 'Fatigue' },
        { value: 'Aucun', label: 'Aucun' },
      ]
    },
];

export const painNonPharmaInterventions: Option[] = [
    { value: 'Installation dans une position de confort', label: 'Installation en position de confort' },
    { value: 'Application de chaleur/froid', label: 'Application de chaleur/froid' },
    { value: 'Techniques de relaxation/distraction', label: 'Techniques de relaxation/distraction' },
    { value: 'Soutien psychologique/écoute active', label: 'Soutien psychologique/écoute active' },
    { value: 'Mobilisation douce', label: 'Mobilisation douce' },
    { value: 'Massage/friction', label: 'Massage/friction' },
];

export const scenariosData: { label: string, state: Partial<FormState> }[] = [
    {
        label: 'Patient Stable',
        state: {
            etatEveil: 'Alerte',
            signesVitaux: 'Normal',
            signesNeuro: 'Normal',
            respiratoire: ['Respiration régulière', 'Aucun signe de détresse'],
            digestif: ['Appétit conservé', 'Selles normales'],
            urinaire: ['Diurèse normale', 'Urine claire'],
            tegumentaire: ['Peau intacte'],
            observations: ['Calme et coopérant(e)'],
            douleur: { ...initialPainState, s: 'Légère (1-3/10)' }
        }
    },
    {
        label: 'Post-Op J+1',
        state: {
            position: ['Position semi-assise'],
            etatEveil: 'Alerte',
            signesVitaux: 'Normal',
            respiratoire: ['Respiration régulière'],
            tegumentaire: ['Pansement propre', 'Changement de pansement effectué'],
            observations: ['Mobilisation bien tolérée'],
            particularites: 'Réfection du pansement au site opératoire [préciser site]. La plaie est belle, sans signe d\'infection. Drains en place, productifs. Mobilisation au fauteuil effectuée.',
            douleur: { ...initialPainState, s: 'Modérée (4-6/10)', p: ['Mouvement'], q: ['Lancinante'], site: 'Site opératoire', medicament: 'Analgésie administrée avec bon soulagement.' }
        }
    },
    {
        label: 'Chute du patient',
        state: {
            etatEveil: 'Alerte',
            signesNeuro: 'Anormal',
            geriatrie: ['Risque de chute élevé'],
            tegumentaire: ['Rougeur'],
            observations: ['Agité(e)'],
            particularites: 'Patient(e) retrouvé(e) au sol près de son lit. Mécanisme de chute non-observé. Se plaint de douleur à la hanche droite. Pas de trauma crânien visible. Examen neurologique complet et surveillance initiés. Médecin avisé. Levée assistée.',
            douleur: { ...initialPainState, s: 'Sévère (7-10/10)', site: 'Hanche droite', p: ['Mouvement'], q: ['Sourde'] }
        }
    },
    {
        label: 'Détresse Resp.',
        state: {
            position: ['Position semi-assise'],
            etatEveil: 'Alerte',
            respiratoire: ['Dyspnée au repos', 'Utilisation d’O₂'],
            respiratoire_o2_litres: '3',
            respiratoire_interventions: ['Surveillance de la saturation en O₂', 'Auscultation pulmonaire', 'Position semi-assise', 'Administration d\'O₂ selon prescription'],
            observations: ['Anxieux/Anxieuse'],
            particularites: 'Présente une augmentation soudaine de sa dyspnée. Saturation à 88% à l\'air ambiant, remonte à 94% avec O2 à 3L/min via lunette nasale. Toux productive avec sécrétions blanchâtres. Médecin avisé des changements.'
        }
    },
    {
        label: 'Soins Palliatifs',
        state: {
            position: ['Décubitus dorsal'],
            etatEveil: 'Somnolent',
            digestif: ['Appétit diminué', 'Nausées'],
            digestif_medicament: 'Gravol 10mg IV',
            observations: ['Calme et coopérant(e)'],
            visites: 'Oui',
            douleur: { ...initialPainState, s: 'Sévère (7-10/10)', t: ['Continue'], medicament: 'Hydromorphone 2mg SC aux 3h, bon contrôle.', interventionsNonPharma: ['Installation dans une position de confort', 'Soutien psychologique/écoute active'] }
        }
    },
    {
        label: 'Entrée Patient',
        state: {
            admissionCheckboxes: ['Bracelet d\'identification vérifié et conforme', 'Allergies vérifiées et signalées au dossier', 'Enseignement sur le fonctionnement de l\'unité et l\'appel infirmier effectué'],
            orientation: ['Temps', 'Lieu', 'Personne'],
            autonomie: 'Autonome',
            etatEveil: 'Alerte',
            observations: ['Calme et coopérant(e)'],
            particularites: 'Admission pour [MOTIF]. Installation dans la chambre effectuée. Constantes de base prises et dossier complété. Le/la patient(e) semble bien s\'adapter à l\'environnement.'
        }
    },
    {
        label: 'Cardio - Douleur Thoracique',
        state: {
            position: ['Position semi-assise'],
            etatEveil: 'Alerte',
            signesVitaux: 'Anormal',
            respiratoire: ['Aucun signe de détresse'],
            observations: ['Anxieux/Anxieuse'],
            particularites: 'Se plaint d\'une douleur thoracique rétrosternale survenue il y a 20 minutes. ECG effectué, en attente d\'interprétation par le médecin. Prélèvements sanguins (troponines) envoyés. Surveillances rapprochées.',
            douleur: { ...initialPainState, s: 'Sévère (7-10/10)', q: ['Écrasement'], r: ['Irradiation'], site: 'Rétrosternale avec irradiation bras gauche', t: ['Continue'], u: ['Sueurs', 'Anxiété'], medicament: 'Nitroglycérine SL administrée avec soulagement partiel.' }
        }
    },
    {
        label: 'Neuro - Post-AVC',
        state: {
            etatEveil: 'Somnolent',
            signesNeuro: 'Anormal',
            geriatrie: ['Aide nécessaire pour les transferts', 'Troubles de déglutition / Fausses routes', 'Apathie / Lenteur'],
            particularites: 'Patient(e) au J2 de son AVC ischémique. Hémiparésie droite. Difficulté d\'élocution (aphasie). Alimentation en texture adaptée bien tolérée. Mobilisation au fauteuil avec aide x2. Plan de soins suivi.',
            douleur: { ...initialPainState, s: 'Non évaluable' }
        }
    },
    {
        label: 'Infection / Fièvre',
        state: {
            etatEveil: 'Somnolent',
            signesVitaux: 'Anormal',
            tegumentaire: ['Rougeur'],
            urinaire: ['Urine foncée'],
            observations: ['Sommeil perturbé', 'Sueurs / Diaphorèse'],
            particularites: 'Pic fébrile à 38.9°C. Hémocultures et ECBU prélevés. Initiation de l\'antibiothérapie IV selon la prescription. Bien hydraté(e). Frissons rapportés.',
            douleur: { ...initialPainState, s: 'Modérée (4-6/10)', p: ['Repos'], q: ['Sourde'], site: 'Diffuse (courbatures)' }
        }
    },
    {
        label: 'Patient Agité',
        state: {
            etatEveil: 'Alerte',
            geriatrie: ['Confus(e) / désorienté(e)', 'Agitation', 'Risque de chute élevé'],
            observations: ['Agité(e)'],
            particularites: 'Présente une agitation psychomotrice importante, tente de se lever du lit malgré les consignes. Propos incohérents. Surveillance accrue pour assurer sa sécurité. Mesures de contention non-pharmacologiques mises en place (ex: présence rassurante). Médecin avisé pour réévaluation.',
        }
    },
    {
        label: 'Diabète Suivi',
        state: {
            digestif: ['Alimentation bien tolérée'],
            particularites: 'Glycémie capillaire effectuée : [VALEUR] mmol/L. Administration de [X] unités d\'insuline [TYPE] selon l\'échelle mobile. Repas bien toléré. Aucun signe d\'hypo/hyperglycémie noté.'
        }
    },
    {
        label: 'Fin de quart',
        state: {
            observations: ['Calme et coopérant(e)', 'Sommeil réparateur'],
            particularites: 'Transmission effectuée à l\'équipe suivante. État stable, aucun événement notable durant le quart.'
        }
    },
    {
        label: 'Hypoglycémie',
        state: {
            etatEveil: 'Somnolent',
            signesNeuro: 'Anormal',
            observations: ['Sueurs / Diaphorèse'],
            particularites: 'Patient(e) retrouvé(e) somnolent(e). Glycémie capillaire à [VALEUR] mmol/L. Resucrage effectué avec [PRODUIT] per os. Contrôle glycémique à faire dans 15 minutes. Médecin avisé.',
        }
    },
    {
        label: 'Crise Hypertensive',
        state: {
            signesVitaux: 'Anormal',
            observations: ['Anxieux/Anxieuse'],
            particularites: 'Se plaint de céphalées. Tension artérielle mesurée à [VALEUR] mmHg. Patient(e) mis(e) au repos au lit. Médecin avisé. Administration de [MÉDICAMENT] selon prescription. Surveillance tensionnelle horaire initiée.',
            douleur: { ...initialPainState, s: 'Modérée (4-6/10)', site: 'Céphalées', q: ['Sourde'] }
        }
    },
    {
        label: 'Soins de Plaie',
        state: {
            tegumentaire: ['Lésion/plaie', 'Changement de pansement effectué'],
            tegumentaire_interventions: ['Réfection du pansement selon protocole', 'Surveillance de l\'état de la plaie'],
            particularites: 'Réfection du pansement de la plaie au [SITE]. Aspect de la plaie : propre, sans signe d\'infection, en bonne voie de cicatrisation. Patient(e) a bien toléré le soin.',
            douleur: { ...initialPainState, s: 'Légère (1-3/10)', p: ['Pression'], site: 'Site de la plaie' }
        }
    },
    {
        label: 'Transfusion Sanguine',
        state: {
            observations: ['Suivi médical en cours'],
            particularites: 'Début de la transfusion du 1er culot globulaire (CG) à [HEURE]. Patient(e) apyrétique, signes vitaux stables avant, pendant et après la transfusion. Aucune réaction transfusionnelle observée. Surveillance maintenue selon protocole.'
        }
    },
];