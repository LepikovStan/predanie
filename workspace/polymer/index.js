var cheerio = require('cheerio');
var through = require('through2');
var fs = require('fs');
var async = require('async');
var _ = require('lodash');

module.exports = function() {
    var componentsName = getComponents();
    var components = loadComponents(componentsName);

    return through.obj(processFile);

    function processFile(file) {
        file.contents = new Buffer(replacePolymer(file.contents.toString()));
        this.push(file);
    }

    function replacePolymer(html) {
        var $html = cheerio.load(html);

        _.map(components, function(component, tagName) {
            replaceComponent(component, tagName, $html);

            if (_.size($html(tagName))) {
                replaceComponent(component, tagName, $html);
            }
        });

        return $html.html();
    }

    function replaceComponent(component, tagName, $html) {
        var $component = cheerio.load(component);
        var tpl = '<div class="'+tagName+'">' + $component('template').html() + '    </div>';

        $html(tagName).each(function(i, elem) {
            var $elem = $html(this);
            var attrs = elem.attribs;

            var restpl = prepareTpl(tpl, attrs, $elem.html());
            $elem.replaceWith(restpl);
        });
    }

    function prepareTpl(tpl, attrs, innerHtml) {
        _.map(attrs, function(attrVal, attrName) {
            var regexp = new RegExp('\{\{'+attrName+'\}\}', 'gim');
            tpl = tpl.replace(regexp, attrVal);
        });
        var innerHtmlRegexp = new RegExp('\{\{innerHtml\}\}', 'gim');
        tpl = tpl.replace(innerHtmlRegexp, innerHtml);
        tpl = tpl.replace(/\{\{.*\}\}/gim, '');

        return tpl;
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