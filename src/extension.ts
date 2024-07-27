import * as vscode from 'vscode'
import { Interpolation } from './commands/interpolation'
import commandAddInterpolation from './commands/addInterpolation';

export function activate(context: vscode.ExtensionContext) {
	Interpolation.call()

	let disposableAddInterpolation = vscode.commands.registerCommand('interpolation.AddInterpolation', commandAddInterpolation);
	context.subscriptions.push(disposableAddInterpolation);
}

export function deactivate() { }
