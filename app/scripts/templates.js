module.exports = function(Handlebars) {

this["JST"] = this["JST"] || {};

Handlebars.registerPartial("discard_publish", Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<button class=\"btn btn-link-white js-discard\">Discard</button>\n<button class=\"btn btn-primary js-publish\">Publish layout</button>\n<div class=\"dropdown\">\n  <button class=\"dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\"><i class=\"material-icons\">more_horiz</i></button>\n  <ul class=\"dropdown-menu dropdown-menu-right\" role=\"menu\">\n    <li><a href=\"#\" class=\"js-publish-and-continue\">Publish and continue editing</a></li>\n    <li><a href=\"#\" class=\"js-save-and-close\">Save draft and close</a></li>\n    "
    + ((stack1 = container.invokePartial(Handlebars.r(partials,'overrides/layout_additional_actions'),depth0,{"name":"overrides/layout_additional_actions","fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n  </ul>\n</div>\n";
},"usePartial":true,"useData":true}));

Handlebars.registerPartial("item_panel", Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return " override-item";
},"3":function(container,depth0,helpers,partials,data) {
    return " overridden-item";
},"5":function(container,depth0,helpers,partials,data) {
    return " item-editing-position";
},"7":function(container,depth0,helpers,partials,data) {
    return "<div class=\"handle\"><i class=\"material-icons\">drag_handle</i></div>";
},"9":function(container,depth0,helpers,partials,data) {
    return "";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"status-icon\">\n      <span class=\"ngl-tooltip\" title=\""
    + ((stack1 = Handlebars.r(helpers,'unless').call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'cms_visible') : stack1),{"name":"unless","hash":{},"fn":container.program(12, data, 0),"inverse":container.program(14, data, 0),"data":data})) != null ? stack1 : "")
    + "\">\n        <i class=\"material-icons\">visibility_off</i>\n      </span>\n    </div>\n";
},"12":function(container,depth0,helpers,partials,data) {
    return "Hidden in CMS";
},"14":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(Handlebars.r(partials,'overrides/item_visibility_tooltip'),depth0,{"name":"overrides/item_visibility_tooltip","fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"16":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "    <div class=\"status-icon\">\n      <span class=\"ngl-tooltip\"\n        title=\""
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'item_view_type') : stack1),{"name":"if","hash":{},"fn":container.program(17, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'slot_view_type') : stack1),{"name":"if","hash":{},"fn":container.program(20, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n        <i class=\"material-icons\">info_outlined</i>\n      </span>\n    </div>\n";
},"17":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div>Overriden item view type to "
    + ((stack1 = Handlebars.r(helpers,'replace').call(depth0 != null ? depth0 : (container.nullContext || {}),"_"," ",{"name":"replace","hash":{},"fn":container.program(18, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ".</div>";
},"18":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'item_view_type') : stack1), depth0));
},"20":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div>Overriden slot view type to "
    + ((stack1 = Handlebars.r(helpers,'replace').call(depth0 != null ? depth0 : (container.nullContext || {}),"_"," ",{"name":"replace","hash":{},"fn":container.program(21, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ".</div>";
},"21":function(container,depth0,helpers,partials,data) {
    var stack1;

  return container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'slot_view_type') : stack1), depth0));
},"23":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<li><a href=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'cms_url') : stack1), depth0))
    + "\" target=\"_blank\" rel=\"noopener noreferrer\">Edit in CMS</a></li>";
},"25":function(container,depth0,helpers,partials,data) {
    return "          <li><a class=\"set-item-position\">Set position</a></li>\n";
},"27":function(container,depth0,helpers,partials,data) {
    return "          <li><a class=\"override-item-view-type\">Override item view type</a></li>\n";
},"29":function(container,depth0,helpers,partials,data) {
    return "<li><a class=\"remove-item\">Remove</a></li>";
},"31":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"item-edit-position\">\n      <input type=\"number\" value=\""
    + container.escapeExpression(Handlebars.r(helpers,'math').call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'position') : stack1),"+",1,{"name":"math","hash":{},"data":data}))
    + "\" class=\"item-position-input\" min=\"1\">\n      <a href=\"#\" class=\"btn btn-primary js-save-position\">Save</a>\n      <a href=\"#\" class=\"btn btn-default js-cancel-position\">Cancel</a>\n    </div>\n";
},"33":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(Handlebars.r(partials,'item_panel'),depth0,{"name":"item_panel","hash":{"override":true,"item":((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'overrideItem') : stack1)},"data":data,"indent":"  ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression;

  return "<div class=\"item-panel"
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,(depth0 != null ? Handlebars.r(depth0,'override') : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'overrideItem') : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'editing_position') : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\">\n  "
    + ((stack1 = Handlebars.r(helpers,'unless').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'is_dynamic') : stack1),{"name":"unless","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n  <p class=\"name\">\n    "
    + alias2(container.lambda(((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'name') : stack1), depth0))
    + "\n  </p>\n  "
    + ((stack1 = container.invokePartial(Handlebars.r(partials,'overrides/item_additional_icons'),depth0,{"name":"overrides/item_additional_icons","fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = Handlebars.r(helpers,'unless').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'is_visible') : stack1),{"name":"unless","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = Handlebars.r(helpers,'ifCond').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'item_view_type') : stack1),"||",((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'slot_view_type') : stack1),{"name":"ifCond","hash":{},"fn":container.program(16, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  <div class=\"controls\">\n    <div class=\"dropdown\">\n      <button class=\"dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\"><i class=\"material-icons\">more_horiz</i></button>\n      <ul class=\"dropdown-menu dropdown-menu-right\">\n        "
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'cms_url') : stack1),{"name":"if","hash":{},"fn":container.program(23, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        "
    + ((stack1 = container.invokePartial(Handlebars.r(partials,'overrides/item_additional_actions'),depth0,{"name":"overrides/item_additional_actions","fn":container.program(9, data, 0),"inverse":container.noop,"data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = Handlebars.r(helpers,'unless').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'is_dynamic') : stack1),{"name":"unless","hash":{},"fn":container.program(25, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = Handlebars.r(helpers,'unless').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'is_dynamic') : stack1),{"name":"unless","hash":{},"fn":container.program(27, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <li><a class=\"override-slot-view-type\">Override slot view type</a></li>\n        "
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'can_remove_item') : stack1),{"name":"if","hash":{},"fn":container.program(29, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n      </ul>\n    </div>\n    <div class=\"item-position\">"
    + alias2(Handlebars.r(helpers,'math').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'position') : stack1),"+",1,{"name":"math","hash":{},"data":data}))
    + "</div>\n  </div>\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'editing_position') : stack1),{"name":"if","hash":{},"fn":container.program(31, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n</div>\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'item') : depth0)) != null ? Handlebars.r(stack1,'overrideItem') : stack1),{"name":"if","hash":{},"fn":container.program(33, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"usePartial":true,"useData":true}));

Handlebars.registerPartial("layouts/app_header", Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<header class=\"app-header\"></header>\n";
},"useData":true}));

Handlebars.registerPartial("layouts/sidebar", Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<header class=\"app-header\">\n  <div class=\"app-center\"></div>\n</header>\n";
},"useData":true}));

this["JST"]["block_actions"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "    <span class=\"action-destroy glyphicon glyphicon-remove\" title=\"Delete "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'template') : stack1)) != null ? Handlebars.r(stack1,'kind') : stack1), depth0))
    + "\"></span>\n    <span class=\"handle glyphicon glyphicon-move\" title=\"Move "
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'template') : stack1)) != null ? Handlebars.r(stack1,'kind') : stack1), depth0))
    + "\"></span>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<span class=\"block_actions\">\n"
    + ((stack1 = Handlebars.r(helpers,'unless').call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'in_group') : stack1),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</span>\n";
},"useData":true});

this["JST"]["block_template"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"template_name\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'view_type') : stack1), depth0))
    + "</div>\n";
},"useData":true});

this["JST"]["block_types/item"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "  <span class=\"icon\">\n    <img src=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'icon') : stack1), depth0))
    + "\" alt=\"\">\n  </span>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "  <span class=\"icon font-icon\"></span>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = Handlebars.r(helpers,'if').call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'icon') : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "<span class=\"title\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'name') : stack1), depth0))
    + "</span>\n";
},"useData":true});

this["JST"]["block_types/items"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "        <div class=\"header\">\n          <h2>"
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'name') : depth0), depth0))
    + "</h2>\n        </div>\n        <div class=\"block-items "
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'identifier') : depth0), depth0))
    + "\"></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<button class=\"button js-open\" data-target=\"blocks\"><span class=\"icon\"></span></button>\n\n<div class=\"left-toolbar-panels\">\n  <div class=\"left-panel left-panel-blocks\">\n    <div class=\"panel-content\">\n      <a class=\"js-close close-panel\"><i class=\"material-icons\">close</i></a>\n"
    + ((stack1 = Handlebars.r(helpers,'each').call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? Handlebars.r(depth0,'groups') : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["blocks/custom"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"empty-block\">"
    + container.escapeExpression(container.lambda((depth0 != null ? Handlebars.r(depth0,'name') : depth0), depth0))
    + "</div>\n";
},"useData":true});

this["JST"]["blocks/default"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div>\n  Block: "
    + container.escapeExpression(container.lambda((depth0 != null ? Handlebars.r(depth0,'model') : depth0), depth0))
    + "\n</div>\n";
},"useData":true});

this["JST"]["blocks/grid"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "    <div class=\"col-lg-4\"><img src=\""
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'image') : depth0), depth0))
    + "\" /> <h2>"
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'title') : depth0), depth0))
    + "</h2></div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"container grid-block\">\n  <div class=\"row\">\n"
    + ((stack1 = Handlebars.r(helpers,'each').call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? Handlebars.r(depth0,'data') : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\n</div>\n";
},"useData":true});

this["JST"]["blocks/image"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<img src=\""
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'src') : stack1), depth0))
    + "\">\n\n";
},"useData":true});

this["JST"]["blocks/list"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<ul>\n  <li><a href=\"#\">Item1</a></li>\n  <li><a href=\"#\">Item2</a></li>\n  <li><a href=\"#\">Item3</a></li>\n</ul>\n";
},"useData":true});

this["JST"]["bm_collection_item"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(Handlebars.r(partials,'item_panel'),depth0,{"name":"item_panel","hash":{"item":(depth0 != null ? Handlebars.r(depth0,'model') : depth0)},"data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"usePartial":true,"useData":true});

this["JST"]["bm_collection_items"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<!--Collection items will appear here!-->\n<div class=\"bm-items\" data-input></div>\n";
},"useData":true});

this["JST"]["bm_collection_overflown_items"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "  <div class=\"bm-overflown\">\n    <a class=\"toggle-link sub-toggle\" role=\"button\" data-toggle=\"collapse\" href=\"#overflown-"
    + alias2(alias1(((stack1 = (depth0 != null ? Handlebars.r(depth0,'collection') : depth0)) != null ? Handlebars.r(stack1,'cid') : stack1), depth0))
    + "\" aria-expanded=\"false\" aria-controls=\"overflown-"
    + alias2(alias1(((stack1 = (depth0 != null ? Handlebars.r(depth0,'collection') : depth0)) != null ? Handlebars.r(stack1,'cid') : stack1), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'message') : depth0), depth0))
    + "</a>\n    <div class=\"collapse\" id=\"overflown-"
    + alias2(alias1(((stack1 = (depth0 != null ? Handlebars.r(depth0,'collection') : depth0)) != null ? Handlebars.r(stack1,'cid') : stack1), depth0))
    + "\" aria-expanded=\"false\">\n      <div class=\"bm-overflown-items\" data-input></div>\n    </div>\n  </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = Handlebars.r(helpers,'if').call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? Handlebars.r(depth0,'before') : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = Handlebars.r(helpers,'if').call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? Handlebars.r(depth0,'offset') : depth0),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    return "      <div class=\"bm-overflown\">\n        <p>"
    + container.escapeExpression(container.lambda((depth0 != null ? Handlebars.r(depth0,'message') : depth0), depth0))
    + "</p>\n      </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<!--Collection items will appear here!-->\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? Handlebars.r(depth0,'collection') : depth0)) != null ? Handlebars.r(stack1,'length') : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "");
},"useData":true});

this["JST"]["bm_collection"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "  <div class=\"loading-collection\">\n    <div class=\"collection-loader\">\n      <i class=\"loading-ng-icon\"></i>\n      <span>Loading</span>\n    </div>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "<div class=\"add-items add-items-btn\" data-input>+ Add items</div>";
},"5":function(container,depth0,helpers,partials,data) {
    return "  <div class=\"remove-all-items\">\n    <a href=\"#\" class=\"js-remove-all\"><i class=\"material-icons\">delete_forever</i> Remove all manual items</a>\n  </div>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "  </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'loading') : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'canAddItems') : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n<div class=\"bm-overflown-before\" data-input></div>\n<div class=\"items\"></div>\n<div class=\"bm-overflown-after\" data-input></div>\n\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'show_remove_all') : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'loading') : stack1),{"name":"if","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["JST"]["error_message"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "      <div class=\"error\">\n        <p>"
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'message') : depth0), depth0))
    + "</p>\n        <p><code>"
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'type') : depth0), depth0))
    + "</code> "
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'url') : depth0), depth0))
    + "</p>\n        <p>"
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'timestamp') : depth0), depth0))
    + " :: "
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'status_code') : depth0), depth0))
    + " "
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'status_text') : depth0), depth0))
    + "</p>\n\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? Handlebars.r(depth0,'debug') : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n      </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "          <div class=\"debug\">\n            <pre>"
    + container.escapeExpression(container.lambda((depth0 != null ? Handlebars.r(depth0,'pretty_debug') : depth0), depth0))
    + "</pre>\n          </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression;

  return "<div class=\"error_message\">\n  <p>An error occurred and we're not sure why.</p>\n  <p>Please, send the error details below to developers with the description of what you were doing when the error occurred to help fix it.</p>\n  <p><a data-toggle=\"collapse\" href=\"#"
    + alias2(Handlebars.r(helpers,'uid').call(alias1,true,{"name":"uid","hash":{},"data":data}))
    + "\" aria-expanded=\"false\" aria-controls=\""
    + alias2(Handlebars.r(helpers,'uid').call(alias1,{"name":"uid","hash":{},"data":data}))
    + "\">Error details</a></p>\n\n  <div id=\""
    + alias2(Handlebars.r(helpers,'uid').call(alias1,{"name":"uid","hash":{},"data":data}))
    + "\" class=\"collapse\">\n"
    + ((stack1 = Handlebars.r(helpers,'each').call(alias1,(depth0 != null ? Handlebars.r(depth0,'errors') : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </div>\n</div>\n";
},"useData":true});

this["JST"]["form_modal"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda;

  return "<div class=\"modal-dialog\">\n  <div class=\"modal-content\">\n    <div class=\"in\">\n      <div class=\"modal-header\">\n        <h4 class=\"modal-title\">"
    + container.escapeExpression(alias1((depth0 != null ? Handlebars.r(depth0,'title') : depth0), depth0))
    + "</h4>\n      </div>\n\n      <div class=\"modal-body\">\n        "
    + ((stack1 = alias1(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'form') : stack1), depth0)) != null ? stack1 : "")
    + "\n      </div>\n\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>\n        <button type=\"button\" class=\"btn btn-primary action_apply green\">OK</button>\n      </div>\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["header"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        "
    + ((stack1 = container.invokePartial(Handlebars.r(partials,'overrides/header'),depth0,{"name":"overrides/header","fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "";
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        <a href=\"#\" class=\"js-normal-mode\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? Handlebars.r(depth0,'base_layout') : depth0)) != null ? Handlebars.r(stack1,'name') : stack1), depth0))
    + "</a>\n        <span>&gt;</span>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "<i class=\"material-icons shared-icon\">share</i>";
},"8":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "        <span class=\"show-form ngl-tooltip js-show-form\" title=\""
    + alias2(alias1(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'description') : stack1), depth0))
    + "\"><span class=\"js-layout-name\" data-placement=\"bottom\">"
    + alias2(alias1(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'name') : stack1), depth0))
    + "</span> <i class=\"material-icons\">edit</i></span>\n        "
    + ((stack1 = container.invokePartial(Handlebars.r(partials,'overrides/header_additional_name'),depth0,{"name":"overrides/header_additional_name","fn":container.program(2, data, 0),"inverse":container.noop,"data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n";
},"10":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "        <span class=\"show-form ngl-tooltip js-layout-name\" title=\""
    + alias2(alias1(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'description') : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'name') : stack1), depth0))
    + "</span>\n";
},"12":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(Handlebars.r(partials,'discard_publish'),depth0,{"name":"discard_publish","data":data,"indent":"        ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"14":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = Handlebars.r(helpers,'eq').call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? Handlebars.r(depth0,'state') : depth0)) != null ? Handlebars.r(stack1,'mode') : stack1),"edit_master",{"name":"eq","hash":{},"fn":container.program(15, data, 0),"inverse":container.program(17, data, 0),"data":data})) != null ? stack1 : "");
},"15":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "          <button class=\"btn btn-primary btn-icon-left js-back\"><i class=\"material-icons\">keyboard_arrow_left</i>Back</button>\n"
    + ((stack1 = container.invokePartial(Handlebars.r(partials,'discard_publish'),depth0,{"name":"discard_publish","data":data,"indent":"          ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"17":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = Handlebars.r(helpers,'eq').call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? Handlebars.r(depth0,'state') : depth0)) != null ? Handlebars.r(stack1,'mode') : stack1),"linking",{"name":"eq","hash":{},"fn":container.program(18, data, 0),"inverse":container.program(20, data, 0),"data":data})) != null ? stack1 : "")
    + "\n";
},"18":function(container,depth0,helpers,partials,data) {
    return "            <button class=\"btn btn-primary btn-icon-left js-soft-back\"><i class=\"material-icons\">keyboard_arrow_left</i>Back</button>\n";
},"20":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = Handlebars.r(helpers,'eq').call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? Handlebars.r(depth0,'state') : depth0)) != null ? Handlebars.r(stack1,'mode') : stack1),"translate",{"name":"eq","hash":{},"fn":container.program(21, data, 0),"inverse":container.program(23, data, 0),"data":data})) != null ? stack1 : "");
},"21":function(container,depth0,helpers,partials,data) {
    return "              <button class=\"btn btn-primary btn-icon-left js-normal-mode\"><i class=\"material-icons\">keyboard_arrow_left</i>Back</button>\n";
},"23":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = Handlebars.r(helpers,'eq').call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? Handlebars.r(depth0,'state') : depth0)) != null ? Handlebars.r(stack1,'mode') : stack1),"change_type",{"name":"eq","hash":{},"fn":container.program(24, data, 0),"inverse":container.program(26, data, 0),"data":data})) != null ? stack1 : "");
},"24":function(container,depth0,helpers,partials,data) {
    return "                <button class=\"btn btn-link-white js-back\">Cancel</button>\n";
},"26":function(container,depth0,helpers,partials,data) {
    return "                <button class=\"btn btn-primary btn-icon-left js-back\"><i class=\"material-icons\">keyboard_arrow_left</i>Back</button>\n";
},"28":function(container,depth0,helpers,partials,data) {
    return "      <button class=\"btn btn-primary btn-icon-left js-change-layout-apply\">Apply</button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"app-logo-box\"><div class=\"app-logo ngl-tooltip\" title=\""
    + container.escapeExpression(container.lambda((depth0 != null ? Handlebars.r(depth0,'layouts_version') : depth0), depth0))
    + "\"></div></div>\n<div class=\"bm-header\">\n  <div class=\"layout-name\">\n\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,(depth0 != null ? Handlebars.r(depth0,'normal_editing') : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,(depth0 != null ? Handlebars.r(depth0,'base_layout') : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n      "
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'shared') : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,(depth0 != null ? Handlebars.r(depth0,'normal_editing') : depth0),{"name":"if","hash":{},"fn":container.program(8, data, 0),"inverse":container.program(10, data, 0),"data":data})) != null ? stack1 : "")
    + "\n\n  </div>\n  <div class=\"actions\">\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,(depth0 != null ? Handlebars.r(depth0,'normal_editing') : depth0),{"name":"if","hash":{},"fn":container.program(12, data, 0),"inverse":container.program(14, data, 0),"data":data})) != null ? stack1 : "")
    + "\n\n"
    + ((stack1 = Handlebars.r(helpers,'eq').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'state') : depth0)) != null ? Handlebars.r(stack1,'mode') : stack1),"change_type",{"name":"eq","hash":{},"fn":container.program(28, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n\n  </div>\n</div>\n";
},"usePartial":true,"useData":true});

this["JST"]["layout_link_chooser"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, alias1=container.escapeExpression;

  return "      <option "
    + alias1(Handlebars.r(helpers,'option_value').call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? Handlebars.r(depth0,'id') : depth0),((stack1 = (depths[1] != null ? Handlebars.r(depths[1],'params') : depths[1])) != null ? Handlebars.r(stack1,'id') : stack1),{"name":"option_value","hash":{},"data":data}))
    + " >"
    + alias1(container.lambda((depth0 != null ? Handlebars.r(depth0,'name') : depth0), depth0))
    + "</option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return "<div class=\"form-inline\">\n  <i class=\"material-icons shared-icon\">share</i>\n  <select class=\"bm-select\" name=\"layout[id]\">\n"
    + ((stack1 = Handlebars.r(helpers,'each').call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? Handlebars.r(depth0,'collection') : depth0)) != null ? Handlebars.r(stack1,'models') : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "  </select>\n</div>\n\n";
},"useData":true,"useDepths":true});

this["JST"]["layouts/application"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"loading-overlay\"></div>\n\n<aside class=\"left-toolbar\">\n <div class=\"top-menu\">\n  <div class=\"blocks\"></div>\n </div>\n\n <div class=\"bottom-menu\"></div>\n</aside>\n\n\n"
    + container.escapeExpression(Handlebars.r(helpers,'yield').call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"yield","hash":{},"data":data}))
    + "\n";
},"useData":true});

this["JST"]["layouts/blank"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return container.escapeExpression(Handlebars.r(helpers,'yield').call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"yield","hash":{},"data":data}))
    + "\n";
},"useData":true});

this["JST"]["layouts/layout_link"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(Handlebars.r(partials,'layouts/app_header'),depth0,{"name":"layouts/app_header","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n<div class=\"main-content\">\n  "
    + container.escapeExpression(Handlebars.r(helpers,'yield').call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"yield","hash":{},"data":data}))
    + "\n</div>\n\n\n";
},"usePartial":true,"useData":true});

this["JST"]["layouts/toolbar"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "  <button data-mode=\""
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'mode') : depth0), depth0))
    + "\" class=\"button ngl-tooltip "
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'className') : depth0), depth0))
    + "\" title=\""
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'title') : depth0), depth0))
    + "\">\n    <span class=\""
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'icon') : depth0), depth0))
    + "\"></span>\n  </button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = Handlebars.r(helpers,'each').call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? Handlebars.r(depth0,'buttons') : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

this["JST"]["modal_discard_or_edit"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"modal-dialog new_layout\">\n  <div class=\"modal-content\">\n    <div class=\"modal-header\">\n        <h1 class=\"modal-title\">"
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'title') : depth0), depth0))
    + "</h1>\n    </div>\n    <div class=\"modal-body\">\n\n       <div><strong>Name:</strong> <span>"
    + alias2(alias1(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'name') : stack1), depth0))
    + "</span></div>\n       <div><strong>Updated at:</strong> <span>"
    + alias2(Handlebars.r(helpers,'date').call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'updated_at') : stack1),{"name":"date","hash":{"format":"LLLL"},"data":data}))
    + "</span></div>\n\n    </div>\n\n   <div class=\"modal-footer\">\n     <button type=\"button\" class=\"btn btn-default action_apply\">New draft</button>\n     <button type=\"button\" class=\"btn btn-primary action_cancel\" data-dismiss=\"modal\">Edit existing</button>\n   </div>\n\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["modal_form"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.lambda((depth0 != null ? Handlebars.r(depth0,'body') : depth0), depth0)) != null ? stack1 : "")
    + "\n";
},"useData":true});

this["JST"]["modal"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "          <button type=\"button\" class=\"btn btn-link action_cancel\" data-dismiss=\"modal\">"
    + container.escapeExpression(container.lambda((depth0 != null ? Handlebars.r(depth0,'cancel_text') : depth0), depth0))
    + "</button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"modal-dialog\">\n  <div class=\"modal-content\">\n    <div class=\"in\">\n      <div class=\"modal-header\">\n        <h1 class=\"modal-title\">"
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'title') : depth0), depth0))
    + "</h1>\n      </div>\n\n      <div class=\"modal-body\">\n        "
    + ((stack1 = alias1((depth0 != null ? Handlebars.r(depth0,'body') : depth0), depth0)) != null ? stack1 : "")
    + "\n      </div>\n\n      <div class=\"modal-footer\">\n"
    + ((stack1 = Handlebars.r(helpers,'unless').call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? Handlebars.r(depth0,'cancel_disabled') : depth0),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        <button type=\"button\" class=\"btn btn-primary action_apply green\">"
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'apply_text') : depth0), depth0))
    + "</button>\n      </div>\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["new_layout"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"modal-dialog new_layout\">\n  <div class=\"modal-content\">\n\n    <div class=\"modal-body\">\n       "
    + ((stack1 = container.lambda((depth0 != null ? Handlebars.r(depth0,'body') : depth0), depth0)) != null ? stack1 : "")
    + "\n    </div>\n\n\n    <div class=\"modal-footer\">\n      <button type=\"button\" class=\"btn btn-primary action_apply green\">Create layout</button>\n    </div>\n\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["pages/layout_link"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(Handlebars.r(partials,'layouts/app_header'),depth0,{"name":"layouts/app_header","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n<div class=\"zones-wrapper\">\n  <div class=\"zones main-content\"></div>\n</div>\n";
},"usePartial":true,"useData":true});

this["JST"]["pages/layout_new"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "";
},"useData":true});

this["JST"]["pages/layout"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(Handlebars.r(partials,'layouts/app_header'),depth0,{"name":"layouts/app_header","data":data,"helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "")
    + "\n<div class=\"main-content\">\n\n  <div id=\"zone_linking_header\"></div>\n  <div class=\"zones\"></div>\n</div>\n\n\n<aside id=\"sidebar\">\n    <div class=\"right-sidebar\"></div>\n    <div id=\"trash\">\n        <div data-trash></div>\n        <i class=\"material-icons\">delete_forever</i><p>Trash</p>\n    </div>\n\n    <div class=\"loader\">\n        <div class=\"content\">\n            <i class=\"loading-ng-icon\"></i>\n            <span>Loading</span>\n        </div>\n    </div>\n</aside>\n";
},"usePartial":true,"useData":true});

this["JST"]["sidebar"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"not-selected\">\n  <div class=\"content\">\n    <span class=\"icon-block\"></span>\n    <p>Select a block to access its properties.</p>\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["sidebar2"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"not-selected\">\n  <div class=\"content\">\n    <span class=\"icon-zone\"></span>\n    <p>You can link a zone in the layout by pointing it to a zone in the shared layout. Blocks from the shared layout zone will then be displayed in the linked zone.</p>\n    <p>Multiple zones in this layout can be linked to zones from different shared layouts.</p>\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["sidebar3"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"not-selected\">\n  <div class=\"content\">\n    <span class=\"icon-zone\"></span>\n    <p>Use the dropdown menu to select a shared layout you want to preview and then select a desired target zone to create a link.</p>\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["slider"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "  <i class=\"autoplay glyphicon glyphicon-play\"></i>\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "  <i class=\"navigation navigation-prev glyphicon glyphicon-menu-left\"></i>\n  <i class=\"navigation navigation-next glyphicon glyphicon-menu-right\"></i>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "  <i class=\"pagination glyphicon glyphicon-option-horizontal\"></i>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'parameters') : depth0)) != null ? Handlebars.r(stack1,'autoplay') : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'parameters') : depth0)) != null ? Handlebars.r(stack1,'navigation') : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'parameters') : depth0)) != null ? Handlebars.r(stack1,'pagination') : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n<span class=\"speed\">"
    + container.escapeExpression(Handlebars.r(helpers,'speed').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'parameters') : depth0)) != null ? Handlebars.r(stack1,'speed') : stack1),{"name":"speed","hash":{},"data":data}))
    + " s</span>\n";
},"useData":true});

this["JST"]["snackbar"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"snackbar-box\">\n  <p class=\"snackbar-message\">"
    + container.escapeExpression(container.lambda((depth0 != null ? Handlebars.r(depth0,'message') : depth0), depth0))
    + "</p>\n</div>\n";
},"useData":true});

this["JST"]["zone_chooser"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "    <a href=\"#\" class=\"btn btn-danger js-unlink\">Unlink zone from layout_id: \""
    + alias2(alias1(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'linked_layout_id') : stack1), depth0))
    + "\" and zone_id: \""
    + alias2(alias1(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'linked_zone_identifier') : stack1), depth0))
    + "\"</a>\n    <a href=\""
    + alias2(Handlebars.r(helpers,'url_for').call(depth0 != null ? depth0 : (container.nullContext || {}),"layout",{"name":"url_for","hash":{"type":"edit","id":((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'linked_layout_id') : stack1)},"data":data}))
    + "\" target=\"_blank\" class=\"btn btn-success js-edit-parent\">Edit linked layout</a>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"zone_chooser\">\n  <a href=\"#\" class=\"btn btn-primary js-choose\">Choose zone</a>\n\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'is_linked') : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});

this["JST"]["zone_linker"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"zone_linker\">\n  <a href=\"#\" class=\"btn btn-primary js-link\">Link zone</a>\n</div>\n";
},"useData":true});

this["JST"]["zone_linking_header"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "      Choose a zone you wish to link\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "     Choose one of the shared layouts and then select a target zone\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression;

  return "<div class=\"steps-wrapper\">\n  <div class=\"steps\">\n    <div class=\"step "
    + alias2(Handlebars.r(helpers,'active_class_if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'state') : depth0)) != null ? Handlebars.r(stack1,'mode') : stack1),"linking",{"name":"active_class_if","hash":{},"data":data}))
    + "\">1</div>\n    <div class=\"step "
    + alias2(Handlebars.r(helpers,'active_class_if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'state') : depth0)) != null ? Handlebars.r(stack1,'mode') : stack1),"choosing",{"name":"active_class_if","hash":{},"data":data}))
    + "\">2</div>\n  </div>\n\n  <div class=\"step-text\">\n"
    + ((stack1 = Handlebars.r(helpers,'eq').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'state') : depth0)) != null ? Handlebars.r(stack1,'mode') : stack1),"linking",{"name":"eq","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "  </div>\n</div>\n\n<div class=\"layout-chooser\"></div>\n";
},"useData":true});

this["JST"]["zone_wrapper"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div class=\"name\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'name') : stack1), depth0))
    + "</div>\n<div class=\"body\" data-zone-receiver></div>\n";
},"useData":true});

this["JST"]["zone"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "  <div class=\"zone-header\">\n    <span class=\"zone-name\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'name') : stack1), depth0))
    + "</span>\n    <div class=\"zone-controls\">\n"
    + ((stack1 = Handlebars.r(helpers,'eq').call(alias1,(depth0 != null ? Handlebars.r(depth0,'mode') : depth0),"chooser",{"name":"eq","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ((stack1 = Handlebars.r(helpers,'eq').call(alias1,(depth0 != null ? Handlebars.r(depth0,'mode') : depth0),"linker",{"name":"eq","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div>\n  </div>\n";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = Handlebars.r(helpers,'if').call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'is_linked') : stack1),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.program(5, data, 0),"data":data})) != null ? stack1 : "");
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "          <span class=\"zone-btn linked-zone-btn ngl-tooltip\" data-placement=\"left\" title=\"<span class='tt-note'>This zone is already linked with<br/> Layout:</span> <strong>"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'linked_layout') : stack1)) != null ? Handlebars.r(stack1,'name') : stack1), depth0))
    + "</strong><br/> <span class='tt-note'>Zone:</span> <strong>"
    + alias2(alias1(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'linked_zone_name') : stack1), depth0))
    + "</strong>\"><span class=\"link-zone-icon\"></span></span>\n          <div class=\"dropdown\">\n              <button class=\"dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\"><i class=\"material-icons\">more_horiz</i></button>\n              <ul class=\"dropdown-menu dropdown-menu-right\">\n                  <li><a title=\"Update link\" class=\"js-choose\">Update link<span class=\"note\">Choose different zone</span></a></li>\n                  <li><a title=\"Unlink\" class=\"js-unlink\">Unlink</a></li>\n              </ul>\n          </div>\n";
},"5":function(container,depth0,helpers,partials,data) {
    return "          <a href=\"#\" class=\"zone-btn link-zone-btn js-choose\"><span>Link zone</span> <span class=\"link-zone-icon\"></span></a>\n";
},"7":function(container,depth0,helpers,partials,data) {
    return "        <a href=\"#\" class=\"zone-btn link-zone-btn js-link\"><span class=\"link-zone-icon\"></span> <span>Select zone</span></a>\n";
},"9":function(container,depth0,helpers,partials,data) {
    return "    <div class=\"linked-zone-overlay\"></div>\n";
},"11":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "    <div class=\"zone-map-overlay\">\n      <div class=\"zone-map-name\">\n        <div class=\"handle\" title=\"Move block\"><i class=\"material-icons\">drag_handle</i></div>\n        <p>"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'name') : stack1), depth0))
    + "</p>\n      </div>\n      <a href=\"#\" class=\"btn btn-outline zone-unmap js-unmap\"><i class=\"material-icons\">close</i></a>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return ((stack1 = Handlebars.r(helpers,'if').call(alias1,(depth0 != null ? Handlebars.r(depth0,'show_header') : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n<div class=\"zone-body\" data-receiver>\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'is_linked') : stack1),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n\n"
    + ((stack1 = Handlebars.r(helpers,'if').call(alias1,(depth0 != null ? Handlebars.r(depth0,'show_zone_map_overlay') : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n</div>\n";
},"useData":true});

return this["JST"];

};