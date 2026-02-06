import type { PropsWithChildren } from "react";
import type { ComponentRegistryEntry } from "component-registry";

type DemoPageProps = PropsWithChildren<{
  entry: ComponentRegistryEntry;
}>;

export function DemoPage({ entry, children }: DemoPageProps) {
  return (
    <div className="demo-detailWrap">
      <div className="demo-detailStack">
        <div className="demo-detailCard">
          <div className="demo-detailHeader">
            <h1 className="demo-detailTitle">{entry.name}</h1>
            <p className="demo-detailDescription">{entry.description}</p>
          </div>

          <div className="demo-detailSource">
            <span className="demo-detailSourceLabel">Source:</span> {entry.sourcePath}
          </div>

          {entry.tags?.length ? (
            <div className="demo-tags">
              {entry.tags.map((tag) => (
                <span key={tag} className="demo-tag">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="demo-previewPanel">{children}</div>
        </div>
      </div>
    </div>
  );
}

