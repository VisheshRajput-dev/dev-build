export type CheckResult = {
  name: string;
  passed: boolean;
  detail?: string;
};

export type TaskLike = {
  id: string;
  rubric?: { criteria?: string[] };
};

// Heuristic static checks based on simple string presence.
export function runChecks(task: TaskLike, files: Record<string, string>): CheckResult[] {
  const criteria = task.rubric?.criteria ?? [];
  const merged = Object.values(files).join("\n");

  return criteria.map((c) => ({
    name: c,
    passed: checkCriterion(c, merged),
  }));
}

function checkCriterion(criterion: string, merged: string): boolean {
  switch (criterion) {
    // Frontend login bug
    case "preventDefault":
      return /preventDefault\s*\(/.test(merged);
    case "emailValidation":
      // accept simple presence of '@' check or regex usage
      return /@/.test(merged) || /includes\(\s*['\"]@['\"]\s*\)|test\(.*@/.test(merged);
    case "passwordRequired":
      return /(password|pwd).*length\s*[<>!=]/i.test(merged);
    case "ariaLabelError":
      return /aria-live\s*=\s*\"(polite|assertive)\"|role\s*=\s*\"alert\"/i.test(merged);

    // API list
    case "loadingState":
      return /loading|spinner|Loading/.test(merged);
    case "renderItems":
      return /map\(.*\)=>|items\s*\./.test(merged);
    case "errorState":
      return /try\s*\{|catch\s*\(|error/i.test(merged);

    // Modal
    case "openClose":
      return /useState\(.*false.*\)|\bopen\b.*setOpen|setOpen\(\s*!?open\s*\)/.test(merged);
    case "focusTrap":
      return /tabIndex=\"-1\"|focus\(\)/.test(merged);
    case "escClose":
      return /onKeyDown|keydown/.test(merged) && /Escape/.test(merged);

    // Accessibility
    case "labels":
      return /<label[^>]*htmlFor=|aria-label=/.test(merged);
    case "ariaLive":
      return /aria-live=\"(polite|assertive)\"/.test(merged);
    case "tabOrder":
      return /tabIndex=/.test(merged);

    // Controlled input
    case "controlled":
      return /useState\(/.test(merged) && /value=/.test(merged) && /onChange=/.test(merged);
    case "minLength":
      return /\.length\s*[<>!=]=?\s*\d+/.test(merged);
    case "liveFeedback":
      return /set(State|Error)|set[A-Z][A-Za-z]+/.test(merged);

    // List filter
    case "filters":
      return /filter\(/.test(merged) && /includes\(/.test(merged);
    case "emptyState":
      return /No results|No items/.test(merged);

    // Backend validate
    case "validOk":
      return /return\s*\{\s*ok:\s*true/.test(merged);
    case "invalidCodes":
      return /errors\s*:\s*\{/.test(merged);

    // Mapper
    case "exists409":
      return /409/.test(merged);
    case "invalid400":
      return /400/.test(merged);
    case "default500":
      return /500/.test(merged);

    // Loading/error/data
    case "spinner":
      return /Loading|Spinner/i.test(merged);
    case "error":
      return /Error/i.test(merged);
    case "data":
      return /\{\s*data|items\s*\}/.test(merged) || /map\(/.test(merged);

    // Tabs
    case "arrowNav":
      return /Arrow(Left|Right)|key/gi.test(merged) && /tablist|role=\"tab\"/.test(merged);
    case "panelVisible":
      return /aria-selected|aria-controls/.test(merged);

    // Toast
    case "appear":
      return /showToast|toast\(/i.test(merged) || /set(State|Show)/.test(merged);
    case "autoHide":
      return /setTimeout\(/.test(merged);

    // POST form
    case "postJson":
      return /fetch\(.*method:\s*['\"]POST['\"]/s.test(merged) && /application\/json/.test(merged);
    case "success":
      return /res\.ok|status\s*===\s*200/.test(merged);
    case "failure":
      return /!res\.ok|throw\s*new/.test(merged);

    // aria-live counter
    case "hasRegion":
      return /aria-live=\"(polite|assertive)\"|role=\"status\"/.test(merged);
    case "announces":
      return /textContent|innerText|set(State|Message)/.test(merged);

    default:
      // Unknown criteria: don't fail hard; treat as not passed so it's visible.
      return false;
  }
}


