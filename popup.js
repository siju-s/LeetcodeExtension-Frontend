// Initialize butotn with users's prefered color
let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", ({color}) => {
    // changeColor.style.backgroundColor = color;
});

// When the button is clicked, inject setPageBackgroundColor into current page
// changeColor.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     function: setPageBackgroundColor,
//   });
// });

// The body of this function will be execuetd as a content script inside the
// current page
function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({color}) => {
        document.body.style.backgroundColor = color;
    });
}

function displayProfileData(data) {
    console.log(data)
    let user = data;
    const username = user.username
    const rank = user.rank
    const avatar = user.avatar
    const viewCount = user.views
    document.getElementById("username").innerHTML = `Username:${username}`
    document.getElementById("rank").innerHTML = `Rank:${rank}`
    document.getElementById("avatar").src = avatar
    document.getElementById("views").innerHTML = `Profile views:${viewCount}`


}

function fetchQuestionsSolved(url) {
   const data = url + "/" + "getQuestions"
    fetch(data)
        .then(response => response.text())
        .then(data => {
            console.log(data)
            let questions = JSON.parse(data);
            const total = questions.totalCount
            const totalSolved = questions.totalSolvedCount
            const easyCount = questions.easyCount
            const easySolvedCount = questions.easySolvedCount
            const mediumCount = questions.mediumCount
            const mediumSolvedCount = questions.mediumSolvedCount
            const hardCount = questions.hardCount
            const hardSolvedCount = questions.hardSolvedCount

            document.getElementById("total").innerHTML = `Problems Solved:${totalSolved}`
            document.getElementById("easy").innerHTML = `${easySolvedCount}/${easyCount}`
            document.getElementById("medium").innerHTML = `${mediumSolvedCount}/${mediumCount}`
            document.getElementById("hard").innerHTML = `${hardSolvedCount}/${hardCount}`



        }).catch((err) => {
        document.getElementById("stats").innerHTML = err;
        console.log('error: ', err);
    });
}

const loginBtn = document.getElementById('submit-btn-login');

loginBtn.addEventListener('click', (e) => {
    var loginDiv = document.getElementById("loginDiv");
    document.getElementsByClassName("loader")[0].style.display = "block";
    // display the problem solved status
    let leetcodeId = document.getElementById("leetcodeId").value;
    let username = leetcodeId;
    console.log(leetcodeId)
    chrome.storage.sync.set({username});

    const url = `https://leetcode-details.herokuapp.com/user/${leetcodeId}`

    fetch(url)
        .then(response => response.text())
        .then(data => {
            console.log(data)
            if (leetcodeId.length <= 0 || data === 'Username does not exist') {
                document.getElementsByClassName("loader")[0].style.display = "none";
                document.getElementById("invalidCreds").innerHTML = 'Invalid LeetCode Id';
                document.getElementsByClassName("invalidCreds")[0].style.display = "block";
            } else {
                displayProfileData(JSON.parse(data))
                fetchQuestionsSolved(url)
                loginDiv.classList.remove("slide-up");
                loginBtn.style.visibility = "hidden";
                document.getElementById("loginDiv").style.visibility = "visible";
                document.getElementById("home").style.visibility = "hidden";
                document.getElementsByClassName("loader")[0].style.display = "none";
                document.getElementsByClassName("invalidCreds")[0].style.display = "none";
            }

        }).catch((err) => {
        document.getElementById("stats").innerHTML = err;
        console.log('error: ', err);
    });

});
