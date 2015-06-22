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
        titleInput = document.getElementById("title"),
        title = titleInput.value,
        startDateInput = document.getElementById("startDate"),
        startDate = startDateInput.value,
        dayCount = target.getAttribute("data-dayCount"),
        holder = document.getElementById("outputHolder");

    e.preventDefault();

    holder.innerHTML = render(title, template, theme, startDate, dayCount);
}

/**
 * Create button to render a template & theme
 *
 * @param template string Template name button will render
 * @param theme string Theme name button will render
 * @param dayCount int Number of days button will render
 * @param targetNodeParam object Node to append to. Defaults to document.body
 * @return Element
 */
function makeRenderButton(template, theme, dayCount, targetNodeParam) {
    "use strict";
    var btn = document.createElement("button"),
        targetNode = targetNodeParam || document.body,
        buttonLabel = String (theme).replace( '-', ' ');

    btn.setAttribute("data-template", template);
    btn.setAttribute("data-theme", theme);
    btn.setAttribute("data-dayCount", dayCount);
    btn.addEventListener(
        "click",
        onRenderButtonClick
    );

    // Make text for button
    btn.appendChild(
        document.createTextNode(buttonLabel)
    );

    targetNode.appendChild(btn);
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
 * @return Element
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
 * Create a date input form-field node
 *
 * @param name string Name of field
 * @param labelText string Text to display in label
 * @param value string Value of field
 * @param targetNodeParam object Element to attach input to
 * @return Element
 */
function makeDateInputField(name, labelText, value, targetNode) {
    "use strict";
    var i = makeInputField(name, labelText, value, targetNode, 'date');
    i.type = 'date';
    return i;
}

/**
 * Create and render the calendar preferences form
 *
 * @return null
 */
function init() {
    "use strict";
    var inputHolder = document.createElement("form"),
        outputHolder = document.createElement("div"),
        startDate = new Date().toJSON().slice(0,10);

    // Create buttons holder & buttons
    inputHolder.setAttribute("class", "no-print");
    makeInputField("title", "Title", "Untitled Calendar", inputHolder);
    makeDateInputField("startDate", "Start date", startDate, inputHolder);
    makeRenderButton("defaultTemplate", "default", "31", inputHolder);
    makeRenderButton("defaultTemplate", "day-planner", "3", inputHolder);
    makeRenderButton("defaultTemplate", "slim-days", "42", inputHolder);
    makeRenderButton("defaultTemplate", "working-week", "7", inputHolder);
    makeRenderButton("defaultTemplate", "full-week", "14", inputHolder);
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
/* Hints for jslint: */
/*jslint browser:true */
/*jslint todo:true */
/*jslint plusplus: true */
/*global console: false */
/*global Handlebars: false */

/**
 * Create data object representing hours in the day for use in template
 */
function makeHoursObject() {
    "use strict";
    var hoursobject = [], 
        startAt = 9,
        endAt = 15,
        h;

    for (h = startAt; h <= endAt; h++) {
        hoursobject.push({'hournumber': h});
    }

    return hoursobject;
}

/** 
 * Create data object representing a week for use in template
 * 
 * @param day Date instance set to required week
 */
function makeWeekObject(day) {
    "use strict";
    return {
        'weeknumber': day.format('W'),
        'weekmonth': day.format('M'),
        'weekyear': day.format('Y'),
        'days': []
    };
}

/**
 * Create data object representing a day for use in template
 * 
 * @param day Date instance
 */
function makeDayObject(day) {
    "use strict";
    return {
        "dayname": day.format('D'),
        "daynumber": day.getDate(),
        "suffix": day.format('S'),
        "month": day.format('M'),
        "year": day.format('Y'),
        "percentage": day.getProgress()
    };
}

/**
 * Update body tag with class="theme"
 *
 * @param themeNameParam Name of css file in /themes,
 * without trailing ".css". Defaults to 'default'
 */
function setTheme(themeNameParam) {
    "use strict";

    // Remove previously added class
    document.body.classList.remove(
        document.body.classList.item(0)
    );

    document.body.classList.add(themeNameParam);
    
    // var themeName = themeNameParam || 'default',
    //     links = document.getElementsByTagName('link'),
    //     a,
    //     l,
    //     elem,
    //     rnd;

    // for (a = 0, l = links.length; a < l; a++) {
    //     elem = links[a];
    //     if ('theme' === elem.getAttribute('title')) {
    //         rnd = Math.round(Math.random() * 1000);// Cache buster
    //         elem.setAttribute('href', 'css/themes/' + themeName + '.css?' + rnd);
    //         break;
    //     }
    // }

    return;
}

/**
 * Render the specified Handlebars template & CSS theme
 *
 * @param title Title for the calendar
 * @param templateNameParam Name of Handlebars template to use. Defaults to 'dayTemplate'
 * @param themeName Name of CSS theme to use. Defaults to 'default'
 * @param startDateParam Start date. Defaults to today
 * @param daysDurationParam Duration in days. Default to 28
 * @return string HTML fragment
 *
 * @todo Enclose in "class"
 * @todo Handle arbitrary number of days enclosed in week objects
 * @todo Templates / themes should be combined into one parameter
 * @todo Themes should be able to set their defaults
 */
function render(
    titleParam,
    templateNameParam,
    themeName,
    startDateParam,
    daysDurationParam
) {
    "use strict";
    var templateName = templateNameParam || 'defaultTemplate',
        templateNode = document.getElementById(templateName),
        template = Handlebars.compile(templateNode.innerHTML),
        startDate = startDateParam || new Date(),
        day = new Date(startDate),
        daysDuration = daysDurationParam || 1,
        data = {'title': titleParam, 'weeks': []},
        weekObj,
        dayObj;

    if (!templateNode) {
        return 'Template not found: ' + templateName;
    }

    // Set CSS theme
    setTheme(themeName || 'default');

    // Create output object for template, in this format:
    // {
    //     'weeks': {
    //         {
    //             'weeknumber',
    //             'weekmonth',
    //             'weekyear',
    //             'days': {
    //                 {
    //                     'dayname',
    //                     'daynumber',
    //                     'suffix',
    //                     'month',
    //                     'year',
    //                     'hours': {
    //                         {
    //                             'hournumber'
    //                         }...
    //                     }
    //                 }...
    //             }
    //         }
    //     }...
    // }
    while (daysDuration--) {
        dayObj = makeDayObject(day);
        console.log(day.getDay());

        // If first day of the week,
        // or first iteration of loop,
        // create a new week object
        if (
            1 === day.getDay() || undefined === weekObj
        ) {
            // Create week object
            weekObj = makeWeekObject(day);
            console.log('Creating week object');
        }

        dayObj.hours = makeHoursObject();
        weekObj.days.push(dayObj);

        // If last day of the week
        // or last iteration of loop
        // add days to week object
        if (
            0 === day.getDay() || 0 === daysDuration
        ) {
            data.weeks.push(weekObj);
        }

        day.addDay(); // Increment day by 1
    }

    console.log(data);
    return template(data);
}
