let timeouts = [];
let alertsWereSet = false;

export function setAlerts(todayAgenda, setAlertFunction) {
    if (!alertsWereSet) {
        timeouts = todayAgenda.map(r => {
            return setTimeout(() => setAlertFunction(r), r.todayDate - Date.now());
        });
        alertsWereSet = true;
        console.log('Alerts were set');
    }
}

export function resetAlerts() {
    console.log('Reset alerts');
    for (let i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    timeouts = [];
    alertsWereSet = false;
}
