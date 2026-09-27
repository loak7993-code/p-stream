import { useCallback, useState } from "react";

import {
  DownloadMedia,
  DownloadProgress,
  WebQuality,
  downloadVariant,
  resolveQualities,
} from "@/backend/downloads/webDownloader";
import { Button } from "@/components/buttons/Button";

export interface DownloadButtonProps {
  media: DownloadMedia;
}

export function DownloadButton({ media }: DownloadButtonProps) {
  const [open, setOpen] = useState(false);
  const [qualities, setQualities] = useState<WebQuality[]>([]);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileName = useCallback(() => {
    if (media.type === "show" && media.season && media.episode) {
      return `${media.title} S${String(media.season.number).padStart(2, "0")}E${String(media.episode.number).padStart(2, "0")}`;
    }
    return `${media.title} (${media.releaseYear})`;
  }, [media]);

  const startResolve = useCallback(async () => {
    setError(null);
    setProgress({ phase: "resolving", pct: 0 });
    try {
      const qs = await resolveQualities(media);
      setQualities(qs);
      setProgress(null);
      setOpen(true);
    } catch (e) {
      setProgress(null);
      setError(e instanceof Error ? e.message : "resolve failed");
    }
  }, [media]);

  const startDownload = useCallback(
    async (q: WebQuality) => {
      setOpen(false);
      try {
        await downloadVariant(q.url, fileName(), setProgress);
      } catch (e) {
        setProgress(null);
        setError(e instanceof Error ? e.message : "download failed");
      }
    },
    [fileName],
  );

  const busy =
    progress?.phase === "resolving" || progress?.phase === "downloading";

  return (
    <div className="mt-3">
      {progress?.phase === "downloading" ? (
        <div className="w-full max-w-sm">
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-buttons-pill-highlight transition-all"
              style={{ width: `${Math.round(progress.pct)}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-type-dimmed">
            Downloading… {Math.round(progress.pct)}%
          </p>
        </div>
      ) : (
        <Button theme="purple" onClick={startResolve} disabled={busy}>
          {busy ? "Resolving…" : "↓ Download"}
        </Button>
      )}
      {error && <p className="mt-1.5 text-xs text-type-danger">⚠ {error}</p>}

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 w-72 rounded-xl border border-type-divider bg-opacity-95 bg-background-main p-4 shadow-2xl">
          <p className="mb-3 font-semibold text-type-emphasis">
            Download quality
          </p>
          <div className="space-y-1.5">
            {qualities.map((q) => (
              <button
                key={q.label}
                type="button"
                className="flex w-full items-center justify-between rounded-lg bg-background-secondary px-3 py-2 text-left transition hover:bg-background-secondaryHover"
                onClick={() => startDownload(q)}
              >
                <span className="text-type-text">{q.label}</span>
                {q.width > 0 && (
                  <span className="text-xs text-type-dimmed">
                    {q.width}×{q.height}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
