wo5App.value('resourceService', {
    db: {},
    consts: {
        db: { wo5: 'WO5' },
        op: {
            rw: 'readwrite'
        },
        store: {
            program: 'Program',
            exercise: 'Exercise',
            session: 'Session',
            set: 'Set'
        },
        index: {
            id: 'id',
            program: 'program',
            workout: 'workout',
            day:'day',
            name: 'name',
            exercise: 'exercise',
            session: 'session'
        },
        measuement: {
            weight: {
                kg:'kg'
            }
        }
    },
    date: function () {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        var yy = ("" + yyyy).substr(2, 2);
        var h = today.getHours();
        var m = today.getMinutes()
        var s = today.getSeconds();

        if (dd < 10) { dd = '0' + dd }
        if (mm < 10) { mm = '0' + mm }

        return { year: yyyy, yearShort: yy, month: mm, day: dd, hour: h, minute: m, second: s };
    }
});