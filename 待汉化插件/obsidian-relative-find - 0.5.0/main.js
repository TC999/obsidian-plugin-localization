/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/

'use strict';

var obsidian = require('obsidian');

class BetterFindPlugin extends obsidian.Plugin {
    onload() {
        this.addCommand({
            id: 'relative-find',
            name: 'Find relative to Cursor Position',
            editorCallback: (editor) => {
                new SearchModal(this.app, editor, "after").open();
            }
        });
        this.addCommand({
            id: 'relative-find-before',
            name: 'Find before the Cursor',
            editorCallback: (editor) => {
                new SearchModal(this.app, editor, "before").open();
            }
        });
        for (let i = 1; i < 10; i++) {
            this.addCommand({
                id: 'copy-search-result-' + i,
                name: 'Copy Search Result ' + i + ' to Clipboard',
                checkCallback: (check) => {
                    var _a;
                    const search = (_a = this.app.workspace.getLeavesOfType("search")[0]) === null || _a === void 0 ? void 0 : _a.view;
                    //@ts-ignore
                    if (search && search.getQuery()) {
                        if (!check) {
                            //@ts-ignore
                            const result = search.dom.children[i - 1].childrenEl.innerText;
                            navigator.clipboard.writeText(result);
                        }
                        return true;
                    }
                    return false;
                }
            });
        }
    }
}
class SearchModal extends obsidian.SuggestModal {
    constructor(app, editor, mode) {
        super(app);
        this.editor = editor;
        this.defaultMode = mode;
        this.setPlaceholder("Search for something...");
        this.setInstructions([
            {
                command: "after:",
                purpose: "to find after cursor",
            },
            {
                command: "before:",
                purpose: "to find before cursor",
            },
            {
                command: "↑↓",
                purpose: "to navigate"
            },
            {
                command: "↵",
                purpose: "to jump to result",
            },
        ]);
    }
    onOpen() {
        super.onOpen();
        this.inputEl.value = `${this.defaultMode}:`;
    }
    getSuggestions(query) {
        const mode = query.split(":").first();
        query = query.replace(mode + ":", "");
        if (query) {
            const results = [];
            this.currentQuery = query;
            for (let i = 0; i < this.editor.lineCount(); i++) {
                let line = this.editor.getLine(i);
                if (!line.endsWith(" ")) {
                    line += " ";
                }
                let intermediateResults = line.toLowerCase().split(query.toLowerCase());
                intermediateResults.remove(intermediateResults.first());
                intermediateResults.forEach((res) => {
                    results.push({
                        text: res,
                        pos: {
                            line: i,
                            ch: this.computeColumn(res, line),
                        },
                    });
                });
            }
            return this.sortSuggestions(results, mode);
        }
        return [];
    }
    computeColumn(res, line) {
        if (res) {
            return line.toLowerCase().indexOf(this.currentQuery.toLowerCase() + res) + this.currentQuery.length;
        }
        else {
            return line.length;
        }
    }
    sortSuggestions(suggestions, mode) {
        const { line, ch } = this.editor.getCursor();
        switch (mode) {
            case "after":
                return suggestions.filter((s) => {
                    if (s.pos.line < line) {
                        return false;
                    }
                    else if (s.pos.line === line && s.pos.ch < ch) {
                        return false;
                    }
                    return true;
                });
            case "a":
                return suggestions.filter((s) => {
                    if (s.pos.line < line) {
                        return false;
                    }
                    else if (s.pos.line === line && s.pos.ch < ch) {
                        return false;
                    }
                    return true;
                });
            case "before":
                return suggestions.filter((s) => {
                    if (s.pos.line > line) {
                        return false;
                    }
                    else if (s.pos.line === line && s.pos.ch > ch) {
                        return false;
                    }
                    return true;
                }).reverse();
            case "b":
                return suggestions.filter((s) => {
                    if (s.pos.line > line) {
                        return false;
                    }
                    else if (s.pos.line === line && s.pos.ch > ch) {
                        return false;
                    }
                    return true;
                }).reverse();
            default:
                return suggestions;
        }
    }
    renderSuggestion(suggestion, el) {
        const queryEl = createEl("span", { text: this.currentQuery, cls: "RF-query" });
        queryEl.toggleClass("RF-has-space-end", this.currentQuery.endsWith(" "));
        const resultEl = el.createEl("span", { text: suggestion.text, cls: "RF-result" });
        resultEl.toggleClass("RF-has-space-beginning", suggestion.text.startsWith(" "));
        resultEl.prepend(queryEl);
        el.createEl("span", {
            text: `Line: ${suggestion.pos.line + 1} - Character: ${suggestion.pos.ch}`,
            cls: "RF-info"
        });
        el.addClass("RF-suggestion");
    }
    onNoSuggestion() {
        this.resultContainerEl.empty();
        this.resultContainerEl.appendChild(createDiv({
            text: "Nothing found.",
            cls: "suggestion-empty"
        }));
    }
    onChooseSuggestion(item) {
        this.editor.setCursor(item.pos);
        this.editor.setSelection({
            line: item.pos.line,
            ch: item.pos.ch - this.currentQuery.length,
        }, item.pos);
    }
}

module.exports = BetterFindPlugin;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsibWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6bnVsbCwibmFtZXMiOlsiUGx1Z2luIiwiU3VnZ2VzdE1vZGFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7TUFTcUIsZ0JBQWlCLFNBQVFBLGVBQU07SUFDbkQsTUFBTTtRQUNMLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDZixFQUFFLEVBQUUsZUFBZTtZQUNuQixJQUFJLEVBQUUsa0NBQWtDO1lBQ3hDLGNBQWMsRUFBRSxDQUFDLE1BQWM7Z0JBQzlCLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2xEO1NBQ0QsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNmLEVBQUUsRUFBRSxzQkFBc0I7WUFDMUIsSUFBSSxFQUFFLHdCQUF3QjtZQUM5QixjQUFjLEVBQUUsQ0FBQyxNQUFjO2dCQUM5QixJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNuRDtTQUNELENBQUMsQ0FBQztRQUVILEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFVBQVUsQ0FBQztnQkFDZixFQUFFLEVBQUUscUJBQXFCLEdBQUcsQ0FBQztnQkFDN0IsSUFBSSxFQUFFLHFCQUFxQixHQUFHLENBQUMsR0FBRyxlQUFlO2dCQUNqRCxhQUFhLEVBQUUsQ0FBQyxLQUFjOztvQkFDN0IsTUFBTSxNQUFNLEdBQUcsTUFBQSxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLDBDQUFFLElBQUksQ0FBQzs7b0JBRXJFLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FB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
