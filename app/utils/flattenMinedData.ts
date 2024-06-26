import {MinedDataType} from '../../lib/ZenId';

type FlatDataType = {key: string; value: string | null};
type IndexedDataType = {[key: string]: any};
export function flattenMinedData(
  data: MinedDataType & IndexedDataType,
): FlatDataType[] {
  const flatData: FlatDataType[] = [];

  function extractText(value: any, prefix: string = ''): void {
    if (value === null || value === undefined) {
      return;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          extractText(value[key], `${prefix}${key}.`);
        }
      }
    } else if (typeof value === 'string') {
      flatData.push({key: prefix.slice(0, -1), value});
    }
  }

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      extractText(data[key], `${key}.`);
    }
  }

  return flatData;
}
