export type ZenIdResponseType = {
  ErrorCode: null | any;
  ErrorText: null | any;
  ImagePageCount: number;
  ImageUrlFormat: string;
  MessageType: string;
  MinedData: MinedDataType;
  ParentSampleID: null | any;
  ProcessingTimeMs: number;
  ProjectedImage: ProjectedImageType;
  RawFieldsOcr: RawFieldsOcrType[];
  SampleID: string;
  SampleType: string;
  State: string;
  Subsamples: null | any;
  UploadSessionID: string;
  UploadTime: string;
};

export type MinedDataType = {
  Address: null | any;
  Authority: null | any;
  BirthAddress: BirthAddressType;
  BirthCertificateNumber: null | any;
  BirthDate: BirthDateType;
  BirthLastName: null | any;
  BirthNumber: null | any;
  CarNumber: null | any;
  DocumentCode: string;
  DocumentCountry: string;
  DocumentRole: string;
  DrivinglicenseNumber: null | any;
  ExpiryDate: ExpiryDateType;
  EyesColor: null | any;
  FathersBirthDate: null | any;
  FathersBirthNumber: null | any;
  FathersBirthSurname: null | any;
  FathersName: null | any;
  FathersSurname: null | any;
  FirstName: FirstNameType;
  FirstNameOfParents: null | any;
  GunlicenseNumber: null | any;
  HealthInsuranceCardNumber: null | any;
  HealthInsuranceNumber: null | any;
  Height: null | any;
  IdcardNumber: IdcardNumberType;
  InsuranceCompanyCode: null | any;
  IssueDate: IssueDateType;
  IssuingCountry: IssuingCountryType;
  LastName: LastNameType;
  MaritalStatus: null | any;
  MothersBirthDate: null | any;
  MothersBirthNumber: null | any;
  MothersBirthSurname: null | any;
  MothersName: null | any;
  MothersSurname: null | any;
  Mrz: null | any;
  Nationality: NationalityType;
  PageCode: string;
  PassportNumber: null | any;
  Photo: PhotoType;
  ResidencyNumber: null | any;
  ResidencyNumberPhoto: null | any;
  ResidencyPermitCode: null | any;
  ResidencyPermitDescription: null | any;
  Sex: SexType;
  SpecialRemarks: null | any;
  Titles: null | any;
  TitlesAfter: null | any;
  VisaNumber: null | any;
};

export type BirthAddressType = {
  Confidence: number;
  Text: string;
};

export type BirthDateType = {
  Confidence: number;
  Date: string;
  Text: string;
};

export type FirstNameType = {
  Confidence: number;
  Text: string;
};

export type IdcardNumberType = {
  Confidence: number;
  Text: string;
};

export type IssueDateType = {
  Confidence: number;
  Date: string;
  Text: string;
};

export type IssuingCountryType = {
  Confidence: number;
  Text: string;
};

export type LastNameType = {
  Confidence: number;
  Text: string;
};

export type NationalityType = {
  Confidence: number;
  Text: string;
};

export type PhotoType = {
  Confidence: number;
  EyesInfo: any;
  FromNfc: boolean;
  HasHeadWear: boolean;
  HasOccludedMouth: boolean;
  HasSunGlasses: boolean;
  ImageData: any;
  Text: string;
};

export type ExpiryDateType = {
  Confidence: number;
  Date: string;
  Text: string;
};

export type SexType = {
  Confidence: number;
  Sex: string;
  Text: string;
};

export type ProjectedImageType = {
  AsText: string;
  IsNull: boolean;
};

export type RawFieldsOcrType = {
  Confidence: number;
  FieldId: string;
  OrcRawResult: string;
  OrcResult: string;
  OutlineInProjectedImage: any;
};
