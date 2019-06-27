import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-custom-calender',
  templateUrl: './custom-calender.component.html',
  styleUrls: ['./custom-calender.component.css']
})
export class CustomCalenderComponent implements OnInit, AfterViewInit {
  cal = {
    mName: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // Month Names
    data: null, // Events for the selected period
    sDay: 0, // Current selected day
    sMth: 0, // Current selected month
    sYear: 0, // Current selected year
    sMon: false, // Week start on Monday?

    /* [FUNCTIONS] */
    list: function () {
      // cal.list() : draw the calendar for the given month

      // BASIC CALCULATIONS
      // Note - Jan is 0 & Dec is 11 in JS.
      // Note - Sun is 0 & Sat is 6
      this.cal.sMth = parseInt(document.getElementById("cal-mth")['value']); // selected month
      this.cal.sYear = parseInt(document.getElementById("cal-yr")['value']); // selected year
      var daysInMth = new Date(this.cal.sYear, this.cal.sMth + 1, 0).getDate(), // number of days in selected month
        startDay = new Date(this.cal.sYear, this.cal.sMth, 1).getDay(), // first day of the month
        endDay = new Date(this.cal.sYear, this.cal.sMth, daysInMth).getDay(); // last day of the month

      // LOAD DATA FROM LOCALSTORAGE
      this.cal.data = localStorage.getItem("cal-" + this.cal.sMth + "-" + this.cal.sYear);
      if (this.cal.data == null) {
        localStorage.setItem("cal-" + this.cal.sMth + "-" + this.cal.sYear, "{}");
        this.cal.data = {};
      } else {
        this.cal.data = JSON.parse(this.cal.data);
      }

      // DRAWING CALCULATIONS
      // Determine the number of blank squares before start of month
      var squares = [];
      if (this.cal.sMon && startDay != 1) {
        var blanks = startDay == 0 ? 7 : startDay;
        for (var i = 1; i < blanks; i++) { squares.push("b"); }
      }
      if (!this.cal.sMon && startDay != 0) {
        for (var i = 0; i < startDay; i++) { squares.push("b"); }
      }

      // Populate the days of the month
      for (var i = 1; i <= daysInMth; i++) { squares.push(i); }

      // Determine the number of blank squares after end of month
      if (this.cal.sMon && endDay != 0) {
        var blanks = endDay == 6 ? 1 : 7 - endDay;
        for (var i = 0; i < blanks; i++) { squares.push("b"); }
      }
      if (!this.cal.sMon && endDay != 6) {
        var blanks = endDay == 0 ? 6 : 6 - endDay;
        for (var i = 0; i < blanks; i++) { squares.push("b"); }
      }

      // DRAW
      // Container & Table
      var container = document.getElementById("container"),
        cTable = document.createElement("table");
      cTable.id = "calendar";
      container.innerHTML = "";
      container.appendChild(cTable);

      // First row - Days
      var cRow = document.createElement("tr"),
        cCell = null,
        days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
      if (this.cal.sMon) { days.push(days.shift()); }
      for (var d of days) {
        cCell = document.createElement("td");
        cCell.innerHTML = d;
        cRow.appendChild(cCell);
      }
      cRow.classList.add("head");
      cTable.appendChild(cRow);

      // Days in Month
      var total = squares.length;
      cRow = document.createElement("tr");
      cRow.classList.add("day");
      for (var i = 0; i < total; i++) {
        cCell = document.createElement("td");
        if (squares[i] == "b") { cCell.classList.add("blank"); }
        else {
          cCell.innerHTML = "<div class='dd'>" + squares[i] + "</div>";
          if (this.cal.data[squares[i]]) {
            cCell.innerHTML += "<div class='evt'>" + this.cal.data[squares[i]] + "</div>";
          }
          cCell.addEventListener("click", function () {
            this.cal.show(this);
          });
        }
        cRow.appendChild(cCell);
        if (i != 0 && (i + 1) % 7 == 0) {
          cTable.appendChild(cRow);
          cRow = document.createElement("tr");
          cRow.classList.add("day");
        }
      }

      // REMOVE ANY ADD/EDIT EVENT DOCKET
      this.cal.close();
    },

    show: function (el) {
      // this.cal.show() : show edit event docket for selected day
      // PARAM el : Reference back to cell clicked

      // FETCH EXISTING DATA
      this.cal.sDay = el.getElementsByClassName("dd")[0].innerHTML;

      // DRAW FORM
      var tForm = "<h1>" + (this.cal.data[this.cal.sDay] ? "EDIT" : "ADD") + " EVENT</h1>";
      tForm += "<div id='evt-date'>" + this.cal.sDay + " " + this.cal.mName[this.cal.sMth] + " " + this.cal.sYear + "</div>";
      tForm += "<textarea id='evt-details' required>" + (this.cal.data[this.cal.sDay] ? this.cal.data[this.cal.sDay] : "") + "</textarea>";
      tForm += "<input type='button' value='Close' onclick='this.cal.close()'/>";
      tForm += "<input type='button' value='Delete' onclick='this.cal.del()'/>";
      tForm += "<input type='submit' value='Save'/>";

      // ATTACH
      var eForm = document.createElement("form");
      eForm.addEventListener("submit", this.cal.save);
      eForm.innerHTML = tForm;
      var container = document.getElementById("event");
      container.innerHTML = "";
      container.appendChild(eForm);
    },

    close: function () {
      // this.cal.close() : close event docket

      document.getElementById("cal-event").innerHTML = "";
    },

    save: function (evt) {
      // this.cal.save() : save event

      evt.stopPropagation();
      evt.preventDefault();
      this.cal.data[this.cal.sDay] = document.getElementById("evt-details")['value'];
      localStorage.setItem("cal-" + this.cal.sMth + "-" + this.cal.sYear, JSON.stringify(this.cal.data));
      this.cal.list();
    },

    del: function () {
      // this.cal.del() : Delete event for selected date

      if (confirm("Remove event?")) {
        delete this.cal.data[this.cal.sDay];
        localStorage.setItem("cal-" + this.cal.sMth + "-" + this.cal.sYear, JSON.stringify(this.cal.data));
        this.cal.list();
      }
    }
  };
  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    let now = new Date();
    let nowMth = now.getMonth();
    let nowYear = now.getFullYear();

    let mth = document.getElementById("month");
    for (let i = 0; i < 12; i++) {
      let opt = document.createElement("option");
      opt.value = '' + i;
      opt.innerHTML = this.cal.mName[i];
      if (i == nowMth) { opt.selected = true; }
      mth.appendChild(opt);
    }

    let year = document.getElementById("year");
    for (let i = nowYear - 10; i <= nowYear + 10; i++) {
      let opt = document.createElement("option");
      opt.value = '' + i;
      opt.innerHTML = '' + i;
      if (i == nowYear) { opt.selected = true; }
      year.appendChild(opt);
    }

    document.getElementById("cal-set").addEventListener("click", this.cal.list);
    this.cal.list();
  }
}