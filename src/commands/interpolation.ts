import * as vscode from 'vscode'

export class Interpolation {
  listener(): any {
    vscode.workspace.onDidChangeTextDocument(event => {
      const eventChange = event.contentChanges[0]
      const changeStart = eventChange.range.start
      const startLine = eventChange.range.start.line
      const line = event.document.lineAt(startLine)
      const lineText = line.text
      const textChanges = eventChange.text

      if ((!textChanges.includes('{') || lineText.charAt(changeStart.character - 1) !== '#') && !lineText.includes("'")) return

      const editor = vscode.window.activeTextEditor
      if (!editor || editor.document !== event.document) return

      const newText = lineText.replace(/'([^']*)(')?/g, '"$1"')
      editor.edit(editBuilder => {
        editBuilder.replace(line.range, newText)
      })
    })
  }
}
