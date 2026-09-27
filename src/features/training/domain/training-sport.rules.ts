const sportNameAliases: ReadonlyMap<string, string> = new Map([["futevolei", "footvolley"]]);

function normalizeSportName(name: string): string {
  const normalized = name
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
  return sportNameAliases.get(normalized) ?? normalized;
}

export function isSameTrainingSport(firstName: string, secondName: string): boolean {
  return normalizeSportName(firstName) === normalizeSportName(secondName);
}
