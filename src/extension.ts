import * as vscode from 'vscode'
import { Interpolation } from './commands/interpolation'

export function activate(context: vscode.ExtensionContext) {
	Interpolation.call()
}

export function deactivate() { }
