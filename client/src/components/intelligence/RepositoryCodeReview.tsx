
"use client";

import { useState } from "react";
import { reviewRepositoryCode } from "@/services/repositoryCodeReview.service";

interface Finding {
  severity: "HIGH" | "MEDIUM" | "LOW";
  category: string;
  title: string;
  description: string;
  suggestion: string;
  line: number | null;
}

interface ReviewResult {
  filePath: string;
  truncated: boolean;
  review: {
    summary: string;
    findings: Finding[];
  };
}

interface Props {
  repositoryId: string;
  filePath: string;
  onSelectLine: (line: number) => void;
}

export default function RepositoryCodeReview({
  repositoryId,
  filePath,
  onSelectLine,
}: Props) {
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleReview = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const response = await reviewRepositoryCode(
        repositoryId,
        filePath
      );

      if (!response.success) {
        throw new Error(response.message || "Code review failed");
      }

      setResult(response.result);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to review code"
      );
    } finally {
      setLoading(false);
    }
  };

  const findings = result?.review.findings || [];

  const counts = {
    HIGH: findings.filter((f) => f.severity === "HIGH").length,
    MEDIUM: findings.filter((f) => f.severity === "MEDIUM").length,
    LOW: findings.filter((f) => f.severity === "LOW").length,
  };

  const filteredFindings =
    filter === "ALL"
      ? findings
      : findings.filter((f) => f.severity === filter);

  const severityStyles: Record<string, string> = {
    HIGH: "bg-red-500/10 text-red-500 border-red-500/20",
    MEDIUM: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    LOW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <div className="space-y-5 rounded-xl border border-white/10 p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">AI Code Review</h2>
          <p className="mt-1 text-sm text-muted-foreground break-all">
            {filePath}
          </p>
        </div>

        <button
          onClick={handleReview}
          disabled={loading || !filePath}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          {loading ? "Reviewing..." : "Review Code"}
        </button>
      </div>

      {loading && (
        <div className="rounded-lg bg-muted/40 p-5 text-center text-sm">
          AI is analyzing your code...
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {(["HIGH", "MEDIUM", "LOW"] as const).map((severity) => (
              <div
                key={severity}
                className="rounded-lg border border-white/10 p-3"
              >
                <p className="text-xs text-muted-foreground">
                  {severity}
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {counts[severity]}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-lg bg-muted/40 p-4">
            <h3 className="mb-2 font-medium">Review Summary</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {result.review.summary}
            </p>

            {result.truncated && (
              <p className="mt-2 text-xs text-yellow-500">
                The file was truncated before analysis.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {["ALL", "HIGH", "MEDIUM", "LOW"].map((severity) => (
              <button
                key={severity}
                onClick={() => setFilter(severity)}
                className={`rounded-lg border px-3 py-1.5 text-xs ${
                  filter === severity
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-white/10 text-muted-foreground"
                }`}
              >
                {severity}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredFindings.map((finding, index) => (
  <div
    key={index}
    className="overflow-hidden rounded-lg border border-white/10"
  >
    <div className="flex items-center justify-between gap-3 p-4">
      <button
        onClick={() =>
          setExpanded(expanded === index ? null : index)
        }
        className="min-w-0 flex-1 text-left"
      >
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-md border px-2 py-1 text-xs font-medium ${
                severityStyles[finding.severity]
              }`}
            >
              {finding.severity}
            </span>

            <span className="text-xs text-muted-foreground">
              {finding.category}
            </span>
          </div>

          <h3 className="text-sm font-medium">
            {finding.title}
          </h3>
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-3">
        {finding.line !== null && (
          <button
            onClick={() => onSelectLine(finding.line!)}
            className="rounded-md bg-yellow-500/10 px-2 py-1 text-xs text-yellow-500 hover:bg-yellow-500/20"
          >
            Line {finding.line} ↗
          </button>
        )}

        <button
          onClick={() =>
            setExpanded(expanded === index ? null : index)
          }
          className="text-muted-foreground"
        >
          {expanded === index ? "−" : "+"}
        </button>
      </div>
    </div>

    {expanded === index && (
      <div className="space-y-4 border-t border-white/10 p-4">
        <div>
          <h4 className="mb-1 text-sm font-medium">
            Description
          </h4>
          <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
            {finding.description}
          </p>
        </div>

        <div>
          <h4 className="mb-1 text-sm font-medium">
            Suggested Fix
          </h4>
          <pre className="whitespace-pre-wrap break-words rounded-lg bg-muted/50 p-3 text-sm leading-6">
            {finding.suggestion}
          </pre>
        </div>
      </div>
    )}
  </div>
))}

            {filteredFindings.length === 0 && (
              <p className="rounded-lg bg-muted/40 p-5 text-center text-sm text-muted-foreground">
                No findings in this category.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}