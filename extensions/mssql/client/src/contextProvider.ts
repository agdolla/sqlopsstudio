/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as vscode from 'vscode';
import * as sqlops from 'sqlops';

export enum BuiltInCommands {
    SetContext = 'setContext',
}

export enum ContextKeys {
	ISCLOUD = 'mssql:iscloud'
}

const isCloudEditions = [

];

export function setCommandContext(key: ContextKeys | string, value: any) {
    return vscode.commands.executeCommand(BuiltInCommands.SetContext, key, value);
}

export default class ContextProvider {
	private _disposables = new Array<vscode.Disposable>();

	constructor() {
		this._disposables.push(sqlops.workspace.onDidOpenDashboard(this.onDashboardOpen, this));
		this._disposables.push(sqlops.workspace.onDidChangeToDashboard(this.onDashboardOpen, this));
	}

	public onDashboardOpen(e: sqlops.DashboardDocument): void {
		let iscloud: boolean;
		if (e.profile.providerName.toLowerCase() === 'mssql' && .options['edition']) {
			if (isCloudEditions.some(e.profile.options['edition'])) {
				iscloud = true;
			} else {
				iscloud = false;
			}
		}

		if (iscloud === true || iscloud === false) {
			setCommandContext(ContextKeys.ISCLOUD, true);
		}
	}

	dispose(): void {
		this._disposables = this._disposables.map(i => i.dispose());
	}
}
