export interface Option {
  value: string;
  label: string;
}

export type SectionType = 'radio' | 'checkbox';

export interface PainState {
  p: string[];
  q: string[];
  r: string[];
  site: string;
  s: string;
  t: string[];
  u: string[];
  medicament: string;
  interventionsNonPharma: string[];
}

export interface PainField {
  id: keyof Omit<PainState, 'medicament' | 'interventionsNonPharma' | 'site'>;
  label: string;
  type: 'radio' | 'checkbox';
  options: Option[];
}

export interface FormState {
  quart: string;
  gender: string;
  // Admission fields
  admissionCheckboxes: string[];
  orientation: string[];
  autonomie: string;
  effetsPersonnels: string;
  accesVeineux: boolean;
  accesVeineux_gauge: string;
  accesVeineux_site: string;
  piccLine: boolean;
  piccLine_site: string;
  drains: string[];
  sondes: string[];
  // Other sections
  position: string[];
  etatEveil: string;
  signesVitaux: string;
  signesNeuro: string;
  respiratoire: string[];
  respiratoire_medicament: string;
  respiratoire_interventions: string[];
  respiratoire_o2_litres: string;
  digestif: string[];
  digestif_medicament: string;
  digestif_interventions: string[];
  urinaire: string[];
  urinaire_medicament: string;
  urinaire_interventions: string[];
  tegumentaire: string[];
  tegumentaire_medicament: string;
  tegumentaire_interventions: string[];
  geriatrie: string[];
  observations: string[];
  visites: string;
  particularites: string;
  douleur: PainState;
}

export interface SectionData {
  id: keyof Omit<FormState, 'douleur' | 'particularites' | `${string}_medicament` | `${string}_interventions'` | 'respiratoire_o2_litres' | 'quart' | 'gender' | 'admissionCheckboxes' | 'orientation' | 'autonomie' | 'effetsPersonnels' | 'accesVeineux' | 'accesVeineux_gauge' | 'accesVeineux_site' | 'piccLine' | 'piccLine_site' | 'drains' | 'sondes'>;
  title: string;
  type: SectionType;
  options: Option[];
  hasIntervention?: boolean;
  interventions?: Option[];
}

export interface LayoutSettings {
    lineHeight: number;
    fontSize: number;
    textTopPosition: number;
    textLeftPosition: number;
    textBlockWidth: number;
    letterSpacing: number;
    fontWeight: number;
    fontFamily: string;
    textOpacity: number;
}

export interface SavedState {
  formState: FormState;
  aiNote: string;
  layoutSettings?: LayoutSettings;
}