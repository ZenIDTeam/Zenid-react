import {ViewProps} from 'react-native/types';

export const DocumentRole = {
  Idc: 0,
  Pas: 1,
  Drv: 2,
  Res: 3,
  Gun: 4,
  Hic: 5,
  Std: 6,
  Car: 7,
  Birth: 8,
  Add: 9,
  Ide: 10,
  Vis: 11,
} as const;

export type DocumentRole = (typeof DocumentRole)[keyof typeof DocumentRole];

export const DocumentPage = {
  Front: 0,
  Back: 1,
} as const;

export type DocumentPage = (typeof DocumentPage)[keyof typeof DocumentPage];

export const DocumentCountry = {
  Cz: 0,
  Sk: 1,
  At: 2,
  Hu: 3,
  Pl: 4,
  De: 5,
  Hr: 6,
  Ro: 7,
  Ru: 8,
  Ua: 9,
  It: 10,
  Dk: 11,
  Es: 12,
  Fi: 13,
  Fr: 14,
  Gb: 15,
  Is: 16,
  Nl: 17,
  Se: 18,
  Si: 19,
  Bg: 20,
  Al: 21,
  Ad: 22,
  Be: 23,
  By: 24,
  Ba: 25,
  Me: 26,
  Ee: 27,
  Ie: 28,
  Cy: 29,
  Li: 30,
  Lt: 31,
  Lv: 32,
  Lu: 33,
  Mt: 34,
  Md: 35,
  Mc: 36,
  No: 37,
  Pt: 38,
  Gr: 39,
  Sm: 40,
  Mk: 41,
  Rs: 42,
  Ch: 43,
  Tr: 44,
  Va: 45,
  Vn: 46,
  In: 47,
  Us: 48,
  Jp: 49,
  Pk: 50,
  Ng: 51,
  Br: 52,
  Bd: 53,
  Cn: 54,
  Id: 55,
  Mx: 56,
  Ol: 57,
  Ph: 58,
  Et: 59,
  Eg: 60,
  Cd: 61,
  Ir: 62,
  Th: 63,
  Tz: 64,
  Za: 65,
  Mm: 66,
  Co: 67,
  Kr: 68,
  Ke: 69,
  Ar: 70,
  Dz: 71,
  Sd: 72,
  Ug: 73,
  Iq: 74,
  Ca: 75,
  Ma: 76,
  Uz: 77,
  Sa: 78,
  Ye: 79,
  Pe: 80,
  Ao: 81,
  My: 82,
  Af: 83,
  Mz: 84,
  Gh: 85,
  Ci: 86,
  Np: 87,
  Ve: 88,
  Mg: 89,
  Au: 90,
  Kp: 91,
  Cm: 92,
  Ne: 93,
  Tw: 94,
  Ml: 95,
  Bf: 96,
  Lk: 97,
  Sy: 98,
  Mw: 99,
  Cl: 100,
  Kz: 101,
  Zm: 102,
  Ec: 103,
  So: 104,
  Sn: 105,
  Gt: 106,
  Td: 107,
  Kh: 108,
  Zw: 109,
  Ss: 110,
  Rw: 111,
  Gn: 112,
  Bi: 113,
  Bj: 114,
  Bo: 115,
  Tn: 116,
  Ht: 117,
  Jo: 118,
  Cu: 119,
  Do: 120,
  Az: 121,
  Il: 122,
  Tj: 123,
  Hn: 124,
  Ae: 125,
  Sl: 126,
  Tg: 127,
  La: 128,
  Kg: 129,
  Tm: 130,
  Ly: 131,
  Sv: 132,
  Ni: 133,
  Py: 134,
  Cg: 135,
  Sg: 136,
  Cf: 137,
  Lb: 138,
  Ps: 139,
  Cr: 140,
  Lr: 141,
  Nz: 142,
  Om: 143,
  Kw: 144,
  Mr: 145,
  Pa: 146,
  Er: 147,
  Ge: 148,
  Uy: 149,
  Mn: 150,
  Am: 151,
  Jm: 152,
  Qa: 153,
  Na: 154,
  Gm: 155,
  Bw: 156,
  Ls: 157,
  Ga: 158,
  Gw: 159,
  Xk: 160,
  Bh: 161,
  Gq: 162,
  Tt: 163,
  Tl: 164,
} as const;

export type DocumentCountry =
  (typeof DocumentCountry)[keyof typeof DocumentCountry];

export interface Document {
  role: DocumentRole;
  country: DocumentCountry;
  page: DocumentPage;
  code: number;
}

export interface DocumentControllerConfiguration {
  showVisualisation: boolean;
  showHelperVisualisation: boolean;
  showDebugVisualisation: boolean;
  dataType: 'picture' | 'video';
  role?: DocumentRole;
  country: DocumentCountry;
  page?: DocumentPage;
  code?: number;
  documents?: Document[];
  settings?: {[key: string]: any};
}

export interface DocumentPictureViewProps extends ViewProps {
  configuration: DocumentControllerConfiguration;
}
