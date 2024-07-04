import {
  DocumentControllerConfiguration,
  DocumentCountry,
  DocumentPage,
  DocumentRole,
} from '../../lib/ZenId';

export const idConfiguration: DocumentControllerConfiguration = {
  showVisualisation: true,
  showHelperVisualisation: false,
  showDebugVisualisation: false,
  dataType: 'picture',
  role: DocumentRole.Idc,
  country: DocumentCountry.Cz,
  page: DocumentPage.Front,
  code: 1234,
  documents: [
    {
      role: DocumentRole.Idc,
      country: DocumentCountry.Cz,
      page: DocumentPage.Front,
      code: 1234,
    },
  ],
  settings: {key: 'value'},
};

export const idBackConfiguration: DocumentControllerConfiguration = {
  showVisualisation: true,
  showHelperVisualisation: false,
  showDebugVisualisation: false,
  dataType: 'picture',
  role: DocumentRole.Idc,
  country: DocumentCountry.Cz,
  page: DocumentPage.Back,
  code: 1234,
  documents: [
    {
      role: DocumentRole.Idc,
      country: DocumentCountry.Cz,
      page: DocumentPage.Back,
      code: 1234,
    },
  ],
  settings: {key: 'value'},
};

export const rkConfiguration: DocumentControllerConfiguration = {
  showVisualisation: true,
  showHelperVisualisation: false,
  showDebugVisualisation: false,
  dataType: 'picture',
  role: DocumentRole.Drv,
  country: DocumentCountry.Cz,
  page: DocumentPage.Front,
  code: 1234,
  documents: [
    {
      role: DocumentRole.Drv,
      country: DocumentCountry.Cz,
      page: DocumentPage.Front,
      code: 1234,
    },
  ],
  settings: {key: 'value'},
};

export const pasConfiguration: DocumentControllerConfiguration = {
  showVisualisation: true,
  showHelperVisualisation: false,
  showDebugVisualisation: false,
  dataType: 'picture',
  role: DocumentRole.Pas,
  country: DocumentCountry.Cz,
  page: DocumentPage.Front,
  code: 1234,
  documents: [
    {
      role: DocumentRole.Pas,
      country: DocumentCountry.Cz,
      page: DocumentPage.Front,
      code: 1234,
    },
  ],
  settings: {key: 'value'},
};
