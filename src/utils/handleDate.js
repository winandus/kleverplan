export function timeStampToDate(timestamp) {
    let date = new Date(timestamp * 1000);
    return date.toLocaleDateString("default")
}

export function dateToTimestamp(date) {
    let timestamp = new Date(date).getTime() / 1000
    return timestamp
}

export function dateFormatForInput(date) {
    let dateArray = date.split("/");
    let formattedDateArray = []
    dateArray.map(date => {
        if (parseInt(date) < 10) {
            date = '0' + date
        }
        formattedDateArray.push(date)
    });
    const newdate = formattedDateArray[2] + '-' + formattedDateArray[0] + '-' + formattedDateArray[1];
    return newdate
}

export function timestampToDateString(timestamp) {
    let date = new Date(timestamp * 1000), month, day, year;
    let dateString;
    month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    dateString = [year, month, day].join('-');
    return dateString
}

export function dateStringToTimestamp(dateString) {
    const date = new Date(dateString);
    const timestamp = date.getTime() / 1000;
    return timestamp
}