import {Plugin, View, WorkspaceLeaf} from 'obsidian';
// import {App, PluginSettingTab, Setting, TFolder} from 'obsidian';

// interface MyPluginSettings {
// 	mySetting: string;
// }
//
// const DEFAULT_SETTINGS: MyPluginSettings = {
// 	mySetting: 'aliases'
// }

function fileItems(fileExplorer: WorkspaceLeaf) {
	const view: View = fileExplorer.view;
	// console.log(typeof view)
	type ObjectKey = keyof typeof view;
	const keyFileItems = 'fileItems' as ObjectKey;
	return view[keyFileItems];
}

function removeExtraDiv(el: HTMLDivElement): void {
	const aliasDiv = el.querySelector('.file-alias')
	if (aliasDiv) {
		console.log(`removing ${aliasDiv}` )
		aliasDiv.remove();
	}
}

export default class FrontmatterExtraDisplay extends Plugin {
	// settings: MyPluginSettings;

	displayExtraInfo() {
		// NOTE: 这里的 this 是 undefined, 但是为什么?
		// 调用方式是 onload(method)中触发了一个 function(不是method)

		const fileExplorer: WorkspaceLeaf = app.workspace.getLeavesOfType('file-explorer')[0];
		// console.log(fileExplorer);

		const files = fileItems(fileExplorer);
		// console.log(files);

		for (const file of Object.values(files)) {
			if (file.file) {
				const el = file["selfEl"];
				if(el){
					removeExtraDiv(el);

					// TODO: 用key替换'ID'
					// let key = this.settings.mySetting;

					const meta_id = app.metadataCache.getFileCache(file.file)?.frontmatter?.ID;
					const content = meta_id ? meta_id : '';
					if (content) {
						el.createEl('div',
							{text: content, cls: 'file-alias nav-file-title-content'});
					}
				}
			}
		}
	}

	async onload() {
		console.log("Loading frontmatter-extra-display");

		app.workspace.onLayoutReady(this.displayExtraInfo);
		app.workspace.on("layout-change", this.displayExtraInfo);
		app.workspace.on("editor-change", this.displayExtraInfo);
	}

	onunload() {
		const fileExplorer = app.workspace.getLeavesOfType('file-explorer')[0];
		const files = fileItems(fileExplorer);
		for (const file of Object.values(files)) {
			if (file.file) {
				const el = file["selfEl"];
				if (el) {
					removeExtraDiv(el);
				}
			}
		}
	}
}

// class SettingTab extends PluginSettingTab {
// 	// 插件配置 Tab
// 	plugin: FrontmatterExtraDisplay;
//
// 	constructor(app: App, plugin: FrontmatterExtraDisplay) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}
//
// 	display(): void {
// 		const {containerEl} = this;
//
// 		containerEl.empty();
//
// 		containerEl.createEl('h2', {text: 'Settings for plugin FrontmatterAliasDisplay. (vlaw)'});
// 		containerEl.createEl("h3", {text: `version: ${this.plugin.manifest.version}`});
//
// 		new Setting(containerEl)
// 			.setName('Meta Key')
// 			.setDesc('Display Extra Info')
// 			.addText(text => text
// 				.setPlaceholder('Enter Meta Key')
// 				.setValue('')
// 				.onChange(async (value) => {
// 					console.log('Key: ' + value);
// 					this.plugin.settings.mySetting = value;
// 					// await this.plugin.saveSettings();
// 				}));
// 	}
// }
