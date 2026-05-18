const state = {
  startedAt: Date.now(),
  firstDraftAt: null,
  editCount: 0,
  publishReadyMarks: 0,
  publishReadyTotal: 0,
  wizardStep: 0,
  chapters: [
    { title: 'Hook', text: '' },
    { title: 'Core Idea', text: '' },
    { title: 'Closing', text: '' }
  ]
};

const ids = [
  'template',
  'importType',
  'importValue',
  'wizardState',
  'projectBrief',
  'styleGuide',
  'bannedClaims',
  'sourceNotes',
  'prompt',
  'outputFormat',
  'outline',
  'sectionCards',
  'fullDraft',
  'timeToDraft',
  'editsPer1k',
  'publishRate',
  'auditLog'
];

const el = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));

function logAction(message) {
  const item = document.createElement('li');
  item.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  el.auditLog.prepend(item);
}

function chapterWordCount() {
  return state.chapters
    .map((c) => c.text.trim().split(/\s+/).filter(Boolean).length)
    .reduce((a, b) => a + b, 0);
}

function updateMetrics() {
  if (state.firstDraftAt) {
    const secs = Math.max(1, Math.round((state.firstDraftAt - state.startedAt) / 1000));
    el.timeToDraft.textContent = `${secs}s`;
  }

  const words = chapterWordCount();
  const per1k = words ? ((state.editCount / words) * 1000).toFixed(1) : '0';
  el.editsPer1k.textContent = per1k;

  const rate = state.publishReadyTotal
    ? Math.round((state.publishReadyMarks / state.publishReadyTotal) * 100)
    : 0;
  el.publishRate.textContent = `${rate}%`;
}

function safeClaims(text, bannedClaims) {
  const banned = bannedClaims
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
  return banned.filter((claim) => text.toLowerCase().includes(claim.toLowerCase()));
}

function formatPrefix(output) {
  if (output === 'video') {
    return '[00:00]';
  }
  if (output === 'podcast') {
    return '[Host]';
  }
  if (output === 'newsletter') {
    return '[Issue]';
  }
  return '';
}

function expandSection(baseText, chapterTitle) {
  const prompt = el.prompt.value.trim() || 'Untitled idea';
  const brief = el.projectBrief.value.trim();
  const style = el.styleGuide.value.trim() || 'clear and practical';
  const sources = el.sourceNotes.value.trim();
  const importContext = `${el.importType.value}: ${el.importValue.value.trim()}`.trim();

  const paragraphs = [
    `${formatPrefix(el.outputFormat.value)} ${chapterTitle}: ${baseText || `Introduce ${prompt} with a compelling setup.`}`.trim(),
    `Develop the section with a ${style} voice while maintaining continuity with previous sections.`,
    brief ? `Project brief anchor: ${brief}.` : 'Project brief anchor: keep focus on the central outcome.',
    sources ? `Source notes grounding: ${sources}.` : 'Source notes grounding: add citations where claims are made.',
    `Imported context used: ${importContext || 'none'}.`
  ];

  return paragraphs.join('\n\n');
}

function renderOutline() {
  el.outline.innerHTML = '';
  state.chapters.forEach((chapter, idx) => {
    const item = document.createElement('li');
    item.textContent = `${idx + 1}. ${chapter.title}`;
    el.outline.appendChild(item);
  });
}

function renderSectionCards() {
  el.sectionCards.innerHTML = '';
  state.chapters.forEach((chapter, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-section';
    wrapper.innerHTML = `
      <h4>${chapter.title}</h4>
      <textarea id="chapter-${idx}" placeholder="Write section notes">${chapter.text}</textarea>
      <div class="row">
        <button data-expand="${idx}">2) Expand section</button>
      </div>
    `;
    el.sectionCards.appendChild(wrapper);
  });
}

function syncSectionsFromCards() {
  state.chapters = state.chapters.map((chapter, idx) => {
    const textArea = document.getElementById(`chapter-${idx}`);
    return {
      ...chapter,
      text: textArea ? textArea.value : chapter.text
    };
  });
}

function assembleDraft() {
  syncSectionsFromCards();
  const draft = state.chapters
    .map((c, i) => `## ${i + 1}. ${c.title}\n\n${c.text || '[empty section]'}`)
    .join('\n\n');
  const attributed = `${draft}\n\n---\nAttribution: generated with consented materials and source notes.`;
  el.fullDraft.value = attributed;
}

function runStructurePass() {
  syncSectionsFromCards();
  state.chapters.sort((a, b) => a.title.localeCompare(b.title));
  renderOutline();
  renderSectionCards();
  assembleDraft();
  logAction('Structure pass completed');
}

function runRepetitionPass() {
  const lines = el.fullDraft.value.split('\n');
  const deduped = [];
  const seen = new Set();
  lines.forEach((line) => {
    const key = line.trim().toLowerCase();
    if (!key || !seen.has(key)) {
      deduped.push(line);
      if (key) {
        seen.add(key);
      }
    }
  });
  el.fullDraft.value = deduped.join('\n');
  state.editCount += 1;
  updateMetrics();
  logAction('Repetition cleanup completed');
}

function runFactPass() {
  const blocked = safeClaims(el.fullDraft.value, el.bannedClaims.value);
  if (blocked.length) {
    alert(`Factual consistency check failed due to banned claims:\n- ${blocked.join('\n- ')}`);
    logAction('Factual consistency check found banned claims');
    return;
  }
  alert('Factual consistency check passed');
  logAction('Factual consistency check passed');
}

function runTonePass() {
  const tone = el.styleGuide.value.trim() || 'consistent editorial';
  el.fullDraft.value = `Tone profile: ${tone}\n\n${el.fullDraft.value}`;
  state.editCount += 1;
  updateMetrics();
  logAction('Tone unification completed');
}

document.getElementById('wizardBtn').addEventListener('click', () => {
  state.wizardStep = (state.wizardStep + 1) % 4;
  const steps = [
    'Wizard step 1/3: pick template + import source',
    'Wizard step 2/3: fill brief + style + source notes',
    'Wizard step 3/3: create draft and expand sections',
    'Wizard complete: start your first project'
  ];
  el.wizardState.textContent = steps[state.wizardStep];
  logAction(el.wizardState.textContent);
});

document.getElementById('addChapterBtn').addEventListener('click', () => {
  const input = document.getElementById('newChapter');
  const title = input.value.trim();
  if (!title) {
    return;
  }
  state.chapters.push({ title, text: '' });
  input.value = '';
  renderOutline();
  renderSectionCards();
  logAction(`Added chapter "${title}"`);
});

document.getElementById('draftBtn').addEventListener('click', () => {
  syncSectionsFromCards();
  state.chapters = state.chapters.map((chapter) => ({
    ...chapter,
    text: expandSection(chapter.text, chapter.title)
  }));
  renderSectionCards();
  assembleDraft();
  if (!state.firstDraftAt) {
    state.firstDraftAt = Date.now();
  }
  updateMetrics();
  logAction('Script drafting completed');
});

el.sectionCards.addEventListener('click', (event) => {
  const index = event.target.getAttribute('data-expand');
  if (index === null) {
    return;
  }
  syncSectionsFromCards();
  const idx = Number(index);
  const chapter = state.chapters[idx];
  chapter.text = expandSection(chapter.text, chapter.title);
  renderSectionCards();
  assembleDraft();
  state.editCount += 1;
  updateMetrics();
  logAction(`Expanded section "${chapter.title}"`);
});

document.getElementById('assembleBtn').addEventListener('click', () => {
  assembleDraft();
  const blob = new Blob([el.fullDraft.value], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  const format = el.outputFormat.value;
  link.href = URL.createObjectURL(blob);
  link.download = `longform-${format}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
  logAction('Final assembly/export completed');
});

document.getElementById('markReadyBtn').addEventListener('click', () => {
  state.publishReadyTotal += 1;
  if (el.fullDraft.value.trim()) {
    state.publishReadyMarks += 1;
  }
  updateMetrics();
  logAction('Publish-ready sample recorded');
});

document.getElementById('structurePassBtn').addEventListener('click', runStructurePass);
document.getElementById('repetitionPassBtn').addEventListener('click', runRepetitionPass);
document.getElementById('factPassBtn').addEventListener('click', runFactPass);
document.getElementById('tonePassBtn').addEventListener('click', runTonePass);
el.fullDraft.addEventListener('input', () => {
  state.editCount += 1;
  updateMetrics();
});

renderOutline();
renderSectionCards();
updateMetrics();
logAction('App initialized');
