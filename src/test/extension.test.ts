import * as assert from 'assert'
import * as vscode from 'vscode'
import * as path from 'path'

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.')

	test('should replace single quotes with double quotes when typing interpolation in Ruby', async () => {
		const uri = vscode.Uri.file(path.join(__dirname, '../../src/test/fixtures/test.rb'))
		const document = await vscode.workspace.openTextDocument(uri)
		const editor = await vscode.window.showTextDocument(document)

		const initialText = "puts 'Hello, #{name}'"
		const expectedText = 'puts "Hello, #{name}"'

		await editor.edit(editBuilder => {
			editBuilder.insert(new vscode.Position(0, 0), initialText)
		})

		await new Promise(resolve => setTimeout(resolve, 500))

		const actualText = editor.document.getText()

		assert.strictEqual(actualText.trim(), expectedText)
	})
})
