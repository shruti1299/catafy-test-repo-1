const dateFormat=(date:Date):string=>{
// Convert to Date object

var year = date.getUTCFullYear();
var month = String(date.getUTCMonth() + 1).padStart(2, '0');
var day = String(date.getUTCDate()).padStart(2, '0');
var hours = String(date.getUTCHours()).padStart(2, '0');
var minutes = String(date.getUTCMinutes()).padStart(2, '0');

// Format the date and time
return  year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
}