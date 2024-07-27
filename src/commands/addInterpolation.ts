import * as vscode from 'vscode'

export default function commandAddInterpolation() {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  const selection = editor.selection
  if (!selection.isSingleLine) return addHash(editor, selection)

  const line = editor.document.lineAt(selection.start.line)
  const lineText = line.text

  if (!isInsideString(lineText, selection)) return addHash(editor, selection)

  const newText = replaceSingleQuotes(lineText)
  const newLineText = insertInterpolation(newText, selection.start.character, selection.end.character)

  applyEdits(editor, line.range, newLineText)
  updateCursorPosition(editor, selection)
}

function isInsideString(lineText: string, selection: vscode.Selection): boolean {
  const quotesIndex = [...lineText.matchAll(/['"]/g)]

  if (quotesIndex.length % 2 !== 0) return true
  if (quotesIndex.length < 1) return false

  const startChar = selection.start.character

  return quotesIndex.some((quote, index, arr) => {
    return index % 2 === 0 && quote.index < startChar && arr[index + 1]?.index >= startChar
  })
}

function replaceSingleQuotes(text: string): string {
  const quoteMatch = text.match(/'([^']*)(')?/)
  if (quoteMatch && !quoteMatch[2]) {
    return text.replace(/'([^']*)/g, '"$1')
  }
  return text.replace(/'([^']*)(')?/g, '"$1"')
}

function insertInterpolation(text: string, positionStart: number, positionEnd: number): string {
  return `${text.slice(0, positionStart)}#{${text.slice(positionStart, positionEnd)}}${text.slice(positionEnd)}`
}

function applyEdits(editor: vscode.TextEditor, range: vscode.Range, newText: string) {
  editor.edit(editBuilder => {
    editBuilder.replace(range, newText)
  })
}

function updateCursorPosition(editor: vscode.TextEditor, selection: vscode.Selection) {
  const newPosition = selection.start.translate(0, 2)
  editor.selection = new vscode.Selection(newPosition, newPosition)
}

function addHash(editor: vscode.TextEditor, selection: vscode.Selection) {
  editor.edit(editBuilder => {
    editBuilder.insert(selection.start, '#')
  })
}
