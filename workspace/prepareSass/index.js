var cheerio = require('cheerio');
var through = require('through2');
var fs = require('fs');
var async = require('async');
var _ = require('lodash');

module.exports = function() {
    var componentsName = getComponents();
    var components = loadComponents(componentsName);

    return through.obj(processFile);

    function processFile() {
        var style = '@import "reset"\n';
        _.map(components, function(component, tagName) {
            prepareSass(component, tagName);
            style += '@import "' + tagName + '"\n';
        });
        style += '@import "main"\n';

        fs.writeFile('static/sass/style.sass', style, function(err) {
            if (err) {
                console.log('writeFile err', err);
            }
        });
    }

    function prepareSass(component, tagName) {
        var $component = cheerio.load(component);
        var style = $component('sass').html();
        var regexp = new RegExp(':host', 'gim');

        if (!style) return;

        style = style.replace(regexp, 'div.' + tagName);
        style = style.replace(/^\ {8,8}/gim, '');
        style = style.replace(/&apos;/gim, '\'');
        style = style.replace(/&amp;/gim, '&');
        style = style.replace(/&gt;/gim, '>');
        style = style.replace(/&lt;/gim, '<');

        fs.writeFile('static/sass/' + tagName + '.sass', style, function(err) {
            if (err) {
                console.log('writeFile err', err);
            }
        });
    }

    function loadComponents(names) {
        return _.reduce(names, function (memo, name) {
            var component = fs.readFileSync('./static/components/' + name + '.html');
            memo[name] = component.toString();
            return memo;
        }, {});
    }

    function getComponents() {
        return _.map(fs.readdirSync('./static/components'), function(fileName) {
            return fileName.replace('.html', '');
        });
    }
};