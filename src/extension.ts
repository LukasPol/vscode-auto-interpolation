import * as vscode from 'vscode'
import { Interpolation } from './commands/interpolation'

export function activate(context: vscode.ExtensionContext) {
	new Interpolation().listener()
}

export function deactivate() { }
