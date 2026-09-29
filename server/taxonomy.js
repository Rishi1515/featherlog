const cache = new Map();
export async function verifyTaxonomy(result) {
  if (!result.bird || !result.scientific) return result;
  try {
    const name = result.scientific.trim();
    if (cache.has(name)) return { ...result, ...cache.get(name) };
    const response = await fetch(`https://api.gbif.org/v1/species/match?strict=true&name=${encodeURIComponent(name)}`, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Taxonomy unavailable');
    const match = await response.json();
    if (match.matchType !== 'EXACT' || match.class !== 'Aves' || match.rank !== 'SPECIES') return { ...result, taxonomyVerified: false, reason: `${result.reason} Species name could not be verified; review required.` };
    const key = match.acceptedUsageKey || match.usageKey;
    const namesResponse = await fetch(`https://api.gbif.org/v1/species/${key}/vernacularNames?limit=100`, { signal: AbortSignal.timeout(10000) });
    if (!namesResponse.ok) throw new Error('Names unavailable');
    const names = (await namesResponse.json()).results.filter(n => n.language === 'eng' && n.vernacularName.length > 4);
    const common = names.find(n => n.vernacularName.toLowerCase() === result.common.toLowerCase()) || names.find(n => n.preferred) || names[0];
    const verified = { scientific: match.canonicalName, common: common?.vernacularName || match.canonicalName, taxonomyVerified: true, taxonomySource: `https://www.gbif.org/species/${key}` };
    cache.set(name, verified);
    return { ...result, ...verified };
  } catch {
    return { ...result, taxonomyVerified: false, reason: `${result.reason} Taxonomy lookup unavailable; review required.` };
  }
}
