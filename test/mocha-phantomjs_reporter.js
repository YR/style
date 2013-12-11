// mocha-phantomjs_reporter -- based on code from blanket.defaultReporter
(function () {
    
    /* NOTE: Required method for running as a custom reporter */
    blanket.customReporter = function (coverageData, reporterOptions) {
        logDebug('blanket.customReporter: mocha-phantomjs_reporter, with options:' + (reporterOptions !== undefined ? CoverageFormatter.PrintProperties(reporterOptions[0]) : 'NONE')); // Log entry point        
        // If running in browser with mocha, print default blanket debug output 
        if (!window.mochaPhantomJS) {
            blanket.defaultReporter(coverageData);
        }
        else {
            // Log output to console according to reporter options             
            var coverageTotals = new CoverageFormatter(summarizeTotals(coverageData), reporterOptions); // Find and summarize coverage data
            console.log(coverageTotals.ToLog());
            // Alternatively: appendTag('div', document.body, coverageTotals.ToOutput(), 'blanket-summary');                
        }        
        logDebug('blanket.customReporter: done');
    };

    var logDebug = function (entry) {
        if (_blanket.options("debug") && console) {
            console.log(entry);
        };
    };

    // check if a data-cover-modulepattern was provided for per-module coverage reporting
    var modulePattern = _blanket.options("modulePattern");
    var modulePatternRegex = (modulePattern ? new RegExp(modulePattern) : null);

    var percentage = function (number, total) {
        return (Math.round(((number / total) * 100) * 100) / 100);
    };

    var appendTag = function (type, el, str, classStr) {
        var dom = document.createElement(type);
        dom.innerHTML = str;
        if (classStr !== undefined) { dom.setAttribute('class', classStr); }
        el.appendChild(dom);
    };

    function escapeInvalidXmlChars(str) {
        return str.replace(/\&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/\>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/\'/g, "&apos;");
    }

    function isBranchFollowed(data, bool) {
        var mode = bool ? 0 : 1;
        if (typeof data === 'undefined' ||
            typeof data === null ||
            typeof data[mode] === 'undefined') {
            return false;
        }
        return data[mode].length > 0;
    }

    var branchStack = [];

    function branchReport(colsIndex, src, cols, offset, lineNum) {
        var newsrc = "";
        var postfix = "";
        if (branchStack.length > 0) {
            newsrc += "<span class='" + (isBranchFollowed(branchStack[0][1], branchStack[0][1].consequent === branchStack[0][0]) ? 'branchOkay' : 'branchWarning') + "'>";
            if (branchStack[0][0].end.line === lineNum) {
                newsrc += escapeInvalidXmlChars(src.slice(0, branchStack[0][0].end.column)) + "</span>";
                src = src.slice(branchStack[0][0].end.column);
                branchStack.shift();
                if (branchStack.length > 0) {
                    newsrc += "<span class='" + (isBranchFollowed(branchStack[0][1], false) ? 'branchOkay' : 'branchWarning') + "'>";
                    if (branchStack[0][0].end.line === lineNum) {
                        newsrc += escapeInvalidXmlChars(src.slice(0, branchStack[0][0].end.column)) + "</span>";
                        src = src.slice(branchStack[0][0].end.column);
                        branchStack.shift();
                        if (!cols) {
                            return { src: newsrc + escapeInvalidXmlChars(src), cols: cols };
                        }
                    }
                    else if (!cols) {
                        return { src: newsrc + escapeInvalidXmlChars(src) + "</span>", cols: cols };
                    }
                    else {
                        postfix = "</span>";
                    }
                } else if (!cols) {
                    return { src: newsrc + escapeInvalidXmlChars(src), cols: cols };
                }
            } else if (!cols) {
                return { src: newsrc + escapeInvalidXmlChars(src) + "</span>", cols: cols };
            } else {
                postfix = "</span>";
            }
        }
        var thisline = cols[colsIndex];
        //consequent

        var cons = thisline.consequent;
        if (cons.start.line > lineNum) {
            branchStack.unshift([thisline.alternate, thisline]);
            branchStack.unshift([cons, thisline]);
            src = escapeInvalidXmlChars(src);
        } else {
            var style = "<span class='" + (isBranchFollowed(thisline, true) ? 'branchOkay' : 'branchWarning') + "'>";
            newsrc += escapeInvalidXmlChars(src.slice(0, cons.start.column - offset)) + style;

            if (cols.length > colsIndex + 1 &&
              cols[colsIndex + 1].consequent.start.line === lineNum &&
              cols[colsIndex + 1].consequent.start.column - offset < cols[colsIndex].consequent.end.column - offset) {
                var res = branchReport(colsIndex + 1, src.slice(cons.start.column - offset, cons.end.column - offset), cols, cons.start.column - offset, lineNum);
                newsrc += res.src;
                cols = res.cols;
                cols[colsIndex + 1] = cols[colsIndex + 2];
                cols.length--;
            } else {
                newsrc += escapeInvalidXmlChars(src.slice(cons.start.column - offset, cons.end.column - offset));
            }
            newsrc += "</span>";

            var alt = thisline.alternate;
            if (alt.start.line > lineNum) {
                newsrc += escapeInvalidXmlChars(src.slice(cons.end.column - offset));
                branchStack.unshift([alt, thisline]);
            } else {
                newsrc += escapeInvalidXmlChars(src.slice(cons.end.column - offset, alt.start.column - offset));
                style = "<span class='" + (isBranchFollowed(thisline, false) ? 'branchOkay' : 'branchWarning') + "'>";
                newsrc += style;
                if (cols.length > colsIndex + 1 &&
                  cols[colsIndex + 1].consequent.start.line === lineNum &&
                  cols[colsIndex + 1].consequent.start.column - offset < cols[colsIndex].alternate.end.column - offset) {
                    var res2 = branchReport(colsIndex + 1, src.slice(alt.start.column - offset, alt.end.column - offset), cols, alt.start.column - offset, lineNum);
                    newsrc += res2.src;
                    cols = res2.cols;
                    cols[colsIndex + 1] = cols[colsIndex + 2];
                    cols.length--;
                } else {
                    newsrc += escapeInvalidXmlChars(src.slice(alt.start.column - offset, alt.end.column - offset));
                }
                newsrc += "</span>";
                newsrc += escapeInvalidXmlChars(src.slice(alt.end.column - offset));
                src = newsrc;
            }
        }
        return { src: src + postfix, cols: cols };
    }

    var isUndefined = function (item) {
        return typeof item !== 'undefined';
    };

    var createCoverageLine = function (file, result, numberOfFilesCovered, fileNumber, totalSmts, totalBranches, passedBranches, code) {
        return 'File:{{file}}, Coverage:%{{percentage}}, Covered statements:{{numberCovered}}/{{totalSmts}} \n'.replace("{{file}}", file)
                         .replace("{{percentage}}", result)
                         .replace("{{numberCovered}}", numberOfFilesCovered)
                         .replace(/\{\{fileNumber\}\}/g, fileNumber)
                         .replace("{{totalSmts}}", totalSmts)
                         .replace("{{totalBranches}}", totalBranches)
                         .replace("{{passedBranches}}", passedBranches)
                         .replace("{{source}}", (code!==null? code.join(" ") : '' ));
    }

    var createCoverageArray = function( file, result, numberOfFilesCovered, fileNumber, totalSmts, totalBranches, passedBranches, code) {
        return { 'File': file, 'CoveredPercent': result, 'StatementsTotal': totalSmts, 'StatementsCovered': numberOfFilesCovered, 'FileNumber': fileNumber, 'BranchesTotal': totalBranches, 'BranchesPassed': passedBranches, 'Code': 'Not included' };
    };

    /* Functions which runs through file data and formats into relevant data */
    var summarizeTotals = function(coverage) {
        
        var sumResult = new Array (null); // Base array for totals and files Add empty placeholder for totals later
        var fileNumber = 0;

        var hasBranchTracking = Object.keys(coverage.files).some(function (elem) {
            return typeof coverage.files[elem].branchData !== 'undefined';
        });
        
        var files = coverage.files;
        var totals = {
            totalSmts: 0,
            numberOfFilesCovered: 0,
            passedBranches: 0,
            totalBranches: 0,
            moduleTotalStatements: {},
            moduleTotalCoveredStatements: {},
            moduleTotalBranches: {},
            moduleTotalCoveredBranches: {}
        };

        for (var file in files) {
            fileNumber++;

            var statsForFile = files[file],
                totalSmts = 0,
                numberOfFilesCovered = 0,
                code = [],
                i;

            var end = [];
            for (i = 0; i < statsForFile.source.length; i += 1) {
                var src = statsForFile.source[i];

                if (branchStack.length > 0 ||
                    typeof statsForFile.branchData !== 'undefined') {
                    if (typeof statsForFile.branchData[i + 1] !== 'undefined') {
                        var cols = statsForFile.branchData[i + 1].filter(isUndefined);
                        var colsIndex = 0;                        
                        src = branchReport(colsIndex, src, cols, 0, i + 1).src;

                    } else if (branchStack.length) {
                        src = branchReport(0, src, null, 0, i + 1).src;
                    } else {
                        src = escapeInvalidXmlChars(src);
                    }
                } else {
                    src = escapeInvalidXmlChars(src);
                }
                var lineClass = "";
                if (statsForFile[i + 1]) {
                    numberOfFilesCovered += 1;
                    totalSmts += 1;
                    lineClass = 'hit';
                } else {
                    if (statsForFile[i + 1] === 0) {
                        totalSmts++;
                        lineClass = 'miss';
                    }
                }
                code[i + 1] = "<div class='" + lineClass + "'><span class=''>" + (i + 1) + "</span>" + src + "</div>";
            }
            totals.totalSmts += totalSmts;
            totals.numberOfFilesCovered += numberOfFilesCovered;
            var totalBranches = 0;
            var passedBranches = 0;
            if (typeof statsForFile.branchData !== 'undefined') {
                for (var j = 0; j < statsForFile.branchData.length; j++) {
                    if (typeof statsForFile.branchData[j] !== 'undefined') {
                        for (var k = 0; k < statsForFile.branchData[j].length; k++) {
                            if (typeof statsForFile.branchData[j][k] !== 'undefined') {
                                totalBranches++;
                                if (typeof statsForFile.branchData[j][k][0] !== 'undefined' &&
                                  statsForFile.branchData[j][k][0].length > 0 &&
                                  typeof statsForFile.branchData[j][k][1] !== 'undefined' &&
                                  statsForFile.branchData[j][k][1].length > 0) {
                                    passedBranches++;
                                }
                            }
                        }
                    }
                }
            }
            totals.passedBranches += passedBranches;
            totals.totalBranches += totalBranches;

            // if "data-cover-modulepattern" was provided, 
            // track totals per module name as well as globally
            if (modulePatternRegex) {
                var moduleName = file.match(modulePatternRegex)[1];

                if (!totals.moduleTotalStatements.hasOwnProperty(moduleName)) {
                    totals.moduleTotalStatements[moduleName] = 0;
                    totals.moduleTotalCoveredStatements[moduleName] = 0;
                }

                totals.moduleTotalStatements[moduleName] += totalSmts;
                totals.moduleTotalCoveredStatements[moduleName] += numberOfFilesCovered;

                if (!totals.moduleTotalBranches.hasOwnProperty(moduleName)) {
                    totals.moduleTotalBranches[moduleName] = 0;
                    totals.moduleTotalCoveredBranches[moduleName] = 0;
                }

                totals.moduleTotalBranches[moduleName] += totalBranches;
                totals.moduleTotalCoveredBranches[moduleName] += passedBranches;
            }

            var result = percentage(numberOfFilesCovered, totalSmts);
            var output = createCoverageArray(file, result, numberOfFilesCovered, fileNumber, totalSmts, totalBranches, passedBranches, code);
            sumResult.push(output);
        }

        // create temporary function for use by the global totals reporter, 
        // as well as the per-module totals reporter
        var createAggregateTotal = function (numSt, numCov, numBranch, numCovBr, moduleName) {            
            var totalPercent = percentage(numCov, numSt);            
            return createCoverageArray("GLOBAL TOTAL", totalPercent, numCov, '', numSt, numBranch, numCovBr, null);
        };

        // if "data-cover-modulepattern" was provided, 
        // output the per-module totals alongside the global totals    
        if (modulePatternRegex) {
            for (var thisModuleName in totals.moduleTotalStatements) {
                if (totals.moduleTotalStatements.hasOwnProperty(thisModuleName)) {

                    var moduleTotalSt = totals.moduleTotalStatements[thisModuleName];
                    var moduleTotalCovSt = totals.moduleTotalCoveredStatements[thisModuleName];

                    var moduleTotalBr = totals.moduleTotalBranches[thisModuleName];
                    var moduleTotalCovBr = totals.moduleTotalCoveredBranches[thisModuleName];

                    createAggregateTotal(moduleTotalSt, moduleTotalCovSt, moduleTotalBr, moduleTotalCovBr, thisModuleName);
                }
            }
        }

        sumResult[0] = createAggregateTotal(totals.totalSmts, totals.numberOfFilesCovered, totals.totalBranches, totals.passedBranches, null);
        return sumResult;
    };

    // Extend string to contain a format function
    String.prototype.format = function () {
        var formatted = this;
        for (var i = 0; i < arguments.length; i++) {
            var regexp = new RegExp('\\{' + i + '\\}', 'gi');
            formatted = formatted.replace(regexp, arguments[i]);
        }
        return formatted;
    };

    /* Class for output formatting of data */
    var CoverageFormatter = function (data, reporterOptions) {
        var self = this;
        this.Data = data;
        this.Options = (reporterOptions !== undefined ? reporterOptions[0] : { "outputformat": "html", "logformat": "json" });
        this.ToJson = function () {
            return JSON.stringify(this.Data, null, "\t")
        };
        this.ToXml = function () {
            return "<coverage>{0}</coverage>".format(CoverageFormatter.PrintArrayWithProperties(self.Data, "\n<coverage_entry>{0}</coverage_entry>", "<{0}>{1}</{0}>"));
        };
        this.ToHtml = function () {
            return "<div class='coverage-summary'>{0}</div>".format(CoverageFormatter.PrintArrayWithProperties(self.Data, "<div class='coverage'>{0}</div>", "<span><label>{0}:</label> {1} </span> "));
        };
        this.ToObject = function () {
            return self.Data;
        };
        this.ToOutput = function () {
            return self.FormatByType(self.Options.outputformat);
        };
        this.ToLog = function () {
            return self.FormatByType(self.Options.logformat);
        };
        this.FormatByType = function (type) {
            switch(type.toLowerCase()) {
                case 'xml':
                    return self.ToXml();
                case 'json':
                    return self.ToJson();
                case 'object':
                    return self.ToObject();
                default:
                    return self.ToHtml();
            }
        }
    };
    // Static helper: printing out object properties
    CoverageFormatter.PrintProperties = function (objectData, formatString) {
        formatString = (formatString !== undefined ? formatString : "'{0}':{1}, ");
        var out = '';
        for (var prop in objectData) {
            out += formatString.format(prop, objectData[prop]);
        }
        return out;
    };
    // Static helper: printing out array of object
    CoverageFormatter.PrintArrayWithProperties = function (objectArray, outerString, innerString) {
        outerString = (outerString !== undefined ? outerString : "{0}\n");
        var out = '';
        for (var j = 0; j < objectArray.length; j++) {
            out += outerString.format(CoverageFormatter.PrintProperties(objectArray[j], innerString));
        }
        return out;
    }

})();
