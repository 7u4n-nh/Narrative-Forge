/**
 * Complex condition evaluator for Narrative Forge #if blocks.
 *
 * Supports:
 *   Comparisons: == != > < >= <=
 *   Logic:       && || !  (also and / or / not)
 *   Parentheses: ( )
 *   Literals:    numbers, booleans (true/false), strings ("..." or '...')
 *   Variables:   identifiers like trust_brandon, player_age, magic_color
 *
 * Examples:
 *   trust_brandon >= 30
 *   player_sex == "male" && player_age < 23
 *   !(asked_mother) || magic_color == "black"
 *   (trust_brandon >= 50 and affection_brandon > 20) or route_brandon
 */

export type VarType = "number" | "boolean" | "string";

export type VariableMap = Record<
  string,
  { type: VarType; value: string | number | boolean }
>;

export type EvalResult =
  | { ok: true; value: boolean }
  | { ok: false; error: string };

type Token =
  | { kind: "number"; value: number }
  | { kind: "string"; value: string }
  | { kind: "boolean"; value: boolean }
  | { kind: "ident"; value: string }
  | { kind: "op"; value: string }
  | { kind: "lparen" }
  | { kind: "rparen" };

function tokenize(input: string): Token[] | string {
  const tokens: Token[] = [];
  let i = 0;
  const s = input.trim();

  while (i < s.length) {
    const c = s[i];

    if (/\s/.test(c)) {
      i++;
      continue;
    }

    if (c === "(") {
      tokens.push({ kind: "lparen" });
      i++;
      continue;
    }
    if (c === ")") {
      tokens.push({ kind: "rparen" });
      i++;
      continue;
    }

    const two = s.slice(i, i + 2);
    if (
      two === "==" ||
      two === "!=" ||
      two === ">=" ||
      two === "<=" ||
      two === "&&" ||
      two === "||"
    ) {
      tokens.push({ kind: "op", value: two });
      i += 2;
      continue;
    }
    if (c === ">" || c === "<" || c === "!") {
      tokens.push({ kind: "op", value: c });
      i++;
      continue;
    }

    if (c === '"' || c === "'") {
      const quote = c;
      i++;
      let value = "";
      while (i < s.length && s[i] !== quote) {
        if (s[i] === "\\" && i + 1 < s.length) {
          value += s[i + 1];
          i += 2;
        } else {
          value += s[i];
          i++;
        }
      }
      if (i >= s.length) return "Unterminated string literal";
      i++;
      tokens.push({ kind: "string", value });
      continue;
    }

    if (
      /[0-9]/.test(c) ||
      (c === "-" && i + 1 < s.length && /[0-9]/.test(s[i + 1]))
    ) {
      let num = "";
      if (c === "-") {
        num += "-";
        i++;
      }
      while (i < s.length && /[0-9.]/.test(s[i])) {
        num += s[i];
        i++;
      }
      const n = Number(num);
      if (Number.isNaN(n)) return `Invalid number: ${num}`;
      tokens.push({ kind: "number", value: n });
      continue;
    }

    if (/[a-zA-Z_]/.test(c)) {
      let ident = "";
      while (i < s.length && /[a-zA-Z0-9_]/.test(s[i])) {
        ident += s[i];
        i++;
      }
      const lower = ident.toLowerCase();
      if (lower === "true") {
        tokens.push({ kind: "boolean", value: true });
      } else if (lower === "false") {
        tokens.push({ kind: "boolean", value: false });
      } else if (lower === "and" || lower === "or" || lower === "not") {
        tokens.push({ kind: "op", value: lower });
      } else {
        tokens.push({ kind: "ident", value: ident });
      }
      continue;
    }

    return `Unexpected character: ${c}`;
  }

  return tokens;
}

type Value = string | number | boolean;

function resolveIdent(name: string, vars: VariableMap): Value | string {
  const entry = vars[name];
  if (!entry) return `Unknown variable: ${name}`;
  if (entry.type === "number") return Number(entry.value);
  if (entry.type === "boolean") {
    if (typeof entry.value === "boolean") return entry.value;
    return entry.value === "true" || entry.value === true;
  }
  return String(entry.value);
}

function isErrorMsg(s: string): boolean {
  return (
    s.startsWith("Unknown") ||
    s.startsWith("Unexpected") ||
    s.startsWith("Missing") ||
    s.startsWith("Invalid") ||
    s.startsWith("Unterminated")
  );
}

class Parser {
  private pos = 0;
  constructor(
    private tokens: Token[],
    private vars: VariableMap,
  ) {}

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private next(): Token | undefined {
    return this.tokens[this.pos++];
  }

  private expectOp(...ops: string[]): string | null {
    const t = this.peek();
    if (t?.kind === "op" && ops.includes(t.value)) {
      this.next();
      return t.value;
    }
    return null;
  }

  parse(): Value | string {
    const result = this.parseOr();
    if (this.pos < this.tokens.length) {
      return "Unexpected tokens after expression";
    }
    return result;
  }

  private parseOr(): Value | string {
    let left = this.parseAnd();
    if (typeof left === "string" && isErrorMsg(left)) return left;

    while (this.expectOp("||", "or")) {
      const right = this.parseAnd();
      if (typeof right === "string" && isErrorMsg(right)) return right;
      left = Boolean(left) || Boolean(right);
    }
    return left;
  }

  private parseAnd(): Value | string {
    let left = this.parseNot();
    if (typeof left === "string" && isErrorMsg(left)) return left;

    while (this.expectOp("&&", "and")) {
      const right = this.parseNot();
      if (typeof right === "string" && isErrorMsg(right)) return right;
      left = Boolean(left) && Boolean(right);
    }
    return left;
  }

  private parseNot(): Value | string {
    if (this.expectOp("!", "not")) {
      const inner = this.parseNot();
      if (typeof inner === "string" && isErrorMsg(inner)) return inner;
      return !Boolean(inner);
    }
    return this.parseComparison();
  }

  private parseComparison(): Value | string {
    const left = this.parsePrimary();
    if (typeof left === "string" && isErrorMsg(left)) return left;

    const op = this.expectOp("==", "!=", ">", "<", ">=", "<=");
    if (!op) return left;

    const right = this.parsePrimary();
    if (typeof right === "string" && isErrorMsg(right)) return right;

    switch (op) {
      case "==":
        return left == right;
      case "!=":
        return left != right;
      case ">":
        return Number(left) > Number(right);
      case "<":
        return Number(left) < Number(right);
      case ">=":
        return Number(left) >= Number(right);
      case "<=":
        return Number(left) <= Number(right);
      default:
        return `Unknown operator: ${op}`;
    }
  }

  private parsePrimary(): Value | string {
    const t = this.peek();
    if (!t) return "Unexpected end of expression";

    if (t.kind === "lparen") {
      this.next();
      const inner = this.parseOr();
      if (typeof inner === "string" && isErrorMsg(inner)) return inner;
      const close = this.next();
      if (close?.kind !== "rparen") return "Missing closing parenthesis";
      return inner;
    }

    if (t.kind === "number" || t.kind === "string" || t.kind === "boolean") {
      this.next();
      return t.value;
    }

    if (t.kind === "ident") {
      this.next();
      return resolveIdent(t.value, this.vars);
    }

    return `Unexpected token: ${JSON.stringify(t)}`;
  }
}

/** Evaluate a condition expression against a variable map. */
export function evaluateCondition(
  expression: string,
  vars: VariableMap,
): EvalResult {
  if (!expression.trim()) {
    return { ok: false, error: "Empty expression" };
  }

  const tokens = tokenize(expression);
  if (typeof tokens === "string") {
    return { ok: false, error: tokens };
  }
  if (tokens.length === 0) {
    return { ok: false, error: "Empty expression" };
  }

  try {
    const parser = new Parser(tokens, vars);
    const result = parser.parse();
    if (typeof result === "string" && isErrorMsg(result)) {
      return { ok: false, error: result };
    }
    return { ok: true, value: Boolean(result) };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Evaluation failed",
    };
  }
}

/** Build a VariableMap from API variable records. */
export function buildVariableMap(
  records: Array<{ key: string; type: string; value: string }>,
): VariableMap {
  const map: VariableMap = {};
  for (const r of records) {
    const type = (
      r.type === "number" || r.type === "boolean" || r.type === "string"
        ? r.type
        : "string"
    ) as VarType;
    let value: string | number | boolean = r.value;
    if (type === "number") value = Number(r.value);
    if (type === "boolean") value = r.value === "true";
    map[r.key] = { type, value };
  }
  return map;
}

/** Apply choice effects (set / add / sub) to a variable map. */
export function applyEffects(
  vars: VariableMap,
  effects: Array<{
    key: string;
    op: "set" | "add" | "sub";
    value: string | number | boolean;
  }>,
): VariableMap {
  const next = { ...vars };
  for (const effect of effects) {
    const current = next[effect.key];
    if (effect.op === "set") {
      const type: VarType =
        typeof effect.value === "number"
          ? "number"
          : typeof effect.value === "boolean"
            ? "boolean"
            : "string";
      next[effect.key] = { type, value: effect.value };
    } else if (effect.op === "add" && current) {
      next[effect.key] = {
        type: "number",
        value: Number(current.value) + Number(effect.value),
      };
    } else if (effect.op === "sub" && current) {
      next[effect.key] = {
        type: "number",
        value: Number(current.value) - Number(effect.value),
      };
    } else if (effect.op === "add") {
      next[effect.key] = { type: "number", value: Number(effect.value) };
    }
  }
  return next;
}
