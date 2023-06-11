mobiscroll.setOptions({
    locale: mobiscroll.localeen,
    theme: 'auto',
    themeVariant: 'light'
});

$(function () {
    var oldEvent,
        tempEvent = {},
        deleteEvent,
        restoreEvent,
        colorPicker,
        tempColor,
        $title = $('#event-title'),
        $deleteButton = $('#event-delete'),
        $color = $('#event-color'),
        datePickerResponsive = {
            medium: {
                controls: ['calendar'],
                touchUi: false
            }
        },
        datetimePickerResponsive = {
            medium: {
                controls: ['calendar', 'time'],
                touchUi: false
            }
        },
        now = new Date();
        let calendarList=[];
        $.get('/calendar',function(data){
            calendarList=data;
            myData=calendarList;
        }).done(function(){
            console.log(myData)
            console.log(calendarList)
            function createAddPopup(elm) {
                // hide delete button inside add popup
                $deleteButton.hide();
        
                deleteEvent = true;
                restoreEvent = false;
                
                // set popup header text and buttons for adding
                popup.setOptions({
                    headerText: 'New event',
                    buttons: ['cancel', {
                        text: 'Add',
                        keyCode: 'enter',
                        handler: function () {
                            // 캘린더 생성 이벤트 객체
                            const add_element={
                                id: tempEvent.id,
                                title: tempEvent.title,
                                description: tempEvent.description,
                                allDay: tempEvent.allDay,
                                start: tempEvent.start,
                                end: tempEvent.end,
                                color: tempEvent.color,
                            }
                            // 서버에 post 요청 보내야함
                            calendar.updateEvent({
                                add_element
                            });
                            
                            // navigate the calendar to the correct view
                            calendar.navigateToEvent(tempEvent);
                            deleteEvent = false;
                            popup.close();
                            console.log(add_element.id);
                            $.post('/calendar/save',{id:add_element.id,title:add_element.title,start:add_element.start,end:add_element.end,color:add_element.color})
                        },
                        cssClass: 'mbsc-popup-button-primary'
                    }]
                });
        
                // fill popup with a new event data
                $title.mobiscroll('getInst').value = tempEvent.title;
                // $description.mobiscroll('getInst').value = '';
                // $allDay.mobiscroll('getInst').checked = true;
                // range.setVal([tempEvent.start, tempEvent.end]);
                // $statusBusy.mobiscroll('getInst').checked = true;
                // range.setOptions({ controls: ['date'], responsive: datePickerResponsive });
                selectColor('', true);
        
                // set anchor for the popup
                popup.setOptions({ anchor: elm });
        
                popup.open();
            }
        
            function createEditPopup(args) {
                var ev = args.event;
                // show delete button inside edit popup
                $deleteButton.show();
        
                deleteEvent = false;
                restoreEvent = true;
        
                // set popup header text and buttons for editing
                popup.setOptions({
                    headerText: 'Edit event',
                    buttons: ['cancel', {
                        text: 'Save',
                        keyCode: 'enter',
                        handler: function () {
                            var eventToSave = {
                                id: ev.id,
                                title: $title.val(),
                                description: tempEvent.description,
                                allDay: tempEvent.allDay,
                                start: tempEvent.start,
                                end: tempEvent.end,
                                color: ev.color,
                            };
                            // 수정 파트
                            console.log("EVENT TO SAVE  ",tempEvent.description);
                            console.log("EVENT TO SAVE  ",eventToSave);
                            // update event with the new properties on save button click
                            calendar.updateEvent(eventToSave);
                            // navigate the calendar to the correct view
                            calendar.navigateToEvent(eventToSave);
                            restoreEvent = false;
                            popup.close();
                        },
                        cssClass: 'mbsc-popup-button-primary'
                    }]
                });
        
                // fill popup with the selected event data
                // 수정 버튼 클릭시 기본 내용
                $title.mobiscroll('getInst').value = ev.title || '';
            
                selectColor(ev.color, true);
        
                // set anchor for the popup
                popup.setOptions({ anchor: args.domEvent.currentTarget });
                popup.open();
            }
        
            var calendar = $('#demo-add-delete-event').mobiscroll().eventcalendar({
                clickToCreate: 'double',
                dragToCreate: true,
                dragToMove: true,
                dragToResize: true,
                
                data: myData,
                onEventClick: function (args) {
                    oldEvent = $.extend({}, args.event);
                    tempEvent = args.event;
        
                    if (!popup.isVisible()) {
                        createEditPopup(args);
                    }
                },
                onEventCreated: function (args) {
                    popup.close();
        
                    // store temporary event
                    tempEvent = args.event;
                    createAddPopup(args.target);
                    
                },
                onEventDeleted: function () {
                    mobiscroll.snackbar({
                        button: {
                            action: function () {
                                calendar.addEvent(args.event);
                            },
                            text: 'Undo'
                        },
                        message: 'Event deleted'
                    });
                }
            }).mobiscroll('getInst');
        
            var popup = $('#demo-add-popup').mobiscroll().popup({
                display: 'center',
                contentPadding: false,
                onClose: function () {
                    if (deleteEvent) {
                        calendar.removeEvent(tempEvent);
                    } else if (restoreEvent) {
                        calendar.updateEvent(oldEvent);
                        
                    }
                },
                responsive: {
                    medium: {
                        display: 'anchored',
                        width: 400,
                        fullScreen: false,
                        touchUi: false
                    }
                }
            }).mobiscroll('getInst');
        
            $title.on('input', function (ev) {
                // update current event's title
                tempEvent.title = ev.target.value;
            });
        
        
            $deleteButton.on('click', function () {
                // delete current event on button click
                calendar.removeEvent(tempEvent);
                
                // save a local reference to the deleted event
                var deletedEvent = tempEvent;
        
                popup.close();
        
                mobiscroll.snackbar({
                    button: {
                        action: function () {
                            calendar.addEvent(deletedEvent);
                        },
                        text: 'Undo'
                    },
                    message: 'Event deleted'
                });
            });
        
            colorPicker = $('#demo-event-color').mobiscroll().popup({
                display: 'bottom',
                contentPadding: false,
                showArrow: false,
                showOverlay: false,
                buttons: [
                    'cancel',
                    {
                        text: 'Set',
                        keyCode: 'enter',
                        handler: function (ev) {
                            setSelectedColor();
                        },
                        cssClass: 'mbsc-popup-button-primary'
                    }
                ],
                responsive: {
                    medium: {
                        display: 'anchored',
                        anchor: $('#event-color-cont')[0],
                        buttons: {},
                    }
                }
            }).mobiscroll('getInst');
        
            function selectColor(color, setColor) {
                $('.crud-color-c').removeClass('selected');
                $('.crud-color-c[data-value="' + color + '"]').addClass('selected');
                if (setColor) {
                    $color.css('background', color || '');
                }
            }
        
            function setSelectedColor() {
                tempEvent.color = tempColor;
                $color.css('background', tempColor);
                colorPicker.close();
            }
        
            $('#event-color-picker').on('click', function () {
                selectColor(tempEvent.color || '');
                colorPicker.open();
            });
        
        
            $('.crud-color-c').on('click', function (ev) {
                var $elm = $(ev.currentTarget);
        
                tempColor = $elm.data('value');
                selectColor(tempColor);
        
                if (!colorPicker.s.buttons.length) {
                    setSelectedColor();
                }
            });
        });
        
    //     myData = [{
    //         id: 1,
    //         start: '2023-05-08T13:00',
    //         end: '2023-05-08T13:45',
    //         title: 'Lunch @ Butcher\'s',
    //         description: '',
    //         allDay: false,
    //         free: true,
    //         color: '#009788'
    //     },{
    //         id: 1,
    //         start: '2023-05-20',
    //         end: '2023-05-21',
    //         title: 'binwon calendar',
    //         description: '',
    //         allDay: false,
    //         free: false,
    //         color: '#009788'
    //     }
    // ];

    
});