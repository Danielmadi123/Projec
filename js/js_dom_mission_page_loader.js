/*
  let elmsArr = [
    {
      tagName:"h1",
      content:"test"
    },
    {
      tagName:"h2",
      content:"test2"
    },
  ];
*/

let elmsArr = [];

const createElm = (
  tagName,
  content,
  color,
  width,
  height,
  size,
  boxshadow,
  padding,
  backgroundColor,
  margin,
  borderRadius
) => {
  // tagName = "h1"
  // content = "test"
  // color = "green"
  // width = 100
  // height = 100
  // size = 5
  let pageDiv = document.getElementById("pageDiv");
  let newElm = document.createElement(tagName); // create new elm
  pageDiv.appendChild(newElm); // add new elm to html
  newElm.innerText = content; // set content to elm
  newElm.style.color = color; // set color
  newElm.style.width = width + "px"; // set width and add px
  newElm.style.height = height + "px"; // set height and add px
  newElm.style.fontSize = size + "rem"; // set font size and addrem
  newElm.style.boxShadow = boxshadow;
  newElm.style.padding = padding;
  newElm.style.backgroundColor = backgroundColor;
  newElm.style.margin = margin;
  newElm.style.borderRadius = borderRadius;
  // elmsArr.push({
  //   tagName: tagName,
  //   content: content,
  //   color: color,
  //   width: width,
  //   height: height,
  //   size: size,
  // }); // save in array the new tag
  elmsArr.push({
    tagName,
    content,
    color,
    width,
    height,
    size,
    boxshadow,
    padding,
    backgroundColor,
    margin,
    borderRadius,
  });
  let createInfo = document.getElementById("createInfo");
  createInfo.innerText = `Created ${tagName} with "${content}"`; // save in array the new tag
  console.log("elmsArr", elmsArr);
};

const clearPage = () => {
  let pageDiv = document.querySelector("#pageDiv");
  pageDiv.innerHTML = ""; // remove all tags
};

const restorePage = () => {
  elmsArr = []; // clear the array
  let newElmsArr = []; // clear the array
  let jsonStr = localStorage.getItem("tags"); // get string json from localStorage
  console.log("jsonStr", jsonStr);
  newElmsArr = JSON.parse(jsonStr); //convert from json to array
  console.log("newElmsArr", newElmsArr);
  for (let item of newElmsArr) {
    /*
      item = {
        tagName: "h1", content: "test1"
      }
    */
    createElm(item.tagName, item.content);
  }
};

window.addEventListener("load", () => {
  document.getElementById("form1").addEventListener("submit", (e) => {
    //happends when we put btn in form
    e.preventDefault(); //stop refresh
  });
  document.getElementById("submitBtn").addEventListener("click", () => {
    let inputTag = document.getElementById("inputTag"); // get elm from html
    let inputContent = document.getElementById("inputContent"); // get elm from html
    let inputColor = document.getElementById("inputColor"); // get elm from html
    let inputWidth = document.getElementById("inputWidth"); // get elm from html
    let inputHeight = document.getElementById("inputHeight"); // get elm from html
    let inputSize = document.getElementById("inputSize"); // get elm from html
    let inputBoxshadow = document.getElementById("inputBoxshadow");
    let inputPadding = document.getElementById("inputPadding");
    let inputbgc = document.getElementById("inputbgc");
    let inputmargin = document.getElementById("inputmargin");
    let inputbr = document.getElementById("inputbr");
    createElm(
      inputTag.value,
      inputContent.value,
      inputColor.value,
      inputWidth.value,
      inputHeight.value,
      inputSize.value,
      inputBoxshadow.value,
      inputPadding.value,
      inputbgc.value,
      inputmargin.value,
      inputbr.value
    ); //execute the function and passing values from inputs
    //createElm("h1", "test")
  });
  document.getElementById("saveBtn").addEventListener("click", () => {
    let jsonStr = JSON.stringify(elmsArr); // convert array to string (json)
    //why we need to convert? to save it in localStorage
    //localStorage can save only strings
    localStorage.setItem("tags", jsonStr); //save to localStorage
  });
  document.getElementById("clearBtn").addEventListener("click", () => {
    clearPage();
  });
  restorePage();
});
