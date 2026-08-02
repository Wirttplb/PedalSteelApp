import { readFileSync } from 'fs';

export function readJsonFile(filepath: string)
{
    const fileContent = readFileSync(filepath, 'utf-8');
    const data = JSON.parse(fileContent);

    return data;
}