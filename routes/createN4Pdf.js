const mysql = require("mysql");

let fs = require("fs");

const HummusRecipe = require("hummus-recipe");

const moment = require("moment");

let coordinates = require("./coordinates.js");

exports.createN4Pdf = function(req, res, next) {
  let urlString = req.url;

  let splitString = urlString.split("?");

  let fullName = decodeURI(splitString[1]);




  function createPdf(dataString) {
    const pdfDoc = new HummusRecipe("public/N4.pdf", "public/"+ fullName + " New N4.pdf");
  
    pdfDoc
  
      .editPage(1)
      .image(
        "./public/check.jpg",
        coordinates.coordinatesObject.checkBoxOne.x,
        coordinates.coordinatesObject.checkBoxOne.y,
        {
          scale: 0.1
        }
      )
      .image(
        "./public/check.jpg",
        coordinates.coordinatesObject.checkBoxTwo.x,
        coordinates.coordinatesObject.checkBoxTwo.y,
        {
          scale: 0.1
        }
      )
  
      .image(
        "./public/check.jpg",
        coordinates.coordinatesObject.checkBoxThree.x,
        coordinates.coordinatesObject.checkBoxThree.y,
        {
          scale: 0.1
        }
      )
  
      .image(
        "./public/check.jpg",
        coordinates.coordinatesObject.checkBoxFour.x,
        coordinates.coordinatesObject.checkBoxFour.y,
        {
          scale: 0.1
        }
      )
  
      .image(
        "./public/check.jpg",
        coordinates.coordinatesObject.checkBoxFive.x,
        coordinates.coordinatesObject.checkBoxFive.y,
        {
          scale: 0.1
        }
      )
      .image(
        "./public/check.jpg",
        coordinates.coordinatesObject.checkBoxSix.x,
        coordinates.coordinatesObject.checkBoxSix.y,
        {
          scale: 0.1
        }
      )
  
      .image(
        "./public/check.jpg",
        coordinates.coordinatesObject.checkBoxSeven.x,
        coordinates.coordinatesObject.checkBoxSeven.y,
        {
          scale: 0.1
        }
      )
  
      .endPage()
  
      //----------------------------------PAGE 2
  
      .editPage(2)
  
      .text(
        dataString.tenantsName,
        coordinates.coordinatesObject.toTenantsName.x,
        coordinates.coordinatesObject.toTenantsName.y,
        {
          color: "#070100",
          fontSize: 15,
          font: "Courier New"
        }
      )
  
      .text(
        dataString.landlordsName,
        coordinates.coordinatesObject.landLordsName.x,
        coordinates.coordinatesObject.landLordsName.y,
        {
          color: "#070100",
          fontSize: 15,
          font: "Courier New"
        }
      )
  
      .text(
        dataString.addressOfUnit,
        coordinates.coordinatesObject.addressOfRentalUnit.x,
        coordinates.coordinatesObject.addressOfRentalUnit.y,
        {
          color: "#070100",
          fontSize: 15,
          font: "Courier New"
        }
      )
  
      .text(
        dataString.amountOwing,
        coordinates.coordinatesObject.amountOwing.x,
        coordinates.coordinatesObject.amountOwing.y,
        {
          color: "#070100",
          fontSize: 15,
          size: 22,
          font: "Courier New"
        }
      )
  
      .text(
        dataString.day,
        coordinates.coordinatesObject.day.x,
        coordinates.coordinatesObject.day.y,
        {
          color: "#070100",
          fontSize: 4,
          size: 18,
          font: "Courier New"
        }
      )
  
      .text(
        dataString.month,
        coordinates.coordinatesObject.month.x,
        coordinates.coordinatesObject.month.y,
        {
          color: "#070100",
          fontSize: 4,
          size: 18,
          font: "Courier New"
        }
      )
  
      .text(
        dataString.year,
        coordinates.coordinatesObject.year.x,
        coordinates.coordinatesObject.year.y,
        {
          color: "#070100",
          fontSize: 6,
          size: 22,
          font: "Courier New"
        }
      )
  
      .endPage()
  
      //----------------------------------PAGE 3
  
      .editPage(3)
  
      .text(
        dataString.rentPaid,
        coordinates.coordinatesObject.rentPaid.x,
        coordinates.coordinatesObject.rentPaid.y,
        {
          color: "#070100",
          fontSize: 15,
          size: 18,
          font: "Courier New"
        }
      )
  
      .text(
        dataString.rentOwing,
        coordinates.coordinatesObject.rentOwing.x,
        coordinates.coordinatesObject.rentOwing.y,
        {
          color: "#070100",
          fontSize: 12,
          size: 20,
          font: "Courier New"
        }
      )
  
      .text(
        dataString.totalOwing,
        coordinates.coordinatesObject.totalOwing.x,
        coordinates.coordinatesObject.totalOwing.y,
        {
          color: "#070100",
          fontSize: 12,
          size: 20,
          font: "Courier New"
        }
      )
  
      .endPage()
      // end and save
 
      .endPDF(() => {
        /* done! */
      });
  }
  
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "property pal"
  });
  connection.connect(err => {
    if (err) throw err;
    // console.log("Connected!");
  });
  
let sqlQuery = "SELECT * FROM `n4tenants` WHERE `tenantsName` LIKE '" + fullName + "' ORDER BY `tenantsName` ASC"

  connection.query(sqlQuery, (err, rows) => {

    if (err) throw err;
  
    let id = rows[0].id;
    let checkbox1 = rows[0].checkbox1;
    let checkbox2 = rows[0].checkbox2;
    let checkbox3 = rows[0].checkbox3;
    let checkbox4 = rows[0].checkbox4;
    let checkbox5 = rows[0].checkbox5;
    let checkbox6 = rows[0].checkbox6;
    let checkbox7 = rows[0].checkbox7;
    let tenantsName = rows[0].tenantsName;
    let landlordsName = rows[0].landlordsName;
    let addressOfUnit = rows[0].addressOfUnit;
    let amountOwing = rows[0].amountOwing;
    let dateToPay = rows[0].dateToPay;
    let rentPaid = rows[0].rentPaid;
    let rentOwing = rows[0].rentOwing;
    let totalOwing = rows[0].totalOwing;
    let checkbox8 = rows[0].checkbox8;
    dateToPay = moment(dateToPay).format("DD MM YYYY");
    let splitDate = dateToPay.split(" ");
  
    let day = splitDate[0];
    let month = splitDate[1];
    let year = splitDate[2];

  
    let finalData = {
      id,
      checkbox1,
      checkbox2,
      checkbox3,
      checkbox4,
      checkbox5,
      checkbox6,
      checkbox7,
      tenantsName,
      landlordsName,
      addressOfUnit,
      amountOwing,
      dateToPay,
      rentPaid,
      rentOwing,
      totalOwing,
      checkbox8,
      day,
      month,
      year
    };

    // console.log(JSON.stringify(finalData));
  
    fs.writeFile(

      "C:\\users\\justin\\Desktop\\internship\\Property Pal\\public\\test.txt",
      JSON.stringify(finalData),
      function(err) {
        if (err) throw err;
        console.log("Saved!");
       
      },
      createPdf(finalData)
    );
  });






















  
  res.render("launchPdf");
};
