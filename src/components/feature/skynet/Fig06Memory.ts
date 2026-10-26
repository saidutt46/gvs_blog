/**
 * Fig06Memory: the one memory-type mapping shared by F6 (Fig06Memories)
 * and F12 (Fig12Dirs). Each type has one drawing style (CSS class
 * `mem-<key>`; the styles are repeated in both components) and the text a
 * tap shows. Colour is never the only cue: each style also has its own
 * stroke pattern, weight and fill, and its name is always written out.
 *
 *   working    : --text stroke, dashed, no fill        (short-lived)
 *   episodic   : --muted stroke, solid, --code-bg fill  (records)
 *   semantic   : --accent stroke, solid, faint accent   (facts)
 *   procedural : --accent stroke, thick, stronger accent (how we work)
 *
 * Sources: 03-architecture.md Diagram D table (lines 71-78) and
 * ~/skynet-hq/docs/06-memory.md section 1 (lines 17-22).
 */
export type MemKey = 'working' | 'episodic' | 'semantic' | 'procedural';

export interface Memory {
  key: MemKey;
  name: string;
  short: string;
  holds: string;
  example: string;
  rule: string;
}

export const MEMORIES: Memory[] = [
  {
    key: 'working',
    name: 'Working memory',
    short: 'one session’s context window',
    holds: 'A session’s context window: scarce, disposable.',
    example: 'The prompt, the handoff, the files it opened.',
    rule: 'Lost at session end; never relied on. At start it loads procedural memory, the knowledge index, and the latest handoff with its citations.',
  },
  {
    key: 'episodic',
    name: 'Episodic',
    short: 'what happened',
    holds: 'Time-stamped records.',
    example: 'Prompt/report pairs, handoffs, ledgers, the agent-to-agent message log.',
    rule: 'Append-only, time-stamped, never edited after the fact.',
  },
  {
    key: 'semantic',
    name: 'Semantic',
    short: 'what is true',
    holds: 'Distilled facts, each with a source and a verified date.',
    example: '“UI tests need the simulator booted first [src: report …] (verified …)”',
    rule: 'Merged, corrected, pruned; every fact cites its source episode.',
  },
  {
    key: 'procedural',
    name: 'Procedural',
    short: 'how we work',
    holds: 'How the crew works.',
    example: 'Skills, agent definitions, contracts, docs, scripts.',
    rule: 'Nothing edits it on its own. Changes arrive as proposals, the owner approves, and the decision is logged.',
  },
];

export const MEM_BY_KEY: Record<MemKey, Memory> = Object.fromEntries(
  MEMORIES.map((m) => [m.key, m]),
) as Record<MemKey, Memory>;
