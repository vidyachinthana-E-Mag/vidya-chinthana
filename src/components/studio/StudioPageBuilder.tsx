import { useState } from "react";
import { Reorder, motion } from "motion/react";
import { SiteConfig } from "../../types/site";
import {
  CustomPage,
  PageBlock,
  PageBlockType,
  newBlock,
  newCustomPage,
} from "../../types/pageBuilder";
import BlockRenderer from "../builder/BlockRenderer";
import {
  GripVertical,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Layers,
} from "lucide-react";

const BLOCK_TYPES: { type: PageBlockType; label: string }[] = [
  { type: "hero", label: "Hero" },
  { type: "richtext", label: "Rich text" },
  { type: "image", label: "Image" },
  { type: "columns", label: "2 columns" },
  { type: "article_grid", label: "Article grid" },
  { type: "cta", label: "Button CTA" },
  { type: "divider", label: "Divider" },
  { type: "spacer", label: "Spacer" },
];

function BlockInspector({
  block,
  onChange,
}: {
  block: PageBlock;
  onChange: (props: Record<string, string | boolean | number>) => void;
}) {
  const fields = Object.keys(block.props);
  if (fields.length === 0) return <p className="text-[10px] text-white/30">No editable fields</p>;

  return (
    <div className="space-y-2 max-h-48 overflow-y-auto">
      {fields.map((key) => (
        <div key={key}>
          <span className="text-[8px] text-white/30 uppercase">{key}</span>
          <input
            value={String(block.props[key] ?? "")}
            onChange={(e) => onChange({ ...block.props, [key]: e.target.value })}
            className="studio-input w-full px-2 py-1.5 text-[10px] mt-0.5"
          />
        </div>
      ))}
    </div>
  );
}

export default function StudioPageBuilder({
  draft,
  onPatch,
}: {
  draft: SiteConfig;
  onPatch: (fn: (c: SiteConfig) => SiteConfig) => void;
}) {
  const pages = draft.customPages;
  const [activeId, setActiveId] = useState(pages[0]?.id ?? "");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [canvasMode, setCanvasMode] = useState<"edit" | "preview">("edit");

  const activePage = pages.find((p) => p.id === activeId) ?? pages[0];

  const updatePages = (fn: (pages: CustomPage[]) => CustomPage[]) => {
    onPatch((c) => {
      c.customPages = fn(c.customPages);
      return c;
    });
  };

  const updatePage = (pageId: string, fn: (p: CustomPage) => CustomPage) => {
    updatePages((list) => list.map((p) => (p.id === pageId ? fn(structuredClone(p)) : p)));
  };

  const addPage = () => {
    const pg = newCustomPage();
    updatePages((list) => [...list, pg]);
    setActiveId(pg.id);
  };

  const duplicatePage = () => {
    if (!activePage) return;
    const copy: CustomPage = {
      ...structuredClone(activePage),
      id: `pg-${Date.now()}`,
      slug: `${activePage.slug}-copy`,
      titleEn: `${activePage.titleEn} (copy)`,
    };
    updatePages((list) => [...list, copy]);
    setActiveId(copy.id);
  };

  const addToNav = () => {
    if (!activePage) return;
    onPatch((c) => {
      const exists = c.navItems.some((n) => n.page === `page:${activePage.slug}`);
      if (!exists) {
        c.navItems.push({
          id: `nav-${activePage.id}`,
          page: `page:${activePage.slug}`,
          labelEn: activePage.titleEn,
          labelSi: activePage.titleSi,
          visible: true,
        });
      }
      return c;
    });
  };

  if (!activePage) {
    return (
      <div className="space-y-4">
        <p className="text-[10px] text-white/40">Create custom pages with drag-and-drop blocks.</p>
        <button type="button" onClick={addPage} className="w-full py-3 rounded-lg border border-dashed border-cyan-500/40 text-cyan-300 text-xs cursor-pointer">
          + New page
        </button>
      </div>
    );
  }

  const selectedBlock = activePage.blocks.find((b) => b.id === selectedBlockId);

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setCanvasMode("edit")}
          className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded cursor-pointer ${canvasMode === "edit" ? "bg-cyan-500/20 text-cyan-300" : "text-white/40"}`}
        >
          Builder
        </button>
        <button
          type="button"
          onClick={() => setCanvasMode("preview")}
          className={`flex-1 py-1.5 text-[9px] font-bold uppercase rounded cursor-pointer ${canvasMode === "preview" ? "bg-cyan-500/20 text-cyan-300" : "text-white/40"}`}
        >
          Preview
        </button>
      </div>

      <div className="flex gap-1 flex-wrap">
        {pages.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setActiveId(p.id);
              setSelectedBlockId(null);
            }}
            className={`text-[9px] px-2 py-1 rounded border cursor-pointer ${
              p.id === activeId ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-200" : "border-white/10 text-white/40"
            }`}
          >
            {p.titleEn.slice(0, 12)}
          </button>
        ))}
        <button type="button" onClick={addPage} className="p-1 rounded border border-white/10 cursor-pointer text-cyan-400" title="New page">
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex gap-1">
        <button type="button" onClick={duplicatePage} className="p-1.5 rounded hover:bg-white/10 cursor-pointer" title="Duplicate">
          <Copy className="w-3 h-3 text-white/50" />
        </button>
        <button type="button" onClick={addToNav} className="text-[9px] px-2 py-1 rounded border border-white/10 cursor-pointer text-white/50">
          + Nav
        </button>
        <a
          href={`#/page/${activePage.slug}`}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 rounded hover:bg-white/10 text-white/50"
          title="Open page"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <div className="space-y-1.5">
        <span className="text-[9px] text-white/30">Slug (URL: #/page/slug)</span>
        <input
          value={activePage.slug}
          onChange={(e) =>
            updatePage(activePage.id, (p) => {
              p.slug = e.target.value.replace(/[^a-z0-9-]/gi, "").toLowerCase();
              return p;
            })
          }
          className="studio-input w-full px-2 py-1.5 text-xs font-mono"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input
          value={activePage.titleEn}
          onChange={(e) => updatePage(activePage.id, (p) => { p.titleEn = e.target.value; return p; })}
          className="studio-input px-2 py-1.5 text-[10px]"
          placeholder="Title EN"
        />
        <input
          value={activePage.titleSi}
          onChange={(e) => updatePage(activePage.id, (p) => { p.titleSi = e.target.value; return p; })}
          className="studio-input px-2 py-1.5 text-[10px]"
          placeholder="Title SI"
        />
      </div>

      {canvasMode === "preview" ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] max-h-64 overflow-y-auto p-2 scale-[0.85] origin-top">
          <BlockRenderer blocks={activePage.blocks} preview />
        </div>
      ) : (
        <>
          <p className="text-[10px] text-white/40 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Drag blocks to reorder
          </p>
          <Reorder.Group
            axis="y"
            values={activePage.blocks}
            onReorder={(blocks) => updatePage(activePage.id, (p) => { p.blocks = blocks; return p; })}
            className="space-y-1.5"
          >
            {activePage.blocks.map((block) => (
              <Reorder.Item
                key={block.id}
                value={block}
                onClick={() => setSelectedBlockId(block.id)}
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-grab active:cursor-grabbing ${
                  selectedBlockId === block.id
                    ? "border-cyan-500/50 bg-cyan-500/10"
                    : "border-white/[0.08] bg-black/20"
                }`}
              >
                <GripVertical className="w-3 h-3 text-white/25 shrink-0" />
                <span className="text-[10px] flex-1 capitalize">{block.type.replace("_", " ")}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updatePage(activePage.id, (p) => {
                      const b = p.blocks.find((x) => x.id === block.id);
                      if (b) b.visible = !b.visible;
                      return p;
                    });
                  }}
                  className="p-0.5 cursor-pointer"
                >
                  {block.visible ? <Eye className="w-3 h-3 text-cyan-400/80" /> : <EyeOff className="w-3 h-3 text-white/30" />}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updatePage(activePage.id, (p) => {
                      p.blocks = p.blocks.filter((x) => x.id !== block.id);
                      return p;
                    });
                    if (selectedBlockId === block.id) setSelectedBlockId(null);
                  }}
                  className="p-0.5 cursor-pointer text-red-400/80"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </Reorder.Item>
            ))}
          </Reorder.Group>

          <div className="grid grid-cols-2 gap-1.5 pt-2">
            {BLOCK_TYPES.map(({ type, label }) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  updatePage(activePage.id, (p) => {
                    p.blocks.push(newBlock(type));
                    return p;
                  })
                }
                className="text-[9px] py-2 px-1 rounded border border-dashed border-white/15 hover:border-cyan-500/30 cursor-pointer text-white/50"
              >
                + {label}
              </button>
            ))}
          </div>

          {selectedBlock && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-lg border border-cyan-500/30 bg-cyan-500/5"
            >
              <p className="text-[10px] font-bold text-cyan-400/90 mb-2 capitalize">{selectedBlock.type} properties</p>
              <BlockInspector
                block={selectedBlock}
                onChange={(props) =>
                  updatePage(activePage.id, (p) => {
                    const b = p.blocks.find((x) => x.id === selectedBlock.id);
                    if (b) b.props = props;
                    return p;
                  })
                }
              />
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
