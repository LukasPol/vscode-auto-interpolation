import * as vscode from 'vscode'

export class Interpolation {
  static call(): any {
    return new Interpolation().listener()
  }

  listener(): any {
    vscode.workspace.onDidChangeTextDocument(event => {
      if (event.contentChanges.length === 0) return

      const eventChange = event.contentChanges[0]
      const changeStart = eventChange.range.start
      const startLine = changeStart.line
      const line = event.document.lineAt(startLine)
      const lineText = line.text
      const textChanges = eventChange.text

      if (!this.shouldProcessChange(lineText, changeStart, textChanges)) return

      const editor = vscode.window.activeTextEditor
      if (!editor || editor.document !== event.document) return

      const newText = this.replaceSingleQuotes(line.text)
      this.applyTextEdit(editor, line.range, newText)
    })
  }

  private shouldProcessChange(lineText: string, changeStart: vscode.Position, textChanges: string): boolean {
    const hasSingleQuotes = lineText.includes("'")
    const isInterpolationChange = textChanges.includes('{') && lineText.charAt(changeStart.character - 1) === '#'
    const hasInterpolationSyntax = /#?\{/.test(textChanges)

    return hasSingleQuotes && (isInterpolationChange || hasInterpolationSyntax)
  }

  private replaceSingleQuotes(text: string): string {
    return text.replace(/'([^']*)(')?/g, '"$1"')
  }

  private applyTextEdit(editor: vscode.TextEditor, range: vscode.Range, newText: string): void {
    editor.edit(editBuilder => {
      editBuilder.replace(range, newText)
    })
  }
}
