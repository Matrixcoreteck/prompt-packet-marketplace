// Demo sample generator for the "Try This Product" section.
//
// This is intentionally a local mock — no AI API is connected yet. The async
// signature mirrors a future API call, so swapping in a real backend later
// only means replacing the body of generateSample().

export function extractVariables(prompts) {
  const vars = [];
  for (const p of prompts) {
    const matches = p.match(/\{\{([^}]+)\}\}/g) || [];
    for (const m of matches) {
      const name = m.slice(2, -2).trim();
      if (!vars.includes(name)) vars.push(name);
    }
  }
  return vars.slice(0, 3);
}

export function fillTemplate(template, values) {
  return template.replace(/\{\{([^}]+)\}\}/g, (m, name) => {
    const v = values[name.trim()];
    return v && v.trim() ? v : m;
  });
}

export async function generateSample(pack, values) {
  // Simulated latency — replace with a real AI API call later.
  await new Promise((r) => setTimeout(r, 600));
  const template =
    pack.prompts.find((p) => /\{\{[^}]+\}\}/.test(p)) || pack.prompts[0];
  return fillTemplate(template, { topic: "", ...values });
}
