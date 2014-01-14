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
 * Update HREF attribute of the CSS link with title="theme"
 *
 * @param themeNameParam Name of css file in /themes,
 * without trailing ".css". Defaults to 'default'
 */
function setTheme(themeNameParam) {
    "use strict";
    var themeName = themeNameParam || 'default',
        links = document.getElementsByTagName('link'),
        a,
        l,
        elem,
        rnd;

    for (a = 0, l = links.length; a < l; a++) {
        elem = links[a];
        if ('theme' === elem.getAttribute('title')) {
            rnd = Math.round(Math.random() * 1000);// Cache buster
            elem.setAttribute('href', 'themes/' + themeName + '.css?' + rnd);
            break;
        }
    }

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
