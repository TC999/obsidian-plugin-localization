/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/

'use strict';

var obsidian = require('obsidian');
var path = require('path');
var childProcess = require('child_process');
var fs$1 = require('fs');
var os = require('os');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var childProcess__default = /*#__PURE__*/_interopDefaultLegacy(childProcess);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs$1);
var os__default = /*#__PURE__*/_interopDefaultLegacy(os);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function createCommonjsModule(fn) {
  var module = { exports: {} };
	return fn(module, module.exports), module.exports;
}

let isDocker;

function hasDockerEnv() {
	try {
		fs__default['default'].statSync('/.dockerenv');
		return true;
	} catch (_) {
		return false;
	}
}

function hasDockerCGroup() {
	try {
		return fs__default['default'].readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
	} catch (_) {
		return false;
	}
}

var isDocker_1 = () => {
	if (isDocker === undefined) {
		isDocker = hasDockerEnv() || hasDockerCGroup();
	}

	return isDocker;
};

var isWsl_1 = createCommonjsModule(function (module) {




const isWsl = () => {
	if (process.platform !== 'linux') {
		return false;
	}

	if (os__default['default'].release().toLowerCase().includes('microsoft')) {
		if (isDocker_1()) {
			return false;
		}

		return true;
	}

	try {
		return fs__default['default'].readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft') ?
			!isDocker_1() : false;
	} catch (_) {
		return false;
	}
};

if (process.env.__IS_WSL_TEST__) {
	module.exports = isWsl;
} else {
	module.exports = isWsl();
}
});

var defineLazyProp = (object, propertyName, fn) => {
	const define = value => Object.defineProperty(object, propertyName, {value, enumerable: true, writable: true});

	Object.defineProperty(object, propertyName, {
		configurable: true,
		enumerable: true,
		get() {
			const result = fn();
			define(result);
			return result;
		},
		set(value) {
			define(value);
		}
	});

	return object;
};

const {promises: fs, constants: fsConstants} = fs__default['default'];




// Path to included `xdg-open`.
const localXdgOpenPath = path__default['default'].join(__dirname, 'xdg-open');

const {platform, arch} = process;

/**
Get the mount point for fixed drives in WSL.

@inner
@returns {string} The mount point.
*/
const getWslDrivesMountPoint = (() => {
	// Default value for "root" param
	// according to https://docs.microsoft.com/en-us/windows/wsl/wsl-config
	const defaultMountPoint = '/mnt/';

	let mountPoint;

	return async function () {
		if (mountPoint) {
			// Return memoized mount point value
			return mountPoint;
		}

		const configFilePath = '/etc/wsl.conf';

		let isConfigFileExists = false;
		try {
			await fs.access(configFilePath, fsConstants.F_OK);
			isConfigFileExists = true;
		} catch {}

		if (!isConfigFileExists) {
			return defaultMountPoint;
		}

		const configContent = await fs.readFile(configFilePath, {encoding: 'utf8'});
		const configMountPoint = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(configContent);

		if (!configMountPoint) {
			return defaultMountPoint;
		}

		mountPoint = configMountPoint.groups.mountPoint.trim();
		mountPoint = mountPoint.endsWith('/') ? mountPoint : `${mountPoint}/`;

		return mountPoint;
	};
})();

const pTryEach = async (array, mapper) => {
	let latestError;

	for (const item of array) {
		try {
			return await mapper(item); // eslint-disable-line no-await-in-loop
		} catch (error) {
			latestError = error;
		}
	}

	throw latestError;
};

const open = async (target, options) => {
	if (typeof target !== 'string') {
		throw new TypeError('Expected a `target`');
	}

	options = {
		wait: false,
		background: false,
		newInstance: false,
		allowNonzeroExitCode: false,
		...options
	};

	if (Array.isArray(options.app)) {
		return pTryEach(options.app, singleApp => open(target, {
			...options,
			app: singleApp
		}));
	}

	let {name: app, arguments: appArguments = []} = options.app || {};
	appArguments = [...appArguments];

	if (Array.isArray(app)) {
		return pTryEach(app, appName => open(target, {
			...options,
			app: {
				name: appName,
				arguments: appArguments
			}
		}));
	}

	let command;
	const cliArguments = [];
	const childProcessOptions = {};

	if (platform === 'darwin') {
		command = 'open';

		if (options.wait) {
			cliArguments.push('--wait-apps');
		}

		if (options.background) {
			cliArguments.push('--background');
		}

		if (options.newInstance) {
			cliArguments.push('--new');
		}

		if (app) {
			cliArguments.push('-a', app);
		}
	} else if (platform === 'win32' || (isWsl_1 && !isDocker_1())) {
		const mountPoint = await getWslDrivesMountPoint();

		command = isWsl_1 ?
			`${mountPoint}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe` :
			`${process.env.SYSTEMROOT}\\System32\\WindowsPowerShell\\v1.0\\powershell`;

		cliArguments.push(
			'-NoProfile',
			'-NonInteractive',
			'–ExecutionPolicy',
			'Bypass',
			'-EncodedCommand'
		);

		if (!isWsl_1) {
			childProcessOptions.windowsVerbatimArguments = true;
		}

		const encodedArguments = ['Start'];

		if (options.wait) {
			encodedArguments.push('-Wait');
		}

		if (app) {
			// Double quote with double quotes to ensure the inner quotes are passed through.
			// Inner quotes are delimited for PowerShell interpretation with backticks.
			encodedArguments.push(`"\`"${app}\`""`, '-ArgumentList');
			appArguments.unshift(target);
		} else {
			encodedArguments.push(`"${target}"`);
		}

		if (appArguments.length > 0) {
			appArguments = appArguments.map(arg => `"\`"${arg}\`""`);
			encodedArguments.push(appArguments.join(','));
		}

		// Using Base64-encoded command, accepted by PowerShell, to allow special characters.
		target = Buffer.from(encodedArguments.join(' '), 'utf16le').toString('base64');
	} else {
		if (app) {
			command = app;
		} else {
			// When bundled by Webpack, there's no actual package file path and no local `xdg-open`.
			const isBundled = !__dirname || __dirname === '/';

			// Check if local `xdg-open` exists and is executable.
			let exeLocalXdgOpen = false;
			try {
				await fs.access(localXdgOpenPath, fsConstants.X_OK);
				exeLocalXdgOpen = true;
			} catch {}

			const useSystemXdgOpen = process.versions.electron ||
				platform === 'android' || isBundled || !exeLocalXdgOpen;
			command = useSystemXdgOpen ? 'xdg-open' : localXdgOpenPath;
		}

		if (appArguments.length > 0) {
			cliArguments.push(...appArguments);
		}

		if (!options.wait) {
			// `xdg-open` will block the process unless stdio is ignored
			// and it's detached from the parent even if it's unref'd.
			childProcessOptions.stdio = 'ignore';
			childProcessOptions.detached = true;
		}
	}

	cliArguments.push(target);

	if (platform === 'darwin' && appArguments.length > 0) {
		cliArguments.push('--args', ...appArguments);
	}

	const subprocess = childProcess__default['default'].spawn(command, cliArguments, childProcessOptions);

	if (options.wait) {
		return new Promise((resolve, reject) => {
			subprocess.once('error', reject);

			subprocess.once('close', exitCode => {
				if (options.allowNonzeroExitCode && exitCode > 0) {
					reject(new Error(`Exited with code ${exitCode}`));
					return;
				}

				resolve(subprocess);
			});
		});
	}

	subprocess.unref();

	return subprocess;
};

function detectArchBinary(binary) {
	if (typeof binary === 'string' || Array.isArray(binary)) {
		return binary;
	}

	const {[arch]: archBinary} = binary;

	if (!archBinary) {
		throw new Error(`${arch} is not supported`);
	}

	return archBinary;
}

function detectPlatformBinary({[platform]: platformBinary}, {wsl}) {
	if (wsl && isWsl_1) {
		return detectArchBinary(wsl);
	}

	if (!platformBinary) {
		throw new Error(`${platform} is not supported`);
	}

	return detectArchBinary(platformBinary);
}

const apps = {};

defineLazyProp(apps, 'chrome', () => detectPlatformBinary({
	darwin: 'google chrome',
	win32: 'chrome',
	linux: ['google-chrome', 'google-chrome-stable']
}, {
	wsl: {
		ia32: '/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe',
		x64: ['/mnt/c/Program Files/Google/Chrome/Application/chrome.exe', '/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe']
	}
}));

defineLazyProp(apps, 'firefox', () => detectPlatformBinary({
	darwin: 'firefox',
	win32: 'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
	linux: 'firefox'
}, {
	wsl: '/mnt/c/Program Files/Mozilla Firefox/firefox.exe'
}));

defineLazyProp(apps, 'edge', () => detectPlatformBinary({
	darwin: 'microsoft edge',
	win32: 'msedge',
	linux: 'microsoft-edge'
}, {
	wsl: '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
}));

open.apps = apps;

var open_1 = open;

const DEFAULT_SETTINGS = {
    apps: [],
};
class OpenWithPlugin extends obsidian.Plugin {
    onload() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('loading plugin');
            yield this.loadSettings();
            this.addSettingTab(new OpenWithSettingTab(this));
            this.addCommand({
                id: "copy-absolute-file-path",
                name: "Copy absolute Path of File to clipboard",
                checkCallback: (checking) => {
                    let file = this.app.workspace.getActiveFile();
                    if (file) {
                        if (!checking) {
                            navigator.clipboard.writeText(this.getAbsolutePathOfFile(file));
                        }
                        return true;
                    }
                    return false;
                }
            });
            this.settings.apps.forEach(app => {
                this.addCommand({
                    id: "open-file-with-" + app.name.toLowerCase(),
                    name: "Open File with " + app.name,
                    checkCallback: (checking) => {
                        let file = this.app.workspace.getActiveFile();
                        if (file) {
                            if (!checking) {
                                open_1(this.getAbsolutePathOfFile(file), {
                                    app: {
                                        name: app.code,
                                        arguments: app.arguments.split(","),
                                    }
                                });
                            }
                            return true;
                        }
                        return false;
                    }
                });
            });
        });
    }
    getAbsolutePathOfFile(file) {
        //@ts-ignore
        const path = obsidian.normalizePath(`${this.app.vault.adapter.basePath}/${file.path}`);
        if (obsidian.Platform.isDesktopApp && navigator.platform === "Win32") {
            return path.replace(/\//g, "\\");
        }
        return path;
    }
    loadSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
        });
    }
    saveSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.saveData(this.settings);
        });
    }
}
class OpenWithSettingTab extends obsidian.PluginSettingTab {
    constructor(plugin) {
        super(plugin.app, plugin);
        this.plugin = plugin;
    }
    display() {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Open with Plugin' });
        new obsidian.Setting(containerEl)
            .setName("Add new application")
            .setClass("OW-setting-item")
            .setDesc("Add a new application to open files with. You need to use the application path or command (for example \"code\" for VSCode) and arguments need to be comma seperated.")
            .addText(cb => {
            cb.inputEl.addClass("OW-name");
            cb.setPlaceholder("Display Name");
        })
            .addText(cb => {
            cb.inputEl.addClass("OW-code");
            cb.setPlaceholder("Path/Command");
        })
            .addText(cb => {
            cb.inputEl.addClass("OW-args");
            cb.setPlaceholder("Arguments (optional)");
        })
            .addButton(btn => {
            btn.setButtonText("+")
                .onClick(() => __awaiter(this, void 0, void 0, function* () {
                //@ts-ignore
                const name = document.querySelector(".OW-name").value;
                //@ts-ignore
                const code = document.querySelector(".OW-code").value;
                //@ts-ignore
                const args = document.querySelector(".OW-args").value;
                if (name && code) {
                    this.plugin.addCommand({
                        id: "open-file-with-" + name.toLowerCase(),
                        name: "Open File with " + name,
                        checkCallback: (checking) => {
                            let file = this.app.workspace.getActiveFile();
                            if (file) {
                                if (!checking) {
                                    open_1(this.plugin.getAbsolutePathOfFile(file), {
                                        app: {
                                            name: code,
                                            arguments: args.split(","),
                                        }
                                    });
                                }
                                return true;
                            }
                            return false;
                        }
                    });
                    this.plugin.settings.apps.push({ name, code, arguments: args });
                    yield this.plugin.saveSettings();
                    this.display();
                }
                else {
                    new obsidian.Notice("Display Name & Path/Command are always neccessary.");
                }
            }));
        });
        this.plugin.settings.apps.forEach(app => {
            new obsidian.Setting(containerEl)
                .setName(app.name)
                .setDesc(`Command: ${app.code}${app.arguments ? ` | Arguments: ${app.arguments}` : ""}`)
                .addButton(btn => {
                btn.setIcon("trash")
                    .setTooltip("Remove")
                    .onClick(() => __awaiter(this, void 0, void 0, function* () {
                    new obsidian.Notice("You need to restart Obsidian for these changes to take effect.");
                    this.plugin.settings.apps.remove(app);
                    yield this.plugin.saveSettings();
                    this.display();
                }));
            });
        });
    }
}

module.exports = OpenWithPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIm5vZGVfbW9kdWxlcy9pcy1kb2NrZXIvaW5kZXguanMiLCJub2RlX21vZHVsZXMvaXMtd3NsL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RlZmluZS1sYXp5LXByb3AvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb3Blbi9pbmRleC5qcyIsIm1haW4udHMiXSwic291cmNlc0NvbnRlbnQiOm51bGwsIm5hbWVzIjpbImZzIiwib3MiLCJpc0RvY2tlciIsInJlcXVpcmUkJDAiLCJwYXRoIiwiaXNXc2wiLCJjaGlsZFByb2Nlc3MiLCJkZWZpbmVMYXp5UHJvcGVydHkiLCJQbHVnaW4iLCJvcGVuIiwibm9ybWFsaXplUGF0aCIsIlBsYXRmb3JtIiwiUGx1Z2luU2V0dGluZ1RhYiIsIlNldHRpbmciLCJOb3RpY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXVEQTtBQUNPLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRTtBQUM3RCxJQUFJLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxZQUFZLENBQUMsR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDLENBQUMsVUFBVSxPQUFPLEVBQUUsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtBQUNoSCxJQUFJLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLFVBQVUsT0FBTyxFQUFFLE1BQU0sRUFBRTtBQUMvRCxRQUFRLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDbkcsUUFBUSxTQUFTLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7QUFDdEcsUUFBUSxTQUFTLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxNQUFNLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7QUFDdEgsUUFBUSxJQUFJLENBQUMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7QUFDOUUsS0FBSyxDQUFDLENBQUM7QUFDUDs7Ozs7OztBQzFFQSxJQUFJLFFBQVEsQ0FBQztBQUNiO0FBQ0EsU0FBUyxZQUFZLEdBQUc7QUFDeEIsQ0FBQyxJQUFJO0FBQ0wsRUFBRUEsc0JBQUUsQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDN0IsRUFBRSxPQUFPLElBQUksQ0FBQztBQUNkLEVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRTtBQUNiLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFDZixFQUFFO0FBQ0YsQ0FBQztBQUNEO0FBQ0EsU0FBUyxlQUFlLEdBQUc7QUFDM0IsQ0FBQyxJQUFJO0FBQ0wsRUFBRSxPQUFPQSxzQkFBRSxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMs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
