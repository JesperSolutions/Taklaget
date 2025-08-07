import { ReportData } from '../types/report';

export const defaultReportData: ReportData = {
  buildingContact: {
    bygherre: 'DANDY Business Park',
    adresse: 'Resilience House, Lysholt Allé 10',
    postnummer: '7100 Vejle',
    kontaktperson: 'Flemming Krarup & Michael Juul Andersen',
    telefon: '+4529815911',
    email: 'fwk@dandybusinesspark.dk - mja@dandybusinesspark.dk'
  },
  agritectumContact: {
    kontakt: 'Flemming Adolfsen',
    telefon: '+4521619540',
    email: 'flemming.adolfsen@agritectum.com'
  },
  checklist: [
    { name: 'Adgangsforhold', ikkeRelevant: false, ikkeEtableret: true, etableret: false, m2: '', kommentar: 'Adgang med lang stige' },
    { name: 'Faldsikring / rækværk', ikkeRelevant: false, ikkeEtableret: false, etableret: true, m2: '', kommentar: 'Faldsikring' },
    { name: 'Eks. tag materiale', ikkeRelevant: false, ikkeEtableret: false, etableret: false, m2: '490', kommentar: 'Tagpap' },
    { name: 'Alder på tag', ikkeRelevant: false, ikkeEtableret: false, etableret: false, m2: '', kommentar: '' },
    { name: 'Tekniske udførelse iht specifikationer', ikkeRelevant: false, ikkeEtableret: false, etableret: false, m2: '', kommentar: 'OK' },
    { name: 'Svejsninger', ikkeRelevant: false, ikkeEtableret: false, etableret: false, m2: '', kommentar: 'OK' },
    { name: 'Afløb', ikkeRelevant: false, ikkeEtableret: false, etableret: false, m2: '', kommentar: 'UV tagbrønde' },
    { name: 'Opkanter og murkroner', ikkeRelevant: false, ikkeEtableret: false, etableret: false, m2: '', kommentar: 'OK' },
    { name: 'Ovenlys', ikkeRelevant: false, ikkeEtableret: false, etableret: false, m2: '', kommentar: 'Et enkelt OK' },
    { name: 'Tekniske installationer', ikkeRelevant: false, ikkeEtableret: false, etableret: false, m2: '', kommentar: 'OK' },
    { name: 'Vurdering af isoleringstype', ikkeRelevant: false, ikkeEtableret: false, etableret: false, m2: '', kommentar: 'EPS og Mineraluld' },
    { name: 'Grønt tag', ikkeRelevant: false, ikkeEtableret: false, etableret: true, m2: '', kommentar: 'Delvist' },
    { name: 'Solceller', ikkeRelevant: false, ikkeEtableret: false, etableret: true, m2: '', kommentar: '2 mindre områder, limet løsning.' },
    { name: 'NOx reduction', ikkeRelevant: false, ikkeEtableret: true, etableret: false, m2: '', kommentar: '' },
    { name: 'Regnvandsopsamling', ikkeRelevant: false, ikkeEtableret: true, etableret: false, m2: '', kommentar: '' },
    { name: 'Rekreative områder', ikkeRelevant: false, ikkeEtableret: true, etableret: false, m2: '', kommentar: '' }
  ],
  photos: [
    { id: '1', caption: 'Delvis sedum tag i bakker.' },
    { id: '2', caption: 'Sedum og solceller' },
    { id: '3', caption: 'UV tagbrønd bladfang defekt' },
    { id: '4', caption: 'Murkroner OK' },
    { id: '5', caption: 'Folder i tagpap' },
    { id: '6', caption: 'Folder i tagpap' },
    { id: '7', caption: 'Ovenlys fin inddækningshøjde' },
    { id: '8', caption: 'Sedum vokser udover kantskinne' },
    { id: '9', caption: 'Leverandør af Sol' },
    { id: '10', caption: 'Styring til solceller' }
  ],
  recommendations: [
    { id: '1', text: 'Taget virker generelt i god stand, men der er detaljer omkring folder, brønde og vedligeholdelse af det grønne tag som bør efterses nærmere af en autoriseret tagdækker.' },
    { id: '2', text: 'Vi vil anbefale at der laves en serviceaftale for taget således at taget løbende efterses og eventuelle fejl, mangler og slitage udbedres.' },
    { id: '3', text: 'Vi vil anbefale at der udføres ekstraordinære test af fugtighed i isoleringen så eventuelle genbrug opdages i tide.' },
    { id: '4', text: 'Vi anbefaler at udarbejde en ESG-handlingsplan for taget, så det kan understøtte bæredygtighedstiltag i DANDY Business Park.' }
  ],
  economy: [
    { description: 'Taginspektion', amount: 1, unit: 'stk', price: 15000, total: 15000 },
    { description: 'Rapport udarbejdelse', amount: 1, unit: 'stk', price: 5000, total: 5000 },
    { description: 'Opfølgning', amount: 2, unit: 'timer', price: 1200, total: 2400 }
  ],
  responsibility: [
    { task: 'Taginspektion gennemført', responsible: 'Flemming Adolfsen', deadline: '2024-01-15', status: 'completed' },
    { task: 'Rapport udarbejdet', responsible: 'Flemming Adolfsen', deadline: '2024-01-20', status: 'completed' },
    { task: 'Opfølgning på anbefalinger', responsible: 'Flemming Krarup', deadline: '2024-02-01', status: 'pending' }
  ]
};