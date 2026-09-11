import { FOUNDATION_COLOR_SAMPLES } from "./foundations-colors-section.constants";
import { foundationsColorsSectionStyles } from "./foundations-colors-section.styles";

export function FoundationsColorsSection() {
  return (
    <section className={foundationsColorsSectionStyles.root} aria-labelledby="colors-title">
      <div>
        <h2 id="colors-title" className={foundationsColorsSectionStyles.title}>
          Cores categóricas
        </h2>
        <p className={foundationsColorsSectionStyles.description}>
          Amostras identificadas por texto, sem significado de produto.
        </p>
      </div>
      <ul className={foundationsColorsSectionStyles.grid} aria-label="Amostras de cor">
        {FOUNDATION_COLOR_SAMPLES.map((sample) => (
          <li key={sample.tone} className={foundationsColorsSectionStyles.sample[sample.tone]}>
            {sample.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
