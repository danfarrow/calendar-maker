/* Hints for jslint: */
/*jslint browser:true */
/*jslint todo:true */
/*jslint plusplus: true */
/*global console: false */
/*global render: false */

/**
 * Event callback for render buttons
 */
function onRenderButtonClick(e) {
    "use strict";
    var target = e.currentTarget,
        template = target.getAttribute("data-template"),
        theme = target.getAttribute("data-theme"),
        startDateInput = document.getElementById("startDate"),
        startDate = startDateInput.value,
        dayCount = target.getAttribute("data-dayCount"),
        holder = document.getElementById("outputHolder");

    e.preventDefault();

    holder.innerHTML = render(template, theme, startDate, dayCount);
}

/**
 * Create button to render a template & theme
 *
 * @param template string Template name button will render
 * @param theme string Theme name button will render
 * @param dayCount int Number of days button will render
 * @param targetNodeParam object Node to append to. Defaults to document.body
 */
function makeRenderButton(template, theme, dayCount, targetNodeParam) {
    "use strict";
    var btn = document.createElement("button"),
        br = document.createElement("br"),
        targetNode = targetNodeParam || document.body;

    btn.setAttribute("data-template", template);
    btn.setAttribute("data-theme", theme);
    btn.setAttribute("data-dayCount", dayCount);
    btn.addEventListener(
        "click",
        onRenderButtonClick
    );

    // Make text for button
    btn.appendChild(
        document.createTextNode(theme)
    );

    targetNode.appendChild(btn);
    targetNode.appendChild(br);
    return btn;
}

/**
 * Create text input form-field
 *
 * @param name string Name of field
 * @param labelText string Text to display in label
 * @param value string Value of field
 * @param targetNodeParam object Element to attach input to
 * @param inputTypeParam string Type of input. Defaults to "text"
 */
function makeInputField(
    name,
    labelText,
    value,
    targetNodeParam,
    inputTypeParam
) {
    "use strict";
    var input = document.createElement("input"),
        label = document.createElement("label"),
        txt = document.createTextNode(labelText),
        br = document.createElement("br"),
        targetNode = targetNodeParam || document.body,
        inputType = inputTypeParam || "text";

    // Create input
    input.setAttribute("type", inputType);
    input.setAttribute("name", name);
    input.setAttribute("id", name);
    input.setAttribute("value", value);

    // Create label
    label.setAttribute("for", name);
    label.appendChild(txt);

    // Append to target node or body
    targetNode.appendChild(label);
    targetNode.appendChild(input);
    targetNode.appendChild(br);
    return input;
}

/**
 * Create date input form-field
 *
 * @param name string Name of field
 * @param labelText string Text to display in label
 * @param value string Value of field
 * @param targetNodeParam object Element to attach input to
 * @return {*}
 */
function makeDateInputField(name, labelText, value, targetNode) {
    "use strict";
    var i = makeInputField(name, labelText, value, targetNode, 'date');
    i.type = 'date';
    return i;
}

/**
 * Init
 */
function init() {
    "use strict";
    var inputHolder = document.createElement("form"),
        outputHolder = document.createElement("div"),
        today = new Date().toJSON().slice(0,10);

    // Create buttons holder & buttons
    inputHolder.setAttribute("class", "no-print");
    makeDateInputField("startDate", "Start date", today, inputHolder);
    makeRenderButton("defaultTemplate", "default", "31", inputHolder);
    makeRenderButton("defaultTemplate", "day-planner", "3", inputHolder);
    makeRenderButton("defaultTemplate", "slim-days", "42", inputHolder);
    makeRenderButton("defaultTemplate", "working-week", "7", inputHolder);
    makeRenderButton("defaultTemplate", "slim-weeks", "224", inputHolder);
    document.body.appendChild(inputHolder);

    // Create output holder
    outputHolder.setAttribute("id", "outputHolder");
    document.body.appendChild(outputHolder);
}

/**
 * Call init on DOMContentLoaded
 */
document.addEventListener(
    "DOMContentLoaded",
    init
);